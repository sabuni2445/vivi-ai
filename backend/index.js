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
const { generateImage, generateMysticImage, generateVideo, pollTaskStatus } = require('./services/freepik');
const { checkCredits, deductCredit, refundCredit, logUsage } = require('./services/monetization');
const { generateVoice, getVoices } = require('./services/elevenlabs');

app.use('/videos', express.static(TEMP_DIR));
app.use('/public/campaigns', express.static(PUBLIC_DIR));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// --- USER & CREDIT ROUTES ---

app.get('/api/user/credits', async (req, res) => {
  const userId = req.headers['x-user-id'] || 'anonymous';
  try {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) {
        return res.json({ 
            credits: 0, video_credits: 0, image_credits: 0, 
            subscription_tier: 'none' 
        });
    }
    res.json({ 
        credits: user.video_credits || 0, // Fallback for old UI
        video_credits: user.video_credits || 0,
        image_credits: user.image_credits || 0,
        enhancement_credits: user.enhancement_credits || 0,
        subscription_tier: user.subscription_tier || 'none'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch credits' });
  }
});

app.post('/api/subscription/subscribe', async (req, res) => {
  const userId = req.headers['x-user-id'] || 'anonymous';
  const { packageId } = req.body;
  
  const packages = {
    'starter': { video: 3, image: 15, enhancement: 5, bg: 10, rest: 3 },
    'creator': { video: 10, image: 50, enhancement: 20, bg: -1, rest: 10 },
    'business': { video: 30, image: 150, enhancement: 50, bg: -1, rest: 50 } // Finite limits instead of unlimited (-1)
  };
  
  const pkg = packages[packageId];
  if (!pkg) return res.status(400).json({ error: 'Invalid package' });

  try {
    // Upsert or update user
    const existing = await dbGet('SELECT id FROM users WHERE id = ?', [userId]);
    if (existing) {
        await dbRun(`
            UPDATE users SET 
                subscription_tier = ?, 
                video_credits = ?, 
                image_credits = ?, 
                enhancement_credits = ?,
                bg_removal_credits = ?,
                restoration_credits = ?
            WHERE id = ?
        `, [packageId, pkg.video, pkg.image, pkg.enhancement, pkg.bg, pkg.rest, userId]);
    } else {
        await dbRun(`
            INSERT INTO users (id, credits, subscription_tier, video_credits, image_credits, enhancement_credits, bg_removal_credits, restoration_credits)
            VALUES (?, 0, ?, ?, ?, ?, ?, ?)
        `, [userId, packageId, pkg.video, pkg.image, pkg.enhancement, pkg.bg, pkg.rest]);
    }

    const user = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
    res.json({ success: true, tier: user.subscription_tier, video_credits: user.video_credits });
  } catch (error) {
    res.status(500).json({ error: 'Subscription failed' });
  }
});

// Legacy backward compatibility route
app.post('/api/credits/buy', async (req, res) => {
    req.url = '/api/subscription/subscribe';
    app.handle(req, res);
});

// --- GENERATION ENGINE V2 ---

/**
 * UTILITY: Upload Assets (Product Photo / Logo)
 */
app.post('/api/upload', upload.fields([{ name: 'productImage', maxCount: 1 }, { name: 'logoFile', maxCount: 1 }]), (req, res) => {
  try {
    const files = req.files;
    const urls = {};

    if (files.productImage) {
      const file = files.productImage[0];
      const newName = `product_${uuidv4()}${path.extname(file.originalname)}`;
      const newPath = path.join(PUBLIC_DIR, newName);
      fs.renameSync(file.path, newPath);
      urls.productImageUrl = `/public/campaigns/${newName}`;
    }

    if (files.logoFile) {
      const file = files.logoFile[0];
      const newName = `logo_${uuidv4()}${path.extname(file.originalname)}`;
      const newPath = path.join(PUBLIC_DIR, newName);
      fs.renameSync(file.path, newPath);
      urls.logoUrl = `/public/campaigns/${newName}`;
    }

    res.json({ success: true, ...urls });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload assets' });
  }
});

/**
 * STEP 1: Generate Script (OpenAI)
 */
app.post('/api/generate-script', checkCredits, async (req, res) => {
  let { productName, description, userDescription, style, productImageUrl } = req.body;
  
  if (!productName) {
    productName = 'My Product';
  }

  if (!userDescription && productImageUrl) {
    console.log(`[Generate Script] Description is empty. Using Vision AI to analyze uploaded product image...`);
    try {
      const { analyzeImage } = require('./services/gemini');
      const analysis = await analyzeImage(productImageUrl);
      if (analysis) {
        userDescription = analysis;
        console.log(`[Generate Script] Vision AI Output: ${analysis}`);
        description = `${description}. Product Details: ${analysis}`;
      }
    } catch (err) {
      console.error(`[Generate Script] Vision AI failed:`, err.message);
    }
  } else if (userDescription) {
    description = `${description}. Product Details: ${userDescription}`;
  }

  if (!description) return res.status(400).json({ error: 'Product description required. Please provide one or upload a photo.' });

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
app.post('/api/generate-images', require('./services/monetization').checkImageCredits, async (req, res) => {
  const { videoId, scenes } = req.body;
  const userId = req.headers['x-user-id'] || 'anonymous';
  
  try {
    // Deduct credit first
    await require('./services/monetization').deductImageCredit(userId);

    console.log(`[Images] Starting parallel generation for ${scenes.length} scenes...`);
    
    const imageResults = await Promise.all(scenes.map(async (scene, i) => {
      try {
        // SKIP IF IMAGE ALREADY EXISTS (User uploaded asset that they don't want to enhance)
        if (scene.image_url && (scene.image_url.startsWith('http') || scene.image_url.startsWith('/public'))) {
           console.log(`[Images] Scene ${i} already has a valid asset. Skipping AI generation.`);
           const directTaskId = `direct_${uuidv4()}`;
           await dbRun(
             'INSERT INTO images (id, video_id, scene_index, task_id, status, image_url) VALUES (?, ?, ?, ?, ?, ?)',
             [uuidv4(), videoId, i, directTaskId, 'completed', scene.image_url]
           );
           return { sceneIndex: i, taskId: directTaskId, directUrl: scene.image_url };
        }

        let result;
        if (scene.reference_image) {
          console.log(`[Images] Scene ${i} has reference_image. Running full Enhancement pipeline.`);
          const { removeBackground, imageToImage } = require('./services/freepik');
          try {
             // 1. Remove background
             const bgRemovedUrl = await removeBackground(scene.reference_image);
             // 2. Perform Image-to-Image with the cinematic prompt (using low strength to preserve product)
             result = await imageToImage(bgRemovedUrl, scene.visual_prompt, 0.35);
             
             // imageToImage returns a taskId or direct URL, wrap it for the rest of the flow
             if (typeof result === 'string' && result.startsWith('http')) {
                result = { directUrl: result };
             }
          } catch (e) {
             console.error(`[Images] Enhancement failed for scene ${i}. Falling back to standard generation.`, e);
             result = await generateMysticImage(scene.visual_prompt, req.body.aspectRatio || '9:16', req.body.mode === 'pro');
          }
        } else {
          result = await generateMysticImage(scene.visual_prompt, req.body.aspectRatio || '9:16', req.body.mode === 'pro');
        }

        if (!result) return null;

        const isDirect = typeof result === 'object' && result.directUrl;
        const taskId = isDirect ? `direct_${uuidv4()}` : result;

        // Log task in DB
        await dbRun(
          'INSERT INTO images (id, video_id, scene_index, task_id, status, image_url) VALUES (?, ?, ?, ?, ?, ?)',
          [uuidv4(), videoId, i, taskId, isDirect ? 'completed' : 'processing', isDirect ? result.directUrl : (scene.image_url || null)]
        );

        return { sceneIndex: i, taskId, directUrl: isDirect ? result.directUrl : null };
      } catch (err) {
        console.error(`[Images] Error generating scene ${i}:`, err.message);
        return null;
      }
    }));

    const imageTasks = imageResults.filter(r => r !== null);
    res.json({ tasks: imageTasks });
  } catch (error) {
    await require('./services/monetization').refundImageCredit(userId);
    res.status(500).json({ error: 'Failed to start image generation' });
  }
});

/**
 * EXTRA STEP: AI Image Enhancement (Image-to-Image)
 */
app.post('/api/enhance-image', require('./services/monetization').checkImageCredits, async (req, res) => {
  const { imageUrl, prompt, strength } = req.body;
  const userId = req.headers['x-user-id'] || 'anonymous';

  if (!imageUrl || !prompt) {
    return res.status(400).json({ error: 'Image URL and prompt required' });
  }

  try {
    // Deduct credit
    await require('./services/monetization').deductImageCredit(userId);

    const result = await require('./services/freepik').imageToImage(imageUrl, prompt, strength || 0.35);
    
    if (typeof result === 'string' && result.startsWith('http')) {
       return res.json({ status: 'succeed', resultUrl: result });
    }

    res.json({ taskId: result, status: 'processing' });
  } catch (error) {
    console.error('Enhance Error:', error);
    res.status(500).json({ error: 'Failed to start enhancement' });
  }
});

/**
 * STEP 3: Finalize & Generate Video (Kling)
 */
app.post('/api/finalize-video', require('./services/monetization').checkVideoCredits, async (req, res) => {
  const { videoId, scenes, enhancedMotion } = req.body; // scenes includes final image_urls
  const userId = req.headers['x-user-id'] || 'anonymous';

  try {
    console.log(`[Finalize Video] videoId=${videoId}, userId=${userId}, scenes=${scenes?.length}, logoUrl=${req.body.logoUrl}`);

    // Feature gating check for enhanced motion
    const user = await dbGet('SELECT subscription_tier FROM users WHERE id = ?', [userId]);
    if (enhancedMotion && (!user || user.subscription_tier === 'starter' || user.subscription_tier === 'none')) {
        return res.status(403).json({ error: 'Enhanced Cinematic Motion requires Creator or Business tier.' });
    }

    // 1. Deduct credit first
    await require('./services/monetization').deductVideoCredit(userId);
    
    // 2. Start Kling Video Task
    const mode = req.body.mode || 'pro';
    console.log(`[Finalize Video] Starting video gen. Mode: ${mode}. First scene image: ${scenes?.[0]?.image_url?.substring(0, 60)}`);
    const taskId = await generateVideo(scenes, mode);
    console.log(`[Finalize Video] Got taskId: ${taskId}`);
    
    // 3. Update video record — if videoId exists, update; otherwise insert a fresh record
    let inputData = {};
    if (videoId) {
        const videoRec = await dbGet('SELECT input_data FROM videos WHERE id = ?', [videoId]);
        if (videoRec && videoRec.input_data) {
            try { inputData = JSON.parse(videoRec.input_data); } catch(e) { inputData = {}; }
        }
    }
    if (req.body.logoUrl) {
        inputData.logoUrl = req.body.logoUrl;
    }

    if (videoId) {
        await dbRun(
          'UPDATE videos SET task_id = ?, status = ?, scenes_data = ?, input_data = ? WHERE id = ?',
          [taskId, 'processing', JSON.stringify(scenes), JSON.stringify(inputData), videoId]
        );
    } else {
        // No videoId from frontend — create a new record
        const newVideoId = uuidv4();
        await dbRun(
          'INSERT INTO videos (id, user_id, task_id, status, scenes_data, input_data) VALUES (?, ?, ?, ?, ?, ?)',
          [newVideoId, userId, taskId, 'processing', JSON.stringify(scenes), JSON.stringify(inputData)]
        );
    }

    const costEstimate = mode === 'pro' ? 2.50 : 0.40;
    await require('./services/monetization').logUsage(userId, `freepik_video_${mode}`, 1, costEstimate);
    res.json({ taskId, status: 'processing', mode });
  } catch (error) {
    console.error('Finalize Video Error:', error?.response?.data || error.message || error);
    try { await require('./services/monetization').refundVideoCredit(userId); } catch(e) { /* ignore refund errors */ }
    res.status(500).json({ error: 'Failed to start video production', details: error.message });
  }
});

/**
 * Fetch available voices
 */
app.get('/api/voices', async (req, res) => {
  const voices = await getVoices();
  res.json({ voices });
});

/**
 * Generate AI Voiceover
 */
app.post('/api/generate-voice', async (req, res) => {
  const { text, voiceId } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  try {
    const fileName = `voice_${Date.now()}.mp3`;
    const outputPath = path.join(PUBLIC_DIR, fileName);
    await generateVoice(text, outputPath, voiceId);
    
    // Return the public URL to the audio file
    res.json({ audioUrl: `/public/campaigns/${fileName}` });
  } catch (error) {
    console.error('Voice generation error:', error);
    res.status(500).json({ error: 'Failed to generate voiceover' });
  }
});

const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegStatic);
const { exec } = require('child_process');

async function downloadFile(url, outputPath) {
  const resp = await require('node-fetch')(url);
  const buffer = await resp.buffer();
  fs.writeFileSync(outputPath, buffer);
}

function mergeVideoAudio(videoPath, audioPath, outputPath, logoPath = null) {
  return new Promise((resolve, reject) => {
    let command = ffmpeg().input(videoPath).input(audioPath);
    
    if (logoPath) {
      command = command.input(logoPath)
        .complexFilter([
          "[2:v]scale=120:-1[logo]", // Scale logo
          "[0:v][logo]overlay=W-w-30:30[outv]" // Top-right watermark
        ])
        .outputOptions([
          '-map [outv]',
          '-map 1:a:0',
          '-c:v libx264',
          '-preset fast',
          '-c:a aac',
          '-shortest'
        ]);
    } else {
      command = command.outputOptions([
        '-c:v copy',
        '-c:a aac',
        '-map 0:v:0',
        '-map 1:a:0',
        '-shortest'
      ]);
    }

    command.save(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err));
  });
}

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
            const video = await dbGet('SELECT * FROM videos WHERE task_id = ?', [taskId]);
            let finalUrl = result.resultUrl;

            // If we have scenes data, we likely have voiceover text
            if (video && video.scenes_data) {
                try {
                  const scenes = JSON.parse(video.scenes_data);
                  const voiceText = scenes.map(s => s.voiceover).join('. ');
                  const voiceId = scenes[0]?.voiceId || null; // Assume voiceId is attached to scenes by frontend
                  
                  if (voiceText) {
                    const audioFileName = `audio_${Date.now()}.mp3`;
                    const audioPath = path.join(TEMP_DIR, audioFileName);
                    await generateVoice(voiceText, audioPath, voiceId);

                    const rawVideoName = `raw_video_${Date.now()}.mp4`;
                    const rawVideoPath = path.join(TEMP_DIR, rawVideoName);
                    await downloadFile(result.resultUrl, rawVideoPath);

                    const finalVideoName = `final_video_${Date.now()}.mp4`;
                    const finalVideoPath = path.join(PUBLIC_DIR, finalVideoName);
                    
                    let inputData = {};
                    try { inputData = video.input_data ? JSON.parse(video.input_data) : {}; } catch(e) { inputData = {}; }
                    const logoUrl = inputData.logoUrl;
                    let localLogoPath = null;
                    if (logoUrl) {
                        if (logoUrl.startsWith('/public')) {
                            localLogoPath = path.join(__dirname, '..', logoUrl);
                        } else if (logoUrl.includes('/public/campaigns/')) {
                            const filename = logoUrl.split('/').pop();
                            localLogoPath = path.join(__dirname, 'public/campaigns', filename);
                        }
                    }

                    await mergeVideoAudio(rawVideoPath, audioPath, finalVideoPath, localLogoPath);
                    finalUrl = `/public/campaigns/${finalVideoName}`;
                  }
                } catch (e) {
                  console.error('Audio Merge Error:', e);
                  // fallback to original url if merge fails
                }
            }

            await dbRun('UPDATE videos SET status = ?, video_url = ? WHERE task_id = ?', ['completed', finalUrl, taskId]);
            result.resultUrl = finalUrl;
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
