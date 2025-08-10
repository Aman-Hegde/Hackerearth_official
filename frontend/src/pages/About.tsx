import React from 'react';
import { Target, Eye, Heart, Users, MapPin, Clock, Mail, Phone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const About = () => {
  const { isDark } = useTheme();

  const values = [
    {
      icon: Target,
      title: "Innovation",
      description: "We strive to push the boundaries of technology and create solutions that matter."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Together we achieve more. We believe in the power of teamwork and collective intelligence."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "We are driven by our love for technology and the desire to make a positive impact."
    },
    {
      icon: Eye,
      title: "Excellence",
      description: "We maintain high standards in everything we do, from code quality to project delivery."
    }
  ];

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-500 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'}`}>
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`${isDark
          ? 'absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-900/20 to-indigo-900/10'
          : 'absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-600/10'
        } rounded-full blur-3xl`}></div>
        <div className={`${isDark
          ? 'absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-900/20 to-pink-900/10'
          : 'absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10'
        } rounded-full blur-3xl`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className={`inline-flex items-center space-x-2 backdrop-blur-sm border rounded-full px-6 py-3 mb-8 shadow-lg ${
            isDark
            ? 'bg-slate-800/80 border-slate-700/50 text-slate-200'
            : 'bg-white/80 border-gray-200/50 text-gray-700'
          }`}>
            <Target className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <span className="font-medium">About Us</span>
          </div>
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : ''}`}>
            <span className={isDark
              ? 'bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'}>
              About HackerEarth
            </span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Empowering the next generation of technologists through innovation, collaboration, and excellence at NMAMIT.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className={`
            rounded-3xl p-8 shadow-xl backdrop-blur-sm border transition-transform duration-300 animate-slide-in-left
            ${isDark
              ? 'bg-slate-800/80 border-slate-700/60 hover:border-slate-500'
              : 'bg-white/80 border-gray-200/50 hover:border-gray-300'}
            hover:scale-105
          `}>
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Mission</h2>
            </div>
            <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              To create a vibrant community where NMAMIT students can learn, collaborate, and innovate in the field of technology. We aim to bridge the gap between academic learning and real-world application by providing hands-on experience and mentorship.
            </p>
          </div>
          <div
            className={`
              rounded-3xl p-8 shadow-xl backdrop-blur-sm border transition-transform duration-300 animate-slide-in-left
              ${isDark
                ? 'bg-slate-800/80 border-slate-700/60 hover:border-slate-500'
                : 'bg-white/80 border-gray-200/50 hover:border-gray-300'}
              hover:scale-105
            `}
            style={{ animationDelay: '200ms' }}
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Vision</h2>
            </div>
            <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              To become the leading technical club that produces skilled professionals who contribute meaningfully to the tech industry. We envision a future where our members lead innovation and drive positive change in society through technology.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className={`text-4xl font-bold mb-12 text-center animate-fade-in ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className={`
                    rounded-3xl p-8 text-center shadow-xl backdrop-blur-sm border animate-bounce-in
                    ${isDark
                      ? 'bg-slate-800/80 border-slate-700/60 hover:border-slate-500'
                      : 'bg-white/80 border-gray-200/50 hover:border-gray-300'}
                    hover:scale-105 transition-all duration-300
                  `}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {value.title}
                  </h3>
                  <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'} leading-relaxed`}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Info */}
        <div className={`
          rounded-3xl p-12 mb-20 shadow-xl backdrop-blur-sm border animate-scale-in
          ${isDark
            ? 'bg-slate-800/80 border-slate-700/60'
            : 'bg-white/80 border-gray-200/50'}
        `}>
          <h2 className={`text-4xl font-bold mb-12 text-center ${isDark ? "text-white" : "text-gray-900"}`}>
            Get in Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: MapPin,
                name: 'Location',
                info: <>Room 301, Computer Science Building<br />NMAMIT, Nitte College<br />Karkala, Karnataka</>,
              },
              {
                icon: Users,
                name: 'Meetings',
                info: <>Every Friday at 6:00 PM<br />All NMAMIT students welcome<br />Open discussions &amp; workshops</>,
              },
              {
                icon: Clock,
                name: 'Office Hours',
                info: <>Monday - Friday<br />2:00 PM - 8:00 PM<br />Drop by anytime!</>,
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="group hover:scale-105 transition-transform duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${idx === 1
                    ? 'from-green-500 to-emerald-600'
                    : idx === 2
                      ? 'from-purple-500 to-pink-600'
                      : 'from-blue-500 to-indigo-600'
                  } rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.name}</h3>
                  <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'} leading-relaxed`}>{item.info}</p>
                </div>
              );
            })}
          </div>

          {/* Contact Details */}
          <div className={`mt-12 pt-8 border-t ${isDark ? 'border-slate-600' : 'border-gray-200'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`flex items-center space-x-4 rounded-2xl p-6
                ${isDark
                  ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-900'
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'}`}>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Email</h4>
                  <p className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>hackerearth@nmamit.in</p>
                </div>
              </div>

              <div className={`flex items-center space-x-4 rounded-2xl p-6
                ${isDark
                  ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-900'
                  : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'}`}>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Phone</h4>
                  <p className={`font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>+91 76195 45988</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Join Us CTA */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-12 text-white text-center shadow-2xl animate-scale-in">
          <h2 className="text-4xl font-bold mb-6">
            Want to Be Part of Our Story?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join HackerEarth at NMAMIT and help us write the next chapter of innovation and excellence.
          </p>
          <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg">
            Join Us Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
