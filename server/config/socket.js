module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`user: ${socket.id} connected`);

    socket.on('join-room', (data) => {
      const { roomId, emailId, prefs } = data;
      console.log(`${emailId} joined room: ${roomId}`);
      socket.broadcast.to(roomId).emit('user-joined', { emailId, prefs });
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};