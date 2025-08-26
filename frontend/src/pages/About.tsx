import React from 'react';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/image.png';
import { TypingAnime } from '../components/TypingAnime';

const About = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'}`}>
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`${isDark
          ? 'absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-900/20 to-indigo-900/10'
          : 'absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-600/10'
          } rounded-full blur-3xl`}
        />
        <div className={`${isDark
          ? 'absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-900/20 to-pink-900/10'
          : 'absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10'
          } rounded-full blur-3xl`}
        />
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Floating Bubbles or any SVG/Lottie effect */}
          <svg className="opacity-30 w-full h-full" style={{ position: 'absolute', left: 180, top: 0 }} xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 15 }).map((_, i) =>
              <circle
                key={i}
                cx={Math.random() * 600}
                cy={Math.random() * 800}
                r={Math.random() * 40 + 20}
                fill={i % 3 === 0 ?
                  "#6366F1" : i % 3 === 1 ? "#818CF8" : "#E0E7FF"}
                opacity={Math.random() * 0.4 + 0.2}
              />
            )}
          </svg>
        </div>
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className={`inline-flex flex-col items-center space-x-2 backdrop-blur-sm border rounded-full px-6 py-3 mb-8 shadow-lg ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-slate-200' : 'bg-white/80 border-gray-200/50 text-gray-700'}`}>
            <img
              src={logo}
              alt="HackerEarth Logo"
              width={100}
              height={100}
              className="w-24 h-24 border rounded-[54px] object-contain mb-6 drop-shadow-xl"
            />
            <span className="font-medium">About Us</span>
          </div>
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : ''}`}>
            <span className={isDark ? 'bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}>
              About <TypingAnime text="Hackerearth Hub-NMAMIT" speed={80} className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent" />
            </span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-700'}`}>
            Welcome to Hackerearth Hub-NMAMIT, your gateway to mastering Competitive Programming and enhancing your coding skills. As a vibrant tech club backed by Hackerearth India, we provide a dynamic platform for students to engage in weekly and monthly contests, participate in enlightening webinars, and benefit from up-solving sessions. Our mission is to foster a stimulating competitive environment that inspires and challenges members to reach new heights in programming.
          </p>
          <p className={`mt-6 text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-700'}`}>
            At Hackerearth Hub-NMAMIT, we’re more than just a club; we’re a community committed to your growth. Our website features diverse programming tracks and hands-on coding interview simulations designed to build your confidence and refine your problem-solving abilities. Join us to explore, compete, and connect with fellow coders as we embark on this exciting journey together!
          </p>
        </div>

        {/* Group Photo Section */}
        {/* <section className={`rounded-3xl p-8 shadow-xl backdrop-blur-sm border mb-20 transition-transform duration-300
  ${isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white/80 border-gray-200/50'}
`}>
          <div className="max-w-4xl mx-auto">
            <img
              src="/path-to-your-group-photo.jpg" // replace with your image path
              alt="Hackerearth Hub-NMAMIT Group Photo"
              className="rounded-2xl shadow-lg w-full object-cover"
              loading="lazy"
            />
          </div>
        </section> */}


      </div>
    </div>
  );
};

export default About;
