import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import logo from '../assets/image.png'; // Ensure path is correct
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom'; // Use Link for internal navigation

const Footer = () => {
  const { isDark } = useTheme();

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/hackerearth_nmamit/?hl=en", label: "Instagram" },
    { icon: Github, href: "https://github.com/HackerearthHubNmamit", label: "GitHub" },
    { icon: Linkedin, href: "https://in.linkedin.com/company/hackerearth-hub-nmamit", label: "LinkedIn" },
    { icon: Twitter, href: "https://x.com/NHackerearth", label: "Twitter" }
  ];

  const quickLinks = ["Events", "Team", "Domains", "About", "Contact"];

  return (
    <footer className={`relative overflow-hidden border-t ${isDark ? "bg-black/50 border-white/10" : "bg-gray-50 border-gray-200"}`}>
      
      {/* Background Text Element */}
      <div className={`absolute -bottom-20 left-0 select-none pointer-events-none z-0 opacity-50 
        ${isDark ? "text-gray-900" : "text-gray-200"}`}
        style={{ fontSize: 'clamp(9rem, 22vw, 15.5rem)', fontWeight: '1000' }}
      >
        HackerEarth
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* RESTRUCTURED GRID: 3 columns for Brand, Links, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          
          {/* Column 1: Brand & Logo */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-4 mb-4">
              <img 
                src={logo} 
                alt="HackerEarth Logo" 
                className="w-16 h-12 rounded-lg object-cover"
              />
              <span className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                HackerEarth
              </span>
            </div>
            <p className={`text-sm max-w-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              The premier tech club of NMAMIT, under Department of Counselling and Welfare - Abhyuday Fostering innovation and competitive programming skills.
            </p>
          </div>

          {/* Column 2: Quick Links (Centered on all screen sizes) */}
          <div className="flex flex-col items-center">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className={`transition-colors duration-300 text-sm ${isDark ? "text-gray-400 hover:text-blue-400" : "text-gray-600 hover:text-blue-600"}`}
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Contact Info
            </h3>
            <div className="space-y-4 text-sm">
              <a href="mailto:Hackerearth.Nmamit@Nitte.edu.in" className="flex items-center gap-3 group">
                <Mail className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                <span className={`group-hover:underline ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  hackerearth@nmamit.in
                </span>
              </a>
              <a href="https://www.google.com/maps/place/Nitte+Mahalinga+Adyantaya+Memorial+Institute+of+Technology" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <MapPin className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                <span className={`group-hover:underline ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  NMAMIT, Nitte College
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section (Centered Copyright & Socials) */}
        <div className={`mt-16 pt-8 ${isDark ? "border-gray-800" : "border-gray-200"} flex flex-col sm:flex-row justify-between items-center gap-4`}>
          <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}>
            © {new Date().getFullYear()} HackerEarth Club, NMAMIT. All rights reserved.
          </p>
          <div className="flex space-x-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all duration-300 ${isDark ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;