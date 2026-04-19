const axios = require('axios');
const fs = require('fs');

let defaultVoiceId = null;

const googleTTS = require('google-tts-api');

async function fallbackGoogleTTS(text, outputPath) {
  console.log('Using Google TTS fallback...');
  const safeText = String(text || "Vivi AI Production").substring(0, 200); // Google TTS limit is 200 chars per chunk
  
  try {
    const results = await googleTTS.getAllAudioBase64(safeText, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com',
      splitPunct: ',.?',
    });
    
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
  const safeText = String(text || "No text provided");
  
  try {
    if (!process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY === 'YOUR_API_KEY') {
       throw new Error('ElevenLabs API Key is missing or invalid.');
    }

    // Dynamically fetch the first available voice to prevent 404
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
        text: safeText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      },
      responseType: 'arraybuffer',
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
    
    try {
      return await fallbackGoogleTTS(safeText, outputPath);
    } catch (fallbackErr) {
       console.warn("TTS ENGINE CRASH. Generating silent audio fallback to prevent FFmpeg crash.");
       return new Promise((resolve) => {
         require('fluent-ffmpeg')()
           .input('anullsrc=r=44100:cl=mono')
           .inputFormat('lavfi')
           .audioCodec('libmp3lame')
           .duration(3)
           .save(outputPath)
           .on('end', () => resolve(outputPath))
           .on('error', () => resolve(outputPath)); // Failsafe
       });
    }
  }
}

module.exports = { generateVoice };
