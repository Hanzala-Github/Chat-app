// import multer from "multer";
// import fs from "fs";
// import path from "path";

// const UPLOAD_DIR = path.join(process.cwd(), "uploads", "voices");

// if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, UPLOAD_DIR),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname) || ".webm";
//     cb(null, `${Date.now()}${ext}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (!file.mimetype.startsWith("audio/")) {
//     return cb(new Error("only audio files are allowed"), false);
//   }
//   cb(null, true);
// };

// export const uploadVoice = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 2_500_000 },
// });
import path from "path";
import multer from "multer";
import crypto from "crypto";
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "voices");

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = crypto.randomUUID();
    cb(null, `${name}${ext}`);
  },
});

export const uploadVoice = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("audio/")) {
      return cb(new Error("Only audio allowed"));
    }
    cb(null, true);
  },
});
