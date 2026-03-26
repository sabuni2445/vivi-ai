const axios = require('axios');
const fs = require('fs');

async function fetchVideo(keywords, outputPath, isRetry = false) {
  try {
    const options = {
      method: 'GET',
      url: `https://api.pexels.com/videos/search?query=${encodeURIComponent(keywords)}&per_page=1`,
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    };

    const response = await axios.request(options);
    if (!response.data.videos || response.data.videos.length === 0) {
      if (!isRetry) {
        console.warn(`Pexels: No videos found for '${keywords}'. Retrying with generic fallback...`);
        return fetchVideo('beautiful abstract motion', outputPath, true);
      }
      throw new Error(`No videos found for: ${keywords}`);
    }

    const videoFiles = response.data.videos[0].video_files;
    const selectedFile = videoFiles.find(f => f.quality === 'hd') || 
                         videoFiles.find(f => f.quality === 'sd') || 
                         videoFiles[0];
                         
    if (!selectedFile || !selectedFile.link) {
      throw new Error(`Could not find a valid video file format for: ${keywords}`);
    }
    
    const videoUrl = selectedFile.link;
    const videoResponse = await axios.get(videoUrl, { responseType: 'stream' });

    const writer = fs.createWriteStream(outputPath);
    videoResponse.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    // If Pexels server crashes (500) on a specific keyword, retry with a safe fallback
    if (!isRetry && error.response && error.response.status >= 500) {
      console.warn(`Pexels Server Error (${error.response.status}) on '${keywords}'. Retrying with generic fallback...`);
      return fetchVideo('beautiful abstract motion', outputPath, true);
    }
    
    if (error.response) {
      console.error(`Pexels API Error (${error.response.status}):`, error.response.statusText);
    } else {
      console.error('Pexels Request Error:', error.message);
    }
    throw error;
  }
}

module.exports = { fetchVideo };
