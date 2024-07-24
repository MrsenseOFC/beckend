import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../connect.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Registro de Usuário
export const registerUser = async (req, res) => {
  const { username, email, password, profile_type, competitive_category, plan } = req.body;

  // Verificação se todos os campos obrigatórios estão presentes
  if (!username || !email || !password || !profile_type || !competitive_category || !plan) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos obrigatórios' });
  }

  try {
    // Geração de hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserção do novo usuário no banco de dados
    const query = 'INSERT INTO users (username, email, password, profile_type, competitive_category, plan) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [username, email, hashedPassword, profile_type, competitive_category, plan], (err, result) => {
      if (err) {
        console.error('Erro ao registrar usuário:', err.message);
        return res.status(500).json({ error: 'Erro ao registrar usuário' });
      }

      res.status(201).json({ message: 'Usuário registrado com sucesso' });
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
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
    const [rows] = await db.promise().query(query, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, profile_type: user.profile_type }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      success: true,
      token: token,
      user: {
        id: user.id,
        username: user.username,
        profile_type: user.profile_type,
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
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
