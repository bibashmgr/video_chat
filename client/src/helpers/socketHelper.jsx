import React from 'react';
import socketio from 'socket.io-client';

const SocketContext = React.createContext();
const socket = socketio.connect(`${window.location.hostname}:9999`);

export const SocketProvider = (props) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return React.useContext(SocketContext);
};
