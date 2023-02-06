import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
    let participantInfo = {
      email: formInfo.email,
      avatarColor: generateRandomColor(),
      prefs: {
        audio: true,
        video: true,
        screen: false,
      },
    };

    navigate(`room/${formInfo.roomId}`);

    dispatch(addParticipant(participantInfo));
    dispatch(
      setUserInfo({
        email: formInfo.email,
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
