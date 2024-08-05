// src/controllers/playerProfilesController.js

import promisePool from '../connect.js'; // Verifique o caminho do seu módulo de conexão com o banco de dados

export const getPlayerProfile = async (req, res) => {
  const userId = req.params.userId;

  try {
    const query = 'SELECT * FROM PlayerProfiles WHERE user_id = ?';
    const [result] = await promisePool.query(query, [userId]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Perfil do jogador não encontrado' });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Erro ao obter o perfil do jogador:', error);
    res.status(500).json({ error: 'Erro ao obter o perfil do jogador' });
  }
};
