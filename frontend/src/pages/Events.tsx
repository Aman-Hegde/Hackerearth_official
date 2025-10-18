import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Loader from '../components/Loader';

const pastEvents = [
  {
    id: 1,
    title: "MindMesh 2025",
    date: "2025-10-11",
    image: "/images/MindMesh.jpeg",
    gradient: "from-green-500 to-teal-500",
    link: "",
  },
  {
    id: 2,
    title: "Git & Github Workshop",
    date: "2025-09-06",
    image: "/images/workshop1.jpg",
    gradient: "from-purple-300 to-purple-600",
    link: "https://drive.google.com/drive/folders/1cKVk40LXLwJVtkqSQy5FfbbPWqI8zG7n",
  },
];

const EventCard = ({ event, index, isDark }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="rounded-2xl shadow-xl border border-white/10 overflow-hidden bg-gradient-to-br from-slate-900/70 via-purple-800/60 to-slate-800/80 mb-2">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
        <div className="px-5 py-5">
          <div className="flex items-center gap-2 text-sm text-white/80 mb-3 justify-center">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h3 className="text-center text-2xl font-bold text-white mb-6">{event.title}</h3>
          <div className="flex justify-center">
            <Link
              to={event.link}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold bg-gradient-to-r ${event.gradient} text-white shadow`}
              style={{ minWidth: 150 }}
            >
              View Highlights
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg"
    >
      <img
        src={event.image}
        alt={event.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="relative z-10 flex h-full flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-6">{event.title}</h3>
        <button className="group/button relative inline-flex items-center gap-2 text-base font-semibold">
          <Link to={event.link} className={`bg-gradient-to-r ${event.gradient} bg-clip-text text-transparent`}>
            View Highlights
          </Link>
          <ArrowRight className={`w-4 h-4 bg-gradient-to-r ${event.gradient} bg-clip-text text-transparent transition-transform group-hover/button:translate-x-1`} />
          <span className={`absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r ${event.gradient} transition-all duration-300 group-hover/button:w-full`} />
        </button>
      </div>
    </motion.div>
  );
};
const Events = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  if (loading) {
    return (
      <div className={`flex flex-col justify-center items-center min-h-screen ${isDark ? "bg-black text-white" : "bg-slate-50 text-gray-900"}`}>
        <Loader size={80} />
        <p className="mt-4 text-lg font-medium">Loading Events...</p>
      </div>
    );
  }

  return (
    <div className={`transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center">
              <button
                type="button"
                className="group relative z-[60] mx-auto rounded-full border px-7 py-2 text-xl backdrop-blur transition-all duration-300 hover:shadow-xl md:text-sm"
                style={{
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                }}
              >
                <span className={`relative ${isDark ? "text-white" : "text-gray-900"}`}>Past Events</span>
              </button>
            </div>
            <h2 className={`mt-7 text-4xl text-center font-semibold tracking-tight md:text-[56px] ${isDark ? "bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent" : "text-gray-900"}`}>
              Recent Events
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} isDark={isDark} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Events;
