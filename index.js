import express from 'express';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import clubProfilesRoutes from './routes/clubProfiles.js';
import userPhotosRoutes from './routes/userPhotos.js';
import userVideosRoutes from './routes/userVideos.js';
import universityProfilesRoutes from './routes/universityProfiles.js';
import scoutProfilesRoutes from './routes/scoutProfiles.js';
import opportunitiesRoutes from './routes/opportunities.js';
import eventsRoutes from './routes/events.js';
import playersRoutes from './routes/players.js'; // Adicionando a rota de jogadores
import profileRoutes from './routes/profileRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET não está definido nas variáveis de ambiente.');
  } else {
    process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');
    console.log(`Generated JWT_SECRET: ${process.env.JWT_SECRET}`);
  }
}

const app = express();

app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições deste IP, por favor tente novamente mais tarde.',
});
app.use(limiter);

const corsOptions = {
  origin: 'https://talent2show-com-46dh.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://example.com"],
      connectSrc: ["'self'", "https://talent2show-com-46dh.onrender.com"],
      fontSrc: ["'self'", "https://talent2show-com-46dh.onrender.com"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(morgan('combined'));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubProfilesRoutes);
app.use('/api/userPhotos', userPhotosRoutes);
app.use('/api/userVideos', userVideosRoutes);
app.use('/api/universities', universityProfilesRoutes);
app.use('/api/scouts', scoutProfilesRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/players', playersRoutes); // Usando a nova rota para jogadores
app.use('/api/profile', profileRoutes);

app.use((err, req, res, next) => {
  console.error('Erro:', err.message);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

const PORT = process.env.PORT || 7320;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
