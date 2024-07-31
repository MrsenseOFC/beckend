import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import promisePool from '../connect.js'; // Ajuste o caminho conforme necessário

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Registro de Usuário
export const registerUser = async (req, res) => {
  const { username, email, password, profile_type, competitive_category, competitive_level } = req.body;

  // Verificação se todos os campos obrigatórios estão presentes
  if (!username || !email || !password || !profile_type || !competitive_category || !competitive_level) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos obrigatórios' });
  }

  try {
    // Verificar se o email já está em uso
    const checkEmailQuery = 'SELECT * FROM Users WHERE email = ?';
    const [results] = await promisePool.query(checkEmailQuery, [email]);

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    // Geração de hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserção do novo usuário no banco de dados
    const query = `
      INSERT INTO Users (username, email, password, profile_type, competitive_category, competitive_level)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [userResult] = await promisePool.query(query, [username, email, hashedPassword, profile_type, competitive_category, competitive_level]);

    const userId = userResult.insertId; // Obtém o ID do novo usuário inserido

    // Inserção do perfil do jogador na tabela PlayerProfiles
    if (profile_type === 'player') {
      const playerProfileQuery = `
        INSERT INTO PlayerProfiles (user_id, username, email, profile_image)
        VALUES (?, ?, ?, ?)
      `;
      await promisePool.query(playerProfileQuery, [userId, username, email, null]);
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

  if (!email || !password) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos obrigatórios' });
  }

  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [result] = await promisePool.query(query, [email]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Consultar imagem de perfil, se existir
    let profileImage = null;
    if (user.profile_type === 'player') {
      const profileImageQuery = 'SELECT profile_image FROM PlayerProfiles WHERE user_id = ?';
      const [imageResult] = await promisePool.query(profileImageQuery, [user.id]);
      profileImage = imageResult.length > 0 ? imageResult[0].profile_image : null;
    }

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
  res.status(200).json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
};
