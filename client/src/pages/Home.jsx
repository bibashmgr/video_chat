import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// helpers
import { SocketContext } from '../helpers/Socket';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');

  const socket = React.useContext(SocketContext);

  const handleChange = (e) => {
    setRoomId(e.target.value);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomId !== '') {
      navigate(`/room/${roomId}`);
    }
  };

  const handleGenerateRoom = () => {};

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`user: ${socket.id} connected`);
    });
  }, [socket]);

  return (
    <div className='home-container'>
      <div className='card'>
        <form action='#' className='form-container' onSubmit={handleJoinRoom}>
          <input
            name='roomId'
            placeholder='Enter Room Id'
            className='room-input'
            onChange={handleChange}
          />
          <button type='submit' className='btn join-room-btn'>
            Join room
          </button>
        </form>
        <p className='divider'>OR</p>
        <button type='button' className='btn generate-room-btn'>
          Generate Room
        </button>
      </div>
    </div>
  );
};

export default Home;
