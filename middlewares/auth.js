import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Tentativa de acesso com token inválido:', err.message);
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }

    // Verifica se os dados do usuário estão presentes e válidos
    if (!user || !user.id) {
      return res.status(403).json({ error: 'Dados de usuário inválidos no token' });
    }

    req.user = user; // Adiciona os dados do usuário ao objeto req
    next(); // Continua para o próximo middleware ou rota
  });
};
