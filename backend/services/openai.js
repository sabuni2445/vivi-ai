const { OpenAI } = require('openai');

let openaiClient;

function getOpenAIClient() {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is missing from environment variables.');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

async function generateScript(prompt) {
  const openai = getOpenAIClient();
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

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo', // or 'gpt-4o-mini'
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate a script for: ${prompt}` },
    ],
    response_format: { type: 'json_object' },
  });

  const content = JSON.parse(response.choices[0].message.content);
  // Ensure we return the array even if GPT wraps it in a key
  return content.scenes || content.script || Array.isArray(content) ? content : Object.values(content)[0];
}

module.exports = { generateScript };
