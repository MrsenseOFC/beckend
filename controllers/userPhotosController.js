import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { db } from '../connect.js'; // Ajuste conforme necessário

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadProfilePicture = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = `/uploads/photos/${req.file.filename}`;

  // Aqui você pode armazenar o caminho no banco de dados
  res.json({ filePath });
};

export const getProfilePicture = async (req, res) => {
  const { userId } = req.params;

  try {
    // Consulta o caminho do arquivo no banco de dados
    const [result] = await db.query('SELECT filePath FROM user_photos WHERE userId = ?', [userId]);
    const filePath = result?.filePath;

    if (!filePath) {
      return res.status(404).send('File not found');
    }

    const absolutePath = path.join(__dirname, '..', filePath);

    if (fs.existsSync(absolutePath)) {
      res.sendFile(absolutePath);
    } else {
      res.status(404).send('File not found');
    }
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).send('Server error');
  }
};
