import promisePool from '../connect.js'; // Ajuste o caminho conforme necessário

// Função para buscar o perfil do jogador pelo nome de usuário
export const getPlayerProfile = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Nome de usuário é obrigatório' });
  }

  try {
    const query = 'SELECT * FROM player_profiles WHERE username = ?';
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
