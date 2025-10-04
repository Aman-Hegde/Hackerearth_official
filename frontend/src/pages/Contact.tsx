"use client" // This component uses client-side hooks and animations

import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { TypingAnime } from '../components/TypingAnime'; // Assuming you have this component
import { ContactForm } from './ContactForm'; // Assuming this is in a separate file
import logo from '../assets/image.png';

const Contact = () => {
  const { isDark } = useTheme();

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      contact: "hackerearth@nmamit.in",
      href: "mailto:hackerearth@nmamit.in",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      icon: Phone,
      title: "Call Us",
      contact: "+91 76195 45988",
      href: "tel:+917619545988",
      // FIX: Replaced green gradient with a theme-consistent one
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      contact: "Room 301, CS Building, NMAMIT",
      href: "https://www.google.com/maps/search/?api=1&query=Room+301+CS+Building+NMAMIT",
      gradient: "from-pink-500 to-red-500",
    }
  ];

  return (
    <div className={`min-h-screen pt-24 pb-24 transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h1 className={`text-4xl font-semibold tracking-tighter md:text-[54px] md:leading-[60px] pb-2 mb-4 ${
            isDark
              ? "bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent"
              : "text-gray-900"
          }`}>
            Get in Touch
          </h1>
          <div className={`text-xl max-w-3xl mx-auto leading-relaxed h-8 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            <TypingAnime text="We're here to help. Let's connect." speed={50} />
          </div>
        </motion.div>
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {contactMethods.map((method, i) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`flex items-center gap-3 p-4 rounded-lg transition-colors duration-300 ${
                  isDark 
                    ? 'border border-gray-800 hover:border-gray-700' 
                    : 'border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </div>
                <div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{method.title}</div>
                  <a
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} hover:underline`}
                  >
                    {method.contact}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Form and Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className={`text-3xl font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Get in Touch
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Have questions or ideas? Let's talk! We're always open to discussing new opportunities.
              </p>
            </div>

            <div className={`rounded-xl p-6 sm:p-8 ${
              isDark ? 'border border-gray-800' : 'border border-gray-200'
            }`}>
              <ContactForm />
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className={`text-xl font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Let's Connect
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Prefer other ways to reach out? Here's how you can connect with us.
              </p>
            </div>

            <div className="space-y-4">
              <div className={`flex items-center gap-3 p-4 rounded-lg transition-colors duration-300 ${
                isDark 
                  ? 'border border-gray-800 hover:border-gray-700' 
                  : 'border border-gray-200 hover:border-gray-300'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <Mail className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </div>
                <div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Email</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    hackerearth@nmamit.in
                  </div>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-4 rounded-lg transition-colors duration-300 ${
                isDark 
                  ? 'border border-gray-800 hover:border-gray-700' 
                  : 'border border-gray-200 hover:border-gray-300'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <Phone className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </div>
                <div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Phone</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    +91 76195 45988
                  </div>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-4 rounded-lg transition-colors duration-300 ${
                isDark 
                  ? 'border border-gray-800 hover:border-gray-700' 
                  : 'border border-gray-200 hover:border-gray-300'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <MapPin className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </div>
                <div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Visit Us</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Room 301, CS Building, NMAMIT
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;