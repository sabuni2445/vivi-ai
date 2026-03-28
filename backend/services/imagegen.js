const axios = require('axios');
const fs = require('fs');

async function generateImage(keywords, outputPath) {
  try {
    const pexelsKey = process.env.PEXELS_API_KEY;
    if (!pexelsKey) {
      throw new Error("PEXELS_API_KEY is missing. Cannot fetch fallback images.");
    }
    
    // We are restoring true AI Image Generation! 
    // Using Pollinations AI as the primary creative engine, because stock photos aren't "creative" enough!
    const enhancedPrompt = `${keywords}, highly creative, masterpiece, cinematic lighting, hd photorealistic`;
    const aiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1280&height=720&nologo=true`;
    
    console.log(`[ImageGen] Generating highly creative AI Image for: '${keywords}'...`);
    
    try {
      const response = await axios.get(aiUrl, { 
        responseType: 'stream',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      const writer = fs.createWriteStream(outputPath);
      response.data.pipe(writer);

      return await new Promise((resolve, reject) => {
        writer.on('close', resolve);
        writer.on('error', reject);
      });
    } catch (aiError) {
      console.log(`[ImageGen] Free AI API temporarily busy. Falling back to high-quality Pexels matching...`);
      // Seamlessly fall back to Pexels exclusively if the AI server throws an IP/Timeout error
      const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(keywords)}&per_page=1&orientation=landscape`;
      const pexelsRes = await axios.get(pexelsUrl, { headers: { Authorization: pexelsKey } });
      
      let finalPhotos = pexelsRes.data.photos;
      if (!finalPhotos || finalPhotos.length === 0) {
        const fallbackKeywords = keywords.split(' ').slice(0, 2).join(' ');
        const fallbackRes = await axios.get(`https://api.pexels.com/v1/search?query=${encodeURIComponent(fallbackKeywords)}&per_page=1&orientation=landscape`, { headers: { Authorization: pexelsKey } });
        finalPhotos = fallbackRes.data.photos;
      }
      
      if (!finalPhotos || finalPhotos.length === 0) throw new Error(`Could not generate or fetch fallback for '${keywords}'`);
      
      const imageUrl = finalPhotos[0].src.landscape || finalPhotos[0].src.large;
      const response = await axios.get(imageUrl, { responseType: 'stream' });
      const writer = fs.createWriteStream(outputPath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('close', resolve);
        writer.on('error', reject);
      });
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('AI Image Gen Error: Pexels Authentication failed. Check your API Key.');
    } else {
      console.error('AI Image Gen Error:', error.message);
    }
    throw error;
  }
}

module.exports = { generateImage };
