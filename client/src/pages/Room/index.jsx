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
  setParticipants,
  removeParticipant,
  setAudio,
  setVideo,
  setScreen,
} from '../../features/participants';

// helpers
import { useSocket } from '../../helpers/socketHelper';
import { generateRandomColor } from '../../helpers/colorGenerator';

const Room = () => {
  const userInfo = useSelector((state) => state.userInfo.value);
  const participants = useSelector((state) => state.participants.value);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { roomId } = useParams();

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
    dispatch(removeParticipant({ userId: userInfo.email }));
    navigate('/');
  };
  const getUserInfo = () => {
    return participants.find(
      (participant) => participant.email === userInfo.email
    );
  };

  useEffect(() => {
    if (userInfo.email === '') {
      dispatch(setParticipants([]));
      navigate('/');
    } else {
      socket.emit('join-room', {
        roomId: roomId,
        participantInfo: {
          email: userInfo.email,
          avatarColor: generateRandomColor(),
          prefs: {
            audio: false,
            video: false,
            screen: false,
          },
        },
      });
      socket.on('user-joined', (data) => {
        dispatch(setParticipants(data));
      });
      socket.on('user-left', (data) => {
        dispatch(setParticipants(data));
      });
      socket.on('user-disconnected', (data) => {
        console.log(data);
        dispatch(setParticipants(data));
      });
    }
  }, []);

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
