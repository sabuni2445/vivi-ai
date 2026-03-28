const axios = require('axios');
const fs = require('fs');

let defaultVoiceId = null;

const googleTTS = require('google-tts-api');

async function fallbackGoogleTTS(text, outputPath) {
  console.log('Using Google TTS fallback...');
  try {
    const results = await googleTTS.getAllAudioBase64(text, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com',
      splitPunct: ',.?',
    });
    
    // Combine base64 results
    let buffers = [];
    for (const result of results) {
      buffers.push(Buffer.from(result.base64, 'base64'));
    }
    const finalBuffer = Buffer.concat(buffers);
    
    fs.writeFileSync(outputPath, finalBuffer);
    console.log('Google TTS fallback successful:', outputPath);
    return outputPath;
  } catch (err) {
    console.error('Google TTS fallback failed:', err.message);
    throw err;
  }
}

async function generateVoice(text, outputPath) {
  try {
    // Dynamically fetch the first available voice to prevent 404 (Voice Not Found) errors
    if (!defaultVoiceId) {
      const voicesResp = await axios.get('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY
        }
      });
      if (!voicesResp.data.voices || voicesResp.data.voices.length === 0) {
        throw new Error('No voices found in your ElevenLabs account.');
      }
      defaultVoiceId = voicesResp.data.voices[0].voice_id;
      console.log('ElevenLabs initialized with Voice ID:', defaultVoiceId);
    }

    const options = {
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${defaultVoiceId}`,
      headers: {
        accept: 'audio/mpeg',
        'content-type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      data: {
        text: text,
        model_id: 'eleven_multilingual_v2', // Updated to latest recommended model
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      },
      responseType: 'arraybuffer', // Important for saving the audio file
    };

    const response = await axios.request(options);
    fs.writeFileSync(outputPath, Buffer.from(response.data));
    return outputPath;
  } catch (error) {
    if (error.response && error.response.data) {
      const errDetail = error.response.data instanceof Buffer ? error.response.data.toString('utf8') : JSON.stringify(error.response.data);
      console.error('ElevenLabs API Error:', errDetail);
    } else {
      console.error('ElevenLabs Local Error:', error.message);
    }
    console.log('Attempting fallback to Google TTS...');
    return await fallbackGoogleTTS(text, outputPath);
  }
}

module.exports = { generateVoice };
