import promisePool from '../connect.js';
import fs from 'fs';
import path from 'path';
import { validationResult, param } from 'express-validator';

// Middleware de validação para userId
export const validateUserId = [
  param('userId')
    .isInt().withMessage('O ID do usuário deve ser um número inteiro')
];

// Upload de Imagem de Perfil
export const uploadProfilePicture = async (req, res) => {
  // Verificar se há erros de validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.params.userId;
  const imageFile = req.file.filename;
  const imagePath = path.join(__dirname, '../uploads', imageFile);

  try {
    // Verificar se o arquivo realmente existe
    if (!fs.existsSync(imagePath)) {
      return res.status(400).json({ error: 'Arquivo de imagem não encontrado' });
    }

    // Verificar se já existe uma imagem para este usuário
    const selectQuery = 'SELECT profile_image FROM ProfilePictures WHERE user_id = ?';
    const [selectResult] = await promisePool.query(selectQuery, [userId]);

    if (selectResult.length > 0) {
      // Se já existe, apagar a imagem antiga do sistema de arquivos
      const oldImagePath = path.join(__dirname, '../uploads', selectResult[0].profile_image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      // Atualizar o registro no banco de dados
      const updateQuery = 'UPDATE ProfilePictures SET profile_image = ? WHERE user_id = ?';
      await promisePool.query(updateQuery, [imageFile, userId]);
    } else {
      // Inserir um novo registro no banco de dados
      const insertQuery = 'INSERT INTO ProfilePictures (user_id, profile_image) VALUES (?, ?)';
      await promisePool.query(insertQuery, [userId, imageFile]);
    }

    res.status(200).json({ image_file: imageFile });
  } catch (error) {
    console.error('Erro ao atualizar a imagem de perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar a imagem de perfil' });
  }
};

// Obter Imagem de Perfil
export const getProfilePicture = async (req, res) => {
  // Verificar se há erros de validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.params.userId;

  try {
    const query = 'SELECT profile_image FROM ProfilePictures WHERE user_id = ?';
    const [result] = await promisePool.query(query, [userId]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Imagem de perfil não encontrada' });
    }

    const imageFile = result[0].profile_image;
    const imagePath = path.join(__dirname, '../uploads', imageFile);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Arquivo de imagem não encontrado no servidor' });
    }

    res.status(200).json({ profile_image: imageFile });
  } catch (error) {
    console.error('Erro ao obter a imagem de perfil:', error);
    res.status(500).json({ error: 'Erro ao obter a imagem de perfil' });
  }
};
