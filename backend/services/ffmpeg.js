const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('ffmpeg-static');
const ffprobeInstaller = require('ffprobe-static');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

function getSubtitleFilter(text) {
  if (!text) return '';
  // Word wrap around 40 characters
  const wrapped = text.replace(/(?![^\n]{1,40}$)([^\n]{1,40})\s/g, '$1\n');
  // Escape quotes and colons safely for FFmpeg filtergraph
  const safeText = wrapped.replace(/'/g, "\u2019").replace(/:/g, "\\:");
  // Centered, bold, white text with black semi-transparent box
  return `drawtext=text='${safeText}':fontcolor=white:fontsize=48:box=1:boxcolor=black@0.6:boxborderw=10:line_spacing=10:x=(w-text_w)/2:y=(h-text_h)-80`;
}

async function processScene(videoPath, audioPath, outputPath, sceneText = '') {
  return new Promise((resolve, reject) => {
    // Determine the duration of the audio
    ffmpeg.ffprobe(audioPath, (err, metadata) => {
      if (err) return reject(new Error('Failed to probe audio: ' + err.message));
      
      let duration = metadata.format && metadata.format.duration;
      duration = parseFloat(duration);
      if (!duration || isNaN(duration) || duration <= 0) {
        duration = (metadata.streams && metadata.streams[0] && metadata.streams[0].duration);
        duration = parseFloat(duration);
      }
      if (!duration || isNaN(duration) || duration <= 0) {
        duration = 5; // Safe fallback if MP3 metadata is missing 
      }

      let filtergraph = `scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1`;
      const subtitleFilter = getSubtitleFilter(sceneText);
      if (subtitleFilter) filtergraph += `,${subtitleFilter}`;

      // Merge audio and video, looping the video if needed and cutting it to audio duration
      ffmpeg(videoPath)
        .input(audioPath)
        .inputOptions(['-stream_loop', '-1']) // Loop video indefinitely
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-t', String(duration), 
          '-pix_fmt', 'yuv420p',
          '-vf', filtergraph
        ])
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(new Error('FFmpeg error: ' + err.message)))
        .save(outputPath);
    });
  });
}

async function concatenateScenes(scenePaths, finalOutputPath) {
  return new Promise((resolve, reject) => {
    const listFile = path.join(path.dirname(finalOutputPath), 'list.txt');
    const content = scenePaths.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n');
    const fs = require('fs');
    fs.writeFileSync(listFile, content);

    ffmpeg()
      .input(listFile)
      .inputOptions(['-f concat', '-safe 0'])
      .outputOptions(['-c copy'])
      .on('end', () => {
        fs.unlinkSync(listFile);
        resolve(finalOutputPath);
      })
      .on('error', (err) => reject(new Error('FFmpeg concatenation error: ' + err.message)))
      .save(finalOutputPath);
  });
}

async function processImageScene(imagePath, audioPath, outputPath, sceneText = '') {
  return new Promise((resolve, reject) => {
    // Determine the duration of the audio
    ffmpeg.ffprobe(audioPath, (err, metadata) => {
      if (err) return reject(new Error('Failed to probe audio: ' + err.message));
      
      let duration = metadata.format && metadata.format.duration;
      duration = parseFloat(duration);
      if (!duration || isNaN(duration) || duration <= 0) {
        duration = (metadata.streams && metadata.streams[0] && metadata.streams[0].duration);
        duration = parseFloat(duration);
      }
      if (!duration || isNaN(duration) || duration <= 0) {
        duration = 5; // Safe fallback if MP3 metadata is missing 
      }

      let filtergraph = `format=yuv420p,scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,zoompan=z='min(max(zoom,1)+0.001,1.5)':d=${Math.ceil(duration * 25)}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720`;
      const subtitleFilter = getSubtitleFilter(sceneText);
      if (subtitleFilter) filtergraph += `,${subtitleFilter}`;

      // Notice: Do NOT use .loop() when using zoompan! 
      // zoompan automatically creates `duration * fps` frames from a SINGLE input image frame.
      // Looping the input causes an infinite buffer exponentially exploding rendering times.
      ffmpeg(imagePath)
        .input(audioPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-pix_fmt', 'yuv420p',
          '-vf', filtergraph,
          '-t', String(duration), 
          '-r', '25' 
        ])
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(new Error('FFmpeg Image error: ' + err.message)))
        .save(outputPath);
    });
  });
}

async function applyLogoWatermark(videoPath, logoPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .input(logoPath)
      .complexFilter([
        // Scale logo to 150px width, then place it in the top right corner
        '[1:v]scale=150:-1[logo]',
        '[0:v][logo]overlay=W-w-30:30'
      ])
      .videoCodec('libx264')
      .audioCodec('copy')
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(new Error('FFmpeg Watermark error: ' + err.message)))
      .save(outputPath);
  });
}

module.exports = { processScene, processImageScene, concatenateScenes, applyLogoWatermark };
