import React from 'react';
import { useSelector } from 'react-redux';

// styling
import './MainScreen.css';

// helpers
import { generateRandomColor } from '../helpers/colorGenerator';

// icons
import { IoMdMicOff } from 'react-icons/io';

const MainScreen = () => {
  const participants = useSelector((state) => state.participants.value);

  let gridCol =
    participants.length === 1 ? 1 : participants.length <= 4 ? 2 : 4;
  let gridColSize = participants.length <= 4 ? 1 : 2;
  let gridRowSize =
    participants.length <= 4
      ? participants.length
      : Math.ceil(participants.length / 2);

  return (
    <div className='main-screen-container'>
      <div
        className='screen-grid'
        style={{
          '--grid-size': gridCol,
          '--grid-col-size': gridColSize,
          '--grid-row-size': gridRowSize,
        }}
      >
        {participants.map((participant, index) => {
          return <ScreenCard key={index} participant={participant} />;
        })}
      </div>
    </div>
  );
};

const ScreenCard = ({ participant }) => {
  return (
    <div className='screen-card'>
      {!participant.prefs.video && (
        <div className='avatar-container'>
          <div
            className='avatar'
            style={{ backgroundColor: `${generateRandomColor()}` }}
          >
            {participant.email.charAt(0)}
          </div>
        </div>
      )}
      {participant.prefs.video && <video className='video'></video>}
      {!participant.prefs.audio && <IoMdMicOff className='muted-icon' />}
      {!participant.prefs.video && (
        <div className='participant-email'>{participant.email}</div>
      )}
    </div>
  );
};

export default MainScreen;
