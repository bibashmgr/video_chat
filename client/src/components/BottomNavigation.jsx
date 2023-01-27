import React, { useState } from 'react';

// styling
import './BottomNavigation.css';

// icons
import { IoMdMic, IoMdMicOff } from 'react-icons/io';
import { BiVideo, BiVideoOff } from 'react-icons/bi';
import { TbScreenShare, TbScreenShareOff } from 'react-icons/tb';
import { TbPhoneX } from 'react-icons/tb';

const BottomNavigation = () => {
  const [prefs, setPrefs] = useState({
    audio: true,
    video: false,
    screen: false,
  });

  const handleAudio = () => {
    setPrefs({ ...prefs, audio: !prefs.audio });
  };
  const handleVideo = () => {
    setPrefs({ ...prefs, video: !prefs.video });
  };
  const handleScreen = () => {
    setPrefs({ ...prefs, screen: !prefs.screen });
  };

  return (
    <nav className='navbar-container'>
      <div
        className={`icon-btn ${!prefs.audio && 'icon-btn-disable'}`}
        onClick={handleAudio}
      >
        {prefs.audio ? (
          <IoMdMic className='icon' />
        ) : (
          <IoMdMicOff className='icon' />
        )}
      </div>
      <div
        className={`icon-btn ${!prefs.video && 'icon-btn-disable'}`}
        onClick={handleVideo}
      >
        {prefs.video ? (
          <BiVideo className='icon' />
        ) : (
          <BiVideoOff className='icon' />
        )}
      </div>
      <div
        className={`icon-btn ${!prefs.screen && 'icon-btn-disable'}`}
        onClick={handleScreen}
      >
        {prefs.screen ? (
          <TbScreenShare className='icon' />
        ) : (
          <TbScreenShareOff className='icon' />
        )}
      </div>
      <div className='icon-btn icon-btn-disable'>
        <TbPhoneX className='icon' />
      </div>
    </nav>
  );
};

export default BottomNavigation;
