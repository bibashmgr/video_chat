import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// styling
import './App.css';

// pages
import Home from './pages/Home';
import Room from './pages/Room';

// helpers
import { SocketContext, socket } from './helpers/Socket';

const App = () => {
  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/room/:roomId' element={<Room />} />
        </Routes>
      </Router>
    </SocketContext.Provider>
  );
};

export default App;
