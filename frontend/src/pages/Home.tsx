import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Code, Users, Trophy, Calendar, Rocket, ChevronRight,FolderOpen, Quote, ExternalLink } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import TypingHero from "../components/TypingHero";

const EventCard = ({ event, index }: { event: any; index: number }) => {
  const { isDark } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`relative w-full overflow-hidden rounded-3xl border p-8 ${
        isDark 
          ? "border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset]" 
          : "border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-lg"
      }`}
    >
      {isDark && (
        <div className="absolute -top-5 -left-5 -z-10 h-40 w-40 rounded-full bg-gradient-to-b from-blue-500/10 to-transparent blur-md"></div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl ${event.color} bg-opacity-20`}>
            {event.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{event.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{event.date}</p>
          </div>
        </div>
        <div className={`px-3 py-1 text-xs font-medium rounded-full ${
          isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
        }`}>
          {event.attendees}+ attended
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{event.description}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {event.tags.map((tag: string, i: number) => (
          <span
            key={i}
            className={`px-3 py-1 text-xs font-medium rounded-full ${
          isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
        }`}
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {event.type}
        </span>
        <Link
          to="/events"
          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          View details
          <ExternalLink className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </motion.div>
  );
};

// Events Data
const events = [
  {
    id: 1, // Add unique ID
    title: "Hackathon 2023",
    date: "October 15-16, 2023",
    description: "24-hour coding marathon where developers built innovative solutions to real-world problems.",
    attendees: 120,
    tags: ["Coding", "Innovation", "Teamwork"],
    type: "Competition",
    icon: <Code className="w-6 h-6 text-blue-500" />,
    color: "bg-blue-100",
    image: "", // Add image URL
  },
  {
    id: 2,
    title: "Tech Talk Series",
    date: "September 5, 2023",
    description: "Industry experts shared insights on emerging technologies and career opportunities in tech.",
    attendees: 85,
    tags: ["Learning", "Networking", "Career"],
    type: "Workshop",
    icon: <Users className="w-6 h-6 text-purple-500" />,
    color: "bg-blue-700",
    image: "",
  },
  {
    id: 3,
    title: "Code Camp Beginners",
    date: "August 12-13, 2023",
    description: "A weekend intensive designed to help beginners build their first web applications from scratch.",
    attendees: 65,
    tags: ["Beginners", "Web Development", "Hands-on"],
    type: "Training",
    icon: <Rocket className="w-6 h-6 text-orange-500" />,
    color: "bg-purple-500",
    image: "",
  },
  // {
  //   id: 4,
  //   title: "Design Sprint",
  //   date: "July 22, 2023",
  //   description: "Collaborative session focused on solving UX challenges and creating intuitive user interfaces.",
  //   attendees: 45,
  //   tags: ["UI/UX", "Design", "Prototyping"],
  //   type: "Workshop",
  //   icon: <Trophy className="w-6 h-6 text-green-500" />,
  //   color: "bg-green-500",
  //   image: "",
  // }
];

// Marquee Component
function Marquee({
  className = "",
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: any) {
  const baseClasses = "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]";
  const directionClasses = vertical ? "flex-col" : "flex-row";

  return (
    <div {...props} className={`${baseClasses} ${directionClasses} ${className}`}>
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`flex shrink-0 justify-around [gap:var(--gap)] ${
              vertical
                ? `animate-marquee-vertical flex-col ${reverse ? "[animation-direction:reverse]" : ""}`
                : `animate-marquee flex-row ${reverse ? "[animation-direction:reverse]" : ""}`
            } ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

// Testimonial Card Component
const TestimonialCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`relative w-full max-w-xs overflow-hidden rounded-3xl border p-8 ${
      isDark 
        ? "border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset]" 
        : "border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-lg"
    }`}>
      {isDark && (
        <div className="absolute -top-5 -left-5 -z-10 h-40 w-40 rounded-full bg-gradient-to-b from-blue-500/10 to-transparent blur-md"></div>
      )}
      
      <Quote className={`w-8 h-8 mb-4 ${isDark ? "text-blue-400" : "text-blue-600"} opacity-60`} />
      
      <div className={`leading-relaxed ${isDark ? "text-gray-200" : "text-gray-700"}`}>{body}</div>

      <div className="mt-6 flex items-center gap-3">
        <img 
          src={img} 
          alt={name} 
          height="48" 
          width="48" 
          className="h-12 w-12 rounded-full border-2 border-white/20" 
        />
        <div className="flex flex-col">
          <div className={`leading-5 font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{name}</div>
          <div className={`leading-5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{username}</div>
        </div>
      </div>
    </div>
  );
};

