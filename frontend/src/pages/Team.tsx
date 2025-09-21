"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// --- Animation Variants ---
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

// --- COMPLETE TEAM DATA ---
const teamMembers = [
    {
      name: "Shaamak M B",
      position: "President",
      image: "/images/shaamak.jpg",
      skills: ["Ethical Hacking", "Cyber Security"],
      slogan: "Curious Mind. Creative Heart.",
      github: "https://github.com/Shaamak",
      linkedin: "https://www.linkedin.com/in/shaamak-madhwaraj-089a80307",
      email: "nnm23cb049@nmamit.in",
      gradient: "from-sky-500 to-indigo-500"
    },
    {
      name: "Vedang Shetty",
      position: "Vice President",
      image: "/images/vedanga.jpg", // Replace with actual image
      skills: ["React", "Python", "Java"],
      slogan: "Living proof that Ctrl+Z saves lives.",
      github: "https://github.com/your-github", // Replace
      linkedin: "https://linkedin.com/in/your-linkedin", // Replace
      email: "anish@hackerearth.edu",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Samrudh R Shetty",
      position: "Secretary",
      image: "/images/samrudh.JPG",
      skills: ["Web Dev", "Leadership"],
      slogan: "Building connections, one line of code at a time.",
      github: "https://github.com/sammyrude",
      linkedin: "https://www.linkedin.com/in/samrudh-r-shetty-349315277/",
      email: "nnm23cs168@nmamit.in",
      gradient: "from-emerald-500 to-green-500"
    },
    {
      name: "Pratham S Salian",
      position: "Tech Lead",
      image: "/images/pratham.jpg",
      skills: ["Python","Java","MERN Stack"],
      slogan: "Debugging today, designing tomorrow.",
      github: "https://github.com/prathamssalian",
      linkedin: "https://www.linkedin.com/in/pratham-s-salian-33534328b/",
      email: "nnm23is137@nmamit.in",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Harshitha P Salian ",
      position: "Tech Lead",
      image: "/images/harshita.jpg",
      skills: ["Python","Cybersecurity","Next.js"],
      slogan: "Finding doors where others see walls.",
      github: "https://github.com/harshithaps11",
      linkedin: "http://www.linkedin.com/in/harshitha-p-s-163574288",
      email: "nnm23is076@nmamit.in",
      gradient: "from-rose-500 to-red-500"
    },
    {
      name: "K S Sujesh ",
      position: "Tech Lead",
      image: "/images/sujesh.jpg",
      skills: ["Python","ML","Deep Learning"],
      slogan: "Solving tomorrow's problems, today.",
      github: "https://github.com/kssujesh",
      linkedin: "https://www.linkedin.com/in/k-s-sujesh-5209702a7",
      email: "nnm23ad027@nmamit.in",
      gradient: "from-orange-500 to-amber-500"
    },
    {
      name: "Aayush Kumar Sinha",
      position: "Tech Lead",
      image: "/images/aayush.jpg", // Replace with actual image
      skills: ["AI/ML", "C++"],
      slogan: "Innovation is the key.",
      github: "https://github.com/bitaayushsinha",
      linkedin: "https://www.linkedin.com/in/bitaayushsinha",
      email: "nnm23cs238@nmamit.in",
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      name: "V Vishnu Prasad",
      position: "Web Master",
      image: "/images/vishnu.jpg",
      skills: ["Cloud Computing","MERN Stack","SEO"],
      slogan: "Eat-Sleep-Code-Repeat.",
      github: "https://github.com/VishnuPrasad55",
      linkedin: "https://www.linkedin.com/in/vishnu-prasad-bb4755246/",
      email: "nnm22is202@nmamit.in",
      gradient: "from-indigo-500 to-violet-500"
    },
    {
      name: "Sam A Rodrigues",
      position: "Documentation Head",
      image: "/images/sam.jpg",
      skills: ["Python","Arduino","Rust"],
      slogan: "Code smarter, not harder.",
      github: "https://github.com/samrodrigues1",
      linkedin: "https://www.linkedin.com/in/sam-anthony-rodrigues-a670b32a7/",
      email: "nnm23ad027@nmamit.in",
      gradient: "from-lime-500 to-green-500"
    },
    {
      name: "Jeevan",
      position: "Social Media Head",
      image: "/images/jeevan.jpg", // Replace with actual image
      skills: ["Content Creation", "Strategy"],
      slogan: "Connecting the community.",
      github: "https://github.com/jeevanshetty131",
      linkedin: "https://www.linkedin.com/in/jeevan-shetty-9422a6317/",
      email: "nnm23cs254@nmamit.in",
      gradient: "from-fuchsia-500 to-purple-500"
    },
    {
      name: "H Bhoomika Shenoy",
      position: "Publicity Head",
      image: "/images/bhoomika.JPG",
      skills: ["Python","C++","HTML"],
      slogan: "Born to code, forced to debug.",
      github: "https://github.com/your-github", // Replace
      linkedin: "https://www.linkedin.com/in/bhoomika-shenoy-650733358",
      email: "nnm23is073@nmamit.in",
      gradient: "from-pink-500 to-rose-500"
    },
];

