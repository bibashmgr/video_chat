import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// helpers
import { useSocket } from '../helpers/SocketHelper';
import { usePeer } from '../helpers/PeerHelper';

const Room = () => {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteDesc, sendStream } =
    usePeer();
  const location = useLocation();

  const myStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteId, setRemoteId] = useState(null);

  // handlers
  const handleJoinedRoom = async (data) => {
    const { destinationId } = data;
    setRemoteId(destinationId);
    const offer = await createOffer();
    socket.emit('call-user', { offer, destinationId });
  };

  const handleIncomingCall = async (data) => {
    const { offer, callerId } = data;
    setRemoteId(callerId);
    const answer = await createAnswer(offer);
    socket.emit('answer-user', { answer, callerId });
  };

  const handleAnswerReceived = async (data) => {
    const { answer } = data;
    setRemoteDesc(answer);
  };

  const getUserMediaStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    myStreamRef.current.srcObject = stream;
  };

  const handleTrackEvent = (event) => {
    const streams = event.streams;
    remoteStreamRef.current.srcObject = streams[0];
  };

  const handleNegotiationEvent = async () => {
    console.log('needed');
    const offer = await createOffer();
    socket.emit('call-user', { offer, destinationId: remoteId });
  };

  useEffect(() => {
    socket.emit('join-room', location.pathname.slice(6));
  }, []);

  useEffect(() => {
    getUserMediaStream();
  }, []);

  useEffect(() => {
    peer.addEventListener('track', handleTrackEvent);
    peer.addEventListener('negotiationneeded', handleNegotiationEvent);

    return () => {
      peer.removeEventListener('track', handleTrackEvent);
    };
  }, []);

  useEffect(() => {
    socket.on('joined-room', handleJoinedRoom);
    socket.on('incoming-call', handleIncomingCall);
    socket.on('answer-received', handleAnswerReceived);

    return () => {
      socket.off('joined-room');
      socket.off('incoming-call');
      socket.off('answer-received');
    };
  }, [socket]);

  return (
    <div className='room-container'>
      <div className='video-grid'>
        <video
          className='video-container my-stream'
          ref={myStreamRef}
          muted
          autoPlay
        />
        <video
          className='video-container remote-stream'
          ref={remoteStreamRef}
          autoPlay
        />
      </div>
    </div>
  );
};

export default Room;
