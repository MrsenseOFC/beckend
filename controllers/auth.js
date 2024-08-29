import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import promisePool from '../connect.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não está definido nas variáveis de ambiente.');
}

// Função para gerar um refresh token
const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Função para buscar a imagem de perfil diretamente na tabela Users
const fetchProfileImage = async (userId) => {
  const profileImageQuery = 'SELECT profile_image FROM Users WHERE id = ?';
  const [imageResult] = await promisePool.query(profileImageQuery, [userId]);
  return imageResult.length > 0 ? imageResult[0].profile_image : null;
};

// Endpoint de registro de usuário
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username = '', email, password, profile_type, competitive_category = null, competitive_level = null } = req.body;

  try {
    const checkEmailQuery = 'SELECT * FROM Users WHERE email = ?';
    const [results] = await promisePool.query(checkEmailQuery, [email]);

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO Users (username, email, password, profile_type, competitive_category, competitive_level)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [userResult] = await promisePool.query(query, [username, email, hashedPassword, profile_type, competitive_category, competitive_level]);

    const userId = userResult.insertId;

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

// Endpoint de login de usuário
export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const query = 'SELECT * FROM Users WHERE email = ?';
    const [result] = await promisePool.query(query, [email]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Buscando a imagem de perfil diretamente na tabela Users
    const profileImage = user.profile_image;

    const token = jwt.sign(
      { id: user.id, username: user.username, profile_type: user.profile_type },
      JWT_SECRET,
      { expiresIn: '15m' } // Token de acesso expira em 15 minutos
    );

    const refreshToken = generateRefreshToken();

    // Armazena o refresh token no banco de dados
    const storeTokenQuery = 'INSERT INTO RefreshTokens (user_id, token) VALUES (?, ?)';
    await promisePool.query(storeTokenQuery, [user.id, refreshToken]);

    // Envia o refresh token como um cookie HTTP-Only
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Somente HTTPS em produção
      sameSite: 'strict',
    });

    // Resposta contendo o token e os dados do usuário, incluindo a imagem de perfil
    res.status(200).json({
      success: true,
      token: token,
      user: {
        id: user.id,
        username: user.username,
        profile_type: user.profile_type,
        profileImage: profileImage,  // Aqui estamos enviando a imagem do perfil
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

// Endpoint para renovar o token de acesso
export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token não fornecido' });
  }

  try {
    const query = 'SELECT * FROM RefreshTokens WHERE token = ?';
    const [result] = await promisePool.query(query, [refreshToken]);

    if (result.length === 0) {
      return res.status(403).json({ message: 'Refresh token inválido' });
    }

    const userId = result[0].user_id;

    // Gera um novo token de acesso
    const newAccessToken = jwt.sign(
      { id: userId },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    res.status(500).json({ message: 'Erro ao renovar token' });
  }
};

// Endpoint de logout
export const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const deleteTokenQuery = 'DELETE FROM RefreshTokens WHERE token = ?';
    await promisePool.query(deleteTokenQuery, [refreshToken]);
  }

  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logout realizado com sucesso' });
};
