import { db } from '../connect.js';

export const getUser = (req, res) => {
  const userId = req.user.id;

  const query = 'SELECT username FROM users WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.status(200).json({ username: result[0].username });
  });
};
