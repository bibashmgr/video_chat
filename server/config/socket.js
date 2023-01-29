module.exports = (io) => {
  let participants = [];
  io.on('connection', (socket) => {
    console.log(`user: ${socket.id} connected`);

    // handlers
    const updateParticipants = (roomId, participantInfo, socketId) => {
      participants.push({
        ...participantInfo,
        roomId: roomId,
        socketId: socketId,
      });
    };

    const getParticipants = (roomId) => {
      let newParticipants = [];
      participants.filter((participant) => {
        if (participant.roomId === roomId) {
          newParticipants.push({
            email: participant.email,
            avatarColor: participant.avatarColor,
            prefs: participant.prefs,
          });
        }
      });

      return newParticipants;
    };

    const removeParticipantsBySocketId = (socketId) => {
      let updatedParticipants = participants.filter(
        (participant) => participant.socketId !== socketId
      );
      participants = updatedParticipants;
    };

    const getParticipant = (roomId, email) => {
      return participants.find(
        (participant) =>
          participant.roomId === roomId && participant.email === email
      );
    };

    const getParticipantBySocketId = (socketId) => {
      return participants.find(
        (participant) => participant.socketId === socketId
      );
    };

    socket.on('join-room', (data) => {
      const { roomId, participantInfo } = data;
      // console.log(data);

      updateParticipants(roomId, participantInfo, socket.id);
      // console.log(participants);

      let roomParticipants = getParticipants(roomId);
      // console.log(roomParticipants);

      socket.join(roomId);
      io.to(roomId).emit('user-joined', roomParticipants);
    });

    socket.on('leave-room', (data) => {
      const { roomId, email } = data;
      let isParticipantExist = getParticipant(roomId, email);
      removeParticipantsBySocketId(isParticipantExist.socketId);
      let roomParticipants = getParticipants(roomId);
      socket.to(roomId).emit('user-left', roomParticipants);
      socket.leave(roomId);
    });

    socket.on('disconnect', () => {
      console.log(`user: ${socket.id} disconnected`);
      let isParticipantExist = getParticipantBySocketId(socket.id);
      if (isParticipantExist) {
        removeParticipantsBySocketId(socket.id);
        let roomParticipants = getParticipants(isParticipantExist.roomId);
        socket
          .to(isParticipantExist.roomId)
          .emit('user-disconnected', roomParticipants);
      }
    });
  });
};
