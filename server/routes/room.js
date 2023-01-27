const express = require('express');

const router = express.Router();

// controllers
const { joinRoom } = require('../controllers/room.js');

router.post('/join', joinRoom);

module.exports = router;
