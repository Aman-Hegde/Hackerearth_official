import React, { useState } from 'react';
import { Trophy, Medal, Star, TrendingUp, Calendar, Target, Award, Crown, Zap, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Leaderboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('overall');
  const { isDark } = useTheme();

  const periods = [
    { id: 'overall', label: 'Overall', icon: Trophy },
    { id: 'monthly', label: 'This Month', icon: Calendar },
    { id: 'weekly', label: 'This Week', icon: TrendingUp }
  ];

  const stats = [
    { title: "Total Participants", value: "0", icon: Target, gradient: "from-blue-500 to-indigo-500" },
    { title: "Problems Solved", value: "0", icon: Zap, gradient: "from-green-500 to-emerald-500" },
    { title: "Active Streaks", value: "0", icon: TrendingUp, gradient: "from-purple-500 to-pink-500" },
    { title: "Events Conducted", value: "0", icon: Star, gradient: "from-orange-500 to-red-500" }
  ];

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-500 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'}`}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`${isDark ? 'bg-blue-900/20' : 'bg-blue-400/10'} absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl`} />
        <div className={`${isDark ? 'bg-purple-900/20' : 'bg-purple-400/10'} absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className={`inline-flex items-center space-x-2 backdrop-blur-sm border rounded-full px-6 py-3 mb-8 shadow-lg ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-slate-200' : 'bg-white/80 border-gray-200/50 text-gray-700'}`}>
            <Trophy className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <span className="font-medium">DSA Sprint Leaderboard</span>
          </div>
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : ''}`}>
            <span className={isDark
              ? "bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent"}>
              Leaderboard
            </span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Track your progress and compete with fellow NMAMIT students in our year-long DSA sprint challenge.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i}
                className={`${isDark ? 'bg-slate-800/80 border-slate-700/50 text-slate-300' : 'bg-white/80 border-gray-200/50 text-gray-800'} backdrop-blur-sm border rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 shadow-xl animate-bounce-in`}
                style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
                <div className={`${isDark ? 'text-slate-400' : 'text-gray-600'} text-sm font-medium`}>{stat.title}</div>
              </div>
            );
          })}
        </div>

        {/* Period Selector */}
        <div className="flex justify-center mb-12">
          <div className={`${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white/80 border-gray-200/50'} backdrop-blur-sm border rounded-2xl p-2 shadow-lg`}>
            <div className="flex space-x-2">
              {periods.map((p) => {
                const Icon = p.icon;
                const selected = selectedPeriod === p.id;
                return (
                  <button key={p.id} onClick={() => setSelectedPeriod(p.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${selected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : isDark
                        ? 'text-slate-300 hover:text-blue-400 hover:bg-slate-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}>
                    <Icon className="w-4 h-4" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* No Events */}
        <div className="text-center mb-20">
          <div className={`${isDark ? 'bg-slate-800/80 border-slate-700/50 text-slate-300' : 'bg-white/80 border-gray-200/50 text-gray-700'} backdrop-blur-sm border rounded-3xl p-16 shadow-xl animate-scale-in`}>
            <div className="flex items-center justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-500 to-gray-700 rounded-3xl flex items-center justify-center shadow-lg">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>No Events Conducted Yet</h2>
            <p className={`text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              We haven't started our DSA sprint events yet. Once underway, this leaderboard will be updated with rankings and scores.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: Trophy, col: 'blue', title: 'Upcoming Competitions', desc: 'Weekly coding challenges and contests' },
                { icon: Zap, col: 'green', title: 'Problem Solving', desc: 'Daily DSA problems and solutions' },
                { icon: Star, col: 'purple', title: 'Skill Tracking', desc: 'Monitor progress and achievements' }
              ].map((h, idx) => {
                const Icon = h.icon;
                return (
                  <div key={idx} className={`${isDark ? 'bg-slate-700/60 border-slate-600 text-slate-300' : `bg-gradient-to-br from-${h.col}-50 to-${h.col}-100 border border-${h.col}-200`} rounded-2xl p-6`}>
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${isDark ? `text-${h.col}-300` : `text-${h.col}-600`}`} />
                    <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{h.title}</h3>
                    <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} text-sm`}>{h.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Info */}
            <div className={`${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'} rounded-2xl p-6`}>
              <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>What to Expect</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {[
                  'Real-time ranking updates',
                  'Points-based scoring system',
                  'Streak tracking and badges',
                  'Monthly and weekly leaderboards',
                  'Problem difficulty levels',
                  'Achievement recognition'
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className={`${isDark ? 'bg-blue-400' : 'bg-blue-600'} w-2 h-2 rounded-full`}></div>
                    <span className={`${isDark ? 'text-slate-300' : 'text-gray-700'} text-sm`}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-12 text-white text-center shadow-2xl animate-scale-in">
            <Trophy className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-4xl font-bold mb-6">Ready to Join the Challenge?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Stay tuned for our upcoming DSA sprint events. Be the first to participate and climb to the top!
            </p>
            <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition duration-300 hover:scale-105 shadow-lg">
              Get Notified
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
