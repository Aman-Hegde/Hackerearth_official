import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, User, LogOut, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/image.png';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
    const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: "Events", href: "/events" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Team", href: "/team" },
    { name: "About us", href: "/about" },
    // { name: "Achievements", href: "/achievements" },
    { name: "Contact", href: "/contact" },
  ];

  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${scrolled
          ? isDark
            ? "bg-black/90 backdrop-blur-md border-gray-800/50"
            : "bg-white/90 backdrop-blur-md border-gray-200/50"
          : isDark
            ? "bg-black/80 backdrop-blur-sm"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
<Link to="/" className="flex items-center space-x-2" aria-label="Home">
            <img
              src={logo}
              alt="HackerEarth Logo"
              width={100}
              height={100}
              className="mt-2 mb-2 w-20 h-14 rounded-full object-cover drop-shadow-xl border"
            />

              <div className="hidden sm:flex items-center space-x-1 p-1 bg-white rounded-md shadow-md h-8 dark:bg-black">
                {/* <Monitor className="w-5 h-5 text-gray-800" /> */}
                <span className="text-gray-800 text-xs font-semibold whitespace-nowrap dark:text-white">HackerEarth Hub-nmamit</span>
              </div>
          </Link>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              type="button"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <>
                <div
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/70'
                    }`}
                >
                  <User
                    className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-700'}`}
                  />
                  <span
                    className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}
                  >
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${isDark
                      ? 'text-gray-300 hover:text-red-400 hover:bg-gray-800/50'
                      : 'text-gray-700 hover:text-red-600 hover:bg-gray-100/50'
                    }`}
                >
                  <LogOut className="w-4 h-4" /> <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              type="button"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${isDark ? 'text-gray-300' : 'text-gray-700'} p-2`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown (slide from below) */}
            <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`md:hidden absolute top-full left-0 right-0 backdrop-blur-md border-b ${
              isDark
                ? "bg-black/95 border-gray-800"
                : "bg-white/95 border-gray-200" // Light mode mobile sidebar background
            }`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-6 space-y-4">
              {isAuthenticated ? (
                <>
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                    isDark
                      ? 'bg-gray-800/50'
                      : 'bg-gray-100/70 border border-gray-200' // Light mode user info mobile
                  }`}>
                    <User className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-700'}`} />
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {user?.name || user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      isDark
                        ? 'text-gray-300 hover:text-red-400 hover:bg-gray-800/50'
                        : 'text-gray-700 hover:text-red-600 hover:bg-gray-100/50' // Light mode logout mobile
                    }`}
                  >
                    <LogOut className="w-5 h-5" /> <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={handleMobileLinkClick}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg text-center font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Login
                </Link>
              )}

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleMobileLinkClick}
                  className={`flex items-center space-x-2 text-base font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-blue-500 dark:text-blue-400' // Active link color (blue for both, but slightly lighter for dark mode)
                      : isDark
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-700 hover:text-gray-900' // Light mode nav items mobile
                  }`}
                >
                  <span>{item.name}</span>
                </Link>
              ))}

              <div className={`pt-4 ${isDark ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}> {/* Theme-aware border */}
                <button
                  onClick={toggleTheme}
                  aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isDark
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50' // Light mode theme toggle mobile
                  }`}
                  type="button"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
