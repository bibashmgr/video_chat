import React, { useEffect } from 'react';

// helpers
import { useSocket } from '../helpers/SocketHelper';

const Room = () => {
  const socket = useSocket();

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`user: ${socket.id} connected`);
    });
  }, [socket]);

  return (
    <div className='room-container'>
      <div className='video-grid'>
        <video className='video-container' />
      </div>
    </div>
  );
};

export default Room;
