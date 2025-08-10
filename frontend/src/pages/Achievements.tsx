import React from 'react';
import { Trophy, Star, Sparkles, ArrowRight } from 'lucide-react';
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

            <p className={`text-xl mb-8 leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              We're working hard to showcase our incredible achievements and milestones. 
              This section will feature our awards, competitions, and success stories.
            </p>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: Star, gradient: 'from-blue-50 to-indigo-50', border: 'border-blue-200', text: 'text-blue-600', title: 'Awards & Recognition', desc: 'National and international accolades' },
                { icon: Trophy, gradient: 'from-purple-50 to-pink-50', border: 'border-purple-200', text: 'text-purple-600', title: 'Competition Results', desc: 'Hackathons and coding contests' },
                { icon: Sparkles, gradient: 'from-orange-50 to-red-50', border: 'border-orange-200', text: 'text-orange-600', title: 'Project Showcases', desc: 'Award-winning innovations' }
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className={`${isDark ? 'bg-slate-700/60 border-slate-600 text-slate-300' : `bg-gradient-to-br ${f.gradient} ${f.border}`} rounded-2xl p-6`}>
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${isDark ? 'text-blue-300' : f.text}`} />
                    <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{f.title}</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{f.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2">
                <span>Stay Tuned</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className={`border-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${isDark ? 'border-slate-500 text-slate-300 hover:border-blue-400 hover:text-blue-400' : 'border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'} px-8 py-3`}>
                Notify Me
              </button>
            </div>
          </div>

          {/* Timeline Preview */}
          <div className="mt-16 text-left">
            <h3 className={`text-2xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>What's Coming</h3>
            <div className="space-y-4">
              {[
                { phase: "Phase 1", title: "Award Gallery", description: "Showcase of all our achievements and recognitions" },
                { phase: "Phase 2", title: "Competition Timeline", description: "Interactive timeline of our competition journey" },
                { phase: "Phase 3", title: "Success Stories", description: "Member spotlights and project case studies" }
              ].map((item, idx) => (
                <div key={idx} className={`${isDark ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-white/60 border-gray-200'} backdrop-blur-sm border rounded-2xl p-6 hover:scale-105 transition`}>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 mt-2">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>{item.phase}</span>
                      <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-300' : 'bg-blue-600'}`}></div>
                    </div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Achievements;
