const axios = require('axios');
const fs = require('fs');

async function fetchVideo(keywords, outputPath, isRetry = false) {
  const safeKeywords = keywords && keywords.trim() !== "" ? keywords : "beautiful atmospheric abstract";
  
  try {
    const options = {
      method: 'GET',
      url: `https://api.pexels.com/videos/search?query=${encodeURIComponent(safeKeywords)}&per_page=1`,
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    };

    const response = await axios.request(options);
    if (!response.data.videos || response.data.videos.length === 0) {
      if (!isRetry) {
        console.warn(`Pexels: No videos found for '${safeKeywords}'. Retrying with generic fallback...`);
        return fetchVideo('beautiful abstract motion', outputPath, true);
      }
      throw new Error(`No videos found for: ${safeKeywords}`);
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

async function searchPexelsOptions(keywords, count = 4, isRetry = false) {
  const safeKeywords = keywords && keywords.trim() !== "" ? keywords : "beautiful atmospheric abstract";
  
  try {
    const options = {
      method: 'GET',
      url: `https://api.pexels.com/videos/search?query=${encodeURIComponent(safeKeywords)}&per_page=${count}`,
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    };

    const response = await axios.request(options);
    if (!response.data.videos || response.data.videos.length === 0) {
      if (!isRetry) return searchPexelsOptions('beautiful abstract motion', count, true);
      return [];
    }

    return response.data.videos.map(vid => {
      const selectedFile = vid.video_files.find(f => f.quality === 'hd') || 
                           vid.video_files.find(f => f.quality === 'sd') || 
                           vid.video_files[0];
      return {
        id: vid.id,
        url: selectedFile ? selectedFile.link : null,
        fallbackThumbnail: vid.image
      };
    }).filter(v => v.url !== null);

  } catch (error) {
    if (!isRetry && error.response && error.response.status >= 500) {
      return searchPexelsOptions('beautiful abstract motion', count, true);
    }
    console.error('Pexels Multi-Search Error:', error.message);
    return [];
  }
}

module.exports = { fetchVideo, searchPexelsOptions };
