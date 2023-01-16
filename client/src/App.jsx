import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// styling
import './App.css';

// pages
import Home from './pages/Home';
import Room from './pages/Room';

// helpers
import { SocketProvider } from './helpers/SocketHelper';
import { PeerProvider } from './helpers/PeerHelper';

const App = () => {
  return (
    <SocketProvider>
      <PeerProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/room/:roomId' element={<Room />} />
          </Routes>
        </Router>
      </PeerProvider>
    </SocketProvider>
  );
};

export default App;
