const express = require('express');
const router = express.Router();
const multer = require('multer');
const profilePicturesController = require('../controllers/profilePictures');

// Configuração do Multer para lidar com uploads de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define a pasta onde as imagens serão salvas
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Define o nome do arquivo (timestamp + nome original)
  }
});
const upload = multer({ storage: storage });

// Rota para upload da imagem de perfil
router.post('/upload', upload.single('profilePic'), profilePicturesController.uploadProfilePicture);

module.exports = router;