const executives = [
     {
      name: "Pallavi Pai",
      position: "Vice Secretary",
      image: "/images/pallavi.jpg",
      skills: ["Web Dev", "Databases"],
      slogan: "Organized code, organized mind.",
      github: "https://github.com/pall111",
      linkedin: "https://www.linkedin.com/in/pallavi-pai-11346927b",
      email: "nnm23ad033@nmamit.in",
      gradient: "from-red-500 to-orange-500"
    },
    {
      name: "Vedant Suresh Mahalle",
      position: "Documentation Co-Head",
      image: "/images/vedant.jpg",
      skills: ["ROS2","Java","Python"],
      slogan: "Designing bots, defining destiny.",
      github: "https://github.com/Vedant10Mahalle",
      linkedin: "https://www.linkedin.com/in/vedant-mahalle-b217b4290",
      email: "nnm23ri031@nmamit.in",
      gradient: "from-yellow-500 to-amber-500"
    },
    {
      name: "Bindu R",
      position: "Publicity Co-Head",
      image: "/images/bindu.jpg",
      skills: ["CSS","HTML", "Design"],
      slogan: "From logic to launch.",
      github: "https://github.com/bindu",
      linkedin: "http://www.linkedin.com/in/bindu-r-a50339312",
      email: "nnm23ri013@nmamit.in",
      gradient: "from-green-500 to-teal-500"
    },
    {
      name: "Vidyalakshmi Kamath",
      position: "Publicity Member",
      image: "/images/vijaya.jpg",
      skills: ["Python","C","C++"],
      slogan: "Dreaming in code, living in firewalls.",
      github: "https://github.com/Vidya-kama-th",
      linkedin: "https://www.linkedin.com/in/vidyalakshmi-kamath-086311325",
      email: "nnm23cb067@nmamit.in",
      gradient: "from-cyan-500 to-sky-500"
    },
    {
      name: "Imaad Baig",
      position: "Publicity Member",
      image: "/images/imaad.jpg",
      skills: ["React","UI/UX","Java"],
      slogan: "Now or never.",
      github: "https://github.com/Imaad-Baig44",
      linkedin: "https://www.linkedin.com/in/imaad-baig-07a4a82aa",
      email: "nnm23cs253@nmamit.in",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      name: "K Vinayaka M Sharma",
      position: "Publicity Member",
      image: "/images/vinayaka.jpg",
      skills: ["Python","MS Office","PowerPoint"],
      slogan: "Empowering minds, one lesson at a time.",
      github: "https://github.com/your-github", // Replace
      linkedin: "https://www.linkedin.com/in/k-vinayaka-m-sharma-985a75350",
      email: "nnm22ee025@nmamit.in",
      gradient: "from-violet-500 to-purple-500"
    },
];


