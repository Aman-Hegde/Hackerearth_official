import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar'; // <--- REMOVE NAVBART
// import { Footer } from './components/Footer';

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
import Sidebar from './components/Sidebar'; // Import Sidebar component


function AppWrapper() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to manage sidebar expansion

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Optionally, you might want to reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="pt-16">
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
      {/* <Footer /> */}
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