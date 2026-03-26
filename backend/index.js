const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

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

const { generateScript } = require('./services/groq');
const { generateVoice } = require('./services/elevenlabs');
const { fetchVideo } = require('./services/pexels');
const { generateImage } = require('./services/imagegen');
const { processScene, processImageScene, concatenateScenes } = require('./services/ffmpeg');

app.use('/videos', express.static(TEMP_DIR));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.post('/api/generate', async (req, res) => {
  const { prompt, useNanoBanana } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const sessionId = Date.now().toString();
  const sessionDir = path.join(TEMP_DIR, sessionId);
  fs.mkdirSync(sessionDir, { recursive: true });

  try {
    console.log(`[${sessionId}] Generating script...`);
    const script = await generateScript(prompt);

    const mergedScenePaths = [];
    for (let index = 0; index < script.length; index++) {
      const scene = script[index];
      const sceneId = index + 1;
      const audioPath = path.join(sessionDir, `audio_${sceneId}.mp3`);
      const rawVisualPath = path.join(sessionDir, useNanoBanana ? `raw_image_${sceneId}.jpg` : `raw_video_${sceneId}.mp4`);
      const mergedVideoPath = path.join(sessionDir, `merged_scene_${sceneId}.mp4`);

      console.log(`[${sessionId}] Scene ${sceneId}: Fetching voice and visuals...`);
      // It's safe to fetch Voice and Visuals at the same time for exactly 1 scene
      await Promise.all([
        generateVoice(scene.text, audioPath),
        useNanoBanana ? generateImage(scene.keywords, rawVisualPath) : fetchVideo(scene.keywords, rawVisualPath),
      ]);

      console.log(`[${sessionId}] Scene ${sceneId}: Merging audio and visuals...`);
      if (useNanoBanana) {
        await processImageScene(rawVisualPath, audioPath, mergedVideoPath);
      } else {
        await processScene(rawVisualPath, audioPath, mergedVideoPath);
      }
      
      mergedScenePaths.push(mergedVideoPath);
    }

    console.log(`[${sessionId}] Concatenating scenes...`);
    const finalVideoPath = path.join(sessionDir, 'final.mp4');
    await concatenateScenes(mergedScenePaths, finalVideoPath);

    const fullVideoUrl = `${req.protocol}://${req.get('host')}/videos/${sessionId}/final.mp4`;
    res.json({ 
      message: 'Video generated successfully', 
      videoUrl: fullVideoUrl,
      script 
    });

  } catch (error) {
    console.error(`[${sessionId}] Generation Error:`, error);
    res.status(500).json({ error: error.message || 'Failed to generate video' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