// --- Reusable Team Member Card Component ---
// --- Reusable Team Member Card Component (Compact Version) ---
const TeamMemberCard = ({ member, isDark }: { member: any, isDark: boolean }) => {
  return (
    <motion.div variants={fadeInUp} className="w-full max-w-xs mx-auto flex flex-col items-center"> {/* Reduced max-width */}
      
      {/* 3D Flipping Card Scene */}
      <div className="group w-full aspect-[4/5] [perspective:1000px]">
        <div className="relative h-full w-full rounded-2xl shadow-xl transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          
          {/* Front Face: Image with Name and Position */}
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <img 
              src={member.image} 
              alt={member.name} 
              className="h-full w-full rounded-2xl object-cover" 
            />
            {/* Overlay for text readability */}
            <div className="absolute inset-0 w-full h-full flex flex-col justify-end p-4 rounded-2xl bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h3 className="text-xl font-bold text-white tracking-tight">{member.name}</h3>
                <p className={`text-sm font-semibold bg-gradient-to-r ${member.gradient || 'from-gray-400 to-gray-200'} bg-clip-text text-transparent`}>
                  {member.position}
                </p>
            </div>
          </div>
          
          {/* Back Face: Slogan, Skills, and Links (with tighter padding) */}
          <div className={`absolute inset-0 h-full w-full rounded-2xl [transform:rotateY(180deg)] [backface-visibility:hidden] border ${isDark ? "bg-black/40 border-white/10" : "bg-white/60 border-gray-200"} backdrop-blur-lg flex flex-col items-center justify-center p-3 text-center`}> {/* Reduced padding */}
            {member.slogan && <p className={`italic text-base mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>"{member.slogan}"</p>} {/* Reduced font size and margin */}
            <div className="flex flex-wrap gap-2 justify-center mb-4"> {/* Reduced margin */}
              {member.skills.length > 0 ? (
                member.skills.map((skill: string) => (
                  <span key={skill} className={`px-2.5 py-1 text-xs font-semibold rounded-full ${isDark ? 'bg-white/10 text-cyan-300' : 'bg-blue-100 text-blue-800'}`}>
                    {skill}
                  </span>
                ))
              ) : (
                <span className={`italic text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Skills to be updated!
                </span>
              )}
            </div>
            <div className="flex space-x-5"> {/* Adjusted spacing */}
              {member.github && <a href={member.github} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-125"><Github size={20} /></a>}
              {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-125"><Linkedin size={20} /></a>}
              {member.email && <a href={`mailto:${member.email}`} className="transition-transform hover:scale-125"><Mail size={20} /></a>}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


// --- Main Team Page Component ---
const Team = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen pt-24 pb-20 overflow-hidden ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h1
            variants={fadeInUp}
            className={`text-5xl md:text-6xl font-bold tracking-tighter ${isDark ? 'bg-gradient-to-r from-gray-200 via-white to-gray-200' : 'bg-gradient-to-r from-gray-800 via-black to-gray-800'} bg-clip-text text-transparent`}
          >
            Meet Our Team
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl max-w-3xl mx-auto mt-4 text-gray-400"
          >
            The passionate individuals driving innovation and fostering our collaborative community.
          </motion.p>
        </motion.div>

        {/* Core Committee Section */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            Core Committee
          </motion.h2>
          <motion.div
            initial="initial" whileInView="animate" variants={staggerContainer} viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8"
          >
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.name} member={member} isDark={isDark} />
            ))}
          </motion.div>
        </div>

        {/* Executive Committee Section */}
        <div className="mb-20">
          <motion.h2
             initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            Executive Committee
          </motion.h2>
          <motion.div
            initial="initial" whileInView="animate" variants={staggerContainer} viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8"
          >
            {executives.map((member) => (
              <TeamMemberCard key={member.name} member={member} isDark={isDark} />
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Team;