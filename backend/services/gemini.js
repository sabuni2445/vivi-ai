const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash-latest' 
});

async function generateScript(prompt) {
  const systemPrompt = `You are a video script generator. Generate a 3-scene video script for Vivi-AI.
  Return ONLY a JSON array with exactly 3 objects.
  Each object MUST have:
  - "text": 1-2 sentences of narration.
  - "keywords": 2-3 visual keywords (nouns/adjectives) to search for stock video.
  - "scene_number": index (1, 2, 3).
  Example:
  [
    { "text": "In the heart of the forest, the dawn breaks.", "keywords": "forest sunrise morning", "scene_number": 1 },
    ...
  ]`;

  const result = await model.generateContent(`${systemPrompt}\n\nUser Prompt: ${prompt}`);
  const response = await result.response;
  const text = response.text();

  // Try to parse JSON from Markdown (some AI models wrap it in ```json)
  const jsonMatch = text.match(/\[[\s\S]*\]/); 
  if (!jsonMatch) {
    throw new Error('AI failed to generate valid JSON format for the script.');
  }

  const script = JSON.parse(jsonMatch[0]);
  return script;
}

module.exports = { generateScript };
