import React from 'react';
import { Trophy,Sparkles} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Achievements = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-500 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`${isDark ? 'bg-blue-900/20' : 'bg-blue-400/10'} absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse`}></div>
        <div className={`${isDark ? 'bg-purple-900/20' : 'bg-purple-400/10'} absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center py-20">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl mb-8 shadow-2xl animate-bounce-in">
            <Trophy className="w-12 h-12 text-white" />
          </div>

          {/* Title */}
          <h1 className={`text-6xl md:text-7xl font-bold mb-6 animate-fade-in-up ${isDark ? 'text-white' : ''}`}>
            <span className={isDark
              ? 'bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}>
              Achievements
            </span>
          </h1>

          {/* Coming Soon Message */}
          <div className={`${isDark ? 'bg-slate-800/80 border-slate-700/50 text-slate-300' : 'bg-white/80 border-gray-200/50 text-gray-700'} backdrop-blur-sm border rounded-3xl p-12 shadow-xl animate-scale-in`}>
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Sparkles className={`w-8 h-8 animate-pulse ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <h2 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Coming Soon</h2>
              <Sparkles className={`w-8 h-8 animate-pulse ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <span>Stay Tuned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
