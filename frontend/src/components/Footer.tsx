"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram } from "lucide-react";
import logo from "../assets/image.png";
import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const { isDark } = useTheme();
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const nearBottom = scrollTop + windowHeight >= documentHeight - 100;
          setIsAtBottom(nearBottom);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isAtBottom) return null; // ✅ Only render near bottom

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
    <motion.footer
      className={`w-full transition-colors duration-400
        ${isDark ? "bg-black border-t border-slate-700" : "bg-white border-t border-gray-200"}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-1 md:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-6">
              <img
                src={logo}
                alt="HackerEarth Logo"
                className="mt-2 mb-2 w-20 h-14 rounded-full object-cover drop-shadow-xl border"
              />
              <span
                className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent 
                ${isDark ? "from-white to-slate-300" : "from-gray-900 to-gray-700"}`}
              >
                HackerEarth
              </span>
            </div>
            <p
              className={`mb-6 leading-relaxed max-w-md ${
                isDark ? "text-slate-400" : "text-gray-600"
              }`}
            >
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
                    aria-label={social.label}
                    className={`group w-12 h-12 bg-gradient-to-r rounded-xl flex items-center justify-center border shadow-md transition-all duration-300 hover:scale-110
                      ${
                        isDark
                          ? "from-slate-800 to-slate-700 border-slate-700 hover:from-blue-600 hover:to-indigo-800 hover:border-blue-600"
                          : "from-gray-100 to-gray-200 border-gray-200 hover:from-blue-500 hover:to-indigo-600 hover:border-blue-500"
                      }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors
                      ${
                        isDark
                          ? "text-slate-200 group-hover:text-white"
                          : "text-gray-600 group-hover:text-white"
                      }`}
                    />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3
              className={`text-lg font-semibold mb-6 ${
                isDark ? "text-slate-100" : "text-gray-900"
              }`}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className={`transition-colors duration-300 flex items-center space-x-2 group
                      ${
                        isDark
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
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* contact info block goes here */}
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`border-t mt-12 pt-8 ${
            isDark ? "border-slate-700" : "border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p
              className={`${
                isDark ? "text-slate-400" : "text-gray-500"
              } text-sm`}
            >
              © 2025 HackerEarth Club, NMAMIT. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="https://www.hackerearth.com/privacy"
                className={`${
                  isDark
                    ? "text-slate-400 hover:text-blue-400"
                    : "text-gray-500 hover:text-blue-600"
                } text-sm`}
              >
                Privacy Policy
              </a>
              <a
                href="https://www.hackerearth.com/terms-of-service"
                className={`${
                  isDark
                    ? "text-slate-400 hover:text-blue-400"
                    : "text-gray-500 hover:text-blue-600"
                } text-sm`}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
