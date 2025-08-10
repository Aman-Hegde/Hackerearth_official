import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, User, LogOut, Zap, Clock, Trophy, ChevronDown, Play, CheckCircle,
  Sun, Moon 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/hacker-earth-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Daily challenge data
  const dailyChallenge = {
    title: "Two Sum Problem",
    difficulty: "Easy",
    points: 50,
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    timeLimit: "30 min",
    participants: 127
  };

  // Scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Timer for daily challenge reset
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleStartChallenge = () => {
    navigate('/coding-environment');
    setShowChallenge(false);
  };

  // Add dark variants
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 
      ${scrolled 
        ? (isDark 
          ? 'bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-700/50'
          : 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50')
        : (isDark 
          ? 'bg-slate-900/80 backdrop-blur-sm'
          : 'bg-white/80 backdrop-blur-sm')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-0 group">
            <div className="relative">
              <img
                src={logo}
                alt="HackerEarth Logo"
                width={100}
                height={100}
                className="w-10 h-8 rounded-xl object-contain"
              />
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent ${isDark? 'text-white' : 'text-black'}`}>
              HackerEarth
            </span>
          </Link>

          {/* Daily Challenge Widget - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 border ${isDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowChallenge(!showChallenge)}
                className="group flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-300 rounded-xl px-4 py-2 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900">Daily Challenge</div>
                    <div className="text-xs text-blue-600 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 ${
                  isDark ? 'text-slate-400' : 'text-gray-500'
                } transition-transform ${showChallenge ? 'rotate-180' : ''}`} />
              </button>

              {/* Challenge Dropdown */}
              {showChallenge && (
                <div className={`absolute top-full right-0 mt-2 w-80 border rounded-2xl shadow-xl z-50 animate-fade-in ${
                  isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Today's Challenge</h3>
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{dailyChallenge.points} pts</span>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {dailyChallenge.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(dailyChallenge.difficulty)}`}>
                          {dailyChallenge.difficulty}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {dailyChallenge.description}
                      </p>
                      <div className={`flex items-center justify-between text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
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
                        onClick={handleStartChallenge}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 group"
                      >
                        <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Start Challenge</span>
                      </button>
                    )}
                    <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                      <div className="text-center">
                        <div className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Resets in</div>
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
          </div>

          {/* Auth Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isDark ? 'text-slate-300 hover:text-red-400 hover:bg-red-900/10' : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors ${isDark
                ? 'text-gray-300 hover:text-blue-400 hover:bg-slate-800'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`md:hidden border-t backdrop-blur-md ${isDark
            ? 'border-slate-700/50 bg-slate-900/95'
            : 'border-gray-200/50 bg-white/95'
            }`}>
            <div className="px-2 pt-2 pb-3">

              {/* Mobile Theme Toggle */}
              <div className="mb-4">
                <button
                  onClick={toggleTheme}
                  className={`w-full flex items-center justify-center space-x-3 p-4 rounded-xl transition-all duration-300 border ${isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
                  }`}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="font-medium text-sm">{isDark ? 'Switch to Light' : 'Switch to Dark'}</span>
                </button>
              </div>

              {/* Mobile Daily Challenge */}
              <div className={`mb-4 p-4 border rounded-xl ${isDark
                ? 'bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-blue-800'
                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Daily Challenge</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(dailyChallenge.difficulty)}`}>
                    {dailyChallenge.difficulty}
                  </span>
                </div>
                <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{dailyChallenge.title}</h4>
                <div className={`flex items-center justify-between text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>{dailyChallenge.timeLimit}</span>
                  <span>{dailyChallenge.points} pts</span>
                </div>
                <button
                  onClick={handleStartChallenge}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg text-sm font-medium"
                >
                  Start Challenge
                </button>
              </div>

              {/* Mobile Auth */}
              <div className="pt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                        {user?.name || user?.email?.split('@')[0]}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 rounded-lg transition-colors ${isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-lg font-medium"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
