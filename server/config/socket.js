module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`user: ${socket.id} connected`);

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
