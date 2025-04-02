require('dotenv').config();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES.split(',');
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de arquivo não permitido. Tipos permitidos: ${allowedTypes.join(', ')}`), false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: (process.env.MAX_FILE_SIZE || 5) * 1024 * 1024
  }
});