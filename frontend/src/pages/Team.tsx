import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Team = () => {
  const { isDark } = useTheme();

  const executives = [
    {
      name: "Shamaak",
      position: "Team Member",
      bio: "Computer Science student passionate about full-stack development and open source.",
      image: "/src/assets/image.png",
      skills: ["JavaScript", "React", "Node.js", "Python"],
      github: "shamaak",
      linkedin: "shamaak-dev",
      email: "shamaak@hackerearth.edu"
    }
  ];

  const teamMembers = [
    {
      name: "Vishnu Prasad",
      position: "Team Lead",
      image: "/src/assets/image.png",
      skills: ["React Native", "Flutter", "iOS", "Android"]
    },
    {
      name: "Anish Bhat",
      position: "Co-Web",
      image: "/src/assets/image.png",
      skills: ["React", "Node", "CPP", "JS"]
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

        {/* Team Members */}
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
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
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

                  <div className="flex flex-wrap gap-1 mb-4">
                    {member.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className={`px-2 py-1 text-xs rounded-full ${
                          isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

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

        {/* Team Leads */}
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
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
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

                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className={`px-2 py-1 text-xs rounded-full ${
                          isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
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
