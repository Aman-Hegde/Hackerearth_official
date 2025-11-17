import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import emailjs from 'emailjs-com';

export function ContactForm() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const form = useRef<HTMLFormElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      setStatusMessage("Success! Your message has been sent.")
      setFormData({name:'', email:'',message:''});
    })
    .catch(() => {
      setStatusMessage("Failed to send Message! Try again.")
    })
    .finally(()=>{
      setIsSubmitting(false);
    })
  };

  return (
    <form ref={form} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
          Your name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="What's your good name?"
          className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 focus:outline-none ${
            isDark
              ? 'border border-gray-700 bg-black text-white placeholder-gray-500 focus:border-gray-500'
              : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-gray-500'
          }`}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
          Your email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="What's your email address?"
          className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 focus:outline-none ${
            isDark
              ? 'border border-gray-700 bg-black text-white placeholder-gray-500 focus:border-gray-500'
              : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-gray-500'
          }`}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
          Your message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="How can we help you?"
          rows={5}
          className={`w-full px-4 py-3 rounded-lg transition-colors duration-300 resize-none focus:outline-none ${
            isDark
              ? 'border border-gray-700 bg-black text-white placeholder-gray-500 focus:border-gray-500'
              : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-gray-500'
          }`}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full px-6 py-3 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
          isDark
            ? 'bg-white text-black hover:bg-gray-200'
            : 'bg-gray-900 text-white hover:bg-gray-700'
        }`}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>

      {statusMessage && (
        <p className={`text-sm text-center ${statusMessage.includes('Success') ? 'text-green-500' : 'text-red-500'}`}>
          {statusMessage}
        </p>
      )}
    </form>
  );
}