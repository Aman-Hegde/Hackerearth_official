// Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, Code, Award, Info, Mail, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { isDark } = useTheme();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Domains', path: '/domains', icon: Code },
    { name: 'Leaderboard', path: '/leaderboard', icon: Award },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Compact with rounded corners */}
      <aside
        className={`fixed top-56 left-4 h-[calc(59vh-2rem)] bg-white dark:bg-black border dark:border-gray-800 z-50 transition-all duration-300 ease-out rounded-2xl
          ${isOpen ? 'w-48' : 'w-14'} ${isOpen ? '' : 'hidden md:block'}`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex flex-col h-full p-2">
          {/* Close button for mobile */}
          {isOpen && (
            <button 
              onClick={() => setIsOpen(false)} 
              className="md:hidden self-end p-2 mb-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          )}

          {/* Centered Navigation */}
          <div className="flex-1 flex items-center justify-center">
            <nav className="w-full">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`group flex items-center rounded-xl p-3 transition-all duration-200
                          ${
                            active
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                          } ${isOpen ? 'justify-start' : 'justify-center'}`}
                      >
                        <Icon className="w-6 h-6" />
                        {isOpen && (
                          <span className="ml-3 text-sm font-medium">
                            {item.name}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
