import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, Building } from 'lucide-react';
import logo from '../assets/image.png'
import { TypingAnime } from '../components/TypingAnime';
import { useTheme } from '../context/ThemeContext';

const Contact = () => {
  const { isDark } = useTheme();
  interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
  }
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };




  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email and we'll respond within 24 hours",
      contact: "hackerearth@nmamit.in",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our team members",
      contact: "+91 76195 45988",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come to our office during office hours",
      contact: "Room 301, CS Building, NMAMIT",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-500 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'}`}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`${isDark ? 'bg-blue-900/20' : 'bg-blue-400/10'} absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl`}></div>
        <div className={`${isDark ? 'bg-purple-900/20' : 'bg-purple-400/10'} absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className={`inline-flex items-center space-x-2 backdrop-blur-sm border rounded-full px-6 py-3 mb-8 shadow-lg ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-slate-300' : 'bg-white/80 border-gray-200/50 text-gray-700'}`}>
            <MessageCircle className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className="font-medium">Get in Touch</span>
          </div>
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Contact Us
          </h1>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Have questions about our club, events, or want to join us? We'd love to hear from you!
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {contactMethods.map((method, i) => {
            const Icon = method.icon;
            return (
              <div key={i} className={`${isDark ? 'bg-slate-800/80 border-slate-700/50 text-slate-300' : 'bg-white/80 border-gray-200/50 text-gray-800'} backdrop-blur-sm border rounded-3xl p-8 text-center hover:scale-105 transition duration-300 shadow-xl animate-bounce-in`}
                style={{ animationDelay: `${i * 200}ms` }}>
                {method.title === "Email Us" ? (
                  <a
                    href="mailto:Hackerearth.Nmamit@Nitte.edu.in"
                    className={`w-20 h-20 bg-gradient-to-r ${method.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group`}
                    aria-label="Send Email"
                  >
                    <Mail className="w-10 h-10 text-white group-hover:text-blue-200 transition-colors" />
                  </a>
                ) : method.title === "Call Us" ? (
                  <a
                    href="tel:+917619545988"
                    className={`w-20 h-20 bg-gradient-to-r ${method.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group`}
                    aria-label="Call"
                  >
                    <Phone className="w-10 h-10 text-white group-hover:text-green-200 transition-colors" />
                  </a>
                ) : method.title === "Visit Us" ? (
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Room+301+CS+Building+NMAMIT"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-20 h-20 bg-gradient-to-r ${method.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group`}
                    aria-label="Find Location"
                  >
                    <MapPin className="w-10 h-10 text-white group-hover:text-pink-200 transition-colors" />
                  </a>
                ) : (
                  <div className={`w-20 h-20 bg-gradient-to-r ${method.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                )}
                <h3 className="text-2xl font-semibold mb-4">{method.title}</h3>
                <p className="mb-6 leading-relaxed">{method.description}</p>
                {method.title === "Email Us" ? (
                  <a
                    href="mailto:Hackerearth.Nmamit@Nitte.edu.in"
                    className="font-semibold text-lg text-blue-400 hover:underline"
                  >
                    hackerearth@nmamit.in
                  </a>
                ) : method.title === "Call Us" ? (
                  <a
                    href="tel:+917619545988"
                    className="font-semibold text-lg text-green-400 hover:underline"
                  >
                    +91 76195 45988
                  </a>
                ) : method.title === "Visit Us" ? (
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Room+301+CS+Building+NMAMIT"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-lg text-pink-400 hover:underline"
                  >
                    Room 301, CS Building, NMAMIT
                  </a>
                ) : (
                  <p className="font-semibold text-lg text-blue-400">{method.contact}</p>
                )}

              </div>
            );
          })}
        </div>

        {/* Form and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <div className={`${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white/80 border-gray-200/50'} backdrop-blur-sm border rounded-3xl p-8 shadow-xl`}>
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Send us a Message</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {(['name', 'email', 'subject'] as (keyof ContactFormData)[]).map((field, idx) => (
                <div key={idx}>
                  <label
                    htmlFor={field}
                    className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    id={field}
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={formData[field]}  // ✅ TS now knows field is a valid key
                    onChange={handleChange}
                    required
                    placeholder={field === 'email' ? 'you@example.com' : ''}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${isDark
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="message" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6}
                  placeholder="Tell us more..."
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-400'}`} />
              </div>
              <button type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-300 hover:scale-105 shadow-lg flex items-center justify-center space-x-2">
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <img src={logo} alt="HackerEarth Logo" width={100} height={100}
              className="w-24 h-20 rounded-xl object-contain mb-6 drop-shadow-xl" />
            <h1 className="text-5xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white text-center">
              <TypingAnime text="HackerEarth" speed={80} className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent" />
            </h1>
            <p className="text-2xl text-slate-700 dark:text-slate-200 font-medium mb-8 text-center">NMAMIT Tech Club</p>
          </div>
        </div>

        {/* FAQ */}
        <div className={`${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white/80 border-gray-200/50'} backdrop-blur-sm border rounded-3xl p-12 shadow-xl`}>
          <h2 className={`text-4xl font-bold mb-12 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Frequently Asked Questions</h2>
          {/* Map FAQs here, applying similar text/border conditional classes */}
        </div>
      </div>
    </div>
  );
};

export default Contact;
