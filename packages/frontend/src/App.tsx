import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Dog from './pages/Dog/Dog';
import DogProfile from './components/DogProfile/DogProfile';
import Puppies from './pages/Puppies/Puppies';
import Admin from './pages/Admin/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poms" element={<Dog breed="pom" />} />
          <Route path="/cvergs" element={<Dog breed="cvergsnaucer" />} />
          <Route path="/puppies" element={<Puppies />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dog/:id" element={<DogProfile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
