import express from 'express';
import { getClubProfile } from '../controllers/clubProfilesController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/:id', getClubProfile, authenticateToken);

export default router;
