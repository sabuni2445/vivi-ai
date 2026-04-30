const { OpenAI } = require('openai');

let groqClient;

function getGroqClient() {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is missing from environment variables.');
    }
    groqClient = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }
  return groqClient;
}

async function generateScript(productName, description, style) {
  const groq = getGroqClient();

  const systemPrompt = `You are a professional AI Video Ad Strategist. Generate a high-converting 3-scene video ad script.
  The total duration must be exactly 8 seconds.
  
  Structure:
  Scene 1: The Hook (3 seconds) - Grab attention instantly.
  Scene 2: The Value (3 seconds) - Show the main benefit/problem solved.
  Scene 3: The CTA (2 seconds) - Strong call to action.

  Return ONLY a JSON object with this exact structure:
  {
    "marketing_strategy": "Brief explanation of the psychological angle used.",
    "scenes": [
      { 
        "scene_number": 1,
        "text": "1-2 sentences for narration.",
        "visual_prompt": "Highly detailed cinematic image prompt. Describe lighting, camera angle, and subject. Style: ${style}.",
        "duration": 3
      },
      { 
        "scene_number": 2,
        "text": "1-2 sentences for narration.",
        "visual_prompt": "Highly detailed cinematic image prompt. Describe lighting, camera angle, and subject. Style: ${style}.",
        "duration": 3
      },
      { 
        "scene_number": 3,
        "text": "1-2 sentences for narration.",
        "visual_prompt": "Highly detailed cinematic image prompt. Describe lighting, camera angle, and subject. Style: ${style}.",
        "duration": 2
      }
    ],
    "caption": "Short, punchy social media caption.",
    "hashtags": ["tag1", "tag2"]
  }`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Product: ${productName}. Description: ${description}. Style: ${style}.` },
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = { generateScript };
