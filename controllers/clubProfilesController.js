import promisePool from '../connect.js';

export const getClubProfile = async (req, res) => {
  const clubId = req.params.id;

  console.log('Received request to get club profile for ID:', clubId);

  try {
    const query = 'SELECT * FROM ClubProfiles WHERE id = ?';
    console.log('Executing query:', query, 'with clubId:', clubId);

    const [result] = await promisePool.query(query, [clubId]);
    console.log('Query result:', result);

    if (result.length === 0) {
      console.log('No club profile found for ID:', clubId);
      return res.status(404).json({ error: 'Perfil do clube não encontrado' });
    }

    console.log('Returning club profile:', result[0]);
    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Erro ao obter o perfil do clube:', error);
    res.status(500).json({ error: 'Erro ao obter o perfil do clube' });
  }
};
