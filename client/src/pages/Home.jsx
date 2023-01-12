import React from 'react';
import { useState } from 'react';

const Home = () => {
  const BASE_URL = 'http://localhost:9999';

  const [roomId, setRoomId] = useState('');

  const handleChange = (e) => {
    setRoomId(e.target.value);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomId !== '') {
      console.log(roomId);
    }
  };

  const handleGenerateRoom = () => {};

  return (
    <div className='main-container'>
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
