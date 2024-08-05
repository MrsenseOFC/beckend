import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import promisePool from '../connect.js'; // Ajuste o caminho conforme necessário

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Registro de Usuário
export const registerUser = async (req, res) => {
  const { username, email, password, profile_type, competitive_category, competitive_level } = req.body;

  // Verifica se todos os campos obrigatórios estão preenchidos
  if (!username || !email || !password || !profile_type || !competitive_category || !competitive_level) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos obrigatórios' });
  }

  try {
    // Verifica se o email já está em uso
    const checkEmailQuery = 'SELECT * FROM Users WHERE email = ?';
    const [results] = await promisePool.query(checkEmailQuery, [email]);

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    // Criptografa a senha antes de salvar no banco de dados
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insere o novo usuário na tabela Users
    const query = `
      INSERT INTO Users (username, email, password, profile_type, competitive_category, competitive_level)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [userResult] = await promisePool.query(query, [username, email, hashedPassword, profile_type, competitive_category, competitive_level]);

    const userId = userResult.insertId;

    // Se o tipo de perfil for 'player', cria um perfil de jogador
    if (profile_type === 'player') {
      const playerProfileQuery = `
        INSERT INTO PlayerProfiles (user_id, best_leg, competitive_level, age_category, birth_date, age, main_position, profile_image)
        VALUES (?, 'right', ?, 'sub20', CURDATE(), 20, 'forward', NULL)
      `;
      await promisePool.query(playerProfileQuery, [userId, competitive_level]);
    }

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

// Login de Usuário
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Verifica se todos os campos obrigatórios estão preenchidos
  if (!email || !password) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos obrigatórios' });
  }

  try {
    // Consulta para encontrar o usuário pelo email
    const query = 'SELECT * FROM Users WHERE email = ?';
    const [result] = await promisePool.query(query, [email]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    // Verifica se a senha está correta
    if (!match) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    let profileImage = null;
    if (user.profile_type === 'player') {
      // Busca a imagem de perfil do jogador se o tipo de perfil for 'player'
      const profileImageQuery = 'SELECT profile_image FROM PlayerProfiles WHERE user_id = ?';
      const [imageResult] = await promisePool.query(profileImageQuery, [user.id]);
      profileImage = imageResult.length > 0 ? imageResult[0].profile_image : null;
    }

    // Gera um token JWT para o usuário
    const token = jwt.sign({ id: user.id, username: user.username, profile_type: user.profile_type }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      success: true,
      token: token,
      user: {
        id: user.id,
        username: user.username,
        profile_type: user.profile_type,
        profileImage: profileImage,
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

// Logout de Usuário
export const logoutUser = (req, res) => {
  // Apenas uma resposta de logout, já que o JWT é armazenado no lado do cliente
  res.status(200).json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
};
