import express from 'express';
import { uploadProfilePicture, getProfilePicture } from '../controllers/userPhotosController.js';

const router = express.Router();

// Rota para fazer upload da foto de perfil
router.post('/upload', uploadProfilePicture);

// Rota para obter a foto de perfil de um usuário específico
router.get('/:userId', getProfilePicture);

export default router;
