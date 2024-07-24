import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { db } from '../connect.js'; // Ajuste conforme necessário
import { v4 as uuidv4 } from 'uuid'; // Importa o UUID para criar identificadores únicos

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadProfilePicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Cria um nome único para o arquivo
  const uniqueFilename = `${uuidv4()}-${Date.now()}-${req.file.originalname}`;
  const filePath = `/uploads/photos/${uniqueFilename}`;

  try {
    // Salva o arquivo no diretório com o novo nome
    fs.renameSync(req.file.path, path.join(__dirname, '..', filePath));

    // Atualiza ou insere o caminho do arquivo no banco de dados
    await db.query(
      'INSERT INTO user_photos (userId, filePath) VALUES (?, ?) ON DUPLICATE KEY UPDATE filePath = VALUES(filePath)',
      [req.body.userId, filePath]
    );
    res.json({ filePath });
  } catch (error) {
    console.error('Error saving file path to database:', error);
    res.status(500).send('Server error');
  }
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
