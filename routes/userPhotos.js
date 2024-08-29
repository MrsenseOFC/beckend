import express from 'express';
import { uploadProfilePicture, getProfilePicture } from '../controllers/userPhotosController.js';
import { authenticateToken } from '../middlewares/auth.js';
import multer from 'multer';

const router = express.Router();

// Setup multer for file uploads with validation
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Arquivo não é uma imagem válida'), false);
  }
};

// Configuração do multer com limites de tamanho e filtro de tipo de arquivo
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 }, // Limite de 2MB
  fileFilter: fileFilter
});

// Rota para upload de imagem de perfil
router.post('/:userId/upload', authenticateToken, upload.single('image_file'), (req, res, next) => {
  if (req.fileValidationError) {
    return res.status(400).json({ error: req.fileValidationError });
  }
  next();
}, uploadProfilePicture);

// Rota para obter imagem de perfil
router.get('/:userId', authenticateToken, getProfilePicture);

export default router;
