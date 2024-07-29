import express from 'express';
import { getClubProfile } from '../controllers/clubProfilesController.js';

const router = express.Router();

router.get('/:id', getClubProfile);

export default router;
