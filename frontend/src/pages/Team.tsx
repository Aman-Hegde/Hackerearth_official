import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { TypingAnimation } from '../components/TypingAnimation';

const Team = () => {
  const { isDark } = useTheme();

  const teamMembers = [
    {
      name: "Shaamak M B",
      position: "President",
      image: "images/shaamak.jpg",
      skills: ["Ethical hacking ", "Cyber security"],
      slogan: "Curious Mind. Creative Heart",
      github: "https://github.com/Shaamak",
      linkedin: "https://www.linkedin.com/in/shaamak-madhwaraj-089a80307?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      email: "nnm23cb049@nmamit.in"
    },
    {
      name: "Shetty Vedanga Shivram",
      position: "Vice President",
      image: "public/images/wallpaperflare.com_wallpaper (1).jpg",
      skills: ["React", "Python", "Java"],
      slogan: "Living proof that Ctrl+Z saves lifes",
      github: "anish-github",
      linkedin: "anish-linkedin",
      email: "anish@hackerearth.edu"
    },
    {
      name: "Samrudh R Shetty",
      position: "Secretary",
      image: "images/samrudh.JPG",
      skills: [],
      slogan: "",
      github: "https://github.com/sammyrude",
      linkedin: "https://www.linkedin.com/in/samrudh-r-shetty-349315277/",
      email: "nnm23cs168@nmamit.in"
    },
    {
      name: "Pratham S Salian",
      position: "Tech Lead",
      image: "images/pratham.jpg",
      skills: ["Python","Java","MERN stack"],
      slogan: "Debugging today, Designing tomorrow ",
      github: "https://github.com/prathamssalian",
      linkedin: "https://www.linkedin.com/in/pratham-s-salian-33534328b/",
      email: "nnm23is137@nmamit.in"
    },
    {
      name: "Harshitha P Salian ",
      position: "Tech Lead",
      image: "images/harshita.jpg",
      skills: ["Python","Cybersecurity","Next JS"],
      slogan: "Finding doors where others see walls",
      github: "https://github.com/harshithaps11",
      linkedin: "http://www.linkedin.com/in/harshitha-p-s-163574288",
      email: "nnm23is076@nmamit.in"
    },
    {
      name: "K S Sujesh ",
      position: "Tech Lead",
      image: "images/sujesh.jpg",
      skills: ["Python","Machine Learning","Deep Learning"],
      slogan: "Solving tomorrow's problems, today",
      github: "https://github.com/kssujesh",
      linkedin: "https://www.linkedin.com/in/k-s-sujesh-5209702a7",
      email: "nnm23ad027@nmamit.in"
    },
     {
      name: "Aayush Kumar Sinha",
      position: "Tech Lead",
      image: "images/wallpaperflare.com_wallpaper (1).jpg",
      skills: [],
      slogan: "",
      github: "https://github.com/bitaayushsinha",
      linkedin: "https://www.linkedin.com/in/bitaayushsinha",
      email: "nnm23cs238@nmamit.in"
    },
    {
      name: "V Vishnu Prasad",
      position: "Web master",
      image: "images/vishnu.jpg",
      skills: ["Cloud Computing","MERN Stack","SEO"],
      slogan: "Eat-Sleep-Code-Repeat",
      github: "https://github.com/VishnuPrasad55",
      linkedin: "https://www.linkedin.com/in/vishnu-prasad-bb4755246/",
      email: "nnm22is202@nmamit.in"
    },

    {
      name: "Sam A Rodrigues",
      position: "Documentation Head",
      image: "images/sam.jpg",
      skills: ["Python","Arduino","Rust"],
      slogan: "Code smarter, not harder",
      github: "https://github.com/samrodrigues1",
      linkedin: "https://www.linkedin.com/in/sam-anthony-rodrigues-a670b32a7/",
      email: "nnm23ad027@nmamit.in"
    },
    {
      name: "Jeevan",
      position: "Social Media Head",
      image: "public/images/wallpaperflare.com_wallpaper (1).jpg",
      skills: [],
      slogan: "",
      github: "https://github.com/jeevanshetty131",
      linkedin: "https://www.linkedin.com/in/jeevan-shetty-9422a6317/",
      email: "nnm23cs254@nmamit.in"
    },
    {
      name: "H Bhoomika Shenoy",
      position: "Publicity Head",
      image: "images/bhoomika.JPG",
      skills: ["Python","C++","HTML"],
      slogan: "Born to code, forced to debug.",
      github: "",
      linkedin: "https://www.linkedin.com/in/bhoomika-shenoy-650733358?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      email: "nnm23is073@nmamit.in"
    },
  ];

  const executives = [
     {
      name: "Pallavi Pai",
      position: "Vice Secretary",
      image: "images/pallavi.jpg",
      skills: [],
      slogan: "",
      github: "https://github.com/pall111",
      linkedin: "https://www.linkedin.com/in/pallavi-pai-11346927b",
      email: "nnm23ad033@nmamit.in"
    },
    {
      name: "Vedant Suresh Mahalle",
      position: "Documentation Co-Head",
      image: "images/vedant.jpg",
      skills: ["ROS2","Java","Python"],
      slogan: "Designing bots, defining destiny",
      github: "https://github.com/Vedant10Mahalle",
      linkedin: "https://www.linkedin.com/in/vedant-mahalle-b217b4290?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      email: "nnm23ri031@nmamit.in"
    },
    {
      name: "Bindu R",
      position: "Publicity Co-Head",
      image: "images/bindu.jpg",
      skills: ["CSS","HTML"],
      slogan: "From Logic to Launch",
      github: "https://github.com/bindu",
      linkedin: "http://www.linkedin.com/in/bindu-r-a50339312",
      email: "nnm23ri013@nmamit.in"
    },
     {
      name: "Vidyalakshmi Kamath",
      position: "Publicity Member",
      image: "images/vijaya.jpg",
      skills: ["Python","C","C++"],
      slogan: "Dreaming in code, living in firewalls",
      github: "https://github.com/Vidya-kama-th",
      linkedin: "https://www.linkedin.com/in/vidyalakshmi-kamath-086311325?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      email: "nnm23cb067@nmamit.in"
    },
    {
      name: "Imaad Baig",
      position: "Publicity Member",
      image: "images/imaad.jpg",
      skills: ["React","UI/UX","Java"],
      slogan: "Now or never",
      github: "https://github.com/Imaad-Baig44",
      linkedin: "https://www.linkedin.com/in/imaad-baig-07a4a82aa?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      email: "nnm23cs253@nmamit.in"
    },
    {
      name: "K Vinayaka M Sharma",
      position: "Publicity Member",
      image: "images/vinayaka.jpg",
      skills: ["Python","MircosoftWord","PowerPoint"],
      slogan: "Teaching Simply, Reaching Many — Empowering Minds, One Lesson at a Time",
      github: "",
      linkedin: "https://www.linkedin.com/in/k-vinayaka-m-sharma-985a75350?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      email: "nnm22ee025@nmamit.in"
    },
  ];

  return (
    <div
      className={`min-h-screen py-20 transition-colors duration-500 ${
        isDark ? 'bg-black' : 'bg-slate-50'
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
            <TypingAnimation>Meet Our Team</TypingAnimation>
          </h1>
          <p
            className={`text-xl max-w-2xl mx-auto ${
              isDark ? 'text-slate-400' : 'text-gray-600'
            }`}
          >
            Passionate individuals driving innovation and fostering a collaborative learning environment.
          </p>
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
                  {/* Social Links */}
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
                  {/* Social Links */}
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
