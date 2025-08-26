import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, User, LogOut, Sun, Moon, Monitor
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/image.png';

function Button({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
  onClick?: () => void;
  [key: string]: any;
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    icon: "h-10 w-10",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
}

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { name: "Events", href: "/events" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Team", href: "/team" },
    { name: "Achievements", href: "/achievements" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleMobileLinkClick();
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? isDark
          ? 'bg-black backdrop-blur-md shadow-lg border-b border-slate-700/50'
          : 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
        : isDark
          ? 'bg-black backdrop-blur-sm'
          : 'bg-white/80 backdrop-blur-sm'
        }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2" aria-label="Home">
            <img
              src={logo.src}
              alt="HackerEarth Logo"
              width={100}
              height={100}
              className="mt-2 mb-2 w-20 h-14 rounded-full object-cover drop-shadow-xl border"
            />
            <span className={`hidden md:inline text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent`}>
              HackerEarth
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? isDark ? 'text-blue-400' : 'text-blue-600'
                    : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <span>{item.name}</span>
              </Link>
            ))}

            <div>
              <button
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 border ${isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
                  }`}
                type="button"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {isAuthenticated ? (
              <>
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                  <User className="w-4 h-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded p-1" />
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                </div>
                <button onClick={handleLogout} className={`flex items-center space-x-1 ${isDark ? 'text-slate-300 hover:text-red-400' : 'text-gray-700 hover:text-red-600'}`}>
                  <LogOut className="w-4 h-4" /> <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg">
                Sign In
              </Link>
            )}

            <Link
              to="/corporate-login"
              className={`text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
            >
              <Monitor className="w-4 h-4" /> <span>Corporate Login</span>
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 border ${isDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
                }`}
              type="button"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} p-2`}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`md:hidden absolute top-full left-0 right-0 backdrop-blur-md border-b ${isDark ? 'bg-black/90 border-gray-800' : 'bg-white/90 border-gray-200'}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-6 space-y-4">
              {isAuthenticated ? (
                <>
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                    <User className="w-4 h-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded p-1" />
                    <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                      {user?.name || user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${isDark ? 'text-slate-300 hover:text-red-400 hover:bg-gray-800' : 'text-gray-700 hover:text-red-600 hover:bg-gray-100'}`}
                  >
                    <LogOut className="w-5 h-5" /> <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={handleMobileLinkClick}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg text-center font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  Sign In
                </Link>
              )}

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleMobileLinkClick}
                  className={`flex items-center space-x-2 text-base font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? isDark ? 'text-blue-400' : 'text-blue-600'
                      : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <span>{item.name}</span>
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-700">
                <Link
                  to="/corporate-login"
                  onClick={handleMobileLinkClick}
                  className={`w-full text-center flex items-center justify-center space-x-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                >
                  <Monitor className="w-5 h-5" /> <span>Corporate Login</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;