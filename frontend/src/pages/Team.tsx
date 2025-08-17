import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Team = () => {
  const { isDark } = useTheme();
  const teamMembers = [
    {
      name: "Vishnu Prasad",
      position: "Team Lead",
      image: "public/images/wallpaperflare.com_wallpaper (1).jpg",
      skills: ["React Native", "Flutter", "iOS", "Android"],
      slogan: "Turning coffee into apps ☕📱"
    },
    {
      name: "Anish Bhat",
      position: "Co-Web",
      image: "public/images/wallpaperflare.com_wallpaper (1).jpg",
      skills: ["React", "Node", "CPP", "JS"],
      slogan: "Breaking bugs, building dreams 🐛✨"
    }
  ];

  const executives = [
    {
      name: "Shamaak",
      position: "Team Member",
      bio: "Computer Science student passionate about full-stack development and open source.",
      image: "public/images/wallpaperflare.com_wallpaper (1).jpg",
      skills: ["JavaScript", "React", "Node.js", "Python"],
      slogan: "Code. Build. Inspire.",
      github: "shamaak",
      linkedin: "shamaak-dev",
      email: "shamaak@hackerearth.edu"
    }
  ];

  return (
    <div
      className={`min-h-screen py-20 transition-colors duration-500 ${
        isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Meet Our Team
          </h1>
          <p
            className={`text-xl max-w-2xl mx-auto ${
              isDark ? 'text-slate-400' : 'text-gray-600'
            }`}
          >
            Passionate individuals driving innovation and fostering a collaborative learning environment.
          </p>
        </div>

        {/* Team Leads (moved to top) */}
        <div className="mb-16">
          <h2
            className={`text-3xl font-bold mb-8 text-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Team Leads
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden max-w-sm mx-auto
                ${isDark ? 'bg-slate-800/60' : 'bg-white'}`}
              >
                <div className="relative group aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-semibold mb-3">{member.slogan}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-blue-500/80 text-white text-xs px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3
                    className={`text-xl font-semibold mb-1 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {member.name}
                  </h3>
                  <p className="text-blue-500 font-medium mb-4">
                    {member.position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members (moved below leads) */}
        <div className="mb-16">
          <h2
            className={`text-3xl font-bold mb-8 text-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Team Members
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
            {executives.map((member, index) => (
              <div
                key={index}
                className={`rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden max-w-sm mx-auto
                ${isDark ? 'bg-slate-800/60' : 'bg-white'}`}
              >
                <div className="relative group aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-semibold mb-3">{member.slogan}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-blue-500/80 text-white text-xs px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3
                    className={`text-xl font-semibold mb-1 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {member.name}
                  </h3>
                  <p className="text-blue-500 font-medium mb-3">
                    {member.position}
                  </p>
                  <p
                    className={`text-sm mb-4 ${
                      isDark ? 'text-slate-400' : 'text-gray-600'
                    }`}
                  >
                    {member.bio}
                  </p>
                  <div className="flex space-x-3">
                    <a
                      href={`https://github.com/${member.github}`}
                      className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://linkedin.com/in/${member.linkedin}`}
                      className={`${isDark ? 'text-slate-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className={`${isDark ? 'text-slate-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} transition-colors`}
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join Our Team */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Join Our Team?</h2>
          <p className="text-xl mb-6">
            We're always looking for passionate individuals to join our community.
          </p>
          <button
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Team;
