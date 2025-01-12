import promisePool from '../connect.js';

export const getUser = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const userId = req.user.id;
  const query = 'SELECT username FROM Users WHERE id = ?';

  try {
    const [rows] = await promisePool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.status(200).json({ username: rows[0].username });
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};
