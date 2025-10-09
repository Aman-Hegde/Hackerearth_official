"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants  } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Loader from "../components/Loader";

// --- Animation Variants ---
const fadeInUp: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
  },
};
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

// --- TEAM DATA (EXCEL STRUCTURE) ---
const coreTeam = [
  {
    name: "Shaamak Madhwaraj Bolar",
    position: "President",
    image: "/images/shaamak.jpg",
    skills: ["Ethical Hacking", "Cyber Security"],
    slogan: "Curious Mind. Creative Heart.",
    github: "https://github.com/Shaamak",
    linkedin: "https://www.linkedin.com/in/shaamak-madhwaraj-089a80307",
    email: "nnm23cb049@nmamit.in",
    gradient: "from-sky-500 to-indigo-500",
  },
  {
    name: "Shetty Vedanga Shivram",
    position: "Vice President",
    image: "/images/ved.jpg",
    skills: ["React", "Python", "Java"],
    slogan: "Living proof that Ctrl+Z saves lives.",
    github: "https://github.com/vedaaanggshetty",
    linkedin: "https://www.linkedin.com/in/shettyvedanga",
    email: "vedangshetty21@gmail.com",
    gradient: "from-blue-500 to-cyan-500",
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
    gradient: "from-emerald-500 to-green-500",
  },
  {
    name: "Pallavi Pai",
    position: "Vice Secretary",
    image: "/images/PallaviPai.jpg",
    skills: ["Web Dev", "Databases"],
    slogan: "Organized code, organized mind.",
    github: "https://github.com/pall111",
    linkedin: "https://www.linkedin.com/in/pallavi-pai-11346927b",
    email: "nnm23ad033@nmamit.in",
    gradient: "from-red-500 to-orange-500"
  },
];

// Web Team
const webTeam = [
  {
    name: "V Vishnu Prasad",
    position: "Web Master",
    image: "/images/vishnu.jpg",
    skills: ["Cloud Computing", "MERN Stack", "SEO"],
    slogan: "Eat-Sleep-Code-Repeat.",
    github: "https://github.com/VishnuPrasad55",
    linkedin: "https://www.linkedin.com/in/vishnu-prasad-bb4755246/",
    email: "nnm22is202@nmamit.in",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    name: "A Anish Bhat",
    position: "Co Web Master",
    image: "/images/Anish_core.jpg",
    skills: ["React"],
    slogan: "........",
    github: "https://github.com/Anish17Bhat",
    linkedin: "https://www.linkedin.com/in/anish-bhat-94182229a",
    email: "nnm23cs036@nmamit.in",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    name: "Shaldon Barnes",
    position: "Co Web Master",
    image: "/images/ShaldonBarnes.jpg",
    skills: ["Web Dev"],
    slogan: "........",
    github: "https://github.com/Shaldonbarnes10",
    linkedin: "https://www.linkedin.com/in/shaldonbarnes",
    email: "nnm23cs172@nmamit.in",
    gradient: "from-sky-500 to-indigo-500",
  }
];

// Tech Leads
const techLeads = [
  {
    name: "Pratham S Salian",
    position: "Tech Lead",
    image: "/images/pratham.jpg",
    skills: ["Python", "Java", "MERN Stack"],
    slogan: "Debugging today, designing tomorrow.",
    github: "https://github.com/prathamssalian",
    linkedin: "https://www.linkedin.com/in/pratham-s-salian-33534328b/",
    email: "nnm23is137@nmamit.in",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Harshitha P Salian",
    position: "Tech Lead",
    image: "/images/harshita.jpg",
    skills: ["Python", "Cybersecurity", "Next.js"],
    slogan: "Finding doors where others see walls.",
    github: "https://github.com/harshithaps11",
    linkedin: "http://www.linkedin.com/in/harshitha-p-s-163574288",
    email: "nnm23is076@nmamit.in",
    gradient: "from-rose-500 to-red-500",
  },
  {
    name: "K S Sujesh",
    position: "Tech Lead",
    image: "/images/sujesh.jpg",
    skills: ["Python", "ML", "Deep Learning"],
    slogan: "Solving tomorrow's problems, today.",
    github: "https://github.com/kssujesh",
    linkedin: "https://www.linkedin.com/in/k-s-sujesh-5209702a7",
    email: "nnm23ad027@nmamit.in",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    name: "Aayush Kumar Sinha",
    position: "Tech Lead",
    image: "/images/Aayush.jpg",
    skills: ["AI/ML", "C++"],
    slogan: "Innovation is the key.",
    github: "https://github.com/bitaayushsinha",
    linkedin: "https://www.linkedin.com/in/bitaayushsinha",
    email: "nnm23cs238@nmamit.in",
    gradient: "from-teal-500 to-cyan-500",
  }
];

