import React from 'react';

// styling
import './MainScreen.css';

// icons
import { IoMdMicOff } from 'react-icons/io';

const MainScreen = ({ participants, userInfo, isReady }) => {
  let gridCol =
    participants.length === 1 ? 1 : participants.length <= 4 ? 2 : 4;
  let gridColSize = participants.length <= 4 ? 1 : 2;
  let gridRowSize =
    participants.length <= 4
      ? participants.length
      : Math.ceil(participants.length / 2);

  return (
    <div
      className={isReady ? 'main-screen-container' : 'ready-screen-container'}
    >
      <div
        className={isReady ? 'screen-grid' : 'ready-screen'}
        style={{
          '--grid-size': gridCol,
          '--grid-col-size': gridColSize,
          '--grid-row-size': gridRowSize,
        }}
        id='screen-grid'
      >
        {participants.map((participant, index) => {
          return (
            <ParticipantCard
              key={index}
              participant={participant}
              userInfo={userInfo}
              isReady={isReady}
            />
          );
        })}
        {participants.map((participant, index) => {
          if (participant.prefs.screen) {
            return (
              <ScreenCard
                key={index}
                participant={participant}
                userInfo={userInfo}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

const ParticipantCard = ({ participant, userInfo, isReady }) => {
  return (
    <div className={isReady ? 'screen-card' : 'ready-card'}>
      {!participant.prefs.video && (
        <div
          className='avatar'
          style={{ backgroundColor: `${participant.avatarColor}` }}
        >
          {participant.email.charAt(0)}
        </div>
      )}

      <video
        className='video'
        id={`video-${participant.email}`}
        autoPlay={true}
        muted={false}
        controls={false}
        style={{
          backgroundColor: !participant.prefs.video ? '#000000' : 'none',
        }}
      ></video>

      {!participant.prefs.audio && <IoMdMicOff className='muted-icon' />}

      <div className='participant-email'>
        {participant.email === userInfo.email ? 'You' : participant.email}
      </div>
    </div>
  );
};

const ScreenCard = ({ participant, userInfo }) => {
  return (
    <div className='screen-card'>
      <video className='video'></video>
      <div className='participant-email'>
        {participant.email === userInfo.email ? 'You' : participant.email}
      </div>
    </div>
  );
};

export default MainScreen;
