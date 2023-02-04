module.exports = (io) => {
  let participants = [];
  io.on('connection', (socket) => {
    console.log(`user: ${socket.id} connected`);

    // add participants to the list
    const updateList = (roomId, participantInfo, socketId) => {
      participants.push({
        ...participantInfo,
        roomId: roomId,
        socketId: socketId,
      });
    };

    // get participants of particular room from the list
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

    // remove a participant from the list using socketId
    const removeParticipantsBySocketId = (socketId) => {
      let updatedParticipants = participants.filter(
        (participant) => participant.socketId !== socketId
      );
      participants = updatedParticipants;
    };

    // get a participant from the list
    const getParticipant = (roomId, email) => {
      return participants.find(
        (participant) =>
          participant.roomId === roomId && participant.email === email
      );
    };

    // get a participant from the list using socketid
    const getParticipantBySocketId = (socketId) => {
      return participants.find(
        (participant) => participant.socketId === socketId
      );
    };

    socket.on('join-room', (data) => {
      const { roomId, participantInfo } = data;
      // console.log(data);

      let roomParticipants = getParticipants(roomId);
      // console.log(roomParticipants);
      updateList(roomId, participantInfo, socket.id);
      // console.log(participants);

      socket.join(roomId);
      io.to(socket.id).emit('user-joined', roomParticipants);
      socket.broadcast.to(roomId).emit('new-user-joined', {
        ...participantInfo,
      });
    });

    socket.on('leave-room', (data) => {
      const { roomId, email } = data;
      let isParticipantExist = getParticipant(roomId, email);
      removeParticipantsBySocketId(isParticipantExist.socketId);
      socket.to(roomId).emit('user-left', { userId: email });
      socket.leave(roomId);
    });

    socket.on('disconnect', () => {
      console.log(`user: ${socket.id} disconnected`);
      let isParticipantExist = getParticipantBySocketId(socket.id);
      if (isParticipantExist) {
        removeParticipantsBySocketId(socket.id);
        socket
          .to(isParticipantExist.roomId)
          .emit('user-disconnected', { userId: isParticipantExist.email });
      }
    });
  });
};
