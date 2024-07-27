import express from 'express';
import { uploadProfilePicture, getProfilePicture } from '../controllers/userPhotosController.js';

const router = express.Router();

// Route to upload profile picture
router.post('/upload', uploadProfilePicture);

// Route to get profile picture of a specific user
router.get('/:userId', getProfilePicture);

export default router;
