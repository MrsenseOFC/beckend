import path from 'path';
import promisePool from '../connect.js';

// Função para upload de imagem de perfil
export const uploadProfilePicture = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ error: 'Usuário não está logado ou não possui um ID válido' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
  }

  const userId = req.user.id;
  const imagePath = `/uploads/profile_pictures/${req.file.filename}`;

  try {
    const query = 'UPDATE Users SET profile_image = ? WHERE id = ?';
    await promisePool.query(query, [imagePath, userId]);

    res.status(200).json({ success: true, image_file: imagePath });
  } catch (error) {
    console.error('Erro ao salvar imagem de perfil:', error);
    res.status(500).json({ error: 'Erro ao salvar imagem de perfil' });
  }
};

// Função para obter a imagem de perfil
export const getProfilePicture = async (req, res) => {
  const userId = req.params.userId;

  try {
    const query = 'SELECT profile_image FROM Users WHERE id = ?';
    const [result] = await promisePool.query(query, [userId]);

    if (result.length === 0 || !result[0].profile_image) {
      return res.status(404).json({ error: 'Imagem de perfil não encontrada' });
    }

    const imagePath = path.join(__dirname, '..', result[0].profile_image);

    res.sendFile(imagePath);
  } catch (error) {
    console.error('Erro ao obter imagem de perfil:', error);
    res.status(500).json({ error: 'Erro ao obter imagem de perfil' });
  }
};
