import React from 'react';

const PeerContext = React.createContext();
const peer = new RTCPeerConnection();

export const peerProvider = (props) => {
  return (
    <PeerContext.Provider value={{ peer }}>
      {props.children}
    </PeerContext.Provider>
  );
};

export const usePeer = () => {
  return React.useContext(PeerContext);
};