// Documentation Team
const documentationTeam = [
  {
    name: "Sam A Rodrigues",
    position: "Documentation Head",
    image: "/images/sam.jpg",
    skills: ["Python", "Arduino", "Rust"],
    slogan: "Code smarter, not harder.",
    github: "https://github.com/samrodrigues1",
    linkedin: "https://www.linkedin.com/in/sam-anthony-rodrigues-a670b32a7/",
    email: "nnm23am053@nmamit.in",
    gradient: "from-lime-500 to-green-500",
  },
  {
    name: "Vedant Suresh Mahalle",
    position: "Co Documentation Head",
    image: "/images/vedant.jpg",
    skills: ["ROS2", "Java", "Python"],
    slogan: "Designing bots, defining destiny.",
    github: "https://github.com/Vedant10Mahalle",
    linkedin: "https://www.linkedin.com/in/vedant-mahalle-b217b4290",
    email: "nnm23ri031@nmamit.in",
    gradient: "from-yellow-500 to-amber-500",
  }
];

// Publicity Team
const publicityTeam = [
  {
    name: "H Bhoomika Shenoy",
    position: "Publicity Head",
    image: "/images/bhoomika.JPG",
    skills: ["Python", "C++", "HTML"],
    slogan: "Born to code, forced to debug.",
    github: "",
    linkedin: "https://www.linkedin.com/in/bhoomika-shenoy-650733358",
    email: "nnm23is073@nmamit.in",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    name: "Bindu R",
    position: "Publicity Co-Head",
    image: "/images/bindu.jpg",
    skills: ["CSS", "HTML", "Design"],
    slogan: "From logic to launch.",
    github: "https://github.com/bindu",
    linkedin: "http://www.linkedin.com/in/bindu-r-a50339312",
    email: "nnm23ri013@nmamit.in",
    gradient: "from-green-500 to-teal-500",
  },
  {
    name: "Vidyalakshmi Kamath",
    position: "Publicity Member",
    image: "/images/VIDYA.jpg",
    skills: ["Python", "C", "C++"],
    slogan: "Dreaming in code, living in firewalls.",
    github: "https://github.com/Vidya-kama-th",
    linkedin: "https://www.linkedin.com/in/vidyalakshmi-kamath-086311325",
    email: "nnm23cb067@nmamit.in",
    gradient: "from-cyan-500 to-sky-500",
  },
  {
    name: "Imaad Baig",
    position: "Publicity Member",
    image: "/images/imaad.jpg",
    skills: ["React", "UI/UX", "Java"],
    slogan: "Now or never.",
    github: "https://github.com/Imaad-Baig44",
    linkedin: "https://www.linkedin.com/in/imaad-baig-07a4a82aa",
    email: "nnm23cs253@nmamit.in",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    name: "K Vinayaka M Sharma",
    position: "Publicity Member",
    image: "/images/VinayakaM.jpg",
    skills: ["Python", "MS Office", "PowerPoint"],
    slogan: "Empowering minds, one lesson at a time.",
    github: "",
    linkedin: "https://www.linkedin.com/in/k-vinayaka-m-sharma-985a75350",
    email: "nnm22ee025@nmamit.in",
    gradient: "from-violet-500 to-purple-500"
  }
];

// Social Media Team
const socialMediaTeam = [
  {
    name: "Jeevan",
    position: "Social Media Head",
    image: "/images/Jeevan_ sociameadia_head.jpg",
    skills: ["Content Creation", "Strategy"],
    slogan: "Connecting the community.",
    github: "https://github.com/jeevanshetty131",
    linkedin: "https://www.linkedin.com/in/jeevan-shetty-9422a6317/",
    email: "nnm23cs254@nmamit.in",
    gradient: "from-fuchsia-500 to-purple-500",
  }
];

