const express = require('express');
const router = express.Router();

// controllers
const indexController = require('../controllers/index.js');

router.get('/', indexController.welcomeUser);

module.exports = router;
