import React, { useEffect, useState } from 'react';
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

  const [peers, setPeers] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { roomId } = useParams();

  const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  // controllers
  const handleAudio = () => {
    dispatch(setAudio({ userId: userInfo.email }));
    console.log(peers);
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
  const makeCall = async (currentUser, newUser) => {
    const peerConnection = new RTCPeerConnection(configuration);

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

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
      makeCall(userInfo.email, data.email);
      dispatch(addParticipant(data));
    });
    socket.on('user-left', (data) => {
      dispatch(removeParticipant({ userId: data.userId }));
    });
    socket.on('user-disconnected', (data) => {
      dispatch(removeParticipant({ userId: data.userId }));
    });
    return () => {
      socket.off('user-joined');
      socket.off('new-user-joined');
      socket.off('user-left');
      socket.off('user-disconnected');
    };
  }, []);

  useEffect(() => {
    socket.on('incoming-call', async (data) => {
      const { caller, callee, offer } = data;

      const peerConnection = new RTCPeerConnection(configuration);

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

      // peerConnection.addEventListener('icecandidate', (event) => {
      //   if (event.candidate) {
      //     socket.emit('send-ice-candidate', {
      //       roomId: roomId,
      //       sender: callee,
      //       receiver: caller,
      //       candidate: event.candidate,
      //     });
      //   }
      // });

      // socket.once('receive-ice-candidate', async (data) => {
      //   const { sender, receiver, iceCandidate } = data;
      //   await peerConnection.addIceCandidate(iceCandidate);
      // });
    });

    return () => {
      socket.off('incoming-call');
    };
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
