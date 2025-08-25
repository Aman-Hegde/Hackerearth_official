import React from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Achievements = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen pt-10 sm:pt-20 transition-colors duration-500 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'}`}>
      {/* Responsive Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`${isDark ? 'bg-blue-900/15' : 'bg-blue-400/10'} absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-2xl sm:blur-3xl`} />
        <div className={`${isDark ? 'bg-purple-900/15' : 'bg-purple-400/10'} absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-2xl sm:blur-3xl`} style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-lg sm:max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center py-12 sm:py-20">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 shadow-2xl">
            <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
          </div>
          {/* Title */}
          <h1 className={`text-3xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-6 ${isDark ? 'text-white' : ''}`}>
            <span className={isDark
              ? 'bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}>
              Achievements
            </span>
          </h1>
          {/* Coming Soon Message - Responsive */}
          <div className={`${isDark ? 'bg-slate-800/80 border-slate-700/50 text-slate-300' : 'bg-white/80 border-gray-200/50 text-gray-700'} backdrop-blur-sm border rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-xl`}>
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <Sparkles className={`w-5 h-5 sm:w-8 sm:h-8 animate-pulse ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <h2 className={`text-xl sm:text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Coming Soon</h2>
              <Sparkles className={`w-5 h-5 sm:w-8 sm:h-8 animate-pulse ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
              <span className="text-base sm:text-xl font-semibold">Stay Tuned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
