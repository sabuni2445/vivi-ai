const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('ffmpeg-static');
const ffprobeInstaller = require('ffprobe-static');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

function getAspectConfig(ratio) {
  switch (ratio) {
    case '9:16':
      return {
        width: 1080,
        height: 1920,
        yPos: '(h/2)', // Center aligned (mobile optimized)
        fontSize: 95,
        wrapLimit: 20
      };
    case '1:1':
      return {
        width: 1080,
        height: 1080,
        yPos: '(h/2)-text_h+(h/4)', // Centered balanced
        fontSize: 80,
        wrapLimit: 30
      };
    case '16:9':
    default:
      return {
        width: 1920,
        height: 1080,
        yPos: '(h-text_h)-120', // Lower-third positioning
        fontSize: 65,
        wrapLimit: 45
      };
  }
}

function getSubtitleFilter(text, targetRatio = '16:9', outputPath) {
  if (!text) return '';
  const config = getAspectConfig(targetRatio);
  
  // Dynamic wrapping based on exact format geometry
  const regex = new RegExp(`(?![^\\n]{1,${config.wrapLimit}}$)([^\\n]{1,${config.wrapLimit}})\\s`, 'g');
  const wrapped = text.replace(regex, '$1\n');
  const safeText = wrapped.replace(/'/g, "\u2019");
  
  const textFilePath = outputPath.replace('.mp4', '.txt');
  require('fs').writeFileSync(textFilePath, safeText);

  const relativePath = require('path').relative(process.cwd(), textFilePath);
  const safeTextFilePath = relativePath.replace(/\\/g, '/');

  return `drawtext=textfile='${safeTextFilePath}':fontcolor=white:font=Impact:fontsize=${config.fontSize}:borderw=6:bordercolor=black@0.9:shadowx=4:shadowy=5:shadowcolor=black@0.6:line_spacing=20:x=(w-text_w)/2:y=${config.yPos}`;
}

async function processScene(videoPath, audioPath, outputPath, sceneText = '', targetRatio = '16:9') {
  const { width, height } = getAspectConfig(targetRatio);

  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(audioPath, (err, metadata) => {
      if (err) return reject(new Error('Failed to probe audio: ' + err.message));
      let duration = parseFloat(metadata.format.duration) || 5;

      // Composition fix: High-quality aggressive aspect crop & scale (increase to prevent black bars)
      let filtergraph = `scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},setsar=1`;
      const subtitleFilter = getSubtitleFilter(sceneText, targetRatio, outputPath);
      if (subtitleFilter) filtergraph += `,${subtitleFilter}`;

      ffmpeg(videoPath)
        .input(audioPath)
        .inputOptions(['-stream_loop', '-1'])
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions(['-t', String(duration), '-pix_fmt', 'yuv420p', '-vf', filtergraph])
        .on('end', () => resolve(outputPath))
        .on('error', (err) => {
           console.error("Scene render error: ", err);
           reject(new Error('FFmpeg error: ' + err.message));
        })
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

async function processImageScene(imagePath, audioPath, outputPath, sceneText = '', targetRatio = '16:9') {
  const { width, height } = getAspectConfig(targetRatio);

  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(audioPath, (err, metadata) => {
      if (err) return reject(new Error('Failed to probe audio: ' + err.message));
      let duration = parseFloat(metadata.format.duration) || 5;

      let filtergraph = `format=yuv420p,scale=${width*2}:${height*2}:force_original_aspect_ratio=increase,crop=${width*2}:${height*2},zoompan=z='min(max(zoom,1)+0.001,1.5)':d=${Math.ceil(duration * 25)}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${width}x${height}`;
      const subtitleFilter = getSubtitleFilter(sceneText, targetRatio, outputPath);
      if (subtitleFilter) filtergraph += `,${subtitleFilter}`;

      ffmpeg(imagePath)
        .input(audioPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions(['-pix_fmt', 'yuv420p', '-vf', filtergraph, '-t', String(duration), '-r', '25'])
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
