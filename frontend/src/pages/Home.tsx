import { useState, useEffect, useRef, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Users, Trophy, Calendar, Rocket, ChevronRight, FolderOpen, Quote } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import TypingHero from "../components/TypingHero";
import { Code, Brain, Lightbulb, Puzzle, Calculator, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
// import CurvedHorizonGlow from '../components/CurvedHorizonGlow';
// import CurvedSectionTransition from '../components/CurvedSectionTransition';

const EventCard = ({ event, index }: { event: any; index: number }) => {
  return (
    <Link to={`/events/${event.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true, amount: 0.3 }}
        className="group relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-white/10 shadow-lg cursor-pointer"
      >
        {/* Background Image with Hover Zoom Effect */}
        <img
          src={event.image}
          alt={`${event.title} poster`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />

        {/* Gradient Overlay (hidden by default, appears on hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content - truly hidden until hover */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-6 text-white 
                     opacity-0 invisible translate-y-8 pointer-events-none
                     group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto
                     transition-all duration-300 ease-in-out bg-gradient-to-t from-black/90 via-black/50 to-transparent"
        >
          <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
          <p className="text-sm text-gray-300 mb-3">{event.date}</p>
          <p className="text-gray-200 mb-4 leading-relaxed">{event.description}</p>

          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* View Details button */}
          <div className="mt-4">
            <div className="inline-flex items-center text-sm font-medium text-white/90 hover:text-white">
              <span>View Details</span>
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
// Events Data
const events = [
  {
    id: 1,
    title: "The Tech Triad",
    date: "March 22, 2025",
    description: "A thrilling 3 rounds of debugging and finding clues, with a prize pool of 15k, open to all participants.",
    tags: ["Hackathon", "Competition", "Prize Pool"],
    image: "/images/techtriad.jpg",
  },
  {
    id: 2,
    title: "Tech EmpowerHER",
    date: "March 08 | 09, 2024",
    description: "An online MCQ challenge celebrating women in tech. Test your knowledge and solve encrypted clues.",
    tags: ["Online", "MCQ", "Women in Tech"],
    image: "/images/tech.jpg",
  },
  {
    id: 3,
    title: "Maze of Codes",
    date: "November 9, 2023",
    description: "An intense coding challenge in collaboration with ACSA, testing problem-solving skills to the limit.",
    tags: ["Coding", "Beginners", "On-site"],
    image: "/images/mazeofcodes.jpg",
  },
  {
    id: 4,
    title: "CodeClash",
    date: "October 05, 2024",
    description: "A coding competition with a 3k prize pool, open to all skill levels.",
    tags: ["Coding", "Beginners"],
    image: "/images/codeclash.jpg",
  },
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
            className={`flex shrink-0 justify-around [gap:var(--gap)] ${vertical
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
    <div className={`relative w-full max-w-md overflow-hidden rounded-3xl border p-8 ${isDark
        ? "border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset]"
        : "border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-lg"
      }`}>
      {isDark && (
        <div className="absolute -top-5 -left-5 -z-10 h-40 w-40 rounded-full bg-gradient-to-b from-blue-500/10 to-transparent blur-md"></div>
      )}

      <Quote className={`w-8 h-8 mb-4 ${isDark ? "text-blue-400" : "text-blue-600"} opacity-60`} />

      <div className={`leading-relaxed ${isDark ? "text-gray-200" : "text-gray-700"}`}>{body}</div>

      <div className="mt-6 flex items-center gap-3">
        <div className="relative">
          <div
            className={`h-12 w-12 rounded-full transition-transform duration-200 hover:scale-105 ${isDark
                ? "border-2 border-white/30 shadow-lg shadow-white/10"
                : "border-2 border-gray-200/50 shadow-md"
              }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              backgroundRepeat: 'no-repeat',
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            }}
          />
          <img
            src={img}
            alt={`${name}'s profile picture`}
            className="sr-only"
          />
        </div>
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
    name: "Vedant Suresh Mahalle ",
    username: "@vedantmahalle45",
    body: "Being selected as the Co-Documentation Head through HackerEarth has been an incredible opportunity to combine my technical and creative skills. From working on web, aptitude, and DSA content to collaborating on documentation and project organization, this experience has strengthened my ability to communicate ideas clearly and contribute effectively to a team. It has truly been a rewarding journey of learning, leadership, and growth.",
    img: "/testimonials_images/vedanthSM_testimonials.jpg",
  },
  {
    name: "K Vinayaka Madhava Sharma",
    username: "@vinayaka_09_2004",
    body: "The main aim helped me to join the club was for the communication and other soft skill development. Which helped alot and assuring team spirit great. The team also assure the aptitude training required for the prior clearance stage of placement drives. Thank you so much for providing me an opportunity to be an integral part of it.",
    img: "/testimonials_images/Kvinayak.jpg",
  },

  {
    name: "Pratham S Salian",
    username: "@pratham_.s._salian",
    body: "Being part of the HackerEarth Club has been an amazing experience. The coding challenges and hackathons helped me strengthen my problem-solving skills and apply concepts in real-world scenarios. Collaborating with peers also improved my teamwork and logical thinking abilities.",
    img: "testimonials_images/pratham.jpg",
  },

  {
    name: "Samrudh R Shetty",
    username: "",
    body: "I wholeheartedly endorse HackerEarth NMAMIT Hub for its exemplary coding challenges and innovative problem-solving opportunities that foster intellectual growth and excellence.",
    img: "/images/samrudh.JPG",
  },
  {
    name: "Gautham Tendulkar ",
    username: "@gauthamtendulkarr",
    body: "Great vibes, amazing people, and lots of memories that’s all that matters!",
    img: "testimonials_images/gautham.jpg",
  },
  {
    name: "Bhoomika Shenoy ",
    username: "@bhoomikashenoyy",
    body: "Being part of this club isn’t just about tech—it’s about connecting, creating, and making an impact. I’ve loved every contest, every brainstorm, and every moment.",
    img: "testimonials_images/ai_animated_g.jpg",
  },
  {
    name: "Pallavi Pai",
    username: "@pallavipai_",
    body: "Being a part of HackerEarth Hub has helped me strengthen my aptitude and foundations in data structures. Participating in programs like the SAP HackFest gave me exposure to what industries expect — the business models, the process of ideating, and pitching your product. The EmpowHer quiz was a great way to learn more about women in tech. My personal interests include Machine learning and App development .Always keen on learning, exploring, and building new things.",
    img: "testimonials_images/ai_animated_g.jpg",
  },
  {
    name: "Manvith",
    username: "@manvithhhhhh",
    body: "Being part of this club has been a valuable experience. I learned new skills, and improved my overall confidence and teamwork abilities.",
    img: "testimonials_images/ai_animated_m.jpg",
  },
];
const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 5);
const thirdColumn = testimonials.slice(5, 8);

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
interface DomainFeature {
  icon: ReactNode;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  bgGradient: string;
  accentColor: string;
  link: string;
}

function ServiceUIGraphic({ feature, isDark }: { feature: DomainFeature; isDark: boolean }) {
  return (
    <div className="relative w-full min-w-0">
      <motion.div
        className="absolute inset-0 rounded-3xl bg-brand-500/5 blur-3xl dark:bg-brand-400/10"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* The graphics are rendered directly for an open, integrated feel */}
      <div className="relative flex min-w-0 items-center justify-center py-2 sm:py-4">
        {feature.title === "Web Development" && (
          <WebDevelopmentGraphic />
        )}
        {feature.title === "Data Structures & Algorithms" && (
          <DSAGraphic isDark={isDark} />
        )}
        {feature.title === "Aptitude & Reasoning" && (
          <AptitudeGraphic isDark={isDark} />
        )}
      </div>
    </div>
  );
}


// --- 1. Web Development Graphic (Aesthetic Overhaul) ---
function WebDevelopmentGraphic() {
  const codeLines = [
    { text: "import { motion } from 'framer-motion';", color1: "text-purple-400", color2: "text-yellow-400" },
    { text: "", color1: "", color2: "" },
    { text: "const App = () => (", color1: "text-cyan-400", color2: "text-yellow-400" },
    { text: "  <motion.div animate={{ scale: 1.1 }}>", color1: "text-green-400", color2: "text-yellow-400" },
    { text: "   Build the Future", color1: "", color2: "text-blue-400" },
    { text: "  </motion.div>", color1: "text-green-400", color2: "text-green-400" },
    { text: ");", color1: "text-cyan-400", color2: "" },
  ];
  const lineHeight = 22;
  const finalHeight = codeLines.length * lineHeight + 32;

  return (
    <motion.div
      className="mx-auto w-full max-w-lg rounded-lg font-mono text-[0.625rem] shadow-2xl shadow-blue-500/10 sm:text-xs xl:text-sm"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.5 }}
    >
      <div className="bg-[#1e212b] rounded-t-lg p-3 flex items-center gap-2 border-b border-white/10">
        <div className="w-3 h-3 bg-red-500 rounded-full" />
        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
        <div className="w-3 h-3 bg-green-500 rounded-full" />
      </div>
      <motion.div
        className="overflow-x-auto overflow-y-hidden rounded-b-lg bg-[#282c34] p-3 sm:p-4"
        variants={{ initial: { height: 0 }, animate: { height: finalHeight } }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
      >
        <motion.div
          className="min-w-[18rem]"
          variants={{ animate: { transition: { staggerChildren: 0.12 } } }}
        >
          {codeLines.map((line, index) => (
            <motion.p
              key={index}
              className="whitespace-nowrap"
              variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
              style={{ height: lineHeight }}
            >
              <span className="text-gray-600 w-6 inline-block select-none">{index + 1}</span>
              <span className={line.color1}>{line.text.split(' ')[0]}</span>
              <span className={line.color2}> {line.text.split(' ').slice(1).join(' ')}</span>
            </motion.p>
          ))}
          <motion.div
            className="w-0.5 h-4 bg-cyan-400 mt-1"
            variants={{ initial: { opacity: 0 }, animate: { opacity: [0, 1, 0] } }}
            transition={{ duration: 1.2, repeat: Infinity, delay: codeLines.length * 0.12 + 0.5 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}


// --- 2. DSA Graphic (Carousel with Corrected & Improved Visualizations) ---
function DSAGraphic({ isDark }: { isDark: boolean }) {
  const visualizations = [
    { title: "Pathfinding Algorithm", component: <PathfindingViz isDark={isDark} /> },
    { title: "Sorting Algorithm", component: <SortingViz isDark={isDark} /> },
    { title: "Graph Traversal", component: <GraphTraversalViz isDark={isDark} /> },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % visualizations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [visualizations.length]);

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4">
      <AnimatePresence mode="wait">
        <motion.h3
          key={visualizations[index].title}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {visualizations[index].title}
        </motion.h3>
      </AnimatePresence>
      <div className="relative w-full h-48 max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {visualizations[index].component}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center space-x-3">
        {["O(n log n)", "O(n²)", "O(V+E)"].map((complexity) => (
          <div key={complexity} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
            {complexity}
          </div>
        ))}
      </div>
    </div>
  );
}

// Sub-components for the DSA Carousel
const PathfindingViz = ({ isDark }: { isDark: boolean }) => {
  const path = "M 20,50 C 60,0, 140,100, 180,50";
  return (
    <svg className="w-full h-full" viewBox="0 0 200 100">
      <path d={path} fill="none" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="2" strokeDasharray="5 5" />
      <motion.circle r="6" fill={isDark ? "#A5B4FC" : "#4F46E5"}
        style={{ offsetPath: `path("${path}")` }}
        animate={{ offsetDistance: "100%" }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
    </svg>
  );
};
const SortingViz = ({ isDark }: { isDark: boolean }) => (
  <div className="w-full h-full flex items-end justify-center gap-2 px-4">
    {[50, 80, 30, 95, 40, 70, 60, 20].map((height, i) => (
      <motion.div
        key={i} layout className={`w-full rounded-t-full ${isDark ? 'bg-purple-400' : 'bg-purple-500'}`}
        initial={{ height: `${height}%` }}
        animate={{ height: `${i * 9 + 25}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 12, delay: i * 0.05 }} />
    ))}
  </div>
);
const GraphTraversalViz = ({ isDark }: { isDark: boolean }) => {
  const nodes = [{ x: 50, y: 50 }, { x: 100, y: 20 }, { x: 150, y: 50 }, { x: 100, y: 80 }];
  const edges = [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 0 }];
  return (
    <svg className="w-full h-full" viewBox="0 0 200 100">
      {edges.map((edge, i) => (
        <line key={i} x1={nodes[edge.from].x} y1={nodes[edge.from].y} x2={nodes[edge.to].x} y2={nodes[edge.to].y} stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="1" />
      ))}
      {nodes.map((node, i) => (
        <circle key={i} cx={node.x} cy={node.y} r="5" fill={isDark ? "#4B5563" : "#9CA3AF"} />
      ))}
      <motion.circle r="6" fill={isDark ? "#67E8F9" : "#0891B2"}
        animate={{ cx: nodes.map(n => n.x), cy: nodes.map(n => n.y) }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75] }} />
    </svg>
  );
};


// --- 3. Aptitude Graphic (Fluid Keyframe-based Orbit) ---
function AptitudeGraphic({ isDark }: { isDark: boolean }) {
  const orbitRadius = 80;
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center space-y-4">
      {/* <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Logical Thinking Network
      </h3> */}
      <div className="relative w-56 h-56">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-48 h-48 rounded-full ${isDark ? "bg-purple-500/5" : "bg-purple-500/10"} blur-xl`}></div>
        </div>

        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Brain className="w-9 h-9 text-white" />
          </motion.div>
        </motion.div>

        {[
          { icon: Calculator, duration: 28, delay: 0 },
          { icon: TrendingUp, duration: 22, delay: 1.5 },
          { icon: Lightbulb, duration: 25, delay: 0.5 },
          { icon: Puzzle, duration: 30, delay: 1.0 },
        ].map(({ icon: Icon, duration, delay }, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{ x: -20, y: -20 }} // Center the icon origin
            animate={{
              rotate: 360,
              x: [orbitRadius, 0, -orbitRadius, 0, orbitRadius].map(v => v - 20),
              y: [0, orbitRadius, 0, -orbitRadius, 0].map(v => v - 20),
            }}
            transition={{ duration, repeat: Infinity, ease: "linear", delay }}
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-md"
              whileHover={{ scale: 1.25, transition: { type: 'spring', stiffness: 300 } }}
            >
              <Icon className="w-5 h-5 text-white" />
            </motion.div>
          </motion.div>
        ))}
      </div>
      <div className="px-4 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium">
        Analytical Reasoning
      </div>
    </div>
  );
}


const features: DomainFeature[] = [
  {
    icon: <Code className="w-8 h-8" />,
    title: "Web Development",
    subtitle: "(React, Node.js, Tailwind CSS...)",
    description: "Master modern web technologies and build stunning, responsive applications.",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    bgGradient: "from-cyan-500/40 via-blue-800/10 to-cyan-600/20",
    accentColor: "text-blue-400",
    link: "/domains",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Data Structures & Algorithms",
    subtitle: "(Python, Java, C++...)",
    description: "Build a rock-solid foundation in computer science fundamentals.",
    technologies: ["Python", "Java", "C++", "Algorithm Design", "Complexity Analysis"],
    bgGradient: "from-blue-400/20 via-purple-400/10 to-blue-600/20",
    accentColor: "text-blue-400",
    link: "/domains",
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    title: "Aptitude & Reasoning",
    subtitle: "(Quantitative, Verbal, Logical...)",
    description: "Sharpen your analytical thinking and logical reasoning skills.",
    technologies: ["Quantitative", "Verbal", "Logical", "Analytical", "Critical Thinking"],
    bgGradient: "from-purple-400/20 via-pink-400/10 to-purple-600/20",
    accentColor: "text-purple-400",
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

const heroStars = Array.from({ length: 36 }, (_, index) => ({
  left: `${((index * 29 + 7) % 96) + 2}%`,
  top: `${((index * 47 + 5) % 72) + 4}%`,
  animationDelay: `${(index % 9) * 0.37}s`,
  animationDuration: `${2.4 + (index % 5) * 0.45}s`,
}));

const heroAccentStars = Array.from({ length: 8 }, (_, index) => ({
  left: `${((index * 41 + 13) % 90) + 5}%`,
  top: `${((index * 31 + 9) % 62) + 6}%`,
  animationDelay: `${(index % 5) * 0.65}s`,
  animationDuration: `${3.4 + (index % 4) * 0.55}s`,
}));

const Home = () => {
  const { isDark } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
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

  const handleServicesClick = () => {
    if (isAuthenticated) {
      navigate('/domains');
    } else {
      navigate('/login');
    }
  };

  const handleExploreDomainClick = () => {
    if (isAuthenticated) {
      navigate('/domains');
    } else {
      navigate('/login');
    }
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

      <section className="hero-crescent relative isolate flex min-h-[100svh] items-center overflow-hidden bg-canvas pb-section-sm pt-28 text-ink sm:pt-32 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div
            className="absolute inset-0 opacity-60 dark:opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgb(var(--color-border) / 0.22) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--color-border) / 0.22) 1px, transparent 1px)",
              backgroundSize: "4rem 4rem",
              WebkitMaskImage: "linear-gradient(to bottom, black, transparent 88%)",
              maskImage: "linear-gradient(to bottom, black, transparent 88%)",
            }}
          />
          <div className="absolute left-1/2 top-[12%] h-[30rem] w-[min(52rem,120vw)] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/15" />
          <div className="absolute -right-24 top-1/3 size-72 rounded-full bg-accent-500/10 blur-3xl dark:bg-accent-400/10" />
          <div className="absolute -left-20 bottom-16 size-64 rounded-full bg-signal-500/5 blur-3xl dark:bg-signal-400/5" />
          <div className="absolute inset-x-0 top-[4.5rem] h-px bg-gradient-to-r from-transparent via-line-strong/70 to-transparent" />
        </div>

        {isDark && (
          <div
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
            aria-hidden="true"
          >
            {heroStars.map((star, index) => (
              <span
                key={index}
                className="absolute size-1 rounded-full bg-white/70 animate-twinkle"
                style={{
                  ...star,
                  filter: "blur(0.5px)",
                }}
              />
            ))}
            {heroAccentStars.map((star, index) => (
              <span
                key={`accent-${index}`}
                className="absolute size-1.5 rounded-full bg-accent-200/80 shadow-[0_0_12px_rgba(34,211,238,0.45)] animate-float"
                style={{
                  ...star,
                  filter: "blur(0.35px)",
                }}
              />
            ))}
          </div>
        )}

        <div className="site-container relative z-20">
          <motion.div
            className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <TypingHero />

            <div
              className="my-7 flex w-36 items-center justify-center gap-2 sm:my-8"
              aria-hidden="true"
            >
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-500/80" />
              <span className="size-1.5 rotate-45 border border-accent-500 bg-canvas shadow-[0_0_12px_rgba(6,182,212,0.45)]" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent-500/80" />
            </div>

            <p className="mx-auto max-w-2xl text-balance text-base font-medium leading-relaxed text-ink-muted sm:text-lg">
              We are a community of developers, designers, and innovators focused on hands-on creation. Join us to collaborate on real-world projects, hone your skills, and build a portfolio that stands out.
            </p>

            <div className="mt-8 flex w-full max-w-xs flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleServicesClick}
                className="btn btn-secondary w-full sm:w-auto sm:min-w-36"
              >
                Services
              </button>
              <Link
                to="/login"
                className="btn btn-primary group w-full sm:w-auto sm:min-w-52"
              >
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
                <span>Join Our Community</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-space relative z-[9] overflow-x-clip bg-canvas">
        <div className="site-container-wide">
          <motion.div
            className="relative z-10 mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center">
              <button type="button" className="eyebrow group relative overflow-hidden">
                <span className="absolute inset-x-0 -top-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-accent-500 to-transparent transition-all duration-500 group-hover:w-3/4" />
                <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-brand-500 to-transparent transition-all duration-500 group-hover:w-3/4" />
                <span className="relative">Learning Paths</span>
              </button>
            </div>

            <h2 className="section-heading mt-5 text-center">
              Our Different{" "}
              <span className="bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text font-light italic text-transparent dark:from-brand-300 dark:to-accent-300">
                Technical Domains
              </span>
            </h2>

            <p className="section-lead mx-auto text-center">
              Comprehensive learning paths designed to accelerate career growth and technical transformation.
            </p>
          </motion.div>

          <div className="relative mt-12 space-y-6 sm:mt-16 sm:space-y-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                ref={(el) => (featureRefs.current[idx] = el)}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.08 }}
                className="ui-card relative overflow-hidden p-4 sm:p-6 lg:p-8"
              >
                <div
                  className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent-500/70 to-transparent"
                  aria-hidden="true"
                />

                <div className="grid min-w-0 items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
                  <motion.div
                    className={`min-w-0 space-y-5 ${idx % 2 === 1 ? "lg:order-2" : ""}`}
                    initial={{ opacity: 0, x: idx % 2 === 1 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="flex size-12 items-center justify-center rounded-control border border-brand-500/20 bg-brand-500/10 text-brand-700 dark:text-brand-300">
                      {feature.icon}
                    </div>

                    <h3 className="font-display text-title text-ink">{feature.title}</h3>
                    <p className="text-base leading-relaxed text-ink-muted sm:text-lg">
                      {feature.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {feature.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-line bg-surface-muted px-3 py-1.5 font-mono text-[0.7rem] font-semibold text-brand-700 dark:text-brand-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleExploreDomainClick}
                      className={`btn btn-secondary group w-full sm:w-auto ${
                        idx === activeFeature
                          ? "border-brand-400 text-brand-700 dark:text-brand-300"
                          : ""
                      }`}
                    >
                      <span>Explore Domain</span>
                      <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </motion.div>

                  <motion.div
                    className={`min-w-0 ${idx % 2 === 1 ? "lg:order-1" : ""}`}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="ui-card-muted relative min-w-0 overflow-hidden p-3 sm:p-5">
                      <ServiceUIGraphic feature={feature} isDark={isDark} />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <StatsSection />

      {/* events */}
      <section className={`relative py-24 ${isDark ? "bg-black" : "bg-slate-50"}`}>
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

            <h2 className={`mt-7 text-center text-4xl font-semibold tracking-tighter md:text-[58px] md:leading-[60px] ${isDark
                ? "bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent"
                : "text-gray-900"
              }`}>
              Explore our Past Events
            </h2>

            <p className={`text-xl max-w-3xl mx-auto leading-relaxed mt-2 ${isDark ? "text-gray-400" : "text-gray-700"
              }`}>
              Take a look at some of our past events and initiatives      </p>
          </motion.div>

          {/* Events Grid - Using the EventCard component */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}


          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`relative py-24 ${isDark ? "bg-black" : "bg-gray-50"}`}>
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

            <h2 className={`mt-5 text-center text-4xl font-semibold tracking-tighter md:text-[54px] md:leading-[60px] ${isDark
                ? "bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent"
                : "text-gray-900"
              }`}>
              What our members say
            </h2>

            <p className={`mt-5 text-center text-lg ${isDark ? "text-gray-400" : "text-gray-600"
              }`}>
              Voices from our community, hear what our members have to say about their journey..
            </p>
          </div>

          <div className="my-16 flex max-h-[738px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
            {/* Mobile: single column */}
            <div className="flex flex-col md:hidden">
              <Marquee pauseOnHover vertical className="[--duration:25s]">
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.username} {...testimonial} />
                ))}
              </Marquee>
            </div>

            <div className="hidden md:flex gap-6 w-full justify-center">
              <div>
                <Marquee pauseOnHover vertical className="[--duration:20s]">
                  {firstColumn.map((testimonial) => (
                    <TestimonialCard key={testimonial.username} {...testimonial} />
                  ))}
                </Marquee>
              </div>

              <div className="hidden lg:block">
                <Marquee reverse pauseOnHover vertical className="[--duration:25s]">
                  {secondColumn.map((testimonial) => (
                    <TestimonialCard key={testimonial.username} {...testimonial} />
                  ))}
                </Marquee>
              </div>

              <div className="hidden xl:block">
                <Marquee pauseOnHover vertical className="[--duration:30s]">
                  {thirdColumn.map((testimonial) => (
                    <TestimonialCard key={testimonial.username} {...testimonial} />
                  ))}
                </Marquee>
              </div>
            </div>
          </div>

          <div className="-mt-8 flex justify-center">
            <button className={`group relative inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-all hover:bg-blue-500/10 active:scale-95 ${isDark
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

      <section className={`relative py-24 transition-colors duration-500 ${isDark ? "bg-black" : "bg-white"}`}>
        <div className="mx-auto max-w-4xl rounded-[40px] border border-black/5 dark:border-white/20 p-2 shadow-sm">
          <div className={`relative mx-auto overflow-hidden rounded-[38px] border border-black/5 dark:border-white/20 p-2 shadow-sm ${isDark ? "bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" : "bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500"
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
                <h2 className={`text-4xl font-bold mb-6 tracking-tighter ${isDark
                    ? "bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent"
                    : "text-white"
                  }`}>
                  Ready to Begin Your Journey?
                </h2>

                {/* Subtitle */}
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${isDark ? "text-blue-200" : "text-blue-100"
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
