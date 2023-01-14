import React, { useEffect } from 'react';

// helpers
import { SocketContext } from '../helpers/Socket';

const Room = () => {
  const socket = React.useContext(SocketContext);

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
