import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Importando uuidv4 para gerar nomes únicos
import { uploadProfilePicture, getProfilePicture } from '../controllers/userPhotosController.js';

const router = express.Router();

// Configuração do Multer para armazenamento de arquivos
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

// Filtro para aceitar apenas arquivos de imagem
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limita o tamanho do arquivo a 5MB
});

// Rota para upload de fotos de perfil
router.post('/upload', upload.single('profilePicture'), (req, res) => {
  // Chama o controlador para processar o upload
  uploadProfilePicture(req, res);
});

// Rota para obter foto de perfil com base no userId
router.get('/:userId', getProfilePicture);

export default router;
