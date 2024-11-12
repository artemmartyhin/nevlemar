import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Dog from './pages/Dog/Dog';
import DogProfile from './components/DogProfile/DogProfile';
import Puppy from './pages/Puppy/Puppy';
import PuppyProfile from './components/PuppyProfile/PuppyProfile';
import Admin from './pages/Admin/Admin';
import About from './pages/About/About';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poms" element={<Dog breed="pom" />} />
          <Route path="/cvergs" element={<Dog breed="cvergsnaucer" />} />
          <Route path="/puppies" element={<Puppy />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dog/:id" element={<DogProfile />} />
          <Route path="/pups/:id" element={<PuppyProfile />} />
          <Route path="/aboutus" element={<About />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
