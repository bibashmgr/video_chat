import React from 'react';
// styling
import './BottomNavigation.css';

// icons
import { IoMdMic, IoMdMicOff } from 'react-icons/io';
import { BiVideo, BiVideoOff } from 'react-icons/bi';
import { BsPauseFill } from 'react-icons/bs';
import { TbScreenShare } from 'react-icons/tb';
import { TbPhoneX } from 'react-icons/tb';

const BottomNavigation = ({
  userInfo,
  handleAudio,
  handleVideo,
  handleScreen,
  handleEndCall,
  isReady,
}) => {
  return (
    <nav className={isReady ? 'navbar-container' : 'ready-screen-controller'}>
      <div
        className={`icon-btn ${!userInfo?.prefs.audio && 'icon-btn-disable'}`}
        onClick={handleAudio}
      >
        {userInfo?.prefs.audio ? (
          <IoMdMic className='icon' />
        ) : (
          <IoMdMicOff className='icon' />
        )}
      </div>
      <div
        className={`icon-btn ${!userInfo?.prefs.video && 'icon-btn-disable'}`}
        onClick={handleVideo}
        id='video-controller'
      >
        {userInfo?.prefs.video ? (
          <BiVideo className='icon' />
        ) : (
          <BiVideoOff className='icon' />
        )}
      </div>
      {isReady && (
        <div
          className={`icon-btn ${userInfo?.prefs.screen && 'icon-btn-disable'}`}
          onClick={handleScreen}
        >
          {userInfo?.prefs.screen ? (
            <BsPauseFill className='icon' />
          ) : (
            <TbScreenShare className='icon' />
          )}
        </div>
      )}
      {isReady && (
        <div className='icon-btn icon-btn-disable' onClick={handleEndCall}>
          <TbPhoneX className='icon' />
        </div>
      )}
    </nav>
  );
};

export default BottomNavigation;
