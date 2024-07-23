import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h', // Tempo de expiração do token
    }
  );

  return token;
};

// Exemplo de uso
const user = {
  id: 1,
  username: 'exampleUser',
  email: 'user@example.com'
};

const token = generateToken(user);
console.log('Generated Token:', token);