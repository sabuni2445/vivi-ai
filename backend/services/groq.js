const { OpenAI } = require('openai');

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

async function generateScript(prompt, contentType) {
  const cType = contentType || 'General';
  const systemPrompt = `You are a professional video script generator for Vivi-AI.
  Content Type Target: ${cType}
  
  You MUST write a highly engaging 4-scene video script tailored to this content type.
  Structure the script functionally:
  - Scene 1: Hook (attention-grabbing first line)
  - Scene 2: Problem
  - Scene 3: Solution
  - Scene 4: Call-to-action (CTA)
  
  You MUST return ONLY a JSON object EXACTLY matching this structure:
  {
    "hook": "The text of scene 1",
    "problem": "The text of scene 2",
    "solution": "The text of scene 3",
    "cta": "The text of scene 4",
    "caption": "A highly engaging social media caption highlighting the content",
    "hashtags": ["#tag1", "#tag2", "#tag3"],
    "scenes": [
      { "text": "[Hook text]", "keywords": "visual keyword1 keyword2", "scene_number": 1 },
      { "text": "[Problem text]", "keywords": "visual keyword1 keyword2", "scene_number": 2 },
      { "text": "[Solution text]", "keywords": "visual keyword1 keyword2", "scene_number": 3 },
      { "text": "[CTA text]", "keywords": "visual keyword1 keyword2", "scene_number": 4 }
    ]
  }
  
  Keep 'text' to 1-2 powerful sentences. Keep 'keywords' strictly to 2-3 visual nouns/adjectives (used for downloading stock footage).`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate a ${cType} video script for the following topic: ${prompt}. Output strictly valid JSON object.` },
    ],
    response_format: { type: 'json_object' },
  });

  const content = JSON.parse(response.choices[0].message.content);
  
  if (!content.scenes || !Array.isArray(content.scenes) || content.scenes.length === 0) {
    throw new Error('Groq generated an invalid or empty script structure.');
  }
  
  return content; // Return the fully structured object with all metadata
}

module.exports = { generateScript };
