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
import playerProfilesRoutes from './routes/playerProfiles.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// Para usar __dirname com ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Gerar JWT_SECRET automaticamente se não estiver definido no arquivo .env
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');
  console.log(`Generated JWT_SECRET: ${process.env.JWT_SECRET}`);
}

// Configuração do CORS para permitir a origem específica
const corsOptions = {
  origin: 'https://oficial-dvgv.onrender.com', // Permitir esta origem
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware para segurança adicional
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://example.com"],
      connectSrc: ["'self'", "https://oficial-dvgv.onrender.com"], // Permitir conexões da origem
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Middleware para configurar timeout
app.use((req, res, next) => {
  req.setTimeout(0);
  res.setTimeout(0);
  next();
});

// Middleware para analisar o corpo das solicitações como JSON
app.use(express.json());

// Middleware para analisar cookies
app.use(cookieParser());

// Servindo arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware para adicionar headers de CORS nas respostas de arquivos estáticos
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://oficial-dvgv.onrender.com'); // Permitir esta origem
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// Rotas para diferentes endpoints
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubProfilesRoutes);
app.use('/api/userPhotos', userPhotosRoutes);
app.use('/api/userVideos', userVideosRoutes);
app.use('/api/universities', universityProfilesRoutes);
app.use('/api/scouts', scoutProfilesRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/playerProfiles', playerProfilesRoutes);

// Middleware para tratamento de erros
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
