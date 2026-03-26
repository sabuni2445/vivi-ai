const { OpenAI } = require('openai');

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
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

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile', // Fast, stable and free tier model
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate a script for: ${prompt}` },
    ],
    response_format: { type: 'json_object' },
  });

  const content = JSON.parse(response.choices[0].message.content);
  if (Array.isArray(content)) return content;
  if (content.scenes) return content.scenes;
  if (content.script) return content.script;
  return Object.values(content)[0];
}

module.exports = { generateScript };
