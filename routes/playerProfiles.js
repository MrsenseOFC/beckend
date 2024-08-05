// src/routes/playerProfilesRoutes.js

import express from 'express';
import { getPlayerProfile } from '../controllers/playerProfilesController.js'; // Certifique-se de que o caminho está correto

const router = express.Router();

// Rota para obter o perfil de um jogador específico pelo ID do usuário
router.get('/:userId', getPlayerProfile);

export default router;
