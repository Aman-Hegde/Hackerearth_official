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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleMobileLinkClick = () => {
    setIsOpen(false);
    scrollToTop();
  };

  const handleLogout = () => {
    logout();
    handleMobileLinkClick();
    navigate('/');
  };

  return (
    <motion.nav
      className="relative bg-black/70 backdrop-blur-md border-b border-gray-800/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2" aria-label="Home" onClick={scrollToTop}>
            <img
              src={logo}
              alt="HackerEarth Logo"
              width={100}
              height={100}
              className="mt-2 mb-2 w-20 h-14 rounded-full object-cover drop-shadow-xl border"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={scrollToTop}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Call to Actions */}
        

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
              aria-label="Open menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden absolute top-full left-0 right-0 backdrop-blur-md border-b border-gray-800 bg-black/70"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-6 space-y-4">
               {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800">
                    <User className="w-4 h-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded p-1" />
                    <span className="text-sm font-medium text-slate-200">
                      {user?.name || user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-slate-300 hover:text-red-400 hover:bg-gray-800"
                  >
                    <LogOut className="w-5 h-5" /> <span>Logout</span>
                  </Button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={handleMobileLinkClick}
                >
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium">
                    Login
                  </Button>
                </Link>
              )}

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleMobileLinkClick}
                  className={`flex items-center space-x-2 text-base font-medium transition-colors duration-200 ${
                    pathname === item.href ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-700">
               

                <button
                  onClick={toggleTheme}
                  aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 border ${isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
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

export default NavBar;