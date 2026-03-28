const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Create temp directory for video processing
const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Configure multer for logo uploads
const upload = multer({ dest: TEMP_DIR });

const { generateScript } = require('./services/groq');
const { generateVoice } = require('./services/elevenlabs');
const { fetchVideo } = require('./services/pexels');
const { generateImage } = require('./services/imagegen');
const { processScene, processImageScene, concatenateScenes, applyLogoWatermark } = require('./services/ffmpeg');

app.use('/videos', express.static(TEMP_DIR));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.post('/api/generate', upload.single('logo'), async (req, res) => {
  const prompt = req.body.prompt;
  const useNanoBanana = req.body.useNanoBanana === 'true' || req.body.useNanoBanana === true;
  const logoPath = req.file ? req.file.path : null;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const sessionId = Date.now().toString();
  const sessionDir = path.join(TEMP_DIR, sessionId);
  fs.mkdirSync(sessionDir, { recursive: true });

  try {
    const contentType = req.body.contentType || 'Motivation';
    const batchCount = parseInt(req.body.batchCount) || 1;
    const maxBatch = Math.min(batchCount, 3); // Max 3 variations to prevent timeout/abuse
    const results = [];

    for (let batchIndex = 0; batchIndex < maxBatch; batchIndex++) {
      const batchSessionId = maxBatch > 1 ? `${sessionId}_v${batchIndex + 1}` : sessionId;
      const batchSessionDir = path.join(TEMP_DIR, batchSessionId);
      if (!fs.existsSync(batchSessionDir)) {
        fs.mkdirSync(batchSessionDir, { recursive: true });
      }

      console.log(`[${batchSessionId}] Generating script (Variation ${batchIndex + 1}/${maxBatch})...`);
      
      // Generate script returns full object: { hook, problem, solution, cta, caption, hashtags, scenes }
      const generatedData = await generateScript(prompt, contentType);
      const script = generatedData.scenes;

      const mergedScenePaths = [];
      for (let index = 0; index < script.length; index++) {
        const scene = script[index];
        const sceneId = index + 1;
        const audioPath = path.join(batchSessionDir, `audio_${sceneId}.mp3`);
        const rawVisualPath = path.join(batchSessionDir, useNanoBanana ? `raw_image_${sceneId}.jpg` : `raw_video_${sceneId}.mp4`);
        const mergedVideoPath = path.join(batchSessionDir, `merged_scene_${sceneId}.mp4`);

        console.log(`[${batchSessionId}] Scene ${sceneId}: Fetching voice and visuals...`);
        // Fetch Voice and Visuals concurrently
        await Promise.all([
          generateVoice(scene.text, audioPath),
          useNanoBanana ? generateImage(scene.keywords, rawVisualPath) : fetchVideo(scene.keywords, rawVisualPath),
        ]);

        console.log(`[${batchSessionId}] Scene ${sceneId}: Merging audio and visuals...`);
        if (useNanoBanana) {
          await processImageScene(rawVisualPath, audioPath, mergedVideoPath, scene.text);
        } else {
          await processScene(rawVisualPath, audioPath, mergedVideoPath, scene.text);
        }
        
        mergedScenePaths.push(mergedVideoPath);
      }

      console.log(`[${batchSessionId}] Concatenating scenes...`);
      const finalVideoPath = path.join(batchSessionDir, 'final.mp4');
      await concatenateScenes(mergedScenePaths, finalVideoPath);

      let outputVideoPath = finalVideoPath;
      
      // If user uploaded a logo, apply it
      if (logoPath) {
        console.log(`[${batchSessionId}] Applying User Logo Watermark...`);
        const watermarkedPath = path.join(batchSessionDir, 'final_watermarked.mp4');
        await applyLogoWatermark(finalVideoPath, logoPath, watermarkedPath);
        outputVideoPath = watermarkedPath;
      }

      const videoFileName = path.basename(outputVideoPath);
      const fullVideoUrl = `${req.protocol}://${req.get('host')}/videos/${batchSessionId}/${videoFileName}`;
      
      results.push({
        videoUrl: fullVideoUrl,
        script: script,
        caption: generatedData.caption,
        hashtags: generatedData.hashtags
      });
    }

    res.json({ 
      message: 'Video(s) generated successfully', 
      results // Array of generated variations
    });

  } catch (error) {
    console.error(`[${sessionId}] Generation Error:`, error);
    res.status(500).json({ error: error.message || 'Failed to generate video' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
