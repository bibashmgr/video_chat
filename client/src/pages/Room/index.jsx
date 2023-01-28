import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// components
import MainScreen from '../../components/MainScreen';
import BottomNavigation from '../../components/BottomNavigation';

// styling
import './index.css';

// actions
import { removeUser } from '../../features/userInfo';
import {
  removeParticipant,
  setAudio,
  setVideo,
  setScreen,
} from '../../features/participants';

const Room = () => {
  const userInfo = useSelector((state) => state.userInfo.value);
  const participants = useSelector((state) => state.participants.value);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAudio = () => {
    dispatch(setAudio({ userId: userInfo.email }));
  };
  const handleVideo = () => {
    dispatch(setVideo({ userId: userInfo.email }));
  };
  const handleScreen = () => {
    dispatch(setScreen({ userId: userInfo.email }));
  };
  const handleEndCall = () => {
    dispatch(removeUser());
    dispatch(removeParticipant({ userId: userInfo.email }));
    navigate('/');
  };
  const getUserInfo = () => {
    return participants.find(
      (participant) => participant.email === userInfo.email
    );
  };

  return (
    <div className='container'>
      <MainScreen participants={participants} />
      <BottomNavigation
        userInfo={getUserInfo()}
        handleAudio={handleAudio}
        handleVideo={handleVideo}
        handleScreen={handleScreen}
        handleEndCall={handleEndCall}
      />
    </div>
  );
};

export default Room;
