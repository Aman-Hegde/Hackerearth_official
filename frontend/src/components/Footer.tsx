import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
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

  return (
    <footer className={`relative overflow-hidden ${isDark ? "bg-black" : "bg-gray-50"}`}>
      {/* Large HackerEarth Text Background */}
      <div className={`absolute -bottom-24 -left-10 select-none pointer-events-none z-0 
        ${isDark ? "text-gray-900" : "text-gray-200"}`}
        style={{ fontSize: 'clamp(6rem, 20vw, 16rem)', fontWeight: '900' }}
      >
        HackerEarth
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <img 
                src={logo} 
                alt="HackerEarth Logo" 
                className="w-16 h-12 rounded-lg object-cover"
              />
              <span className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                HackerEarth
              </span>
            </div>
            <p className={`mb-6 leading-relaxed max-w-md 
              ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              We are a Tech Club which is at service to strengthen your Coding
              Skills and hence a medium to take leap into the field of Competitive
              Programming.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all duration-300
                      ${isDark 
                        ? "text-gray-400 hover:text-white hover:bg-gray-800" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-semibold mb-4
              ${isDark ? "text-white" : "text-gray-900"}`}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["Events", "Team", "Domains", "Achievements"].map((link, index) => (
                <li key={index}>
                  <a
                    href={`/${link.toLowerCase()}`}
                    className={`transition-colors duration-300
                      ${isDark 
                        ? "text-gray-400 hover:text-blue-400" 
                        : "text-gray-600 hover:text-blue-600"
                      }`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`text-lg font-semibold mb-4
              ${isDark ? "text-white" : "text-gray-900"}`}>
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className={`w-5 h-5 mt-1 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                <div>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Email</p>
                  <a
                    href="mailto:Hackerearth.Nmamit@Nitte.edu.in"
                    className={`font-medium hover:underline ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    hackerearth@nmamit.in
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className={`w-5 h-5 mt-1 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                <div>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Phone</p>
                  <a
                    href="tel:+917619545988"
                    className={`font-medium hover:underline ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    +91 76195 45988
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className={`w-5 h-5 mt-1 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                <div>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Location</p>
                  <a
                    href="https://www.google.com/maps/place/Nitte+Mahalinga+Adyantaya+Memorial+Institute+of+Technology"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-medium hover:underline ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    NMAMIT, Nitte College
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center
          ${isDark ? "border-gray-800" : "border-gray-200"}`}>
          <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}>
            © 2025 HackerEarth Club, NMAMIT. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="https://www.hackerearth.com/privacy" 
              className={`text-sm transition-colors hover:underline
                ${isDark ? "text-gray-500 hover:text-blue-400" : "text-gray-600 hover:text-blue-600"}`}
            >
              Privacy Policy
            </a>
            <a 
              href="https://www.hackerearth.com/terms-of-service" 
              className={`text-sm transition-colors hover:underline
                ${isDark ? "text-gray-500 hover:text-blue-400" : "text-gray-600 hover:text-blue-600"}`}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;