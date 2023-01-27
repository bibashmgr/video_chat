import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// styles
import './index.css';

const Home = () => {
  const socket = useSelector((state) => state.socket.value);
  const [formInfo, setFormInfo] = useState({
    email: '',
    roomId: '',
  });

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`user: ${socket.id} connected`);
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  // handlers
  const handleChange = (e) => {
    setFormInfo({ ...formInfo, [e.target.name]: e.target.value });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    console.log(formInfo);
  };

  return (
    <div className='container home-container'>
      <div className='form-card'>
        <form className='form' onSubmit={handleJoinRoom}>
          <div>
            <div className='input-container'>
              <label htmlFor='email'>Email:</label>
              <input
                type='email'
                name='email'
                value={formInfo.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className='input-container'>
              <label htmlFor='email'>Room:</label>
              <input
                type='text'
                name='roomId'
                value={formInfo.roomId}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type='submit' className='join-btn'>
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
