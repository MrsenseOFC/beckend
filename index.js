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

const app = express();

// Configuração do CORS para permitir a origem específica
const corsOptions = {
  origin: 'https://oficial-dvgv.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware para analisar o corpo das solicitações como JSON
app.use(express.json());

// Middleware para analisar cookies
app.use(cookieParser());

// Rotas para diferentes endpoints
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes); // Rota de autenticação
app.use('/api/clubs', clubProfilesRoutes);
app.use('/api/userVideos', userVideosRoutes);
app.use('/api/userPhotos', userPhotosRoutes);
app.use('/api/universities', universityProfilesRoutes);
app.use('/api/scouts', scoutProfilesRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/playerProfiles', playerProfilesRoutes); // Adicionando a rota de perfis de jogadores

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
