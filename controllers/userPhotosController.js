import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Configuração para obter o diretório atual do arquivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do multer para armazenamento de arquivos
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads/profile_pictures'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Função para processar o upload da foto de perfil
export const uploadProfilePicture = (req, res) => {
  upload.single('profilePicture')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // `req.file` contém informações sobre o arquivo enviado
    const filePath = `/uploads/profile_pictures/${req.file.filename}`;
    res.status(200).json({ message: 'Upload bem-sucedido!', filePath });
  });
};

// Função para obter a foto de perfil
export const getProfilePicture = (req, res) => {
  const { userId } = req.params;

  // Aqui você deve definir como recuperar o caminho do arquivo baseado no ID do usuário.
  // Por simplicidade, assumiremos que o arquivo é nomeado como `{userId}.jpg`.
  const filePath = path.join(__dirname, `../uploads/profile_pictures/${userId}.jpg`);

  // Verifica se o arquivo existe e, se existir, envia o arquivo
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: 'Imagem não encontrada.' });
    }

    res.sendFile(filePath);
  });
};