// Graphics Team
const graphicsTeam = [
  {
    name: "Pratheeksha",
    position: "Graphic Head",
    image: "/images/pratheeksha.jpg",
    skills: ["Graphics", "Design"],
    slogan: "Creativity without boundaries.",
    github: "",
    linkedin: "",
    email: "nnm24cb504@nmamit.in",
    gradient: "from-orange-500 to-pink-500"
  },
  {
    name: "Manvith",
    position: "Graphic Co-Head",
    image: "/images/Manvith.jpg",
    skills: ["Graphics"],
    slogan: "Design outside the box.",
    github: "",
    linkedin: "https://www.linkedin.com/in/manvith-shettigar-ba92312a3",
    email: "nnm23is094@nmamit.in",
    gradient: "from-lime-500 to-green-500"
  },
  {
    name: "Gautham Tendulkar",
    position: "Graphic Member",
    image: "/images/gautham.jpg",
    skills: ["Graphics", "Design"],
    slogan: "Art meets innovation.",
    github: "https://github.com/GauthamTendulkar",
    linkedin: "https://www.linkedin.com/in/gautham-tendulkar-a62067296",
    email: "nnm23ec065@nmamit.in",
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    name: "Sowmya D Shetty",
    position: "Graphic Member",
    image: "/images/Sowmya.jpg",
    skills: ["Graphics"],
    slogan: "Ideas into visuals.",
    github: "https://github.com/Sowmyashetty01",
    linkedin: "https://www.linkedin.com/in/sowmya-shetty-934b32328",
    email: "nnm23ec173@nmamit.in",
    gradient: "from-violet-500 to-fuchsia-500"
  }
];

// --- Reusable Team Member Card Component ---
const TeamMemberCard = ({ member, isDark }: { member: any; isDark: boolean }) => {
  return (
    <motion.div
      variants={fadeInUp}
      className="w-full max-w-xs mx-auto flex flex-col items-center"
    >
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
              <h3 className="text-xl font-bold text-white tracking-tight">
                {member.name}
              </h3>
              <p
                className={`text-sm font-semibold bg-gradient-to-r ${member.gradient || "from-gray-400 to-gray-200"
                  } bg-clip-text text-transparent`}
              >
                {member.position}
              </p>
            </div>
          </div>
          {/* Back Face: Slogan, Skills, and Links */}
          <div
            className={`absolute inset-0 h-full w-full rounded-2xl [transform:rotateY(180deg)] [backface-visibility:hidden] border ${isDark ? "bg-black/40 border-white/10" : "bg-white/60 border-gray-200"
              } backdrop-blur-lg flex flex-col items-center justify-center p-3 text-center`}
          >
            {member.slogan && (
              <p
                className={`italic text-base mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                "{member.slogan}"
              </p>
            )}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {member.skills.length > 0 ? (
                member.skills.map((skill: string) => (
                  <span
                    key={skill}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full ${isDark ? "bg-white/10 text-cyan-300" : "bg-blue-100 text-blue-800"
                      }`}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span
                  className={`italic text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Skills to be updated!
                </span>
              )}
            </div>
            <div className="flex space-x-5">
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-125"
                >
                  <Github size={20} className={isDark ? "text-white" : "text-black"} />
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-125"
                >
                  <Linkedin size={20} className={isDark ? "text-white" : "text-black"} />
                </a>
              )}
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="transition-transform hover:scale-125"
                >
                  <Mail size={20} className={isDark ? "text-white" : "text-black"} />
                </a>
              )}
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className={`flex flex-col justify-center items-center min-h-screen ${isDark ? "bg-black text-white" : "bg-slate-50 text-gray-900"}`}>
        <Loader size={80} />
        <p className="mt-4 text-lg font-medium">Loading Team...</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-24 pb-20 overflow-hidden ${isDark ? "bg-black" : "bg-slate-50"
        }`}
    >
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
            className={`text-4xl font-bold tracking-tighter md:text-[54px] md:leading-[60px] pb-2 ${
              isDark 
                ? "bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent" 
                : "text-gray-900"
            }`}
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

        {/* Sections */}
        {[
          { title: "Core Committee", data: coreTeam },
          { title: "Web Team", data: webTeam },
          { title: "Tech Leads", data: techLeads },
          { title: "Documentation Team", data: documentationTeam },
          { title: "Publicity Team", data: publicityTeam },
          { title: "Social Media Team", data: socialMediaTeam },
          { title: "Graphics Team", data: graphicsTeam },
        ].map((section, idx) => (
          <div className="mb-20" key={section.title}>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            >
              {section.title}
            </motion.h2>
            <motion.div
              initial="initial"
              whileInView="animate"
              variants={staggerContainer}
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8"
            >
              {section.data.map((member: any) => (
                <TeamMemberCard
                  key={member.name}
                  member={member}
                  isDark={isDark}
                />
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
