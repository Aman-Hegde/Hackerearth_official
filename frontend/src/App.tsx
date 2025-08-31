import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Events from "./pages/Events";
import Team from "./pages/Team";
import Domains from "./pages/Domains";
import Leaderboard from "./pages/Leaderboard";
import Achievements from "./pages/Achievements";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LoginPage from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ScrollToTop from "./components/ScrollTop";
import Sidebar from "./components/Sidebar";

function AppWrapper() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false); // close sidebar on route change
  }, [location]);

  return (
    <div
      id="scroll-container"
      className="min-h-screen h-full w-full overflow-y-auto bg-slate-50 dark:bg-gray-950 transition-colors duration-300"
    >
      {!isAuthPage && <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />}
      {!isAuthPage && <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />}

      {/* Main content */}
      <main className="pt-0 transition-all duration-300 ease-in-out">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/team" element={<Team />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
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
