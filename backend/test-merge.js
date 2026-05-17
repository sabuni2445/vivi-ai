require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { generateVoice, getVoices } = require('./services/elevenlabs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegStatic);

// We will use an empty 5-second video as a placeholder if you don't have one handy.
// For a true test, we'll quickly generate a silent video using ffmpeg itself, 
// then generate the voice, then merge them.

const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

function createDummyVideo(outputPath) {
    return new Promise((resolve, reject) => {
        console.log('🎬 Creating 5-second dummy video...');
        ffmpeg()
            .input('color=c=black:s=720x1280:r=30')
            .inputFormat('lavfi')
            .outputOptions([
                '-t 5',
                '-c:v libx264'
            ])
            .save(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', (err) => reject(err));
    });
}

function mergeVideoAudio(videoPath, audioPath, outputPath) {
    return new Promise((resolve, reject) => {
      console.log('🔄 Merging Audio and Video...');
      ffmpeg()
        .input(videoPath)
        .input(audioPath)
        .outputOptions([
          '-c:v copy',
          '-c:a aac',
          '-map 0:v:0',
          '-map 1:a:0',
          '-shortest'
        ])
        .save(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err));
    });
}

async function runMergeTest() {
    console.log('--- Vivi AI Stitching Engine Test ---\n');
    
    try {
        const rawVideoPath = path.join(TEMP_DIR, 'test_raw.mp4');
        const audioPath = path.join(TEMP_DIR, 'test_audio.mp3');
        const finalPath = path.join(TEMP_DIR, 'test_final.mp4');

        // 1. Create a dummy video (simulating Kling output)
        await createDummyVideo(rawVideoPath);

        // 2. Fetch voices and pick one
        console.log('🎙️ Fetching ElevenLabs Voices...');
        const voices = await getVoices();
        let targetVoice = null;
        if (voices && voices.length > 0) {
            targetVoice = voices[0].id;
            console.log(`✅ Selected Voice: ${voices[0].name}`);
        }

        // 3. Generate Audio
        console.log('🔊 Generating AI Voiceover...');
        const script = "This is a test of the Vivi AI automatic video and audio stitching engine. If you hear my voice, the FFmpeg integration was an absolute success!";
        await generateVoice(script, audioPath, targetVoice);
        console.log('✅ Audio generated.');

        // 4. Merge them
        await mergeVideoAudio(rawVideoPath, audioPath, finalPath);
        
        console.log(`\n🎉 SUCCESS! Final merged video is ready at:\n➡️ ${finalPath}`);
        console.log('You can open this file on your computer to watch and listen!');
        
    } catch (e) {
        console.error('\n❌ Test Failed:', e.message);
    }
}

runMergeTest();
