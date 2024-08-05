// src/routes/playerProfiles.js

import express from 'express';
import { getPlayerProfile } from '../controllers/playerProfilesController.js'; // Verifique o caminho e o nome da função exportada

const router = express.Router();

// Endpoint para obter o perfil de um jogador específico pelo ID do usuário
router.get('/:userId', getPlayerProfile);

export default router;
