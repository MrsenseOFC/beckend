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
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

const app = express();

// Configuração de CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'userid'],
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware de segurança
app.use(helmet());

// Middleware de logging
app.use(morgan('combined'));

// Middleware para limitar taxas de requisição
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar a 100 requisições por IP por janela de tempo
});
app.use(limiter);

// Middleware para analisar o corpo das solicitações como JSON
app.use(express.json());

// Middleware para analisar cookies
app.use(cookieParser());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubProfilesRoutes);
app.use('/api/userVideos', userVideosRoutes);
app.use('/api/userPhotos', userPhotosRoutes);
app.use('/api/universities', universityProfilesRoutes);
app.use('/api/scouts', scoutProfilesRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/playerProfiles', playerProfilesRoutes);

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
