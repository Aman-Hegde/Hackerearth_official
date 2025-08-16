import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  const events = [
    {
      id: 1,
      title: 'Web Development Workshop',
      description: 'Learn modern web development with React, Node.js, and MongoDB',
      date: '2024-02-15',
      time: '10:00 AM - 4:00 PM',
      location: 'Computer Lab A',
      capacity: 30,
      registered: 23,
      type: 'Workshop',
      tags: ['React', 'Node.js', 'MongoDB'],
    },
    {
      id: 2,
      title: 'AI/ML Hackathon',
      description:
        '48-hour hackathon focused on artificial intelligence and machine learning solutions',
      date: '2024-02-20',
      time: '9:00 AM - 9:00 AM (+2 days)',
      location: 'Main Auditorium',
      capacity: 100,
      registered: 87,
      type: 'Hackathon',
      tags: ['AI', 'ML', 'Python', 'TensorFlow'],
    },
    {
      id: 3,
      title: 'Cybersecurity Seminar',
      description:
        'Understanding modern cybersecurity threats and prevention strategies',
      date: '2024-02-25',
      time: '2:00 PM - 5:00 PM',
      location: 'Conference Room B',
      capacity: 50,
      registered: 42,
      type: 'Seminar',
      tags: ['Cybersecurity', 'Ethical Hacking', 'Network Security'],
    },
    {
      id: 4,
      title: 'Mobile App Development',
      description: 'Build cross-platform mobile apps with React Native and Flutter',
      date: '2024-03-01',
      time: '10:00 AM - 6:00 PM',
      location: 'Computer Lab B',
      capacity: 25,
      registered: 18,
      type: 'Workshop',
      tags: ['React Native', 'Flutter', 'Mobile Development'],
    },
    {
      id: 5,
      title: 'Open Source Contribution',
      description:
        'Learn how to contribute to open source projects and build your portfolio',
      date: '2024-03-05',
      time: '11:00 AM - 3:00 PM',
      location: 'Library Hall',
      capacity: 40,
      registered: 31,
      type: 'Workshop',
      tags: ['Git', 'GitHub', 'Open Source'],
    },
    {
      id: 6,
      title: 'Tech Talk: Industry Insights',
      description: 'Senior developers from top tech companies share their experiences',
      date: '2024-03-10',
      time: '3:00 PM - 5:00 PM',
      location: 'Main Auditorium',
      capacity: 200,
      registered: 156,
      type: 'Talk',
      tags: ['Industry', 'Career', 'Networking'],
    },
  ];

  const handleRegister = (eventId: number) => {
    setSelectedEvent(eventId);
    alert(`Registration for event ${eventId} would be processed here!`);
};

const getTypeColor = (type: string) => {
    if (isDark) {
    switch (type) {
      case 'Workshop':
        return 'bg-blue-900/30 text-blue-300';
      case 'Hackathon':
        return 'bg-green-900/30 text-green-300';
      case 'Seminar':
        return 'bg-purple-900/30 text-purple-300';
      case 'Talk':
        return 'bg-orange-900/30 text-orange-300';
      default:
        return 'bg-gray-800/50 text-gray-300';
    }
  } else {
    switch (type) {
      case 'Workshop':
        return 'bg-blue-100 text-blue-800';
      case 'Hackathon':
        return 'bg-green-100 text-green-800';
      case 'Seminar':
        return 'bg-purple-100 text-purple-800';
      case 'Talk':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
};

  return (
    <div
      className={`min-h-screen py-20 transition-colors duration-500 ${
        isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Upcoming Events
          </h1>
          <p
            className={`text-xl max-w-2xl mx-auto ${
              isDark ? 'text-slate-400' : 'text-gray-600'
            }`}
          >
            Join our workshops, hackathons, and seminars to enhance your skills
            and network with fellow developers.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              data-aos="fade-up"
              data-aos-delay={event.id * 100}
              className={`group relative overflow-hidden rounded-2xl border ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
              } shadow-lg transition-shadow duration-500 ease-in-out transform-gpu hover:shadow-2xl hover:scale-[1.03]`}
            >
              {/* Top gradient bar/accent */}
              <div
                className={`absolute top-0 left-0 w-full h-2
                  ${
                    event.type === 'Workshop'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      : ''
                  }
                  ${
                    event.type === 'Hackathon'
                      ? 'bg-gradient-to-r from-green-500 to-blue-500'
                      : ''
                  }
                  ${
                    event.type === 'Seminar'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : ''
                  }
                  ${
                    event.type === 'Talk'
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                      : ''
                  }
                  rounded-t-2xl`}
              />

              <div className="p-7 flex flex-col h-full">
                {/* Event type & date */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow
                      ${getTypeColor(event.type)} uppercase tracking-wide`}
                  >
                    {event.type}
                  </span>
                  <span className="ml-2 text-xs font-semibold bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-300 px-2 py-1 rounded shadow">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-2 text-base md:text-lg font-semibold leading-6 mb-1 group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="mb-3 text-sm line-clamp-3 text-gray-500 dark:text-gray-300">
                  {event.description}
                </p>

                {/* Details */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-gray-500 mb-5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {event.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {event.registered}/{event.capacity}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {event.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs py-1 px-2 rounded bg-blue-50 text-blue-700 dark:bg-slate-700 dark:text-blue-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Register Button */}
                <button
                  onClick={() => handleRegister(event.id)}
                  disabled={event.registered >= event.capacity}
                  className={`mt-auto py-2 rounded-lg w-full font-semibold flex items-center justify-center gap-2 transition focus:ring-2
                      ${
                        event.registered >= event.capacity
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:from-blue-700 hover:to-indigo-700'
                      }`}
                >
                  {event.registered >= event.capacity ? 'Event Full' : 'Register Now'}
                  {event.registered < event.capacity && (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Registration Info */}
        <div
          className={`mt-12 rounded-xl p-8 ${
            isDark ? 'bg-slate-800/60 text-slate-300' : 'bg-blue-50 text-gray-900'
          }`}
          data-aos="fade-up"
          data-aos-delay={700}
        >
          <h2 className="text-2xl font-bold mb-4">Event Registration Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">How to Register</h3>
              <ul className="space-y-1">
                <li>• Click "Register Now" on any event</li>
                <li>• Fill out the registration form</li>
                <li>• Receive confirmation email</li>
                <li>• Attend the event on time</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Important Notes</h3>
              <ul className="space-y-1">
                <li>• All events are free for members</li>
                <li>• Bring your student ID</li>
                <li>• Laptops required for workshops</li>
                <li>• Certificates will be provided</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
