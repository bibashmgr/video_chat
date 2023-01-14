import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// styling
import './App.css';

// pages
import Home from './pages/Home';
import Room from './pages/Room';

// helpers
import { SocketProvider } from './helpers/SocketHelper';

const App = () => {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/room/:roomId' element={<Room />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
};

export default App;
