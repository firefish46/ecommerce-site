import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage });

router.post('/', (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.error("Multer Error:", err);
      return res.status(500).json({ message: err.message });
    } else if (err) {
      // An unknown error occurred (likely Cloudinary config).
      console.error("Cloudinary/Server Error:", err);
      return res.status(500).json({ message: err.message });
    }

    // Everything went fine.
    if (!req.file) {
        return res.status(400).json({ message: 'Please select an image' });
    }
    
    res.json({
      message: 'Image Uploaded',
      image: req.file.path, 
    });
  });
});

export default router;