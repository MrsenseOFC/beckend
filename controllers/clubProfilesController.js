// controllers/clubProfilesController.js
import promisePool from '../connect.js';

export const getClubProfile = async (req, res) => {
  const clubId = req.params.id;

  try {
    const query = 'SELECT * FROM ClubProfiles WHERE id = ?';
    const [result] = await promisePool.query(query, [clubId]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Perfil do clube não encontrado' });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Erro ao obter o perfil do clube:', error);
    res.status(500).json({ error: 'Erro ao obter o perfil do clube' });
  }
};
