import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// styling
import './App.css';

// pages
import Home from './pages/Home/index.jsx';
import Room from './pages/Room/index.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/room/:id' element={<Room />} />
      </Routes>
    </Router>
  );
};

export default App;
