const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

const app = express();
dotenv.config();

// environment variables
const PORT = process.env.PORT_NUMBER || 9999;
const CLIENT_URL = process.env.CLIENT_BASE_URL;

// routes
const indexRoutes = require('./routes/index.js');

app.use(
  cors({
    origin: '*',
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use('/', indexRoutes);

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_BASE_URL,
  },
});
require('./config/socket')(io);

httpServer.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server running on http://localhost:${PORT}`);
  }
});
