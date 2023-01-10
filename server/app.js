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

// env
const PORT = process.env.PORT_NUMBER || 9999;

app.get('/', (req, res) => {
  res.json('Hello');
});

io.on('connection', (socket) => {
  console.log(`Connected: ${socket.id}`);

  socket.broadcast.emit('newUser', 'A user joined the chat');

  socket.on('newMessage', (args) => {
    socket.broadcast.emit('otherMessage', args);
  });

  socket.on('disconnect', (socket) => {
    console.log(`Disconnected`);
  });
});

httpServer.listen(PORT, () => {
  console.log('Server running on http://localhost:9999');
});
