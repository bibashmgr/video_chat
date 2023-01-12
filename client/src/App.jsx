import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// styling
import './App.css';

// pages
import Home from './pages/Home';
import Room from './pages/Room';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/room/:roomId' element={<Room />} />
      </Routes>
    </Router>
  );
};

export default App;
