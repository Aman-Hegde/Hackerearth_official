import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  Code, 
  Trophy, 
  Info, 
  Mail, 
  ChevronRight,
  X,
  Award
} from 'lucide-react';
import logo from '../assets/hacker-earth-logo.png';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
      {/* Invisible Hover Trigger Area - Always visible but transparent */}
      <div 
        className="fixed left-0 top-0 w-4 h-full z-[60] bg-transparent cursor-pointer"
        onMouseEnter={() => setIsOpen(true)}
        style={{ pointerEvents: 'auto' }}
      />

      {/* Sidebar Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[45] lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Transparent and full height */}
      <div 
        className={`fixed left-0 top-0 h-screen bg-white/10 backdrop-blur-md border-r border-white/20 z-[50] transition-all duration-500 ease-out ${
          isOpen ? 'w-64 translate-x-0 opacity-100' : 'w-0 -translate-x-full opacity-0'
        }`}
        onMouseLeave={() => setIsOpen(false)}
        onMouseEnter={() => setIsOpen(true)}
      >
        <div className={`flex flex-col h-full p-6 ${isOpen ? 'visible' : 'invisible'}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pt-4 mt-8">
            <div className="flex items-center space-x-0">
            <div className="relative">
              <img
                src={logo}
                alt="HackerEarth Logo"
                width={100}
                height={100}
                className="w-10 h-8 rounded-xl object-contain"
              />
            </div>
              <span className="text-xl font-bold text-gray-900">HackerEarth</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-900 transition-colors lg:hidden p-2 hover:bg-white/20 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.name} className="animate-slide-in-left" style={{ animationDelay: `${index * 100}ms` }}>
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-white/30 hover:shadow-md'
                      }`}
                    >
                      <Icon className={`w-5 h-5 transition-transform duration-300 ${
                        isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900 group-hover:scale-110'
                      }`} />
                      <span className="font-medium">{item.name}</span>
                      <ChevronRight className={`w-4 h-4 ml-auto transition-all duration-300 ${
                        isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700 group-hover:translate-x-1'
                      }`} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-white/20 pt-6 animate-fade-in">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-2 font-medium">NMAMIT Technical Club</p>
              <p className="text-xs text-gray-500">Building the Future</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;