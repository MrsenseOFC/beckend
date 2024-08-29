import express from 'express';
import { updatePlayerProfile, deletePlayerProfile } from '../controllers/playersController.js';
import { authenticateToken } from '../middlewares/auth.js'; // Middleware para autenticação

const router = express.Router();

router.put('/:id', authenticateToken, updatePlayerProfile); // Rota para atualização
router.delete('/:id', authenticateToken, deletePlayerProfile); // Rota para deleção

export default router;
