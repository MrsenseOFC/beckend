import express from 'express';
import { getClubProfile } from '../controllers/clubProfilesController.js'; // Verifique o caminho

const router = express.Router();

// Rota para obter o perfil do clube
router.get('/:id', getClubProfile);

export default router;
