import express from 'express';
import { getUser } from '../controllers/users.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getUser);

export default router;
