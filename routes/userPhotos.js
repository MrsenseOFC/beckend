import express from 'express';
import { uploadProfilePicture, getProfilePicture } from '../controllers/userPhotosController.js';
import multer from 'multer';
import path from 'path';

// Defina o armazenamento e a lógica de renomeação do arquivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + ext);
  },
});

// Defina o filtro de arquivo para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Não é um tipo de arquivo suportado'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // Limite de 5MB
});

const router = express.Router();

// Rota para fazer o upload da foto de perfil
router.post('/:userId/upload', upload.single('image_file'), uploadProfilePicture);

// Rota para obter a foto de perfil do usuário
router.get('/:userId', getProfilePicture);

export default router;
