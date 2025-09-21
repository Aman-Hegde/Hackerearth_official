import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from "framer-motion";

function SubmitButton({ isSubmitting }) {
  return (
    <motion.button
      type="submit"
      disabled={isSubmitting}
      whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
      whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
      className="w-full sm:w-auto px-8 py-3 rounded-full font-semibold text-white
        bg-gradient-to-r from-blue-500 to-purple-500
        hover:shadow-lg hover:shadow-blue-500/30 transition-shadow duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      {isSubmitting ? 'Sending...' : 'Send Message'}
    </motion.button>
  );
}

export function ContactForm() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');

    // --- In a real app, you would make an API call here ---
    // try {
    //   const response = await fetch('/api/send-email', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData),
    //   });
    //   if (!response.ok) throw new Error('Network response was not ok.');
    //   setStatusMessage('Success! Your message has been sent.');
    //   setFormData({ email: '', message: '' }); // Clear form
    // } catch (error) {
    //   setStatusMessage('Error: Failed to send message.');
    // } finally {
    //   setIsSubmitting(false);
    // }

    // --- Simulating API call for demonstration ---
    setTimeout(() => {
      console.log("Form Data Submitted:", formData);
      setStatusMessage("Success! Your message has been sent.");
      setFormData({ email: '', message: '' }); // Clear form
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
          Your Email
        </label>
        <input
          type="email" id="email" name="email" required
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
            ${isDark
              ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
              : 'bg-white/60 border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
        />
      </div>

      <div>
        <label htmlFor="message" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
          How can we help?
        </label>
        <textarea
          id="message" name="message" required rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message..."
          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors
            ${isDark
              ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
              : 'bg-white/60 border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <SubmitButton isSubmitting={isSubmitting} />
        <div className="flex items-center gap-2 text-xs text-gray-500">
          
        </div>
      </div>
      
      {statusMessage && (
        <p className={`text-sm text-center ${statusMessage.includes('Success') ? 'text-green-500' : 'text-red-500'}`}>
          {statusMessage}
        </p>
      )}
    </form>
  )
}