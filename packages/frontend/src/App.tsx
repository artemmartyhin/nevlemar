// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';  // Import AuthProvider

import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Pomeranian from './pages/Pomeranian/Pomeranian';
import Cvergsnaucer from './pages/Cvergsnaucer/Cvergsnaucer';
import Puppies from './pages/Puppies/Puppies';
import Admin from './pages/Admin/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poms" element={<Pomeranian />} />
          <Route path="/cvergs" element={<Cvergsnaucer />} />
          <Route path="/puppies" element={<Puppies />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
