import promisePool from '../connect.js';
import { validationResult, query } from 'express-validator';

// Middleware de validação para a rota
export const validateUsername = [
  query('username')
    .notEmpty().withMessage('Nome de usuário é obrigatório')
    .isAlphanumeric().withMessage('Nome de usuário deve conter apenas caracteres alfanuméricos')
];

// Função para buscar o perfil do jogador pelo nome de usuário
export const getPlayerProfile = async (req, res) => {
  // Verificar se há erros de validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username } = req.query;

  try {
    const query = 'SELECT * FROM PlayerProfiles WHERE username = ?';
    const [rows] = await promisePool.query(query, [username]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Perfil de jogador não encontrado' });
    }

    const playerProfile = rows[0]; // Assume que só existe um perfil de jogador com esse nome de usuário

    res.status(200).json(playerProfile);
  } catch (error) {
    console.error('Erro ao buscar perfil do jogador:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
