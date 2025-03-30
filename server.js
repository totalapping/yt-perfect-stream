const { exec } = require('child_process');

// ENV Variables (Railway से लेंगे)
const VIDEO_URL = process.env.VIDEO_URL;
const RTMP_URL = "rtmp://a.rtmp.youtube.com/live2";
const STREAM_KEY = process.env.STREAM_KEY;

// Optimized FFmpeg Command (YouTube-Friendly)
const cmd = `
  ffmpeg -re -stream_loop -1 -i "${VIDEO_URL}" \
  -vf "fps=30,scale=1280:720" -c:v libx264 -preset ultrafast \
  -g 60 -keyint_min 30 \  // 30fps पर हर 2 सेकंड में Keyframe (60/30=2s)
  -b:v 3000k -maxrate 3000k -bufsize 6000k \
  -c:a aac -b:a 128k \
  -f flv "${RTMP_URL}/${STREAM_KEY}"
`;

console.log("Starting YouTube Live Stream...");
const stream = exec(cmd);

// Log FFmpeg Output
stream.stderr.on('data', (data) => {
  console.log(data.toString());
});

// Auto-Restart if Crash
stream.on('exit', (code) => {
  console.log(`FFmpeg exited with code ${code}. Restarting...`);
  setTimeout(() => process.kill(process.pid, 'SIGTERM'), 5000); // 5s delay
});
