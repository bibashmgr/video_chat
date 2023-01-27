import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

// components
import MainScreen from '../../components/MainScreen';
import BottomNavigation from '../../components/BottomNavigation';

// styling
import './index.css';

const Room = () => {
  const socket = useSelector((state) => state.socket.value);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`user: ${socket.id} connected`);
    });

    return () => {
      socket.off('connect');
    };
  }, []);
  return (
    <div className='container'>
      <MainScreen />
      <BottomNavigation />
    </div>
  );
};

export default Room;
