import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadProfilePicture, getProfilePicture } from '../controllers/profileController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Configuração do multer para armazenamento de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile_pictures');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user.id + ext);
  }
});

const upload = multer({ storage });

// Rota para upload de imagem de perfil
router.post('/upload', authenticateToken, upload.single('profilePicture'), uploadProfilePicture);

// Rota para recuperar a imagem de perfil
router.get('/:userId', authenticateToken, getProfilePicture);

export default router;
