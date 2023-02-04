import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// components
import MainScreen from '../../components/MainScreen';
import BottomNavigation from '../../components/BottomNavigation';

// styling
import './index.css';

// actions
import { removeUser } from '../../features/userInfo';
import {
  addParticipant,
  addParticipants,
  removeParticipant,
  clearParticipants,
  setAudio,
  setVideo,
  setScreen,
} from '../../features/participants';

// helpers
import { useSocket } from '../../helpers/socketHelper';

const Room = () => {
  const userInfo = useSelector((state) => state.userInfo.value);
  const participants = useSelector((state) => state.participants.value);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { roomId } = useParams();

  // controllers
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
    socket.emit('leave-room', { roomId: roomId, email: userInfo.email });
    dispatch(removeUser());
    dispatch(clearParticipants());
    navigate('/');
  };
  const getUserInfo = () => {
    return participants.find(
      (participant) => participant.email === userInfo.email
    );
  };

  useEffect(() => {
    if (userInfo.email === '') {
      dispatch(clearParticipants([]));
      navigate('/');
    }
  }, []);

  useEffect(() => {
    socket.on('user-joined', (data) => {
      dispatch(addParticipants(data));
    });
    socket.on('new-user-joined', (data) => {
      dispatch(addParticipant(data));
    });
    socket.on('user-left', (data) => {
      dispatch(removeParticipant({ userId: data.userId }));
    });
    socket.on('user-disconnected', (data) => {
      console.log(data);
    });
  }, []);

  return (
    <div className='container'>
      <MainScreen participants={participants} userInfo={userInfo} />
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
