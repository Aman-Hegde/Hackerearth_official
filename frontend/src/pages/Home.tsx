import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Code, Users, Trophy, Calendar, Rocket, ChevronRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import TypingHero from "../components/TypingHero";

function ServiceUIGraphic({ feature }: { feature: any }) {
  return (
    <div className="relative">
      <motion.div
        className="absolute inset-0 bg-white/5 rounded-3xl blur-3xl dark:bg-gray-800/30"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative bg-white/95 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-300 dark:border-gray-700 rounded-3xl p-8 overflow-hidden shadow-2xl">
        <div className="space-y-6">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center space-x-2 px-4 py-3 bg-gray-200 dark:bg-gray-700">
              <div className="w-3 h-3 bg-gray-500 dark:bg-gray-600 rounded-full animate-pulse" />
              <div
                className="w-3 h-3 bg-gray-600 dark:bg-gray-700 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-3 h-3 bg-gray-700 dark:bg-gray-800 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              />
              <div className="flex-1 bg-white dark:bg-gray-900 rounded px-3 py-1 ml-4 shadow-inner">
                <span className="text-xs text-gray-600 dark:text-gray-400">{feature.title} Learning Path</span>
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 min-h-[140px]">
              <div className="space-y-4">
                <motion.div
                  className="h-6 bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 rounded w-3/4 shadow-sm"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full shadow-sm" />
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3 shadow-sm" />
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {["Beginner", "Intermediate", "Advanced"].map((level, i) => (
                    <motion.div
                      key={level}
                      className="h-14 bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    >
                      <span className="text-xs font-medium text-gray-900 dark:text-gray-300">{level}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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

const stats = [
  { number: "500+", label: "Active Members", icon: <Users className="w-10 h-10" /> },
  { number: "50+", label: "Projects Completed", icon: <Code className="w-10 h-10" /> },
  { number: "25+", label: "Events Organized", icon: <Calendar className="w-10 h-10" /> },
  { number: "15+", label: "Awards Won", icon: <Trophy className="w-10 h-10" /> },
];

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
    <div className={`${isDark ? "bg-slate-900" : "bg-slate-50"} overflow-hidden transition-colors duration-500`}>
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
        <div className="max-w-4xl mx-auto text-center space-y-8">
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
          <motion.div
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-800/50 rounded-full border border-gray-700 mb-6 backdrop-blur-sm"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Learning Paths</span>
          </motion.div>

          <h2 className="text-5xl sm:text-6xl font-black mb-6 leading-tight text-gray-900 dark:text-white">
            Our Different <span className="font-light italic">Technical Domains</span>
          </h2>

          <p className="text-xl max-w-3xl mx-auto leading-relaxed text-gray-700 dark:text-gray-400">
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
                  <motion.div
                    className={`inline-flex items-center space-x-3 px-4 py-2 bg-gradient-to-r ${feature.bgGradient} rounded-full border border-white/10 mb-6`}
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }}
                  >
                    <div className={feature.accentColor}>{feature.icon}</div>
                    <span className={`text-sm font-medium ${feature.accentColor}`}>{feature.subtitle}</span>
                  </motion.div>
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
                  <ServiceUIGraphic feature={feature} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section
        className={`relative z-10 py-24 transition-colors duration-500 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 dark:bg-none`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative inline-block mb-6">
                  <div
                    className={`w-20 h-20 border rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg ${isDark
                      ? "bg-gray-400/60 border-gray-300/50"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    {stat.icon}
                  </div>
                </div>
                <div className={`text-4xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>{stat.number}</div>
                <div className={`font-medium text-lg ${isDark ? "text-slate-400" : "text-gray-600"}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className={`relative z-10 py-24 transition-colors duration-500 ${isDark ? "bg-slate-800/30" : "bg-white"}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`border rounded-2xl p-16 hover:scale-105 transition-all duration-500 shadow-xl ${isDark
              ? "bg-slate-800/60 border-slate-700/50"
              : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
              }`}
          >
            <div className="mb-8">
              <div
                className={`w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center ${isDark ? "bg-blue-600" : "bg-gradient-to-r from-blue-600 to-indigo-600"
                  }`}
              >
                <Rocket className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-8 tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
              Ready to Begin Your Journey?
            </h2>
            <p className={`text-xl mb-12 leading-relaxed max-w-3xl mx-auto ${isDark ? "text-slate-400" : "text-gray-600"}`}>
              Join a community of innovators, builders, and leaders. Start your path to technical excellence today.
            </p>
            <Link
              to="/login"
              className={`group relative inline-flex items-center space-x-4 px-12 py-4 rounded-xl font-semibold text-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${isDark
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                }`}
            >
              <span>Get Started</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
