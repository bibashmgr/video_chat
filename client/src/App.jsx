import { useState, useEffect } from 'react';

import { connect, io } from 'socket.io-client';

import './App.css';

const App = () => {
  const BASE_URL = 'http://localhost:9999';

  const [socket, setSocket] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMesssage] = useState('');

  useEffect(() => {
    const newSocket = io(BASE_URL);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  socket?.on('connect', () => {
    setChat([...chat, 'You joined the chat']);
  });

  socket?.on('newUser', (args) => {
    setChat([...chat, args]);
  });

  socket?.on('otherMessage', (args) => {
    setChat([...chat, args]);
  });

  const handleChange = (e) => {
    setMesssage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setChat([...chat, message]);
    socket.emit('newMessage', message);
    setMesssage('');
  };

  return (
    <div className='container'>
      <div className='chat-container'>
        {chat.map((msg, index) => {
          return (
            <div className='message-container' key={index}>
              {msg}
            </div>
          );
        })}
      </div>
      <form
        action=''
        className='message-form'
        onSubmit={(e) => handleSubmit(e)}
      >
        <input type='text' onChange={(e) => handleChange(e)} value={message} />
        <button type='submit'>Send</button>
      </form>
    </div>
  );
};

export default App;
