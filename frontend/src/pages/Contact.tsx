import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, Building } from 'lucide-react';
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

  const officeHours = [
    { day: "Monday", hours: "2:00 PM - 8:00 PM" },
    { day: "Tuesday", hours: "2:00 PM - 8:00 PM" },
    { day: "Wednesday", hours: "2:00 PM - 8:00 PM" },
    { day: "Thursday", hours: "2:00 PM - 8:00 PM" },
    { day: "Friday", hours: "2:00 PM - 8:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" }
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
                <div className={`w-20 h-20 bg-gradient-to-r ${method.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{method.title}</h3>
                <p className="mb-6 leading-relaxed">{method.description}</p>
                <p className="font-semibold text-lg text-blue-400">{method.contact}</p>
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

          {/* Office Hours & Extra Info */}
          <div className="space-y-8">
            <div className={`${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white/80 border-gray-200/50'} backdrop-blur-sm border rounded-3xl p-8 shadow-xl`}>
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Office Hours</h2>
              </div>
              <div className="space-y-3">
                {officeHours.map((o, idx) => (
                  <div key={idx} className={`flex justify-between border-b last:border-b-0 ${isDark ? 'border-slate-700' : 'border-gray-200'} py-3`}>
                    <span className={`${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{o.day}</span>
                    <span className={`${o.hours === 'Closed' ? 'text-red-400' : 'text-green-400'}`}>{o.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white/80 border-gray-200/50'} backdrop-blur-sm border rounded-3xl p-8 shadow-xl`}>
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Information</h3>
              </div>
              {/* Quick info cards */}
              <div className="space-y-4">
                {[
                  { title: 'Response Time', desc: 'We typically respond within 24 hours' },
                  { title: 'Meeting Location', desc: 'Room 301, CS Building, NMAMIT' },
                  { title: 'Weekly Meetings', desc: 'Every Friday at 6:00 PM' },
                  { title: 'Membership', desc: 'Open to all NMAMIT students, free registration' }
                ].map((info, i) => (
                  <div key={i} className={`${isDark ? 'bg-slate-700 border-slate-600' : 'bg-blue-50 border border-blue-200'} rounded-2xl p-4`}>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{info.title}</h4>
                    <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'} text-sm`}>{info.desc}</p>
                  </div>
                ))}
              </div>
            </div>
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
