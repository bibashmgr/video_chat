import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// styles
import './index.css';

// actions
import { setUserInfo } from '../../features/userInfo';
import { addParticipant } from '../../features/participants';

// helpers
import { generateRandomColor } from '../../helpers/colorGenerator';

const Home = () => {
  const [formInfo, setFormInfo] = useState({
    email: '',
    roomId: '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // handlers
  const handleChange = (e) => {
    setFormInfo({ ...formInfo, [e.target.name]: e.target.value });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    navigate(`room/${formInfo.roomId}`);
    dispatch(
      setUserInfo({
        email: formInfo.email,
      })
    );
    dispatch(
      addParticipant({
        email: formInfo.email,
        avatarColor: generateRandomColor(),
        prefs: {
          audio: false,
          video: false,
          screen: false,
        },
      })
    );
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
