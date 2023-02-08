import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// components
import MainScreen from '../../components/MainScreen';
import BottomNavigation from '../../components/BottomNavigation';

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

  const [isReady, setIsReady] = useState(false);
  const [localStream, setLocalStream] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { roomId } = useParams();

  const configuration = {
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:global.stun.twilio.com:3478',
        ],
      },
    ],
  };

  // controllers
  const handleReadyBtn = () => {
    setIsReady(!isReady);

    socket.emit('join-room', {
      roomId: roomId,
      participantInfo: getUserInfo(),
    });
    socket.on('user-joined', (data) => {
      dispatch(addParticipants(data));
    });
    socket.on('new-user-joined', (data) => {
      makeCall(userInfo.email, data.email);
      dispatch(addParticipant(data));
    });
    socket.on('new-prefs', (data) => {
      const { email, type } = data;

      if (type === 'audio') {
        dispatch(setAudio({ userId: email }));
      }
      if (type === 'video') {
        dispatch(setVideo({ userId: email }));
      }
    });
    socket.on('user-left', (data) => {
      dispatch(removeParticipant({ userId: data.userId }));
    });
    socket.on('user-disconnected', (data) => {
      dispatch(removeParticipant({ userId: data.userId }));
    });
    socket.on('incoming-call', async (data) => {
      const { caller, callee, offer } = data;

      const peerConnection = new RTCPeerConnection(configuration);

      peerConnection.ondatachannel = (event) => {
        const remoteDataChannel = event.channel;
      };

      await localStream.getTracks().forEach((track) => {
        console.log('tracks');
        peerConnection.addTrack(track, localStream);
      });

      peerConnection.addEventListener('track', (event) => {
        console.log('remote-stream');
        let videoElement = document.getElementById(`video-${caller}`);
        if (videoElement) {
          videoElement.srcObject = event.streams[0];
        }
      });

      const remoteDesc = new RTCSessionDescription(offer);
      await peerConnection.setRemoteDescription(remoteDesc);

      const answer = await peerConnection.createAnswer(offer);
      await peerConnection.setLocalDescription(answer);

      socket.emit('answer-call', {
        roomId: roomId,
        caller: caller,
        callee: callee,
        answer: answer,
      });

      peerConnection.addEventListener('icecandidate', (event) => {
        if (event.candidate) {
          socket.emit('send-candidate', {
            roomId: roomId,
            sender: callee,
            receiver: caller,
            candidate: event.candidate,
          });
        }
      });

      socket.on('receive-candidate', async (data) => {
        const { sender, receiver, candidate } = data;
        await peerConnection.addIceCandidate(candidate);
      });
    });
  };

  const handleAudio = () => {
    localStream.getTracks().forEach((track) => {
      if (track.kind === 'audio') {
        track.enabled = !getUserInfo().prefs.audio;
      }
    });
    socket.emit('update-prefs', {
      roomId: roomId,
      email: userInfo.email,
      type: 'audio',
    });
    dispatch(setAudio({ userId: userInfo.email }));
  };

  const handleVideo = () => {
    localStream.getTracks().forEach((track) => {
      if (track.kind === 'video') {
        track.enabled = !getUserInfo().prefs.video;
      }
    });
    socket.emit('update-prefs', {
      roomId: roomId,
      email: userInfo.email,
      type: 'video',
    });
    dispatch(setVideo({ userId: userInfo.email }));
  };

  const handleScreen = () => {
    dispatch(setScreen({ userId: userInfo.email }));
  };

  const handleEndCall = () => {
    if (isReady) {
      socket.emit('leave-room', { roomId: roomId, email: userInfo.email });
      socket.off('user-joined');
      socket.off('new-user-joined');
      socket.off('user-left');
      socket.off('user-disconnected');
      socket.off('incoming-call');
    }
    dispatch(removeUser());
    dispatch(clearParticipants());
    navigate('/');
  };

  // helpers
  const getUserInfo = () => {
    return participants.find(
      (participant) => participant.email === userInfo.email
    );
  };

  const makeCall = async (currentUser, newUser) => {
    const peerConnection = new RTCPeerConnection(configuration);
    const dataChannel = peerConnection.createDataChannel('dataChannel');

    await localStream.getTracks().forEach((track) => {
      console.log('tracks');
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.addEventListener('track', (event) => {
      console.log('remote-stream');
      let videoElement = document.getElementById(`video-${newUser}`);
      if (videoElement) {
        videoElement.srcObject = event.streams[0];
        videoElement.muted = false;
      }
    });

    const offer = await peerConnection.createOffer();
    const localDesc = new RTCSessionDescription(offer);
    await peerConnection.setLocalDescription(localDesc);

    socket.emit('call-user', {
      roomId: roomId,
      caller: currentUser,
      callee: newUser,
      offer: offer,
    });

    socket.once('answer-received', async (data) => {
      const { caller, callee, answer } = data;

      const remoteDesc = new RTCSessionDescription(answer);
      await peerConnection.setRemoteDescription(remoteDesc);
    });

    peerConnection.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        socket.emit('send-candidate', {
          roomId: roomId,
          sender: currentUser,
          receiver: newUser,
          candidate: event.candidate,
        });
      }
    });

    socket.on('receive-candidate', async (data) => {
      const { sender, receiver, candidate } = data;
      await peerConnection.addIceCandidate(candidate);
    });
  };

  useEffect(() => {
    if (userInfo.email === '') {
      if (isReady) {
        socket.off('user-joined');
        socket.off('new-user-joined');
        socket.off('user-left');
        socket.off('user-disconnected');
        socket.off('incoming-call');
      }
      dispatch(clearParticipants([]));
      navigate('/');
    }
  }, []);

  useState(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        let videoElement = document.getElementById(`video-${userInfo.email}`);
        if (videoElement) {
          videoElement.srcObject = stream;
          videoElement.muted = true;
        }
        setLocalStream(stream);
      })
      .catch((error) => {
        console.error('Error accessing media devices.', error);
      });
  }, []);

  return (
    <div className={isReady ? 'container' : 'ready-container'}>
      <MainScreen
        participants={participants}
        userInfo={userInfo}
        isReady={isReady}
      />
      <BottomNavigation
        userInfo={getUserInfo()}
        handleAudio={handleAudio}
        handleVideo={handleVideo}
        handleScreen={handleScreen}
        handleEndCall={handleEndCall}
        isReady={isReady}
      />
      {!isReady && (
        <div className='ready-screen-btns'>
          <button className='ready-to-go-btn' onClick={handleReadyBtn}>
            Ready
          </button>
          <button className='go-back-btn' onClick={handleEndCall}>
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Room;
