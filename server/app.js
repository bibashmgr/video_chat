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
      .emit('joined-room', { destinationId: socket.id });
  });

  socket.on('call-user', (data) => {
    const { offer, destinationId } = data;
    socket
      .to(destinationId)
      .emit('incoming-call', { offer, callerId: socket.id });
  });

  socket.on('answer-user', (data) => {
    const { answer, callerId } = data;
    socket.to(callerId).emit('answer-received', { answer });
  });
});

httpServer.listen(PORT, () => {
  console.log('Server running on http://localhost:9999');
});
