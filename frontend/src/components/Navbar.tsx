import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, User, LogOut, Zap, Clock, Trophy, ChevronDown, Play, CheckCircle,
  Sun, Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/hacker-earth-logo.png';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [challengeCompleted] = useState(false);

  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const dailyChallenge = {
    title: 'Two Sum Problem',
    difficulty: 'Easy',
    points: 50,
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    timeLimit: '30 min',
    participants: 127,
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    setShowChallenge(false);
  };

  const handleStartChallenge = () => {
    navigate('/coding-environment');
    setShowChallenge(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return isDark ? 'text-green-300 bg-green-900/30' : 'text-green-600 bg-green-100';
      case 'Medium':
        return isDark ? 'text-orange-300 bg-orange-900/30' : 'text-orange-600 bg-orange-100';
      case 'Hard':
        return isDark ? 'text-red-300 bg-red-900/30' : 'text-red-600 bg-red-100';
      default:
        return isDark ? 'text-slate-300 bg-slate-800/30' : 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? isDark
            ? 'bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-700/50'
            : 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
          : isDark
            ? 'bg-slate-900/80 backdrop-blur-sm'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" aria-label="Home">
            <img src={logo} alt="HackerEarth Logo" className="w-10 h-8 rounded-xl object-contain" />
            <span className={`text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent ${isDark ? 'text-white' : 'text-black'}`}>
              HackerEarth
            </span>
          </Link>

          {/* Desktop daily challenge & auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
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

            {/* Daily Challenge Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowChallenge(!showChallenge)}
                aria-expanded={showChallenge}
                aria-controls="daily-challenge-dropdown"
                className="group flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-300 rounded-xl px-4 py-2 transition-transform duration-300 hover:scale-105"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900">Daily Challenge</div>
                    <div className="text-xs text-blue-600 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
                    </div>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-gray-500'} transition-transform ${showChallenge ? 'rotate-180' : ''}`} />
              </button>

              {showChallenge && (
                <div
                  id="daily-challenge-dropdown"
                  role="region"
                  aria-label="Daily challenge details"
                  className={`absolute top-full right-0 mt-2 w-80 rounded-2xl shadow-xl z-50 border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
                    } animate-fade-in`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{dailyChallenge.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{dailyChallenge.points} pts</span>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{dailyChallenge.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(dailyChallenge.difficulty)}`}>{dailyChallenge.difficulty}</span>
                      </div>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{dailyChallenge.description}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{dailyChallenge.timeLimit}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{dailyChallenge.participants} solving</span>
                        </div>
                      </div>
                    </div>
                    {challengeCompleted ? (
                      <div className="flex items-center justify-center space-x-2 bg-green-50 border border-green-200 rounded-xl py-3 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Challenge Completed!</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStartChallenge}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Start Challenge</span>
                      </button>
                    )}
                    <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                      <div className="text-center">
                        <div className="text-xs mb-1 text-gray-500">Resets in</div>
                        <div className={`font-mono text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                          {String(timeLeft.hours).padStart(2, '0')}:
                          {String(timeLeft.minutes).padStart(2, '0')}:
                          {String(timeLeft.seconds).padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Auth Section Desktop */}
            {isAuthenticated ? (
              <>
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                  <User className="w-4 h-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded p-1" />
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                </div>
                <button onClick={logout} className={`${isDark ? 'text-slate-300 hover:text-red-400' : 'text-gray-700 hover:text-red-600'}`}>
                  <LogOut className="w-4 h-4 inline mr-1" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={onToggleSidebar}
              className={`${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} p-2`}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
