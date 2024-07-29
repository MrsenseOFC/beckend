import promisePool from '../connect.js';
import fs from 'fs';
import path from 'path';

export const uploadProfilePicture = async (req, res) => {
  const userId = req.params.userId;
  const imageFile = req.file.filename;

  try {
    const query = 'UPDATE ProfilePictures SET profile_image = ? WHERE user_id = ?';
    const [result] = await promisePool.query(query, [imageFile, userId]);

    if (result.affectedRows === 0) {
      // Se não houver uma linha afetada, significa que o usuário não tem uma entrada, então criamos uma
      const insertQuery = 'INSERT INTO ProfilePictures (user_id, profile_image) VALUES (?, ?)';
      await promisePool.query(insertQuery, [userId, imageFile]);
    }

    res.status(200).json({ image_file: imageFile });
  } catch (error) {
    console.error('Erro ao atualizar a imagem de perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar a imagem de perfil' });
  }
};

export const getProfilePicture = async (req, res) => {
  const userId = req.params.userId;

  try {
    const query = 'SELECT profile_image FROM ProfilePictures WHERE user_id = ?';
    const [result] = await promisePool.query(query, [userId]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Imagem de perfil não encontrada' });
    }

    res.status(200).json({ profile_image: result[0].profile_image });
  } catch (error) {
    console.error('Erro ao obter a imagem de perfil:', error);
    res.status(500).json({ error: 'Erro ao obter a imagem de perfil' });
  }
};
