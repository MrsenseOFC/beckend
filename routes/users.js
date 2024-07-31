import express from 'express';
import { getUser } from '../controllers/users.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Use the authenticateToken middleware to protect the getUser route
router.get('/', authenticateToken, getUser);

export default router;
