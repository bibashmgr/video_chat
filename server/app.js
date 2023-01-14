const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

const app = express();
dotenv.config();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_BASE_URL,
  },
});

// environment variables
const PORT = process.env.PORT_NUMBER || 9999;

app.get('/', (req, res) => {
  res.json('Hello');
});

io.on('connection', (socket) => {
  console.log(`user: ${socket.id} connected`);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('join-room', (roomId) => {
    console.log(`user: ${socket.id} joined room: ${roomId}`);
    socket.join(roomId);
    socket.broadcast
      .to(roomId)
      .emit('joined', `user: ${socket.id} joined room: ${roomId}`);
  });
});

httpServer.listen(PORT, () => {
  console.log('Server running on http://localhost:9999');
});
