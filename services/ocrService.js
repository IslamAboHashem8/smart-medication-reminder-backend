const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const OCR_SERVER_URL = process.env.OCR_SERVER_URL;

async function runOCR(imagePath) {
  try {
    // جهّز الصورة عشان تبعتها للـ OCR Server
    const form = new FormData();
    form.append("image", fs.createReadStream(imagePath));

    // بعت الصورة لـ FastAPI على Koyeb
    const response = await axios.post(
      `${OCR_SERVER_URL}/ocr`,
      form,
      {
        headers: form.getHeaders(),
        timeout: 360000 // دقيقة كاملة لأن الـ OCR بياخد وقت
      }
    );

    // استخرج النصوص بس
    const texts = response.data.texts.map(t => t.text);
    console.log("OCR texts received:", texts);
    return texts;

  } finally {
    // امسح الصورة المحلية دايماً حتى لو حصل error
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log("Image deleted after OCR:", imagePath);
    }
  }
}

module.exports = { runOCR };