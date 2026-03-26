const axios = require('axios');
const fs = require('fs');

async function generateImage(keywords, outputPath) {
  try {
    const pollinationsKey = process.env.POLLINATIONS_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // Use Pollinations if explicitly configured
    if (pollinationsKey) {
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(keywords)}?width=1280&height=720&nologo=true`;
      const config = {
        responseType: 'stream',
        headers: { Authorization: `Bearer ${pollinationsKey}` }
      };

      const response = await axios.get(url, config);
      const writer = fs.createWriteStream(outputPath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } 
    // Fall back to OpenAI DALL-E since OPENAI_API_KEY is available in the environment
    else if (openaiKey) {
      console.log(`[ImageGen] Pollinations key missing, falling back to OpenAI DALL-E for '${keywords}'...`);
      const response = await axios.post('https://api.openai.com/v1/images/generations', {
        prompt: keywords + " hd photorealistic",
        n: 1,
        size: "1024x1024"
      }, {
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const imageUrl = response.data.data[0].url;
      const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });

      const writer = fs.createWriteStream(outputPath);
      imageResponse.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } else {
      throw new Error('AI Image Gen Error: Neither POLLINATIONS_API_KEY nor OPENAI_API_KEY was found in .env');
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('AI Image Gen Error: Authentication failed (401). Please check your API keys.');
    } else {
      console.error('AI Image Gen Error:', error.message);
    }
    throw error;
  }
}

module.exports = { generateImage };
