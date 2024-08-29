import promisePool from '../connect.js';

// Função para atualizar o perfil do jogador
export const updatePlayerProfile = async (req, res) => {
  const playerId = req.params.id; // ID do jogador vindo da URL
  const {
    modality, competitiveCategory, ageCategory, competitiveLevel,
    primaryPosition, secondaryPosition, tertiaryPosition, bestLeg,
    birthDate, age, weight, height, birthCity, primaryNationality,
    secondaryNationality, passports, payment, transferValue, league,
    hasManager, toefl, act, sat, graduationDate, gradePointAverage,
    profileImageSrc, bannerImageSrc
  } = req.body;

  try {
    const [result] = await promisePool.query(
      'UPDATE players SET modality = ?, competitiveCategory = ?, ageCategory = ?, competitiveLevel = ?, primaryPosition = ?, secondaryPosition = ?, tertiaryPosition = ?, bestLeg = ?, birthDate = ?, age = ?, weight = ?, height = ?, birthCity = ?, primaryNationality = ?, secondaryNationality = ?, passports = ?, payment = ?, transferValue = ?, league = ?, hasManager = ?, toefl = ?, act = ?, sat = ?, graduationDate = ?, gradePointAverage = ?, profileImageSrc = ?, bannerImageSrc = ? WHERE id = ?',
      [
        modality, competitiveCategory, ageCategory, competitiveLevel,
        primaryPosition, secondaryPosition, tertiaryPosition, bestLeg,
        birthDate, age, weight, height, birthCity, primaryNationality,
        secondaryNationality, passports, payment, transferValue, league,
        hasManager, toefl, act, sat, graduationDate, gradePointAverage,
        profileImageSrc, bannerImageSrc,
        playerId
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Jogador não encontrado para atualização' });
    }

    res.status(200).json({ message: 'Perfil de jogador atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar perfil de jogador:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil de jogador', error: error.message });
  }
};

// Função para deletar o perfil do jogador
export const deletePlayerProfile = async (req, res) => {
  const playerId = req.params.id; // ID do jogador vindo da URL

  try {
    const [result] = await promisePool.query(
      'DELETE FROM players WHERE id = ?',
      [playerId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Jogador não encontrado para exclusão' });
    }

    res.status(200).json({ message: 'Perfil de jogador excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir perfil de jogador:', error);
    res.status(500).json({ message: 'Erro ao excluir perfil de jogador', error: error.message });
  }
};
