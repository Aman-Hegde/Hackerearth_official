import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Brain, ArrowRight, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const domains = [
  {
    icon: Code,
    title: "Web Development",
    description: "Master modern web technologies and build stunning, responsive applications that shape the digital world.",
    technologies: ["React", "Node.js", "TypeScript", "Next.js", "Tailwind CSS"],
    gradient: "from-blue-500 to-cyan-500",
    accentColor: "text-blue-400",
  },
  {
    icon: Database,
    title: "Data Structures & Algorithms",
    description: "Build a rock-solid foundation in computer science fundamentals and competitive programming excellence.",
    technologies: ["C++", "Python", "Java", "LeetCode", "Algorithm Design"],
    gradient: "from-purple-500 to-pink-500",
    accentColor: "text-purple-400",
  },
  {
    icon: Brain,
    title: "Aptitude & Reasoning",
    description: "Sharpen your analytical thinking and logical reasoning skills for academic and professional success.",
    technologies: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Analytical Skills"],
    gradient: "from-orange-500 to-yellow-500",
    accentColor: "text-orange-400",
  }
];

const fadeIn = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Domains = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-500 relative ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      {/* Background Elements */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'} 0%, transparent 50%), radial-gradient(circle at 80% 50%, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 0%, transparent 50%), radial-gradient(circle at 50% 80%, ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.03)'} 0%, transparent 50%)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="initial"
          whileInView="animate"
          variants={fadeIn}
          viewport={{ once: true }}
        >
          <div className="flex justify-center">
            <button
              type="button"
              className="group relative z-[60] mx-auto rounded-full border px-6 py-1 text-xs backdrop-blur transition-all duration-300 active:scale-100 md:text-sm"
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

          <h1 className={`mt-5 text-center text-4xl font-bold tracking-tighter md:text-[54px] md:leading-[60px] ${
            isDark
              ? "bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent"
          }`}>
            Our Different <span className="font-light italic bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Technical Domains</span>
          </h1>

          <p className={`text-xl max-w-3xl mx-auto leading-relaxed mt-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Comprehensive learning paths designed to accelerate career growth and technical transformation.
          </p>
        </motion.div>

        {/* Domains Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {domains.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -5, boxShadow: isDark ? "0 15px 30px rgba(0,0,0,0.4), 0 0 15px rgba(59,130,246,0.3)" : "0 15px 30px rgba(0,0,0,0.1), 0 0 15px rgba(99,102,241,0.2)" }}
                className={`
                  relative rounded-3xl p-8 overflow-hidden transform-gpu
                  transition-all duration-300 cursor-pointer isolate
                  border backdrop-blur-sm
                  ${isDark
                    ? "border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset]"
                    : "border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-lg"
                  }
                `}
              >
                {/* Glowing border effect */}
                <div
                  className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  style={{
                    background: `linear-gradient(to right, ${domain.gradient.split('from-')[1].split('to-')[0].trim().replace('-', ' ')}, ${domain.gradient.split('to-')[1].trim().replace('-', ' ')})`,
                    filter: `blur(8px)`,
                    zIndex: -1,
                  }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-r ${domain.gradient} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {domain.title}
                  </h3>
                  <p className={`mb-6 leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    {domain.description}
                  </p>
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {domain.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className={`px-3 py-1 rounded-full border font-semibold text-xs bg-gradient-to-r ${domain.gradient.replace('from-', 'from-').replace('to-', 'to-')} text-white shadow-md`}
                        style={{
                          borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)', // Example for a subtle border
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {/* CTA Button */}
                  <Link
                    to="/domains-detail" // Or specific domain page
                    className="inline-flex items-center text-base font-medium transition-colors group text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <span>Explore Domain</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section (Redesigned to match Home page footer CTA) */}
        <section className={`relative z-10 py-24 transition-colors duration-500 ${isDark ? "bg-black" : "bg-slate-50"}`}>
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
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
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
                            <ArrowRight className="w-5 h-5" />
                            Get Started
                          </p>
                        </div>
                        <div className="border-white/30 flex size-[26px] items-center justify-center rounded-full border-2 transition-all ease-in-out group-hover:ml-2">
                          <ArrowRight className="w-4 h-4 text-white transition-all ease-in-out group-hover:rotate-45" />
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Domains;