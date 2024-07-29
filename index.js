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

// To use __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Generate JWT_SECRET automatically if not defined in the .env file
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be defined in production environment');
  }
  process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');
  console.log(`Generated JWT_SECRET: ${process.env.JWT_SECRET}`);
}

// CORS configuration to allow specific origins
const allowedOrigins = [
  'https://oficial-dvgv.onrender.com',
  'https://talent2show.onrender.com',
  'http://localhost:5173'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Additional security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Ensure no 'unsafe-eval'
      styleSrc: ["'self'", "'unsafe-inline'"], // Consider removing 'unsafe-inline'
      imgSrc: ["'self'", "data:", "https://example.com"],
      connectSrc: ["'self'", "https://oficial-dvgv.onrender.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
      reportUri: '/csp-violation-report-endpoint', // Add your reporting endpoint
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Middleware for security and request parsing
app.use(express.json());
app.use(cookieParser());

// Serving static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes for different endpoints
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

// CSP violation report endpoint
app.post('/csp-violation-report-endpoint', express.json(), (req, res) => {
  console.error('CSP Violation:', req.body);
  res.status(204).end();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

const PORT = process.env.PORT || 7320;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
