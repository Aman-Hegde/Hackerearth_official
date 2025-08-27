import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Team from './pages/Team';
import Domains from './pages/Domains';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ScrollToTop from './components/ScrollTop';

function AppWrapper() {
  const location = useLocation();

  useEffect(() => {
    // Logic for closing the sidebar on route change can be placed here if needed.
    // The sidebar state has been removed from this file.
  }, [location]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/team" element={<Team />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AppWrapper />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}