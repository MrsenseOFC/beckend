// playerProfilesRoutes.js

const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// Rota para buscar o perfil do jogador pelo nome de usuário
router.get('/profile', playerController.getPlayerProfile);

module.exports = router;
