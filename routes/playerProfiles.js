// routes/playerProfiles.js
import express from 'express';
import { getPlayerProfile } from '../controllers/playerProfilesController.js';

const router = express.Router();

// Rota para obter o perfil do jogador
router.get('/api/playerProfiles/:id', getPlayerProfile);

export default router;
