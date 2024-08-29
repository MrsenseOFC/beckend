import express from 'express';
import { getPlayerProfile, updatePlayerProfile } from '../controllers/playerProfilesController.js';

const router = express.Router();

router.get('/:id', getPlayerProfile);
router.put('/:id', updatePlayerProfile);

export default router;
