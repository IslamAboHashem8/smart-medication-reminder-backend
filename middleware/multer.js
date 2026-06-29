const multer = require('multer');
const path = require('path');

// مكان حفظ الصور
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // لازم تكون موجودة
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + path.extname(file.originalname));
    }
});
const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png"
];
// فلتر للصور فقط
  const fileFilter = (req, file, cb) => {

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error("Only JPG, JPEG and PNG images are allowed."), false);

    }
  };

module.exports = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
