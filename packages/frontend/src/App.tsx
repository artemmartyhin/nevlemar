// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';  // Import AuthProvider

import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Males from './pages/Males/Males';
import Females from './pages/Females/Females';
import Puppies from './pages/Puppies/Puppies';
import AdminPanel from './components/Admin/Admin';

function App() {
  return (
    <AuthProvider>  {/* Wrap your application with AuthProvider */}
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/males" element={<Males />} />
          <Route path="/females" element={<Females />} />
          <Route path="/puppies" element={<Puppies />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
