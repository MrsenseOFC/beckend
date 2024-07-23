import express from 'express';
import multer from 'multer';
import { uploadProfilePicture, getProfilePicture } from '../controllers/userPhotosController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/photos');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('profilePicture'), uploadProfilePicture);
router.get('/:userId', getProfilePicture);

export default router;
