// 
const { spawn } = require("child_process");
const fs = require("fs");

function runOCR(imagePath) {
  return new Promise((resolve, reject) => {

    // ✅ الإصلاح: spawn بدل exec — مفيش shell injection
    const pythonCommand = process.platform === "win32" ? "python" : "python3";
    const python = spawn(pythonCommand, ["python/ocr.py", imagePath]);

    let result = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    python.on("close", (code) => {

      // ✅ احذف الصورة بعد الـ OCR فوراً
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Failed to delete image:", err.message);
        else console.log("Image deleted after OCR:", imagePath);
      });

      if (code !== 0) {
        return reject(new Error(`OCR failed: ${errorOutput}`));
      }

      try {
        const parsed = JSON.parse(result);
        resolve(parsed);
      } catch (e) {
        reject(new Error("Failed to parse OCR output"));
      }
    });

    python.on("error", (err) => {
      reject(new Error(`Failed to start Python: ${err.message}`));
    });

  });
}

module.exports = { runOCR };