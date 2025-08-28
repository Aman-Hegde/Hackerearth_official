// sidebar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Lucide React Icons
import {
  Home, Calendar, Award, Users, Trophy, Mail,
  User, LogOut, Sun, Moon, ChevronRight, ChevronLeft, Menu, X
} from 'lucide-react';

// Using your actual logo import path
import logo from '../assets/hacker-earth-logo.png';

// Using your actual context imports
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// --- Sidebar Props Interface ---
interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

// --- Component Interface Definitions ---
interface NavItem {
  id: string;
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
}

// --- Navigation Items Data ---
const navItems: NavItem[] = [
  { id: 'home', name: 'Home', path: '/', icon: Home },
  { id: 'events', name: 'Events', path: '/events', icon: Calendar },
  { id: 'leaderboard', name: 'Leaderboard', path: '/leaderboard', icon: Award },
  { id: 'team', name: 'Team', path: '/team', icon: Users },
  { id: 'achievements', name: 'Achievements', path: '/achievements', icon: Trophy },
  { id: 'contact', name: 'Contact', path: '/contact', icon: Mail },
];

// --- Sidebar Component ---
const Sidebar: React.FC<SidebarProps> = ({ isExpanded, setIsExpanded }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Helper to determine if we're on a desktop screen
  const isDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 768;

  // Effect to manage sidebar state
  useEffect(() => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
    if (isDesktop() && isExpanded) {
      setIsExpanded(false);
    }
  }, [location.pathname, isMobileOpen, isExpanded, setIsExpanded]);

  const handleLogout = () => {
    logout();
    if (isMobileOpen) setIsMobileOpen(false);
    setIsExpanded(false);
    navigate('/login');
  };

  // --- Utility Function for Navigation Link Classes ---
  const getNavLinkClasses = (item: NavItem) => {
    const isActive = location.pathname === item.path;
    const baseClasses = "flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 group relative";
    
    let linkClasses = `${baseClasses} text-gray-300 hover:text-white hover:bg-gray-800`;
    
    if (isActive) {
      linkClasses = `${baseClasses} bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20`;
    }
    
    return linkClasses;
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-[70] md:hidden">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-md transition-colors duration-200 text-gray-300 hover:text-white bg-gray-900/70"
          aria-label="Toggle sidebar"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Main Sidebar Container */}
      <motion.aside
        initial={false}
        animate={
            isMobileOpen ? { width: '256px', x: 0 } :
            (isDesktop() ? { width: isExpanded ? '256px' : '64px', x: 0 } :
            { width: '64px', x: '-100%' })
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 h-full bg-gray-950 border-r border-gray-800 shadow-xl z-50 overflow-hidden"
        onMouseEnter={() => {
          if (isDesktop()) {
            setIsHovered(true);
            setIsExpanded(true);
          }
        }}
        onMouseLeave={() => {
          if (isDesktop()) {
            setIsHovered(false);
            setIsExpanded(false);
          }
        }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center p-4 border-b border-gray-800 h-16">
            <Link 
              to="/" 
              className="flex items-center space-x-2" 
              onClick={() => { setIsMobileOpen(false); setIsExpanded(false); }}
            >
              <img src={logo} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
              <AnimatePresence>
                {(isExpanded || isHovered) && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="font-bold text-white whitespace-nowrap text-lg"
                  >
                    HackerEarth Hub
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item, itemIndex) => {
                const Icon = item.icon;
                const linkClasses = getNavLinkClasses(item);
                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      onClick={() => {
                        if (isMobileOpen) setIsMobileOpen(false);
                      }}
                      className={linkClasses}
                    >
                      <Icon
                        className={`flex-shrink-0 w-5 h-5 transition-transform duration-200
                          ${location.pathname === item.path ? 'text-white' : 'text-gray-400 group-hover:text-white'}
                          ${isExpanded || isHovered ? '' : 'mx-auto'}
                        `}
                      />
                      <AnimatePresence>
                        {(isExpanded || isHovered) && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2, delay: 0.05 + itemIndex * 0.03 }}
                            className="ml-3 whitespace-nowrap"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <AnimatePresence>
                        {(isExpanded || isHovered) && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2, delay: 0.05 + itemIndex * 0.03 }}
                            className="ml-auto"
                          >
                            <ChevronRight
                              className={`w-4 h-4 transition-transform duration-200
                                ${location.pathname === item.path ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}
                                group-hover:translate-x-1
                              `}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Auth & Theme Toggle Buttons */}
          <div className="p-4 border-t border-gray-800 space-y-2">
            {/* User Login/Logout */}
            {isAuthenticated ? (
              <motion.button
                onClick={handleLogout}
                className="w-full flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors duration-200 group
                  text-gray-300 hover:text-red-400 hover:bg-gray-800"
              >
                <LogOut className={`flex-shrink-0 w-5 h-5 ${(isExpanded || isHovered) ? '' : 'mx-auto'}`} />
                <AnimatePresence>
                  {(isExpanded || isHovered) && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2, delay: 0.05 }}
                      className="ml-3 whitespace-nowrap"
                    >
                      Logout
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ) : (
              <Link
                to="/login"
                onClick={() => { if (isMobileOpen) setIsMobileOpen(false); }}
                className="w-full flex items-center justify-center rounded-lg px-3 py-3 text-sm font-medium text-center transition-all duration-200
                  bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
              >
                <AnimatePresence mode="wait">
                  {(isExpanded || isHovered) ? (
                    <motion.span
                      key="login-expanded"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      Login
                    </motion.span>
                  ) : (
                    <motion.span
                      key="login-collapsed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-center"
                    >
                      <LogOut className="w-5 h-5 rotate-180 text-white" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )}

            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-full flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors duration-200 group
                text-gray-300 hover:text-white hover:bg-gray-800"
            >
              {isDark ? (
                <Sun className={`flex-shrink-0 w-5 h-5 ${(isExpanded || isHovered) ? '' : 'mx-auto'}`} />
              ) : (
                <Moon className={`flex-shrink-0 w-5 h-5 ${(isExpanded || isHovered) ? '' : 'mx-auto'}`} />
              )}
              <AnimatePresence>
                {(isExpanded || isHovered) && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                    className="ml-3 whitespace-nowrap"
                  >
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
          
          {/* Expand/Collapse Toggle Button */}
          <motion.button
            className="flex items-center justify-center h-12 w-full transition-colors duration-200 
              bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4"
            onClick={() => {
                setIsExpanded(!isExpanded);
                if (!isExpanded && isMobileOpen) setIsMobileOpen(false);
            }}
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <AnimatePresence mode="wait">
              {(isExpanded || isHovered) ? (
                <motion.span
                  key="collapse-label"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium whitespace-nowrap mr-auto"
                >
                  Collapse
                </motion.span>
              ) : (
                <motion.span
                  key="expand-label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="sr-only"
                >
                  Expand
                </motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {(isExpanded || isHovered) ? (
                <motion.div
                  key="chevron-left"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="chevron-right"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          
          {/* Sidebar Footer */}
          <AnimatePresence>
            {(isExpanded || isHovered) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="p-4 border-t border-gray-800 text-center"
              >
                <p className="text-xs text-gray-600 font-medium">
                  HackerEarth
                </p>
                <p className="text-xs text-gray-500">
                  Hub-NMAMIT
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;