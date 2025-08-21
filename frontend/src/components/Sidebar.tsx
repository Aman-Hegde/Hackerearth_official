// Sidebar.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Users, Code, Award, Info, Mail, ChevronRight} from 'lucide-react';
import logo from '../assets/hacker-earth-logo.png';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Menu, X, User, LogOut, Zap, Clock, Trophy, ChevronDown, Play, CheckCircle,
  Sun, Moon
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

    const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();

    const handleLogout = () => {
    logout();
    // setShowChallenge(false);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Domains', path: '/domains', icon: Code },
    { name: 'Leaderboard', path: '/leaderboard', icon: Award },
    { name: 'Achievements', path: '/achievements', icon: Trophy },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <>
      {/* Hover trigger for desktop */}
      <div
        className="fixed left-0 top-0 w-4 h-full z-[60] bg-transparent cursor-pointer hidden md:block"
        onMouseEnter={() => setIsOpen(true)}
      />

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 shadow-lg z-50 transition-all duration-300 ease-out
          ${isOpen ? 'w-64' : 'w-14 md:w-14'} translate-x-0 ${isOpen ? '' : 'hidden md:block'}`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b dark:border-slate-700 h-20">
            <Link to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
              <img src={logo} alt="Logo" className="w-10 h-8 rounded-xl object-contain" />
              {isOpen && (
                <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap">
                  HackerEarth Hub-NMAMIT
                </span>
              )}
            </Link>
            {isOpen && (
              <button onClick={() => setIsOpen(false)} className="md:hidden">
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="p-1 flex-1 overflow-hidden">
            <ul className="space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <li
                    key={item.name}
                    className="animate-slide-in-left"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center rounded-xl px-3 py-3 transition-all duration-300 transform hover:scale-[1.03]
                        ${
                          active
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/30 dark:hover:bg-slate-800 hover:shadow-md'
                        }`}
                    >
                      <Icon
                        className={`flex-shrink-0 w-5 h-5 transition-transform duration-300
                        ${
                          active
                            ? 'text-white'
                            : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-hover:scale-110'
                        }`}
                      />
                      {isOpen && (
                        <>
                          <span className="ml-3 font-medium">{item.name}</span>
                          <ChevronRight
                            className={`w-4 h-4 ml-auto transition-all duration-300
                              ${
                                active
                                  ? 'text-white'
                                  : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white group-hover:translate-x-1'
                              }`}
                          />
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className={`flex flex-col items-center`}>

          {isAuthenticated ? (
            isOpen && (
              <div>
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                  <User className="w-4 h-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded p-1" />
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                </div>
                <button onClick={logout} className={`${isDark ? 'text-slate-300 hover:text-red-400' : 'text-gray-700 hover:text-red-600'}`}>
                  <LogOut className="w-4 h-4 inline mr-1" /> Logout
                </button>
              </div>
            )
          ) : ( isOpen && (
            <Link to="/login" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg w-28 text-center">
                Sign In
              </Link> )
            )}
            </div>

          {/* Footer */}
          {isOpen && (
            <div className="border-t border-white/20 pt-4 text-center">
              <p className="text-xs text-gray-600 mb-1 font-medium dark:text-gray-400">
                HackerEarth
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">NMAMIT</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
