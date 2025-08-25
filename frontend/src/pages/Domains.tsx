import { useState, useEffect } from 'react';
import { Code, Database, Brain, ArrowRight} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Domains = () => {
  const [hoveredDomain, setHoveredDomain] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const { isDark } = useTheme(); // <-- use your theme

  // Track scroll position for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const domains = [
    {
      icon: Code,
      title: "Web Development",
      description: "Master modern web technologies and build stunning, responsive applications that shape the digital world.",
      longDescription: "Dive deep into the world of web development with cutting-edge frameworks and technologies. Learn React, Node.js, TypeScript, and modern CSS to create beautiful, performant web applications.",
      technologies: ["React", "Node.js", "TypeScript", "Next.js", "Tailwind CSS", "MongoDB"],
      projects: "25+ Projects",
      members: "180 Members",
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      bgGradient: "from-blue-50 to-cyan-50",
      borderGradient: "from-blue-200 to-cyan-200",
      features: [
        "Full-stack development mastery",
        "Modern framework expertise",
        "Responsive design principles",
        "API development & integration"
      ]
    },
    {
      icon: Database,
      title: "Data Structures & Algorithms",
      description: "Build a rock-solid foundation in computer science fundamentals and competitive programming excellence.",
      longDescription: "Master the art of problem-solving with comprehensive training in data structures and algorithms. Prepare for technical interviews and competitive programming challenges.",
      technologies: ["C++", "Python", "Java", "LeetCode"],
      projects: "500+ Problems Solved",
      members: "220 Members",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      bgGradient: "from-purple-50 to-pink-50",
      borderGradient: "from-purple-200 to-pink-200",
      features: [
        "Competitive programming training",
        "Technical interview preparation",
        "Algorithm optimization techniques",
        "Complex problem-solving skills"
      ]
    },
    {
      icon: Brain,
      title: "Aptitude & Reasoning",
      description: "Sharpen your analytical thinking and logical reasoning skills for academic and professional success.",
      longDescription: "Develop critical thinking abilities through comprehensive aptitude training. Excel in placement tests, competitive exams, and logical reasoning challenges.",
      technologies: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Analytical Skills"],
      projects: "1000+ Questions Practiced",
      members: "150 Members",
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      bgGradient: "from-orange-50 to-amber-50",
      borderGradient: "from-orange-200 to-amber-200",
      features: [
        "Placement test preparation",
        "Logical reasoning mastery",
        "Quick calculation techniques",
        "Pattern recognition skills"
      ]
    }
  ];

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-500 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'}`}>
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`${isDark
          ? "absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-900/20 to-indigo-900/10"
          : "absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-600/10"
          } rounded-full blur-3xl`}></div>
        <div className={`${isDark
          ? "absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-900/20 to-pink-900/10"
          : "absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10"
          } rounded-full blur-3xl`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-100">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? "text-white" : ""}`}>
            <span className={`${isDark
              ? "bg-gradient-to-r from-white via-blue-200 to-indigo-300 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent"}`}>
              Our Domains
            </span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? "text-slate-400" : "text-gray-600"}`}>
            Explore our three specialized domains.
          </p>
        </div>

        {/* Domains Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 overflow-visible">
          {domains.map((domain, index) => {
            const Icon = domain.icon;
            // Parallax + hover
            const parallaxStyle = {
              transform: `translateY(${scrollY * 0.05 * (index + 1)}px)`,
              animationDelay: `${index * 150}ms`,
              animationFillMode: 'both'
            };
            return (
              <div
                key={index}
                className={`
                  group relative rounded-3xl p-8 opacity-0 animate-fade-in-up
                  transition-all duration-300 cursor-pointer shadow-xl min-h-[480px] isolate
                  border backdrop-blur-sm
                  ${isDark
                    ? "bg-slate-800/70 border-slate-700/60 hover:border-slate-600"
                    : "bg-white/80 border-gray-200/50 hover:border-gray-300"
                  }
                  hover:-translate-y-2 hover:shadow-2xl hover:brightness-105
                `}
                style={parallaxStyle}
                onMouseEnter={() => setHoveredDomain(index)}
                onMouseLeave={() => setHoveredDomain(null)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${domain.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                {/* Border Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${domain.borderGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}></div>
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${domain.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-gray-500"}`}>{domain.projects}</div>
                      <div className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-gray-500"}`}>{domain.members}</div>
                    </div>
                  </div>
                  <h3 className={`
    text-2xl font-bold mb-4 transition-colors
    ${isDark
                      ? hoveredDomain === index
                        ? "text-black drop-shadow-lg"
                        : "text-slate-100"
                      : hoveredDomain === index
                        ? "text-blue-700"
                        : "text-gray-900"
                    }
  `}>
                    {domain.title}
                  </h3>
                  <p className={`mb-6 leading-relaxed transition-colors ${isDark
                      ? hoveredDomain === index
                        ? "text-black"
                        : "text-indigo-200"
                      : hoveredDomain === index
                        ? "text-black"
                        : "text-gray-600"
                    }`}>
                    {domain.description}
                  </p>
                  {/* Technologies */}
                  <div className="mb-6">
                    <h4
                      className={`text-sm font-semibold mb-3 transition-colors
    ${isDark
                          ? hoveredDomain === index
                            ? "text-black drop-shadow-lg"
                            : "text-slate-200"
                          : hoveredDomain === index
                            ? "text-blue-700"
                            : "text-gray-700"
                        }
  `}
                    >
                      Technologies & Skills:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {domain.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${domain.gradient} text-white shadow-md hover:shadow-lg transition-shadow`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* CTA Button */}
                  <button className={`w-full bg-gradient-to-r ${domain.gradient} px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group shadow-md`}>
                    <span>Explore Domain</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mb-20 animate-scale-in">
          <div className={`
            rounded-3xl p-12 shadow-xl border
            ${isDark
              ? "bg-slate-800/80 border-slate-700/50"
              : "bg-white/80 border-blue-200/70"}
            backdrop-blur-sm
          `}>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : ""}`}>
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Ready to Dive Deep?
              </span>
            </h2>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-gray-600"}`}>
              Choose your domain and start building amazing projects with our expert mentors and passionate community.
            </p>
            <button className="group relative bg-gradient-to-r from-blue-500 to-purple-600 px-10 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg">
              <span className="relative z-10 flex items-center space-x-2">
                <span>Join a Domain</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Domains;