// Testimonials Data
const testimonials = [
  {
    name: "Arjun Mehta",
    username: "@arjdev",
    body: "HackerEarth completely changed the way I learn coding. The hands-on projects and community support are incredible.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Sara Lin",
    username: "@sara.codes",
    body: "The DSA learning path helped me crack my dream company's coding interview. The practice problems are perfectly curated.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Devon Carter",
    username: "@devninja",
    body: "Our team built a full-stack project in 2 weeks using the web development resources. Saved so much learning time.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h-150&fit=crop&crop=face",
  },
  {
    name: "Priya Shah",
    username: "@priyacodes",
    body: "The aptitude training helped me improve my logical thinking and problem-solving skills significantly.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Leo Martin",
    username: "@leobuilds",
    body: "Found my perfect study group here. The community events and hackathons are game changers for networking.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Chloe Winters",
    username: "@chloewinters",
    body: "The leaderboard system keeps me motivated to practice daily. Climbing ranks never felt so rewarding!",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w-150&h=150&fit=crop&crop=face",
  },
];

const firstColumn = testimonials.slice(0, 2);
const secondColumn = testimonials.slice(2, 4);
const thirdColumn = testimonials.slice(4, 6);

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function ServiceUIGraphic({ feature, isDark }: { feature: any; isDark: boolean }) {
  return (
    <div className="relative">
      <motion.div
        className="absolute inset-0 bg-white/5 rounded-3xl blur-3xl dark:bg-gray-800/30"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative bg-white/95 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-300 dark:border-gray-700 rounded-3xl p-6 overflow-hidden shadow-2xl">
        
        {/* Web Development - Code Editor */}
        {feature.title === "Web Development" && (
          <WebDevelopmentGraphic isDark={isDark} feature={feature} />
        )}
        
        {/* Data Structures & Algorithms - Flowchart */}
        {feature.title === "Data Structures & Algorithms" && (
          <DSAGraphic isDark={isDark} feature={feature} />
        )}
        
        {/* Aptitude & Reasoning - Abstract Mind Map */}
        {feature.title === "Aptitude & Reasoning" && (
          <AptitudeGraphic isDark={isDark} feature={feature} />
        )}
        
      </div>
    </div>
  );
}

