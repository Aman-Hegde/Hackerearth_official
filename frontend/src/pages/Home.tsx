import { useState, useEffect } from 'react';
import { ArrowRight, Code, Users, Trophy, Calendar, Sparkles, Target, Rocket, Star, Globe, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ExploreMoreSection from '../components/ExploreMoreSection';
import { TypingAnime } from '../components/TypingAnime';
import { TextReveal } from "../components/magicui/text-reveal";


const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { isDark } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Code,
      title: "Web Development",
      description: "Master modern web technologies and build stunning, responsive applications.",
      gradient: "from-blue-500 to-cyan-500",
      delay: "0ms"
    },
    {
      icon: Users,
      title: "Data Structures & Algorithms",
      description: "Build a rock-solid foundation in computer science fundamentals.",
      gradient: "from-purple-500 to-pink-500",
      delay: "200ms"
    },
    {
      icon: Trophy,
      title: "Aptitude & Reasoning",
      description: "Sharpen your analytical thinking and logical reasoning skills.",
      gradient: "from-orange-500 to-red-500",
      delay: "400ms"
    }
  ];

  const stats = [
    { number: "500+", label: "Active Members", icon: Users },
    { number: "50+", label: "Projects Completed", icon: Code },
    { number: "25+", label: "Events Organized", icon: Calendar },
    { number: "15+", label: "Awards Won", icon: Trophy }
  ];

  return (
    <div className={`transition-colors duration-500 ${isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
      {/* Professional Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle Gradient Overlays */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark
          ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800'
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
          }`}></div>

        {/* Professional Grid Pattern */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? 'opacity-5' : 'opacity-10'
          }`} style={{
            backgroundImage: `linear-gradient(${isDark ? '#334155' : '#e2e8f0'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#334155' : '#e2e8f0'} 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}></div>

        {/* Subtle Accent Elements */}
        <div className={`absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ${isDark
          ? 'bg-gradient-to-r from-blue-900/10 to-indigo-900/10'
          : 'bg-gradient-to-r from-blue-400/20 to-indigo-600/20'
          }`}></div>
        <div className={`absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full blur-3xl transition-all duration-1000 ${isDark
          ? 'bg-gradient-to-r from-slate-800/20 to-gray-800/20'
          : 'bg-gradient-to-r from-purple-400/15 to-pink-600/15'
          }`}></div>

        {/* Minimal Accent Lines */}
        <div className={`absolute top-0 left-1/3 w-px h-full transition-colors duration-1000 ${isDark ? 'bg-gradient-to-b from-transparent via-slate-700/30 to-transparent' : 'bg-gradient-to-b from-transparent via-gray-300/50 to-transparent'
          }`}></div>
        <div className={`absolute top-0 right-1/3 w-px h-full transition-colors duration-1000 ${isDark ? 'bg-gradient-to-b from-transparent via-slate-700/30 to-transparent' : 'bg-gradient-to-b from-transparent via-gray-300/50 to-transparent'
          }`}></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen min-w-screen flex items-center justify-center pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-fade-in-up ">
            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight tracking-tight">
              <span className={`text-5xl md:text-7xl bg-gradient-to-r bg-clip-text text-transparent block mb-4 transition-all duration-500 ${isDark
                ? 'from-white via-slate-200 to-slate-300'
                : 'from-gray-900 via-blue-900 to-indigo-900'
                }`}>
                <TypingAnime text="HackerEarth" speed={150} className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent" />
              </span>
              <span className={`block text-4xl md:text-5xl font-medium tracking-wide transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-gray-700'
                }`}>
                A Coding Hub of NMAMIT
              </span>
            </h1>

            {/* Professional Subtitle */}
            <p className={`text-2xl md:text-3xl mb-8 max-w-4xl mx-auto leading-relaxed font-light transition-colors duration-500 ${isDark ? 'text-slate-300' : 'text-gray-600'
              }`}>
              Explore the exciting world of Competitive Programming with Hackerearth.
            </p>


            <TextReveal>With due support of Hackerearth India, we host several weekly as well as monthly contests and hence keep up with a healthy competitive environment when it comes to 'CP'.</TextReveal>

            {/* Professional CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <Link
                to="/login"
                className={`group relative px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                  }`}
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <span>Join Our Community</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link
                to="/about"
                className={`group relative border-2 px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm ${isDark
                  ? 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-800/50'
                  : 'border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 bg-white/80'
                  }`}
              >
                <span className="flex items-center space-x-3">
                  <span>Learn More</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Minimal Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className={`w-6 h-10 border-2 rounded-full flex justify-center transition-colors duration-500 ${isDark ? 'border-slate-600' : 'border-gray-400'
            }`}>
            <div className={`w-1 h-3 rounded-full mt-2 animate-pulse transition-colors duration-500 ${isDark ? 'bg-slate-500' : 'bg-gray-400'
              }`}></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`relative z-10 py-24 transition-colors duration-500 z-0 ${isDark ? 'bg-slate-800/30' : 'bg-white'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className={`inline-flex items-center space-x-3 border rounded-full px-8 py-4 mb-12 transition-all duration-500 ${isDark
              ? 'bg-slate-800/60 border-slate-700/50 text-slate-300'
              : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}>
              <Target className="w-5 h-5" />
              <span className="font-medium tracking-wide">Technical Domains</span>
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-8 tracking-tight transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Three Pillars of Excellence
            </h2>
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-gray-600'
              }`}>
              Comprehensive technical education across the most critical areas of modern software development.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`feature-card ${index === 1
                    ? 'feature-middle'
                    : index === 0
                      ? 'feature-left'
                      : 'feature-right'
                    } group relative border rounded-2xl p-8 transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl ${isDark
                      ? 'bg-slate-800/60 border-slate-700/50 hover:border-slate-600/50'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  style={{ animationDelay: feature.delay }}
                >
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className={`text-2xl font-semibold mb-4 transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                      {feature.title}
                    </h3>
                    <p className={`leading-relaxed mb-6 transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-gray-600'
                      }`}>
                      {feature.description}
                    </p>

                    {/* Learn More Link */}
                    <Link
                      to="/domains"
                      className={`inline-flex items-center font-medium transition-colors group ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                        }`}
                    >
                      <span>Explore Domain</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ExploreMoreSection />

      {/* Stats Section */}
      <section className={`relative z-10 py-24 transition-colors duration-500 ${isDark
        ? 'bg-gradient-to-r from-slate-900 to-slate-800'
        : 'bg-gradient-to-r from-slate-50 to-blue-50'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="relative inline-block mb-6">
                    <div className={`w-20 h-20 border rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg ${isDark
                      ? 'bg-slate-800/60 border-slate-700/50'
                      : 'bg-white border-gray-200'
                      }`}>
                      <Icon className={`w-10 h-10 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                  </div>
                  <div className={`text-4xl font-bold mb-3 transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    {stat.number}
                  </div>
                  <div className={`font-medium text-lg transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-gray-600'
                    }`}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`relative z-10 py-24 transition-colors duration-500 ${isDark ? 'bg-slate-800/30' : 'bg-white'
        }`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`border rounded-2xl p-16 hover:scale-105 transition-all duration-500 shadow-xl ${isDark
            ? 'bg-slate-800/60 border-slate-700/50'
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
            }`}>
            <div className="mb-8">
              <div className={`w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                }`}>
                <Rocket className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-8 tracking-tight transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Ready to Begin Your Journey?
            </h2>
            <p className={`text-xl mb-12 leading-relaxed max-w-3xl mx-auto transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-gray-600'
              }`}>
              Join a community of innovators, builders, and leaders. Start your path to technical excellence today.
            </p>
            <Link
              to="/login"
              className={`group relative inline-flex items-center space-x-4 px-12 py-4 rounded-xl font-semibold text-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${isDark
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                }`}
            >
              <span>Get Started</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;