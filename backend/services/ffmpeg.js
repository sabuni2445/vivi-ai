const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('ffmpeg-static');
const ffprobeInstaller = require('ffprobe-static');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

async function processScene(videoPath, audioPath, outputPath) {
  return new Promise((resolve, reject) => {
    // Determine the duration of the audio
    ffmpeg.ffprobe(audioPath, (err, metadata) => {
      if (err) return reject(new Error('Failed to probe audio: ' + err.message));
      const duration = metadata.format.duration;

      // Merge audio and video, looping the video if needed and cutting it to audio duration
      ffmpeg(videoPath)
        .input(audioPath)
        .inputOptions(['-stream_loop -1']) // Loop video indefinitely
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          `-t ${duration}`, // Cut output to audio length
          '-pix_fmt yuv420p',
          '-vf scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1' // standard HD
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

async function processImageScene(imagePath, audioPath, outputPath) {
  return new Promise((resolve, reject) => {
    // Determine the duration of the audio
    ffmpeg.ffprobe(audioPath, (err, metadata) => {
      if (err) return reject(new Error('Failed to probe audio: ' + err.message));
      const duration = metadata.format.duration;

      // Create a video from a single static image that lasts for the audio duration
      ffmpeg()
        .input(imagePath)
        .loop(duration) // Loops the image frame for the entire duration
        .input(audioPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-pix_fmt yuv420p',
          '-vf scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1', // standard HD
          '-shortest' // Finish encoding when the shortest stream ends (the audio)
        ])
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(new Error('FFmpeg Image error: ' + err.message)))
        .save(outputPath);
    });
  });
}

module.exports = { processScene, processImageScene, concatenateScenes };