// Web Development - Code Editor
function WebDevelopmentGraphic({ isDark, feature }: { isDark: boolean; feature: any }) {
  return (
    <div className="space-y-4">
      {/* Browser Header */}
      <div className="flex items-center space-x-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-t-lg">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded-full" />
          <div className="w-3 h-3 bg-yellow-400 rounded-full" />
          <div className="w-3 h-3 bg-green-400 rounded-full" />
        </div>
        <div className="flex-1 bg-white dark:bg-gray-800 rounded px-3 py-1 ml-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">app.jsx - HackerEarth</span>
        </div>
      </div>
      
      {/* Code Content */}
      <div className="bg-gray-900 rounded-b-lg p-4 font-mono text-sm">
        <div className="space-y-2">
          <div className="flex">
            <span className="text-gray-500 w-8 text-right mr-4">1</span>
            <span className="text-blue-400">import</span> <span className="text-green-400">React</span> <span className="text-blue-400">from</span> <span className="text-yellow-400">'react'</span>
          </div>
          <div className="flex">
            <span className="text-gray-500 w-8 text-right mr-4">2</span>
            <span className="text-blue-400">import</span> <span className="text-green-400">TailwindCSS</span> <span className="text-blue-400">from</span> <span className="text-yellow-400">'tailwindcss'</span>
          </div>
          <div className="flex">
            <span className="text-gray-500 w-8 text-right mr-4">3</span>
            <span className="text-purple-400">export default</span> <span className="text-blue-400">function</span> <span className="text-yellow-300">App</span>()
          </div>
          <div className="flex">
            <span className="text-gray-500 w-8 text-right mr-4">4</span>
            <span className="text-gray-400 ml-4">{`{`}</span>
          </div>
          <div className="flex">
            <span className="text-gray-500 w-8 text-right mr-4">5</span>
            <span className="text-gray-400 ml-8">return</span> <span className="text-yellow-300">&lt;div&gt;</span>
          </div>
          <div className="flex">
            <span className="text-gray-500 w-8 text-right mr-4">6</span>
            <span className="text-gray-400 ml-12">Hello, World!</span>
          </div>
          <div className="flex">
            <span className="text-gray-500 w-8 text-right mr-4">7</span>
            <span className="text-yellow-300 ml-8">&lt;/div&gt;</span>
          </div>
          <div className="flex">
            <span className="text-gray-500 w-8 text-right mr-4">8</span>
            <span className="text-gray-400 ml-4">{`}`}</span>
          </div>
        </div>
        
        {/* Blinking Cursor */}
        <motion.div
          className="w-2 h-4 bg-blue-400 ml-2 inline-block"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    </div>
  );
}

