const { exec } = require('child_process');

// ENV Variables
const VIDEO_URL = process.env.VIDEO_URL;
const RTMP_URL = "rtmp://a.rtmp.youtube.com/live2";
const STREAM_KEY = process.env.STREAM_KEY;

// Fixed FFmpeg Command (No Syntax Errors)
const cmd = [
  'ffmpeg',
  '-re',
  '-stream_loop', '-1',
  '-i', `"${VIDEO_URL}"`,
  '-vf', 'fps=30,scale=1280:720',
  '-c:v', 'libx264',
  '-preset', 'ultrafast',
  '-g', '60',
  '-keyint_min', '30',
  '-b:v', '3000k',
  '-maxrate', '3000k',
  '-bufsize', '6000k',
  '-c:a', 'aac',
  '-b:a', '128k',
  '-f', 'flv',
  `"${RTMP_URL}/${STREAM_KEY}"`
].join(' ');

console.log("Starting Stream...");
const stream = exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error("Error:", stderr);
    process.exit(1);
  }
});

stream.stderr.on('data', (data) => {
  console.log(data.toString());
});
