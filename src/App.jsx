import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TgAuth from './pages/TgAuth';
import Orders from './pages/Orders';

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tg-auth" element={<TgAuth />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </Router>
  );
};

export default App;