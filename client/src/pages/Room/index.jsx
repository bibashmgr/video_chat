import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// components
import MainScreen from '../../components/MainScreen';
import BottomNavigation from '../../components/BottomNavigation';

// styling
import './index.css';

const Room = () => {
  return (
    <div className='container'>
      <MainScreen />
      <BottomNavigation />
    </div>
  );
};

export default Room;
