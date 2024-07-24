import express from 'express';
import multer from 'multer';
import { uploadProfilePicture, getProfilePicture } from '../controllers/userPhotosController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/photos');
  },
  filename: (req, file, cb) => {
    // Utiliza UUID para garantir um nome único para o arquivo
    const uniqueFilename = `${uuidv4()}-${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('profilePicture'), uploadProfilePicture);
router.get('/:userId', getProfilePicture);

export default router;
