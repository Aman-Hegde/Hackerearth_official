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
    <div className={`min-h-screen pt-24 pb-24 transition-colors duration-500 relative overflow-hidden ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <div className={`text-xl max-w-3xl mx-auto leading-relaxed h-8 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            <TypingAnime text="We're here to help. Let's connect." speed={50} />
          </div>
        </motion.div>

        {/* Contact Cards with Breathing Gradient Border */}
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
                className="group relative rounded-2xl text-center p-1" // Padding is on the inner div now
              >
                {/* FIX: Breathing gradient glow effect */}
                <div className={`absolute inset-0 z-0 rounded-2xl bg-gradient-to-br ${method.gradient} blur-lg animate-breathing-glow`} />
                
                {/* Card Content */}
                <div className={`relative z-10 rounded-[14px] p-6 transition-all duration-300 border backdrop-blur-sm h-full
                  ${isDark ? "bg-slate-800/60 border-slate-700/50" : "bg-white/60 border-gray-200/80"}
                `}>
                  <div className="flex justify-center mb-4">
                    <div className={`
                      w-14 h-14 rounded-full flex items-center justify-center
                      bg-gradient-to-br ${method.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110
                    `}>
                      {/* FIX: Icon size reduced for a more minimal look */}
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{method.title}</h3>
                  <a
                    href={method.href} target="_blank" rel="noopener noreferrer"
                    className={`font-medium transition-all duration-300 
                      ${isDark ? 'text-slate-400' : 'text-gray-600'}
                      group-hover:bg-gradient-to-r ${method.gradient} group-hover:bg-clip-text group-hover:text-transparent
                    `}
                  >
                    {method.contact}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Form and Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <img src={logo} alt="HackerEarth Logo" className="w-20 h-20 rounded-xl object-contain mb-6 drop-shadow-xl" />
            {/* FIX: Heading is now bold and white in dark mode */}
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Reach Out Directly
            </h2>
            <p className={`text-lg mb-8 leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Have a specific question or proposal? Fill out the form, and a member of our team will get back to you as soon as possible.
            </p>
          </motion.div>

          {/* Right Side Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            // FIX: Padding increased from p-8 to p-10
            className={`rounded-2xl p-10 border backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'}`}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;