
import express from 'express';
import { getClubProfile, getPlayerProfile } from './controllers/clubProfilesController.js';

const router = express.Router();

router.get('/api/clubProfiles/:id', getClubProfile);
router.get('/api/playerProfiles/:id', getPlayerProfile);

export default router;
