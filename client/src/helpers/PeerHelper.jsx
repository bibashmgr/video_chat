import React from 'react';

const PeerContext = React.createContext(null);

const peer = new RTCPeerConnection({
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:global.stun.twilio.com:3478',
      ],
    },
  ],
});

const createOffer = async () => {
  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  return offer;
};

const createAnswer = async (offer) => {
  await peer.setRemoteDescription(offer);
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  return answer;
};

const setRemoteDesc = async (answer) => {
  await peer.setRemoteDescription(answer);
};

const sendStream = (stream) => {
  const tracks = stream.getTracks();
  for (const track of tracks) {
    peer.addTrack(track, stream);
  }
};

export const PeerProvider = (props) => {
  return (
    <PeerContext.Provider
      value={{ peer, createOffer, createAnswer, setRemoteDesc, sendStream }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};

export const usePeer = () => {
  return React.useContext(PeerContext);
};
