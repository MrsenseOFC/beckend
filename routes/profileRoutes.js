// src/routes/playerProfiles.js

import express from 'express';
const router = express.Router();

// Controladores para as rotas (substitua pelos seus controladores reais)
import { getPlayerProfile } from '../controllers/playerProfilesController';

// Rota para obter o perfil do jogador
router.get('/:id', getPlayerProfile);

export default router;
