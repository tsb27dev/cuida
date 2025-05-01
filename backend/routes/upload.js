// backend/routes/upload.js
const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage para multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cuida_uploads',
    allowed_formats: ['jpg','jpeg','png'],
  },
});

const parser = multer({ storage });

const router = express.Router();

// POST /upload
router.post('/', parser.single('image'), (req, res) => {
  // req.file contém info do upload
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada' });
  }
  res.json({
    url: req.file.path,         // URL pública da imagem
    public_id: req.file.filename
  });
});

module.exports = router;