// Data Structures & Algorithms - Flowchart
function DSAGraphic({ isDark, feature }: { isDark: boolean; feature: any }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Algorithm Visualization</span>
      </div>
      
      <div className="grid grid-cols-3 gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {/* Nodes */}
        <motion.div
          className="bg-blue-500 text-white p-3 rounded-lg text-xs text-center shadow-md"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          Input
        </motion.div>
        
        <motion.div
          className="bg-purple-500 text-white p-3 rounded-lg text-xs text-center shadow-md"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          Process
        </motion.div>
        
        <motion.div
          className="bg-green-500 text-white p-3 rounded-lg text-xs text-center shadow-md"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          Output
        </motion.div>
        
        {/* Connecting Lines */}
        <div className="col-span-3 relative h-4">
          <div className="absolute top-2 left-1/3 w-1/3 h-0.5 bg-blue-300 dark:bg-blue-600"></div>
          <div className="absolute top-2 right-1/3 w-1/3 h-0.5 bg-purple-300 dark:bg-purple-600"></div>
        </div>
        
        {/* Second Row */}
        <motion.div
          className="bg-cyan-500 text-white p-3 rounded-lg text-xs text-center shadow-md col-start-2"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          Sort
        </motion.div>
      </div>
      
      <div className="flex justify-center space-x-3">
        {["O(n)", "O(log n)", "O(n²)"].map((complexity, i) => (
          <motion.div
            key={i}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            {complexity}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Aptitude & Reasoning - Abstract Mind Map
function AptitudeGraphic({ isDark, feature }: { isDark: boolean; feature: any }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Logical Thinking</span>
      </div>
      
      <div className="relative h-40 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        {/* Central Node */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs shadow-lg"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Problem
        </motion.div>
        
        {/* Connecting Nodes */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white text-xs shadow-md"
            style={{
              top: `${25 + 50 * Math.sin((i * Math.PI) / 2)}%`,
              left: `${25 + 50 * Math.cos((i * Math.PI) / 2)}%`,
            }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
          >
            {["A", "B", "C", "D"][i]}
          </motion.div>
        ))}
        
        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 40 * Math.cos((i * Math.PI) / 2)}
              y2={50 + 40 * Math.sin((i * Math.PI) / 2)}
              stroke={isDark ? "#4B5563" : "#9CA3AF"}
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>
      
      <div className="flex justify-center">
        <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
          Analytical Reasoning
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: <Code className="w-8 h-8" />,
    title: "Web Development",
    subtitle: "Modern & Responsive",
    description: "Master modern web technologies and build stunning, responsive applications.",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    bgGradient: "from-blue-500/20 via-cyan-400/10 to-blue-600/20",
    accentColor: "text-blue-400",
    link: "/domains",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Data Structures & Algorithms",
    subtitle: "Foundation Fundamentals",
    description: "Build a rock-solid foundation in computer science fundamentals.",
    technologies: ["Python", "Java", "C++", "Algorithm Design", "Complexity Analysis"],
    bgGradient: "from-purple-500/20 via-pink-400/10 to-purple-600/20",
    accentColor: "text-purple-400",
    link: "/domains",
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    title: "Aptitude & Reasoning",
    subtitle: "Analytical Thinking",
    description: "Sharpen your analytical thinking and logical reasoning skills.",
    technologies: ["Quantitative", "Verbal", "Logical", "Analytical", "Critical Thinking"],
    bgGradient: "from-orange-500/20 via-yellow-400/10 to-red-600/20",
    accentColor: "text-orange-400",
    link: "/domains",
  },
];

const StatsSection = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const glowScaleX = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative bg-white dark:bg-black py-20 overflow-hidden"
    >
      {/* The expanding purple glow effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-16 pointer-events-none z-0"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(ellipse at top center, rgba(139,92,246,0.3) 0%, transparent 70%)`,
          scaleX: glowScaleX,
          transformOrigin: 'center',
        }}
      />

      {/* Existing content wrapped in a div to ensure it's above the glow and has max-width */}
      <div className="max-w-6xl mx-auto px-10 relative z-10 py-20">
        <motion.div
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-semibold mb-4 text-black dark:text-white">
            Delivering Results
          </h2>
          <p className="text-xl text-gray-900 dark:text-gray-300">
            Our journey in numbers and achievements
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-8"
        >
          {[
            { icon: <Users className="w-8 h-8" />, number: "400+", title: "Members, every year" },
            { icon: <FolderOpen className="w-8 h-8" />, number: "50+", title: "Projects Completed" },
            { icon: <Calendar className="w-8 h-8" />, number: "25+", title: "Events Organized" },
            { icon: <Trophy className="w-8 h-8" />, number: "15+", title: "Awards Won" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeIn}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.2)" }}
              className="text-center p-6 rounded-xl bg-white/50 dark:bg-black/70 hover:bg-white/70 dark:hover:bg-black/70 transition-all duration-300 border border-gray-800 dark:border-gray-800"
            >
              <motion.div
                className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-black dark:text-white"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {stat.icon}
              </motion.div>
              <h3 className="text-2xl font-bold mb-2 text-black dark:text-white">{stat.number}</h3>
              <p className="text-gray-900 dark:text-gray-300">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

const Home = () => {
  const { isDark } = useTheme();
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = featureRefs.current.findIndex((ref) => ref === entry.target);
            if (index !== -1) setActiveFeature(index);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-20% 0px -20% 0px" }
    );
    featureRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const scrollToFeature = (idx: number) => {
    featureRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className={`${isDark ? "bg-black" : "bg-slate-50"} overflow-hidden transition-colors duration-500`}>
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.07) 0%, transparent 50%), radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-20 hidden lg:flex flex-col space-y-4">
        {features.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToFeature(idx)}
            className={`group relative w-3 h-3 rounded-full transition-all duration-300 ${activeFeature === idx ? "bg-white scale-125 shadow-lg" : "bg-white/30 hover:bg-white/60 hover:scale-110"
              }`}
            aria-label={`Go to ${features[idx].title}`}
          >
            <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap border border-white/20">
                {features[idx].title}
              </div>
            </div>
          </button>
        ))}
      </div>

      <section className="flex flex-col items-center justify-center min-h-[90vh] px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center px-3 py-2 bg-black/80 backdrop-blur-sm border border-gray-700 rounded-full text-xs text-gray-300 shadow-[0_0_20px_rgba(52,211,153,0.1)] cursor-default">
            <span className="ml-1 mr-1">powered by Abhuday</span>
          </div>
          <TypingHero />
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto my-8" />
          <p className="text-muted-foreground max-w-xl mx-auto font-medium relative z-10 text-black-300 dark:text-gray-400">
            We are a community of developers, designers, and innovators focused on hands-on creation. Join us to collaborate on real-world projects, hone your skills, and build a portfolio that stands out.
          </p>
          <div className="pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/domains"
                className="group relative px-6 py-3 bg-gray-800 text-white rounded-lg font-medium text-base hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 border border-gray-700"
              >
                <span className="flex items-center space-x-2">
                  <span>Services</span>
                </span>
              </Link>
              <Link
                to="/login"
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium text-base hover:from-blue-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(66,153,225,0.3)]"
              >
                <span className="flex items-center space-x-2">
                  <ArrowRight className="w-5 h-5" />
                  <span>Join Our Community</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    <section className="relative overflow-x-clip z-10 max-w-7xl mx-auto px-4 sm:px-6">
  <motion.div
    className="text-center mb-16"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="flex justify-center">
      <button
        type="button"
        className="group relative z-[60] mx-auto rounded-full border mt-7 px-6 py-1 text-xs backdrop-blur transition-all duration-300 active:scale-100 md:text-sm"
        style={{
          borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
        }}
      >
        <div className="absolute inset-x-0 -top-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-2xl transition-all duration-500 group-hover:w-3/4"></div>
        <div className="absolute inset-x-0 -bottom-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-2xl transition-all duration-500 group-hover:h-px"></div>
        <span className={`relative ${isDark ? "text-white" : "text-gray-900"}`}>Learning Paths</span>
      </button>
    </div>

    <h2 className={`mt-5 text-center text-4xl font-bold tracking-tighter md:text-[54px] md:leading-[60px] ${
      isDark 
        ? "bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent" 
        : "bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent"
    }`}>
      Our Different <span className="font-light italic bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Technical Domains</span>
    </h2>

    <p className={`text-xl max-w-3xl mx-auto leading-relaxed mt-6 ${
      isDark ? "text-gray-300" : "text-gray-700"
    }`}>
      Comprehensive learning paths designed to accelerate career growth and technical transformation.
    </p>
  </motion.div>

  <div className="space-y-32 relative">
    {features.map((feature, idx) => (
      <motion.div
        key={feature.title}
        ref={(el) => (featureRefs.current[idx] = el)}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: idx * 0.08 }}
        className="min-h-[80vh] flex items-center"
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className={`space-y-8 ${idx % 2 === 1 ? "lg:order-2" : ""}`}
            initial={{ opacity: 0, x: idx % 2 === 1 ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* REPLACED: Gradient badge with testimonials-style button */}
                       {/* <div className="flex justify-center">
              <button
                type="button"
                className="group relative z-[60] mx-auto rounded-full border px-6 py-1 text-xs backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-100 md:text-sm"
                style={{
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                }}
              >
                <div className="absolute inset-x-0 -top-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-2xl transition-all duration-500 group-hover:w-3/4"></div>
                <div className="absolute inset-x-0 -bottom-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-2xl transition-all duration-500 group-hover:h-px"></div>
                <span className={`relative ${isDark ? "text-white" : "text-gray-900"}`}>Testimonials</span>
              </button>
            </div> */}


            <h3 className="text-4xl sm:text-5xl font-bold text-black mb-4 leading-tight dark:text-white">{feature.title}</h3>
            <p className="text-lg text-gray-900 dark:text-gray-300 leading-relaxed mb-8">{feature.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {feature.technologies.map((tech) => (
                <span
                  key={tech}
                  className={`px-3 py-1 rounded-full border font-semibold text-xs bg-gradient-to-r ${feature.bgGradient} ${feature.accentColor} border-white/20`}
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <Link
              to={feature.link}
              className={`inline-flex items-center font-medium transition-colors group ${idx === activeFeature
                ? "text-white"
                : isDark
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
                }`}
            >
              <span>Explore Domain</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <motion.div
            className={`${idx % 2 === 1 ? "lg:order-1" : ""}`}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <ServiceUIGraphic feature={feature} isDark={isDark} />
          </motion.div>
        </div>
      </motion.div>
    ))}
  </div>
</section>

      <StatsSection />
          
          {/* events */}
    <section className={`relative z-10 py-24 ${isDark ? "bg-black" : "bg-slate-50"}`}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Section Header */}
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
          className="group relative z-[60] mx-auto rounded-full border px-7 py-2 text-xl backdrop-blur transition-all duration-300 hover:shadow-xl active:scale-100 md:text-sm"
          style={{
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
          }}
        >
          <div className="absolute inset-x-0 -top-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-2xl transition-all duration-500 group-hover:w-3/4"></div>
          <div className="absolute inset-x-0 -bottom-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-2xl transition-all duration-500 group-hover:h-px"></div>
          <span className={`relative ${isDark ? "text-white" : "text-gray-900"}`}>Community Events</span>
        </button>
      </div>

      <h2 className={`mt-7 text-center text-4xl font-semibold tracking-tighter md:text-[58px] md:leading-[60px] ${
        isDark 
          ? "bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent" 
          : "text-gray-900"
      }`}>
        Explore our Past Events
      </h2> 

      <p className={`text-xl max-w-3xl mx-auto leading-relaxed mt-2 ${
        isDark ? "text-gray-400" : "text-gray-700"
      }`}>
        Discover our past events that brought the community together to learn, collaborate, and innovate.
      </p>
    </motion.div>

    {/* Events Grid (3-column layout) */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg"
        >
          <div className={`absolute inset-[-2px] z-0 rounded-2xl bg-gradient-to-r ${
            event.color === "bg-blue-500" ? "from-blue-500 to-cyan-500" :
            event.color === "bg-purple-500" ? "from-purple-500 to-pink-500" :
            event.color === "bg-orange-500" ? "from-orange-500 to-red-500" :
            event.color === "bg-green-500" ? "from-green-500 to-emerald-500" :
            "from-blue-500 to-purple-500"
          }`} />
          
          <div className="relative h-full w-full overflow-hidden rounded-[14px]">
            {/* Event image - Add your image URL to event data */}
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            ) : (
              <div className={`absolute inset-0 h-full w-full transition-transform duration-500 ease-in-out group-hover:scale-105 ${
                event.color === "bg-blue-500" ? "bg-blue-600" : 
                event.color === "bg-purple-500" ? "bg-purple-600" :
                event.color === "bg-orange-500" ? "bg-orange-600" : 
                event.color === "bg-green-500" ? "bg-green-600" : "bg-blue-600"
              }`} />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <div className="relative flex h-full flex-col justify-end p-6">
              {/* Hover content */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">{event.title}</h3>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {event.tags.map((tag, tagIndex) => (
                    <div key={tagIndex} className={`rounded-full p-px ${
                      event.color === "bg-blue-500" ? "bg-gradient-to-r from-blue-500 to-cyan-500" :
                      event.color === "bg-purple-500" ? "bg-gradient-to-r from-purple-500 to-pink-500" :
                      event.color === "bg-orange-500" ? "bg-gradient-to-r from-orange-500 to-red-500" :
                      event.color === "bg-green-500" ? "bg-gradient-to-r from-green-500 to-emerald-500" :
                      "bg-gradient-to-r from-blue-500 to-purple-500"
                    }`}>
                      <span className={`block rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm ${
                        isDark ? "bg-black/70 text-white/90" : "bg-white/80 text-gray-900"
                      }`}>
                        {tag}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Link
                  to={`/events/${event.id}`} // Add event.id to your data
                  className="group/button relative inline-flex items-center gap-2 text-base font-semibold"
                >
                  <span className={`${
                    event.color === "bg-blue-500" ? "bg-gradient-to-r from-blue-500 to-cyan-500" :
                    event.color === "bg-purple-500" ? "bg-gradient-to-r from-purple-500 to-pink-500" :
                    event.color === "bg-orange-500" ? "bg-gradient-to-r from-orange-500 to-red-500" :
                    event.color === "bg-green-500" ? "bg-gradient-to-r from-green-500 to-emerald-500" :
                    "bg-gradient-to-r from-blue-500 to-purple-500"
                  } bg-clip-text text-transparent`}>
                    View Details
                  </span>
                  <ArrowRight className={`w-4 h-4 ${
                    event.color === "bg-blue-500" ? "bg-gradient-to-r from-blue-500 to-cyan-500" :
                    event.color === "bg-purple-500" ? "bg-gradient-to-r from-purple-500 to-pink-500" :
                    event.color === "bg-orange-500" ? "bg-gradient-to-r from-orange-500 to-red-500" :
                    event.color === "bg-green-500" ? "bg-gradient-to-r from-green-500 to-emerald-500" :
                    "bg-gradient-to-r from-blue-500 to-purple-500"
                  } bg-clip-text text-transparent transition-transform group-hover/button:translate-x-1`} />
                  <span className={`absolute -bottom-1 left-0 h-0.5 w-0 ${
                    event.color === "bg-blue-500" ? "bg-gradient-to-r from-blue-500 to-cyan-500" :
                    event.color === "bg-purple-500" ? "bg-gradient-to-r from-purple-500 to-pink-500" :
                    event.color === "bg-orange-500" ? "bg-gradient-to-r from-orange-500 to-red-500" :
                    event.color === "bg-green-500" ? "bg-gradient-to-r from-green-500 to-emerald-500" :
                    "bg-gradient-to-r from-blue-500 to-purple-500"
                  } transition-all duration-300 group-hover/button:w-full`} />
                </Link>
              </div>
              
              {/* Default visible content */}
              <div className="group-hover:opacity-0 transition-opacity duration-500">
                <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                <p className="text-white/80 text-sm">{event.description}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* "View All Events" Button */}
    {/* <motion.div
      className="text-center mt-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <Link
        to="/events"
        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        <span>View All Events</span>
        <ArrowRight className="w-5 h-5 ml-2" />
      </Link>
    </motion.div> */}
  </div>
</section>
          

           {/* Testimonials Section */}
      <section className={`relative z-10 py-24 ${isDark ? "bg-black" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[540px] text-center mb-16">
            <div className="flex justify-center">
              <button
                type="button"
                className="group relative z-[60] mx-auto rounded-full border px-6 py-1 text-xs backdrop-blur transition-all duration-300 hover:shadow-xl active:scale-100 md:text-sm"
                style={{
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                }}
              >
                <div className="absolute inset-x-0 -top-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-2xl transition-all duration-500 group-hover:w-3/4"></div>
                <div className="absolute inset-x-0 -bottom-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-2xl transition-all duration-500 group-hover:h-px"></div>
                <span className={`relative ${isDark ? "text-white" : "text-gray-900"}`}>Testimonials</span>
              </button>
            </div>
           
            <h2 className={`mt-5 text-center text-4xl font-semibold tracking-tighter md:text-[54px] md:leading-[60px] ${
              isDark 
                ? "bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent" 
                : "text-gray-900"
            }`}>
              What our members say
            </h2>

            <p className={`mt-5 text-center text-lg ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              From coding skills to career growth, our community has helped students achieve their goals.
            </p>
          </div>

          <div className="my-16 flex max-h-[738px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
            <div>
              <Marquee pauseOnHover vertical className="[--duration:20s]">
                {firstColumn.map((testimonial) => (
                  <TestimonialCard key={testimonial.username} {...testimonial} />
                ))}
              </Marquee>
            </div>

            <div className="hidden md:block">
              <Marquee reverse pauseOnHover vertical className="[--duration:25s]">
                {secondColumn.map((testimonial) => (
                  <TestimonialCard key={testimonial.username} {...testimonial} />
                ))}
              </Marquee>
            </div>

            <div className="hidden lg:block">
              <Marquee pauseOnHover vertical className="[--duration:30s]">
                {thirdColumn.map((testimonial) => (
                  <TestimonialCard key={testimonial.username} {...testimonial} />
                ))}
              </Marquee>
            </div>
          </div>

          <div className="-mt-8 flex justify-center">
            <button className={`group relative inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-all hover:bg-blue-500/10 active:scale-95 ${
              isDark 
                ? "border-blue-500/30 bg-black/50 text-white hover:border-blue-500/60" 
                : "border-blue-400/30 bg-white text-gray-900 hover:border-blue-400/60"
            }`}>
              <div className="absolute inset-x-0 -top-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
              <div className="absolute inset-x-0 -bottom-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
              Share your experience
            </button>
          </div>
        </div>
      </section>

    <section className={`relative z-10 py-24 transition-colors duration-500 ${isDark ? "bg-black" : "bg-white"}`}>
        <div className="mx-auto max-w-4xl rounded-[40px] border border-black/5 dark:border-white/20 p-2 shadow-sm">
          <div className={`relative mx-auto overflow-hidden rounded-[38px] border border-black/5 dark:border-white/20 p-2 shadow-sm ${
            isDark ? "bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" : "bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500"
          }`}>
            {/* Background effects */}
            <div
              className="absolute inset-0 z-0"
              style={{
                background: isDark 
                  ? "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(59, 130, 246, 0.15), transparent 70%)"
                  : "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255, 255, 255, 0.2), transparent 70%)",
              }}
            />

            <div
              className="absolute inset-0 z-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter'%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />

            <div className="relative z-10 p-12">
              <div className="text-center">
                {/* Main heading */}
             <h2 className={`text-4xl font-bold mb-6 tracking-tighter ${
  isDark 
    ? "bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent" 
    : "text-white"
}`}>
  Ready to Begin Your Journey?
</h2>
                
                {/* Subtitle */}
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${
                  isDark ? "text-blue-200" : "text-blue-100"
                }`}>
                  Join a community of innovators, builders, and leaders. Start your path to technical excellence today.
                </p>

                {/* Animated CTA button */}
                <div className="flex items-center justify-center mt-10">
                  <Link to="/login">
                    <div className="group border-white/30 bg-white/20 flex h-[64px] cursor-pointer items-center gap-2 rounded-full border p-[11px] backdrop-blur-sm transition-all hover:bg-white/30">
                      <div className="border-white/30 bg-white flex h-[43px] items-center justify-center rounded-full border">
                        <p className="mr-3 ml-2 flex items-center justify-center gap-2 font-medium tracking-tight text-blue-900">
                          <Rocket className="w-5 h-5" />
                          Get Started
                        </p>
                      </div>
                      <div className="border-white/30 flex size-[26px] items-center justify-center rounded-full border-2 transition-all ease-in-out group-hover:ml-2">
                        <ArrowRight className="w-4 h-4 text-white transition-all ease-in-out group-hover:rotate-45" />
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Background text effect */}
                <h1
                  className="absolute inset-x-0 -bottom-20 text-center text-[80px] font-semibold text-transparent sm:text-[120px] pointer-events-none"
                  style={{
                    WebkitTextStroke: isDark ? "1px rgba(255,255,255,0.1)" : "1px rgba(255,255,255,0.2)",
                    color: "transparent",
                  }}
                  aria-hidden="true"
                >
                  HackerEarth
                </h1>
                <h1
                  className="absolute inset-x-0 -bottom-20 text-center text-[80px] font-semibold pointer-events-none opacity-10 sm:text-[120px]"
                  style={{
                    color: isDark ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.4)",
                  }}
                  aria-hidden="true"
                >
                  HackerEarth
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;