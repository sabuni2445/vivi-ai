const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    // Correct way to list models in newer SDK versions
    // Actually, usually it is available on the main instance? No.
    // Let's just try to generate content with 'gemini-pro' to see if that works.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello");
    console.log('Gemini Flash Success:', result.response.text());
  } catch (error) {
    console.error('Gemini Flash Failed:', error.message);
    try {
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const resultPro = await modelPro.generateContent("Say hello");
        console.log('Gemini Pro Success:', resultPro.response.text());
    } catch (err) {
        console.error('Gemini Pro Failed:', err.message);
    }
  }
}

listModels();
