import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TgAuth from './pages/TgAuth';
import Cart from './pages/Cart';
import Inventory from './pages/Inventory';

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tg-auth" element={<TgAuth />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </Router>
  );
};

export default App;