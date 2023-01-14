import React from 'react';
import socketio from 'socket.io-client';

export const socket = socketio.connect(`${window.location.hostname}:9999`);
export const SocketContext = React.createContext();
