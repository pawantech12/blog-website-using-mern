const multer = require("multer");
const path = require("path");

// Multer setup for file upload handling
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (
      ext !== ".jpg" &&
      ext !== ".jfif" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".webp"
    ) {
      // Reject the file if it's not an image.
      return cb(new Error("Only images are allowed"), false);
    }
    // Accept the file if it's an image.
    cb(null, true);
  },
});

module.exports = upload;
