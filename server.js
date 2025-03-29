const { exec } = require('child_process');

// ENV से सभी वेरिएबल्स लें (Railway में डालेंगे)
const VIDEO_URL = process.env.VIDEO_URL;
const RTMP_URL = "rtmp://a.rtmp.youtube.com/live2";
const STREAM_KEY = process.env.STREAM_KEY;

// FFmpeg कमांड (सभी एरर्स फिक्स्ड)
const cmd = `
  ffmpeg -re -stream_loop -1 -i "${VIDEO_URL}" \\
  -vf "scale=1280:720,fps=30" -c:v libx264 -preset ultrafast \\
  -b:v 3000k -maxrate 3000k -bufsize 6000k -tune zerolatency \\
  -c:a aac -b:a 128k -f flv "${RTMP_URL}/${STREAM_KEY}"
`;

console.log("✅ स्ट्रीम शुरू हो रही है...");
const stream = exec(cmd);

// एरर हैंडलिंग
stream.stderr.on('data', (data) => {
  console.log(data.toString()); // FFmpeg लॉग्स
});

stream.on('exit', (code) => {
  if (code !== 0) console.error("❌ FFmpeg बंद हुआ। कोड:", code);
});
