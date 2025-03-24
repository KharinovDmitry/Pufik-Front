import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TgAuth from './pages/TgAuth';

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tg-auth" element={<TgAuth />} />
        </Routes>
      </Router>
  );
};

export default App;