import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// helpers
import { useSocket } from '../helpers/SocketHelper';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');

  const socket = useSocket();

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
