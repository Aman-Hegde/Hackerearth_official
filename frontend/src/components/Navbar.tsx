import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Button({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  ...props
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Events", href: "/events" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Team", href: "/team" },
    { name: "Achievements", href: "/achievements" },
    { name: "Contact", href: "/contact" },
  ];

  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleMobileLinkClick();
    navigate('/');
  };

  const loginButtonGlowClass = "shadow-[0_0_10px_rgba(78,92,237,0.4),_0_0_20px_rgba(147,51,234,0.2)]";

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isDark
          ? scrolled
            ? "bg-[#1E1D36]/90 backdrop-blur-md"
            : "bg-[#1E1D36]"
          : scrolled
            ? "bg-white/80 backdrop-blur-md"
            : "bg-white"
      }`}
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center items-center h-16 relative">
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-blue-500 dark:text-blue-400'
                    : isDark
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4 absolute right-0">
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className={`
                  p-2 rounded-lg transition-all duration-300 hover:scale-105
                  ${isDark
                    ? 'text-white bg-gray-800/20 hover:bg-gray-700/30'
                    : 'text-gray-700 bg-gray-100/50 hover:bg-gray-200/50'
                  }
                `}
                type="button"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {isAuthenticated ? (
                <>
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                    isDark ? 'bg-gray-800/50' : 'bg-gray-100/70'
                  }`}>
                    <User className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-700'}`} />
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {user?.name || user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <button onClick={handleLogout} className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${
                    isDark ? 'text-gray-300 hover:text-red-400 hover:bg-gray-800/50' : 'text-gray-700 hover:text-red-600 hover:bg-gray-100/50'
                  }`}>
                    <LogOut className="w-4 h-4" /> <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ${isDark ? loginButtonGlowClass : ''}`}
                >
                  Login
                </Link>
              )}
            </div>

            <div className="lg:hidden flex items-center space-x-3">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} p-2`}
                aria-label="Open menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`md:hidden absolute top-full left-0 right-0 backdrop-blur-md ${
              isDark ? "bg-black/95" : "bg-white/95"
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
                    isDark ? 'bg-gray-800/50' : 'bg-gray-100/70'
                  }`}>
                    <User className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-700'}`} />
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {user?.name || user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      isDark ? 'text-gray-300 hover:text-red-400 hover:bg-gray-800/50' : 'text-gray-700 hover:text-red-600 hover:bg-gray-100/50'
                    }`}
                  >
                    <LogOut className="w-5 h-5" /> <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={handleMobileLinkClick}
                  className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg text-center font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 ${isDark ? loginButtonGlowClass : ''}`}
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
                      ? 'text-blue-400'
                      : isDark
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <span>{item.name}</span>
                </Link>
              ))}

              <div className={`pt-4 ${isDark ? 'bg-black/95' : 'bg-white/95'}`}>
                <button
                  onClick={toggleTheme}
                  aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
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