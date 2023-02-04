const configuration = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun1:stun.l.google.com:19302',
        'stun2:stun.l.google.com:19302',
        'stun3:stun.l.google.com:19302',
        'stun4:stun.l.google.com:19302',
      ],
    },
  ],
};

export const makeCall = async (currentUser, newUser, myStream) => {
  const peerConnection = new RTCPeerConnection(configuration);
};
