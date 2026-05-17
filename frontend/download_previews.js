const axios = require('axios');
const fs = require('fs');
const path = require('path');

const PEXELS_API_KEY = 'LeSOzdxtAeYT5W2HPS9P8D7t3NwmqgBMlcXjxZkSdR7kRJqPyBef75oQ';

const items = [
  { id: 'luxury-gold', query: 'luxury gold cinematic product lighting', folder: 'atmospheres' },
  { id: 'cyber-neon', query: 'cyberpunk neon lights aesthetic', folder: 'atmospheres' },
  { id: 'minimalist-white', query: 'minimalist white studio product lighting', folder: 'atmospheres' },
  { id: 'midnight-noir', query: 'midnight noir dramatic shadows lighting', folder: 'atmospheres' },
  { id: 'vibrant-pop', query: 'vibrant colorful high saturation motion', folder: 'atmospheres' },
  
  { id: 'grand-reveal', query: 'slow camera zoom out product reveal', folder: 'actions' },
  { id: 'infinite-spin', query: 'cinematic 360 rotation product', folder: 'actions' },
  { id: 'kinetic-burst', query: 'water splash explosion slow motion cinematic', folder: 'actions' },
  { id: 'drone-sweep', query: 'fast camera drone sweep cinematic', folder: 'actions' },
  { id: 'macro-detail', query: 'macro close up texture motion', folder: 'actions' }
];

async function downloadVideo(item) {
  const outputPath = path.join(__dirname, 'public', 'videos', 'previews', `${item.id}.mp4`);
  
  try {
    console.log(`Searching for: ${item.query}...`);
    const searchRes = await axios.get(`https://api.pexels.com/videos/search?query=${encodeURIComponent(item.query)}&per_page=1`, {
      headers: { Authorization: PEXELS_API_KEY }
    });

    if (searchRes.data.videos.length === 0) {
      console.warn(`No video found for ${item.id}`);
      return;
    }

    const video = searchRes.data.videos[0];
    const videoFile = video.video_files.find(f => f.quality === 'hd') || video.video_files[0];
    const videoUrl = videoFile.link;

    console.log(`Downloading ${item.id} from ${videoUrl}...`);
    const videoRes = await axios.get(videoUrl, { responseType: 'stream' });
    
    const writer = fs.createWriteStream(outputPath);
    videoRes.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (e) {
    console.error(`Failed to download ${item.id}:`, e.message);
  }
}

async function run() {
  const dir = path.join(__dirname, 'public', 'videos', 'previews');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const item of items) {
    await downloadVideo(item);
  }
  console.log('All downloads complete.');
}

run();
