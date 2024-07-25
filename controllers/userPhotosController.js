import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; // Importa o módulo fs
import pool from '../connect.js'; // Atualize para importar a exportação padrão
import { v4 as uuidv4 } from 'uuid'; // Importa o UUID para criar identificadores únicos

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadProfilePicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Cria um nome único para o arquivo
  const uniqueFilename = `${uuidv4()}-${Date.now()}-${req.file.originalname}`;
  const filePath = path.join(__dirname, '..', 'uploads', 'photos', uniqueFilename);

  try {
    // Salva o arquivo no diretório com o novo nome
    await fs.promises.rename(req.file.path, filePath);

    // Atualiza ou insere o caminho do arquivo no banco de dados
    const query = `
      INSERT INTO user_photos (user_id, filePath) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE filePath = VALUES(filePath)
    `;
    await pool.query(query, [req.body.user_id, filePath]);

    res.json({ filePath: `/uploads/photos/${uniqueFilename}` });
  } catch (error) {
    console.error('Error saving file path to database:', error);
    res.status(500).send('Server error');
  }
};

export const getProfilePicture = async (req, res) => {
  const { userId } = req.params;

  try {
    // Consulta o caminho do arquivo no banco de dados
    const query = 'SELECT filePath FROM user_photos WHERE user_id = ?';
    const [result] = await pool.query(query, [userId]);
    const filePath = result[0]?.filePath;

    if (!filePath) {
      return res.status(404).send('File not found');
    }

    const absolutePath = path.join(__dirname, '..', filePath);

    if (await fs.promises.stat(absolutePath).catch(() => false)) {
      res.sendFile(absolutePath);
    } else {
      res.status(404).send('File not found');
    }
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).send('Server error');
  }
};
