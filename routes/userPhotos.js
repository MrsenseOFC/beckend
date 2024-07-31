import express from 'express';
import { uploadProfilePicture, getProfilePicture } from '../controllers/userPhotosController.js';
import { authenticateToken } from '../middlewares/auth.js';
import multer from 'multer';

const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

router.post('/:userId/upload', authenticateToken, upload.single('image_file'), uploadProfilePicture);
router.get('/:userId', authenticateToken, getProfilePicture);

export default router;
