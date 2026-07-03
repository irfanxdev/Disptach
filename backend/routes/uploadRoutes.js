import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @route  POST /api/upload
// Accepts a single file under field name "file", returns a public URL
// that can be stored in Post.mediaUrls and passed to platform APIs.
router.post("/", protect, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "dispatch" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });

    const result = await streamUpload();
    res.json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }
});

export default router;
