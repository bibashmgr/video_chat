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
      console.log(`${participantInfo.email} joined ${roomId}`);

      let roomParticipants = getParticipants(roomId);

      updateList(roomId, participantInfo, socket.id);

      socket.join(roomId);
      io.to(socket.id).emit('user-joined', roomParticipants);
      socket.broadcast.to(roomId).emit('new-user-joined', {
        ...participantInfo,
      });
    });

    socket.on('call-user', (data) => {
      const { roomId, caller, callee, offer } = data;
      const isParticipantExist = getParticipant(roomId, callee);

      if (isParticipantExist) {
        io.to(isParticipantExist.socketId).emit('incoming-call', {
          caller: caller,
          callee: callee,
          offer: offer,
        });
      }
    });

    socket.on('answer-call', (data) => {
      const { roomId, caller, callee, answer } = data;
      const isParticipantExist = getParticipant(roomId, caller);

      if (isParticipantExist) {
        io.to(isParticipantExist.socketId).emit('answer-received', {
          caller: caller,
          callee: callee,
          answer: answer,
        });
      }
    });

    // socket.on('send-ice-candiate', (data) => {
    //   const { roomId, sender, receiver, iceCandidate } = data;

    //   const isParticipantExist = getParticipant(roomId, receiver);
    //   io.to(isParticipantExist.socketId).emit('receive-ice-candidate', {
    //     sender: sender,
    //     receiver: receiver,
    //     iceCandidate: iceCandidate,
    //   });
    // });

    socket.on('leave-room', (data) => {
      const { roomId, email } = data;

      let isParticipantExist = getParticipant(roomId, email);
      removeParticipantsBySocketId(isParticipantExist.socketId);
      console.log(`${email} left ${roomId}`);

      socket.broadcast.to(roomId).emit('user-left', { userId: email });
      socket.leave(roomId);
    });

    socket.on('disconnect', () => {
      console.log(`user: ${socket.id} disconnected`);
      let isParticipantExist = getParticipantBySocketId(socket.id);
      if (isParticipantExist) {
        removeParticipantsBySocketId(socket.id);
        console.log(
          `${isParticipantExist.email} left ${isParticipantExist.roomId}`
        );

        socket.broadcast
          .to(isParticipantExist.roomId)
          .emit('user-disconnected', { userId: isParticipantExist.email });
      }
    });
  });
};
