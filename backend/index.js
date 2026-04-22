const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['https://vivi-ai-blond.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// Health check for Render
app.get('/health', (req, res) => res.status(200).send('OK'));

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

const { generateScript } = require('./services/groq');
const { generateVoice } = require('./services/elevenlabs');
const { fetchVideo, searchPexelsOptions } = require('./services/pexels');
const { generateImage } = require('./services/imagegen');
const { processScene, processImageScene, concatenateScenes, applyLogoWatermark } = require('./services/ffmpeg');

app.use('/videos', express.static(TEMP_DIR));
app.use('/public/campaigns', express.static(PUBLIC_DIR));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// --- CAMPAIGN PERSISTENCE ROUTES ---

app.post('/api/campaigns', async (req, res) => {
  const payload = req.body;
  const id = uuidv4();
  const userId = payload.user_id || 'anonymous';
  
  try {
    await dbRun(
      'INSERT INTO campaigns (id, user_id, input, status) VALUES (?, ?, ?, ?)',
      [id, userId, JSON.stringify(payload), 'processing']
    );
    res.status(201).json({ id, status: 'processing' });
  } catch (error) {
    console.error('Create Campaign Error:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

app.get('/api/campaigns/:id', async (req, res) => {
  try {
    const campaign = await dbGet('SELECT * FROM campaigns WHERE id = ?', [req.params.id]);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    
    // Parse JSON fields
    if (campaign.input) campaign.input = JSON.parse(campaign.input);
    if (campaign.script) campaign.script = JSON.parse(campaign.script);
    
    res.json(campaign);
  } catch (error) {
    console.error('Fetch Campaign Error:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

app.patch('/api/campaigns/:id', async (req, res) => {
  const { status, video_url, script } = req.body;
  try {
    let query = 'UPDATE campaigns SET ';
    const updates = [];
    const params = [];
    
    if (status) { updates.push('status = ?'); params.push(status); }
    if (video_url) { updates.push('video_url = ?'); params.push(video_url); }
    if (script) { updates.push('script = ?'); params.push(JSON.stringify(script)); }
    
    if (updates.length === 0) return res.status(400).json({ error: 'No update fields provided' });
    
    query += updates.join(', ') + ' WHERE id = ?';
    params.push(req.params.id);
    
    await dbRun(query, params);
    res.json({ message: 'Campaign updated successfully' });
  } catch (error) {
    console.error('Update Campaign Error:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

app.get('/api/campaigns', async (req, res) => {
  try {
    const campaigns = await dbAll('SELECT * FROM campaigns ORDER BY created_at DESC');
    const parsed = campaigns.map(c => ({
        ...c,
        input: c.input ? JSON.parse(c.input) : null,
        script: c.script ? (typeof c.script === 'string' ? JSON.parse(c.script) : c.script) : null
    }));
    res.json(parsed);
  } catch (error) {
    console.error('List Campaigns Error:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// --- END CAMPAIGN ROUTES ---

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

app.post('/api/script', async (req, res) => {
  const { brief } = req.body;
  console.log('--- NEW LITERAL ENGINE V2 REQUEST ---');
  console.log('BRIEF:', JSON.stringify(brief, null, 2));

  if (!brief) return res.status(400).json({ error: 'Brief is required' });

  try {
    const scriptData = await generateScript(brief);
    res.json(scriptData);
  } catch (error) {
    console.error('Script Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate script' });
  }
});

app.post('/api/assets', async (req, res) => {
  const { script: scriptStr, campaignId } = req.body;
  if (!scriptStr || !campaignId) return res.status(400).json({ error: 'script and campaignId required' });
  
  let scriptObj;
  try {
    scriptObj = typeof scriptStr === 'string' ? JSON.parse(scriptStr) : scriptStr;
  } catch (err) {
    scriptObj = scriptStr;
  }
  const script = scriptObj.scenes || scriptObj;
  const sessionDir = path.join(TEMP_DIR, campaignId);
  if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

  try {
    const assets = [];
    for (let index = 0; index < script.length; index++) {
      const scene = script[index];
      const sceneId = index + 1;
      const audioPath = path.join(sessionDir, `audio_${sceneId}.mp3`);
      const rawVisualPath = path.join(sessionDir, `raw_video_${sceneId}.mp4`);
      
      const sceneText = scene.voiceover || scene.dialogue || scene.text || "";
      const sceneKeywords = scene.visual || scene.keywords || "";

      const fetchPromises = [];
      
      // Force overwrite audio to prevent mixing stale generations if the user edited the text
      fetchPromises.push(generateVoice(sceneText, audioPath));
      
      let videoOptions = [];
      fetchPromises.push(searchPexelsOptions(sceneKeywords, 4).then(opts => videoOptions = opts));
      
      if (fetchPromises.length > 0) await Promise.all(fetchPromises);

      assets.push({
        sceneId,
        keywords: sceneKeywords,
        options: videoOptions,
        audioUrl: `${getBaseUrl(req)}/videos/${campaignId}/audio_${sceneId}.mp3?t=${Date.now()}`,
      });
    }
    res.json({ assets });
  } catch(error) {
    console.error('Assets Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/generate', upload.single('logo'), async (req, res) => {
  const prompt = req.body.prompt;
  const useNanoBanana = req.body.useNanoBanana === 'true' || req.body.useNanoBanana === true;
  const logoPath = req.file ? req.file.path : null;
  const userProvidedScript = req.body.script ? JSON.parse(req.body.script) : null;
  
  if (!prompt && !userProvidedScript) {
    return res.status(400).json({ error: 'Prompt or script is required' });
  }

  const sessionId = Date.now().toString();
  const sessionDir = path.join(TEMP_DIR, sessionId);
  fs.mkdirSync(sessionDir, { recursive: true });

  try {
    const contentType = req.body.contentType || 'Marketing';
    const batchCount = parseInt(req.body.batchCount) || 1;
    const maxBatch = Math.min(batchCount, 3);
    const results = [];

    for (let batchIndex = 0; batchIndex < maxBatch; batchIndex++) {
      const batchSessionId = maxBatch > 1 ? `${sessionId}_v${batchIndex + 1}` : sessionId;
      
      const campaignId = req.body.campaignId || batchSessionId;
      const batchSessionDir = path.join(TEMP_DIR, campaignId); // Use campaignId instead of sessionId for continuity
      if (!fs.existsSync(batchSessionDir)) fs.mkdirSync(batchSessionDir, { recursive: true });

      notifyProgress(campaignId, { step: 'Initializing Synthesis', percentage: 5 });

      let generatedData;
      if (userProvidedScript) {
        console.log(`[${campaignId}] Using user-provided script...`);
        generatedData = userProvidedScript;
      } else {
        console.log(`[${campaignId}] Generating new script...`);
        generatedData = await generateScript(prompt, contentType);
      }
      
      const script = generatedData.scenes || generatedData;
      const mergedScenePaths = [];

      for (let index = 0; index < script.length; index++) {
        const scene = script[index];
        const sceneId = index + 1;
        const audioPath = path.join(batchSessionDir, `audio_${sceneId}.mp3`);
        const rawVisualPath = path.join(batchSessionDir, useNanoBanana ? `raw_image_${sceneId}.jpg` : `raw_video_${sceneId}.mp4`);
        const mergedVideoPath = path.join(batchSessionDir, `merged_scene_${sceneId}.mp4`);

        const sceneText = scene.voiceover || scene.dialogue || scene.text || "";
        const sceneKeywords = scene.visual || scene.keywords || "";

        console.log(`[${campaignId}] Scene ${sceneId}: Voice & Visuals...`);
        notifyProgress(campaignId, { step: `Scene ${sceneId} Assets`, percentage: Math.round(((index + 0.3) / script.length) * 80) });
        
        const selectedVisualsStr = req.body.selectedVisuals;
        let selectedVisualsObj = null;
        if (selectedVisualsStr) {
          try { selectedVisualsObj = JSON.parse(selectedVisualsStr); } catch (e) {}
        }
        const userSelectedUrl = selectedVisualsObj && selectedVisualsObj[sceneId] ? selectedVisualsObj[sceneId] : null;

        const fetchPromises = [];
        if (!fs.existsSync(audioPath)) {
           fetchPromises.push(generateVoice(sceneText, audioPath));
        }
        
        if (!fs.existsSync(rawVisualPath)) {
           if (userSelectedUrl) {
             const axios = require('axios');
             fetchPromises.push(
               axios.get(userSelectedUrl, { responseType: 'stream' }).then(response => {
                  const writer = fs.createWriteStream(rawVisualPath);
                  response.data.pipe(writer);
                  return new Promise((resolve, reject) => { writer.on('finish', resolve); writer.on('error', reject); });
               }).catch(err => { console.error("Failed to download selected visual", err); throw err; })
             );
           } else {
             fetchPromises.push(useNanoBanana ? generateImage(sceneKeywords, rawVisualPath) : fetchVideo(sceneKeywords, rawVisualPath));
           }
        }
        
        if (fetchPromises.length > 0) {
           await Promise.all(fetchPromises);
        }

        const targetRatio = req.body.aspectRatio || (generatedData.strategy && generatedData.strategy.aspect_ratio) || "9:16";

        notifyProgress(campaignId, { step: `Scene ${sceneId} Rendering`, percentage: Math.round(((index + 0.8) / script.length) * 80) });

        if (useNanoBanana) {
          await processImageScene(rawVisualPath, audioPath, mergedVideoPath, sceneText, targetRatio);
        } else {
          await processScene(rawVisualPath, audioPath, mergedVideoPath, sceneText, targetRatio);
        }
        mergedScenePaths.push(mergedVideoPath);
      }

      console.log(`[${batchSessionId}] Concatenating...`);
      notifyProgress(campaignId, { step: 'Finalizing Video', percentage: 90 });
      const finalVideoPath = path.join(batchSessionDir, 'final.mp4');
      await concatenateScenes(mergedScenePaths, finalVideoPath);

      let outputVideoPath = finalVideoPath;
      if (logoPath) {
        const watermarkedPath = path.join(batchSessionDir, 'final_watermarked.mp4');
        await applyLogoWatermark(finalVideoPath, logoPath, watermarkedPath);
        outputVideoPath = watermarkedPath;
      }

      // Phase 1 Persistence: Move to persistent folder
      const persistentFileName = `${campaignId}.mp4`;
      const persistentFilePath = path.join(PUBLIC_DIR, persistentFileName);
      fs.copyFileSync(outputVideoPath, persistentFilePath);

      const baseUrl = getBaseUrl(req);
      const fullVideoUrl = `${baseUrl}/public/campaigns/${persistentFileName}`;
      
      // Update Database Route if Campaign ID was passed
      if (req.body.campaignId) {
         try {
           await dbRun('UPDATE campaigns SET status = ?, video_url = ?, script = ? WHERE id = ?', 
           ['completed', fullVideoUrl, JSON.stringify(script), req.body.campaignId]);
         } catch (dbErr) {
           console.error('Failed to update DB on completion:', dbErr);
         }
      }

      notifyProgress(campaignId, { step: 'Complete', percentage: 100, videoUrl: fullVideoUrl });

      results.push({
        videoUrl: fullVideoUrl,
        script: script,
        caption: generatedData.caption,
        hashtags: Array.isArray(generatedData.hashtags) ? generatedData.hashtags.join(' ') : (generatedData.hashtags || '')
      });
    }

    res.json({ message: 'Success', results });
  } catch (error) {
    console.error(`[${sessionId}] Gen Error:`, error);
    res.status(500).json({ error: error.message || 'Failed to generate video' });
  }
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
