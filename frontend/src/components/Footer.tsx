import React from 'react';
import { Code2, Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import logo from '../assets/image.png';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/hackerearth_nmamit/?hl=en", label: "Instagram" },
    { icon: Github, href: "https://github.com/HackerearthHubNmamit", label: "GitHub" },
    { icon: Linkedin, href: "https://in.linkedin.com/company/hackerearth-hub-nmamit", label: "LinkedIn" },
    { icon: Twitter, href: "https://x.com/NHackerearth", label: "Twitter" }
  ];

  const quickLinks = [
    { name: "Events", href: "/events" },
    { name: "Team", href: "/team" },
    { name: "Domains", href: "/domains" },
    { name: "Achievements", href: "/achievements" }
  ];

  return (
    <footer className={`relative z-10 transition-colors duration-400
      ${isDark
        ? "bg-[#1E1D36]" // Deep, clean dark background
        : "bg-white" // Clean white background
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img src={logo} alt="HackerEarth Logo" width={100} height={100}
                className="mt-2 mb-2 w-20 h-14 rounded-full object-cover drop-shadow-xl" />
              <span className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent
                ${isDark ? "from-white to-slate-300" : "from-gray-900 to-gray-700"}`}>
                HackerEarth
              </span>
            </div>
            <p className={`mb-6 leading-relaxed max-w-md
              ${isDark ? "text-slate-400" : "text-gray-600"}`}>
              We are a Tech Club which is at service to strengthen your Coding
              Skills and hence a medium to take leap into the field of Competitive
              Programming.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className={`group w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
                      ${isDark
                        ? "bg-slate-800 hover:bg-blue-600/30" // Subtle dark background, hover to blue tint
                        : "bg-gray-100 hover:bg-blue-200/50" // Subtle light background, hover to blue tint
                      }`}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className={`w-5 h-5 transition-colors duration-300
                      ${isDark ? "text-slate-300 group-hover:text-blue-300" // Dark mode icon color, hover to light blue
                      : "text-gray-600 group-hover:text-blue-600"}`} /> {/* Light mode icon color, hover to blue */}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-semibold mb-6
              ${isDark ? "text-slate-100" : "text-gray-900"}`}>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className={`transition-colors duration-300 flex items-center space-x-2 group
                      ${isDark
                        ? "text-slate-400 hover:text-blue-400"
                        : "text-gray-600 hover:text-blue-600"
                      }`}
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> {/* Kept blue dot for interactive feel */}
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`text-lg font-semibold mb-6
              ${isDark ? "text-slate-100" : "text-gray-900"}`}>
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
                    ${isDark
                      ? "bg-slate-800 group-hover:bg-blue-600/30"
                      : "bg-blue-100 group-hover:bg-blue-200/50"
                    }`}
                >
                  <Mail className={`w-5 h-5 transition-colors duration-300
                    ${isDark ? "text-blue-300 group-hover:text-blue-200" : "text-blue-600 group-hover:text-blue-700"}`} />
                </div>
                <div>
                  <p className={`${isDark ? "text-slate-400" : "text-gray-500"} text-sm`}>Email</p>
                  <p className={`${isDark ? "text-slate-100" : "text-gray-900"} font-medium`}>
                    <a
                      href="mailto:Hackerearth.Nmamit@Nitte.edu.in"
                      className="hover:underline"
                    >
                      hackerearth@nmamit.in
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
                    ${isDark
                      ? "bg-slate-800 group-hover:bg-green-600/30"
                      : "bg-green-100 group-hover:bg-green-200/50"
                    }`}
                >
                  <Phone className={`w-5 h-5 transition-colors duration-300
                    ${isDark ? "text-green-300 group-hover:text-green-200" : "text-green-600 group-hover:text-green-700"}`} />
                </div>
                <div>
                  <p className={`${isDark ? "text-slate-400" : "text-gray-500"} text-sm`}>Phone</p>
                  <p className={`${isDark ? "text-slate-100" : "text-gray-900"} font-medium`}>
                    <a href="tel:+917619545988" className="hover:underline">
                      +91 76195 45988
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
                    ${isDark
                      ? "bg-slate-800 group-hover:bg-purple-600/30"
                      : "bg-purple-100 group-hover:bg-purple-200/50"
                    }`}
                >
                  <MapPin className={`w-5 h-5 transition-colors duration-300
                    ${isDark ? "text-purple-300 group-hover:text-purple-200" : "text-purple-600 group-hover:text-purple-700"}`} />
                </div>
                <div>
                  <p className={`${isDark ? "text-slate-400" : "text-gray-500"} text-sm`}>Location</p>
                  <p className={`${isDark ? "text-slate-100" : "text-gray-900"} font-medium`}>
                    <a
                      href="https://www.google.com/maps/place/Nitte+Mahalinga+Adyantaya+Memorial+Institute+of+Technology"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      NMAMIT, Nitte College
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`mt-12 pt-8 border-t transition-colors duration-300
          ${isDark ? "border-slate-700" : "border-gray-200"}`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`${isDark ? "text-slate-400" : "text-gray-500"} text-sm flex flex-wrap items-center gap-1`}>
              © {new Date().getFullYear()} HackerEarth Club, NMAMIT. All rights reserved.
              <span className="ml-0 md:ml-4 mt-2 md:mt-0">
                Made with <span className="text-red-500">❤️</span> by&nbsp;
                <a href="https://github.com/HackerearthHubNmamit" target="_blank" rel="noopener noreferrer" className={`${isDark ? "text-blue-400 hover:underline" : "text-blue-600 hover:underline"} font-medium`}>
                  Hackers
                </a>
              </span>
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="https://www.hackerearth.com/privacy" target="_blank" rel="noopener noreferrer" className={`${isDark ? "text-slate-400 hover:text-blue-400" : "text-gray-500 hover:text-blue-600"} text-sm transition-colors`}>
                Privacy Policy
              </a>
              <a href="https://www.hackerearth.com/terms-of-service" target="_blank" rel="noopener noreferrer" className={`${isDark ? "text-slate-400 hover:text-blue-400" : "text-gray-500 hover:text-blue-600"} text-sm transition-colors`}>
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;