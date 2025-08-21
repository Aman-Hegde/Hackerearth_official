import { Code2, Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import logo from '../assets/image.png'
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
        ? "bg-slate-900 border-t border-slate-700"
        : "bg-white border-t border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img src={logo} alt="HackerEarth Logo" width={100} height={100}
                className="mt-2 mb-2 w-20 h-14 rounded-full object-cover drop-shadow-xl border" />
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
                    className={`group w-12 h-12 bg-gradient-to-r rounded-xl flex items-center justify-center border shadow-md transition-all duration-300 hover:scale-110
                      ${isDark
                        ? "from-slate-800 to-slate-700 border-slate-700 hover:from-blue-600 hover:to-indigo-800 hover:border-blue-600"
                        : "from-gray-100 to-gray-200 border-gray-200 hover:from-blue-500 hover:to-indigo-600 hover:border-blue-500"
                      }`}
                    aria-label={social.label}
                  >
                    <Icon className={`w-5 h-5 transition-colors
                      ${isDark ? "text-slate-200 group-hover:text-white"
                      : "text-gray-600 group-hover:text-white"}`} />
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
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
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
                <a
                  href="mailto:Hackerearth.Nmamit@Nitte.edu.in"
                  className={`w-10 h-10 bg-gradient-to-r rounded-lg flex items-center justify-center border transition-all duration-300
                    ${isDark
                      ? "from-blue-900 to-indigo-800 border-blue-900 group-hover:from-blue-700 group-hover:to-indigo-900 group-hover:border-blue-600"
                      : "from-blue-100 to-indigo-100 border-blue-200 group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:border-blue-500"
                    }`}
                  aria-label="Email"
                >
                  <Mail className={`w-5 h-5 transition-colors
                    ${isDark ? "text-blue-300 group-hover:text-white" : "text-blue-600 group-hover:text-white"}`} />
                </a>
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
                <a
                  href="tel:+917619545988"
                  className={`w-10 h-10 bg-gradient-to-r rounded-lg flex items-center justify-center border transition-all duration-300
                    ${isDark
                      ? "from-green-800 to-emerald-800 border-green-900 group-hover:from-green-700 group-hover:to-emerald-900 group-hover:border-green-500"
                      : "from-green-100 to-emerald-100 border-green-200 group-hover:from-green-500 group-hover:to-emerald-600 group-hover:border-green-500"
                    }`}
                  aria-label="Call"
                >
                  <Phone className={`w-5 h-5 transition-colors
                    ${isDark ? "text-green-300 group-hover:text-white" : "text-green-600 group-hover:text-white"}`} />
                </a>
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
                <a
                  href="https://www.google.com/maps/search/?api=1&query=NMAMIT+Nitte+College"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-gradient-to-r rounded-lg flex items-center justify-center border transition-all duration-300
                    ${isDark
                      ? "from-purple-900 to-pink-800 border-purple-900 group-hover:from-purple-700 group-hover:to-pink-900 group-hover:border-purple-600"
                      : "from-purple-100 to-pink-100 border-purple-200 group-hover:from-purple-500 group-hover:to-pink-600 group-hover:border-purple-500"
                    }`}
                  aria-label="Location"
                >
                  <MapPin className={`w-5 h-5 transition-colors
                    ${isDark ? "text-purple-300 group-hover:text-white" : "text-purple-600 group-hover:text-white"}`} />
                </a>
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
        <div className={`border-t mt-12 pt-8 transition-colors duration-300
          ${isDark ? "border-slate-700" : "border-gray-200"}`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`${isDark ? "text-slate-400" : "text-gray-500"} text-sm`}>
              © 2025 HackerEarth Club, NMAMIT. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="https://www.hackerearth.com/privacy" className={`${isDark ? "text-slate-400 hover:text-blue-400" : "text-gray-500 hover:text-blue-600"} text-sm transition-colors`}>
                Privacy Policy
              </a>
              <a href="https://www.hackerearth.com/terms-of-service" className={`${isDark ? "text-slate-400 hover:text-blue-400" : "text-gray-500 hover:text-blue-600"} text-sm transition-colors`}>
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
