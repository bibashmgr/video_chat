import React, { useMemo } from 'react';
import { io } from 'socket.io-client';

const SocketContext = React.createContext(null);

export const useSocket = () => {
  return React.useContext(SocketContext);
};

export const SocketProvider = (props) => {
  const socket = useMemo(() =>
    io({
      host: window.location.hostname,
      port: 9999,
    })
  );

  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};
