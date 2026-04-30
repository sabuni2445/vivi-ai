const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Permissive for debugging

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Incoming: ${req.method} ${req.url}`);
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check and DB Probe
app.get('/health', async (req, res) => {
  try {
    const result = await dbGet('SELECT 1');
    res.status(200).json({ status: 'OK', db: !!result });
  } catch (err) {
    res.status(500).json({ status: 'Error', error: err.message });
  }
});

// Create temp and public directories for video processing and persistence
const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}
const PUBLIC_DIR = path.join(__dirname, 'public/campaigns');
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Configure multer for logo uploads
const upload = multer({ dest: TEMP_DIR });

const crypto = require('crypto');
function uuidv4() {
  return crypto.randomUUID();
}
const { dbRun, dbGet, dbAll } = require('./services/db');
const { generateScript } = require('./services/openai');
const { generateImage, generateVideo, pollTaskStatus } = require('./services/freepik');
const { checkCredits, deductCredit, refundCredit, logUsage } = require('./services/monetization');
const { generateVoice } = require('./services/elevenlabs');

app.use('/videos', express.static(TEMP_DIR));
app.use('/public/campaigns', express.static(PUBLIC_DIR));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// --- USER & CREDIT ROUTES ---

app.get('/api/user/credits', async (req, res) => {
  const userId = req.headers['x-user-id'] || 'anonymous';
  try {
    const user = await dbGet('SELECT credits FROM users WHERE id = ?', [userId]);
    res.json({ credits: user ? user.credits : 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch credits' });
  }
});

app.post('/api/credits/buy', async (req, res) => {
  const userId = req.headers['x-user-id'] || 'anonymous';
  const { packageId } = req.body;
  
  const packages = {
    'starter': 3,
    'pro': 10,
    'elite': 30
  };
  
  const creditsToAdd = packages[packageId] || 0;
  if (creditsToAdd === 0) return res.status(400).json({ error: 'Invalid package' });

  try {
    await dbRun('UPDATE users SET credits = credits + ? WHERE id = ?', [creditsToAdd, userId]);
    const user = await dbGet('SELECT credits FROM users WHERE id = ?', [userId]);
    res.json({ success: true, newBalance: user.credits });
  } catch (error) {
    res.status(500).json({ error: 'Payment failed' });
  }
});

// --- GENERATION ENGINE V2 ---

/**
 * STEP 1: Generate Script (OpenAI)
 */
app.post('/api/generate-script', checkCredits, async (req, res) => {
  const { productName, description, style } = req.body;
  if (!productName || !description) return res.status(400).json({ error: 'Product details required' });

  try {
    const script = await generateScript(productName, description, style);
    const videoId = uuidv4();
    const userId = req.headers['x-user-id'] || 'anonymous';

    // Store video draft
    await dbRun(
      'INSERT INTO videos (id, user_id, status, input_data, scenes_data) VALUES (?, ?, ?, ?, ?)',
      [videoId, userId, 'draft', JSON.stringify({ productName, description, style }), JSON.stringify(script)]
    );

    res.json({ videoId, script });
  } catch (error) {
    console.error('Script Gen Error:', error);
    res.status(500).json({ error: 'Failed to generate script' });
  }
});

/**
 * STEP 2: Generate Images (Freepik)
 */
app.post('/api/generate-images', async (req, res) => {
  const { videoId, scenes } = req.body;
  
  try {
    console.log(`[Images] Starting parallel generation for ${scenes.length} scenes...`);
    
    const imageResults = await Promise.all(scenes.map(async (scene, i) => {
      try {
        const result = await generateImage(scene.visual_prompt);
        if (!result) return null;

        const isDirect = result.directUrl;
        const taskId = isDirect ? `direct_${uuidv4()}` : result;

        // Log task in DB
        await dbRun(
          'INSERT INTO images (id, video_id, scene_index, task_id, status, image_url) VALUES (?, ?, ?, ?, ?, ?)',
          [uuidv4(), videoId, i, taskId, isDirect ? 'completed' : 'processing', isDirect ? result.directUrl : null]
        );

        return { sceneIndex: i, taskId };
      } catch (err) {
        console.error(`[Images] Error generating scene ${i}:`, err.message);
        return null;
      }
    }));

    const imageTasks = imageResults.filter(r => r !== null);
    res.json({ tasks: imageTasks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start image generation' });
  }
});

/**
 * STEP 3: Finalize & Generate Video (Kling)
 */
app.post('/api/finalize-video', checkCredits, async (req, res) => {
  const { videoId, scenes } = req.body; // scenes includes final image_urls
  const userId = req.headers['x-user-id'] || 'anonymous';

  try {
    // 1. Deduct credit first
    await deductCredit(userId);
    
    // 2. Start Kling Video Task
    const taskId = await generateVideo(scenes);
    
    // 3. Update video record
    await dbRun(
      'UPDATE videos SET task_id = ?, status = ?, scenes_data = ? WHERE id = ?',
      [taskId, 'processing', JSON.stringify(scenes), videoId]
    );

    await logUsage(userId, 'freepik_video', 1);
    res.json({ taskId, status: 'processing' });
  } catch (error) {
    console.error('Finalize Video Error:', error);
    await refundCredit(userId); // Refund if start fails
    res.status(500).json({ error: 'Failed to start video production' });
  }
});

/**
 * POLLING: Check Task Status
 */
app.get('/api/task-status/:id', async (req, res) => {
  const taskId = req.params.id;
  const { type } = req.query; // 'image' or 'video'

  try {
    // Check local DB first for instant/already-completed tasks
    if (type === 'image') {
        const localTask = await dbGet('SELECT status, image_url FROM images WHERE task_id = ?', [taskId]);
        if (localTask && (localTask.status === 'completed' || localTask.image_url)) {
            return res.json({ status: 'succeed', resultUrl: localTask.image_url });
        }
    } else {
        const localVideo = await dbGet('SELECT status, video_url FROM videos WHERE task_id = ?', [taskId]);
        if (localVideo && (localVideo.status === 'completed' || localVideo.video_url)) {
            return res.json({ status: 'succeed', resultUrl: localVideo.video_url });
        }
    }

    const result = await pollTaskStatus(taskId, type);
    
    if (result.status === 'succeed') {
        if (type === 'video') {
            await dbRun('UPDATE videos SET status = ?, video_url = ? WHERE task_id = ?', ['completed', result.resultUrl, taskId]);
        } else {
            await dbRun('UPDATE images SET status = ?, image_url = ? WHERE task_id = ?', ['completed', result.resultUrl, taskId]);
        }
    } else if (result.status === 'failed') {
        if (type === 'video') {
            const video = await dbGet('SELECT user_id FROM videos WHERE task_id = ?', [taskId]);
            if (video) await refundCredit(video.user_id);
            await dbRun('UPDATE videos SET status = ? WHERE task_id = ?', ['failed', taskId]);
        } else {
            await dbRun('UPDATE images SET status = ? WHERE task_id = ?', ['failed', taskId]);
        }
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Status check failed' });
  }
});

// --- SSE PROGRESS TRACKER ---
const progressClients = {};
const progressCache = {};

function notifyProgress(campaignId, data) {
  progressCache[campaignId] = data;
  if (progressClients[campaignId]) {
    progressClients[campaignId].forEach(client => {
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  }
}

app.get('/api/progress/:id', (req, res) => {
  const campaignId = req.params.id;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  if (!progressClients[campaignId]) progressClients[campaignId] = [];
  progressClients[campaignId].push({ res });
  
  // Send latest known state immediately if available
  if (progressCache[campaignId]) {
    res.write(`data: ${JSON.stringify(progressCache[campaignId])}\n\n`);
  }

  req.on('close', () => {
    progressClients[campaignId] = progressClients[campaignId].filter(client => client.res !== res);
  });
});

/**
 * LEGACY SYNC ROUTE (kept for minimal backward compatibility if needed)
 */
app.post('/api/generate', checkCredits, async (req, res) => {
    res.status(410).json({ error: 'This endpoint is deprecated. Use the new V2 generation flow.' });
});

// Process-level error handling to prevent 502/503 crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception:', err);
});

// Update URLs to be HTTPS-aware for production (CORS/Mixed Content fix)
function getBaseUrl(req) {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host');
  // Force https if we are on Render
  const finalProtocol = host.includes('render.com') ? 'https' : protocol;
  return `${finalProtocol}://${host}`;
}

app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${PORT}`);
  console.log(`[${new Date().toISOString()}] DB Connection String present: ${!!process.env.DATABASE_URL}`);
});
