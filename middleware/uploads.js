const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define a pasta onde as imagens serão salvas
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Define o nome do arquivo (timestamp + nome original)
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
