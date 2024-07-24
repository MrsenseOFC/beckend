const express = require('express');
const userRoutes = require('./routes/users.js');
const authRoutes = require('./routes/auth.js');
const clubProfilesRoutes = require('./routes/clubProfiles.js');
const userPhotosRoutes = require('./routes/userPhotos.js');
const userVideosRoutes = require('./routes/userVideos.js');
const universityProfilesRoutes = require('./routes/universityProfiles.js');
const scoutProfilesRoutes = require('./routes/scoutProfiles.js');
const opportunitiesRoutes = require('./routes/opportunities.js');
const eventsRoutes = require('./routes/events.js');
const playerProfilesRoutes = require('./routes/playerProfiles.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();

// Configuração de CORS
const corsOptions = {
  origin: 'https://oficial-dvgv.onrender.com',
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
