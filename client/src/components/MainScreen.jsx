import React from 'react';

// styling
import './MainScreen.css';

// icons
import { IoMdMicOff } from 'react-icons/io';

const MainScreen = ({ participants }) => {
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
        id='screen-grid'
      >
        {participants.map((participant, index) => {
          return <ParticipantCard key={index} participant={participant} />;
        })}
        {participants.map((participant, index) => {
          if (participant.prefs.screen) {
            return <ScreenCard key={index} participant={participant} />;
          }
        })}
      </div>
    </div>
  );
};

const ParticipantCard = ({ participant }) => {
  return (
    <div className='screen-card'>
      {!participant.prefs.video && (
        <div className='avatar-container'>
          <div
            className='avatar'
            style={{ backgroundColor: `${participant.avatarColor}` }}
          >
            {participant.email.charAt(0)}
          </div>
        </div>
      )}
      {participant.prefs.video && <video className='video'></video>}
      {!participant.prefs.audio && <IoMdMicOff className='muted-icon' />}

      <div className='participant-email'>{participant.email}</div>
    </div>
  );
};

const ScreenCard = ({ participant }) => {
  return (
    <div className='screen-card'>
      <video className='video'></video>
      <div className='participant-email'>{participant.email}</div>
    </div>
  );
};

export default MainScreen;
