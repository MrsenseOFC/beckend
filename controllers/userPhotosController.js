import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import pool from '../connect.js'; // Certifique-se de que o caminho está correto

// Caminho absoluto para o diretório de uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads/photos');

// Verifica se o diretório de uploads existe, cria se não existir
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Faz o upload da imagem de perfil e atualiza o banco de dados.
 * @param {Object} file - O arquivo enviado pelo multer.
 * @param {number} userId - O ID do usuário.
 * @throws {Error} Se o arquivo não for fornecido ou o ID do usuário for inválido.
 */
export const uploadProfilePicture = async (file, userId) => {
  if (!file) throw new Error('No file uploaded.');
  if (!userId) throw new Error('Invalid User ID.');

  // Verifique se o ID do usuário é válido
  const userExists = await checkUserExists(userId);
  if (!userExists) throw new Error('User ID does not exist.');

  // Define o caminho do arquivo e move o arquivo para o diretório de uploads
  const fileName = `${uuidv4()}-${file.originalname}`;
  const filePath = path.join(uploadDir, fileName);
  fs.renameSync(file.path, filePath); // Mover o arquivo para o diretório de uploads

  // Atualiza o caminho do arquivo no banco de dados
  try {
    const query = `
      INSERT INTO user_photos (user_id, filePath) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE filePath = VALUES(filePath)
    `;
    await pool.query(query, [userId, `/uploads/photos/${fileName}`]);
  } catch (error) {
    console.error('Database error during profile picture upload:', error.message);
    throw new Error('Database error occurred.');
  }
};

// Função para verificar se o usuário existe
const checkUserExists = async (userId) => {
  try {
    const query = 'SELECT id FROM users WHERE id = ?';
    const [rows] = await pool.query(query, [userId]);
    return rows.length > 0;
  } catch (error) {
    console.error('Database error during user existence check:', error.message);
    throw new Error('Database error occurred.');
  }
};

/**
 * Recupera o caminho da imagem de perfil do banco de dados.
 * @param {number} userId - O ID do usuário.
 * @returns {string} - O caminho do arquivo da imagem de perfil.
 * @throws {Error} Se o ID do usuário for inválido ou se nenhuma imagem for encontrada.
 */
export const getProfilePicture = async (userId) => {
  if (!userId) throw new Error('Invalid User ID.');

  try {
    const query = 'SELECT filePath FROM user_photos WHERE user_id = ?';
    const [rows] = await pool.query(query, [userId]);

    if (rows.length === 0) throw new Error('No profile picture found for this user.');

    return rows[0].filePath;
  } catch (error) {
    console.error('Database error during fetching profile picture:', error.message);
    throw new Error('Database error occurred.');
  }
};
