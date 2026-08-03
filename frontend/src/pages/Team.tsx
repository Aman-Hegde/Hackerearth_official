"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import Loader from "../components/Loader";

// --- Animation Variants ---
const getFadeInUp = (shouldReduceMotion: boolean | null): Variants => ({
  initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: shouldReduceMotion ? 0 : 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
});

const getStaggerContainer = (shouldReduceMotion: boolean | null): Variants => ({
  animate: {
    transition: {
      staggerChildren: shouldReduceMotion ? 0 : 0.08,
    },
  },
});

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
    slogan: "Code. Create. Captivate.",
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
    slogan: "Code with purpose, build with passion.",
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
    image: "/images/pratheeksha.jpeg",
    skills: ["Python"," ui/ux","networking/security"],
    slogan: "Not just solving problems - making them pretty.",
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
    image: "/images/gautham.jpeg",
    skills: ["Graphics", "Design"],
    slogan: "Great vibes, amazing people, and lots of memories  that’s all that matters!",
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

type TeamMember = (typeof coreTeam)[number];

const teamSections: Array<{ title: string; data: TeamMember[] }> = [
  { title: "Core Committee", data: coreTeam },
  { title: "Web Team", data: webTeam },
  { title: "Tech Leads", data: techLeads },
  { title: "Documentation Team", data: documentationTeam },
  { title: "Publicity Team", data: publicityTeam },
  { title: "Social Media Team", data: socialMediaTeam },
  { title: "Graphics Team", data: graphicsTeam },
];

type TeamAccent = "primary" | "technical" | "creative" | "success";

const teamSectionAccents: TeamAccent[] = [
  "primary",
  "technical",
  "creative",
  "success",
  "primary",
  "technical",
  "creative",
];

const teamAccentStyles: Record<
  TeamAccent,
  {
    card: string;
    topBorder: string;
    line: string;
    label: string;
    role: string;
    skill: string;
    social: string;
  }
> = {
  primary: {
    card: "border-primary/25 hover:border-primary/45",
    topBorder: "top-border-accent-primary",
    line: "via-primary/70",
    label: "text-primary-text",
    role: "text-primary-text",
    skill: "border-primary/20 bg-primary/5",
    social: "border-primary/20 text-primary-text hover:border-primary/40",
  },
  technical: {
    card: "border-technical/25 hover:border-technical/45",
    topBorder: "top-border-accent-cyan",
    line: "via-technical/70",
    label: "text-technical-text",
    role: "text-technical-text",
    skill: "border-technical/20 bg-technical/5",
    social: "border-technical/20 text-technical-text hover:border-technical/40",
  },
  creative: {
    card: "border-creative/25 hover:border-creative/45",
    topBorder: "top-border-accent-violet",
    line: "via-creative/70",
    label: "text-creative-text",
    role: "text-creative-text",
    skill: "border-creative/20 bg-creative/5",
    social: "border-creative/20 text-creative-text hover:border-creative/40",
  },
  success: {
    card: "border-success/25 hover:border-success/45",
    topBorder: "top-border-accent-emerald",
    line: "via-success/70",
    label: "text-success-text",
    role: "text-success-text",
    skill: "border-success/20 bg-success/5",
    social: "border-success/20 text-success-text hover:border-success/40",
  },
};

// --- Reusable Team Member Card Component ---
const TeamMemberCard = ({
  member,
  accent,
  entranceVariants,
  shouldReduceMotion,
}: {
  member: TeamMember;
  accent: (typeof teamAccentStyles)[TeamAccent];
  entranceVariants: Variants;
  shouldReduceMotion: boolean | null;
}) => {
  return (
    <motion.article
      variants={entranceVariants}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      className={`ui-card group mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden transition-colors duration-300 hover:shadow-surface ${accent.card} ${accent.topBorder}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden border-b border-line bg-surface-muted">
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          decoding="async"
          className="size-full object-cover object-[center_20%]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/10 via-transparent to-transparent"
          aria-hidden="true"
        />
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent to-transparent ${accent.line}`}
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold leading-tight text-ink">
          {member.name}
        </h3>
        <p className={`mt-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] ${accent.role}`}>
          {member.position}
        </p>

        {member.slogan && (
          <p className="mt-4 text-sm italic leading-relaxed text-ink-muted">
            "{member.slogan}"
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {member.skills.length > 0 ? (
            member.skills.slice(0, 3).map((skill: string) => (
              <span
                key={skill}
                className={`rounded-full border px-3 py-1 font-mono text-xs font-semibold text-ink-muted ${accent.skill}`}
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm italic text-ink-subtle">Skills to be updated</span>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-ghost btn-icon group/social bg-surface-muted focus-visible:outline-offset-2 ${accent.social}`}
              aria-label={`GitHub profile for ${member.name}`}
            >
              <Github
                className={`size-5 transition-transform duration-200 ${
                  shouldReduceMotion ? "" : "group-hover/social:translate-x-0.5"
                }`}
                aria-hidden="true"
              />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-ghost btn-icon group/social bg-surface-muted focus-visible:outline-offset-2 ${accent.social}`}
              aria-label={`LinkedIn profile for ${member.name}`}
            >
              <Linkedin
                className={`size-5 transition-transform duration-200 ${
                  shouldReduceMotion ? "" : "group-hover/social:translate-x-0.5"
                }`}
                aria-hidden="true"
              />
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className={`btn btn-ghost btn-icon group/social bg-surface-muted focus-visible:outline-offset-2 ${accent.social}`}
              aria-label={`Email ${member.name}`}
            >
              <Mail
                className={`size-5 transition-transform duration-200 ${
                  shouldReduceMotion ? "" : "group-hover/social:translate-x-0.5"
                }`}
                aria-hidden="true"
              />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

// --- Main Team Page Component ---
const Team = () => {
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const fadeInUp = getFadeInUp(shouldReduceMotion);
  const staggerContainer = getStaggerContainer(shouldReduceMotion);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-ink transition-colors duration-500">
        <Loader size={80} />
        <p className="mt-4 text-lg font-medium">Loading Team...</p>
      </div>
    );
  }

  return (
    <main className="section-glow-subtle min-h-screen overflow-hidden bg-canvas text-ink transition-colors duration-500">
      <div className="site-container-wide section-space pt-28 sm:pt-32">
        {/* Header */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.h1 variants={fadeInUp} className="section-heading">
            <span className="text-gradient-subtle">Meet Our Team</span>
          </motion.h1>
        </motion.div>

        {/* Sections */}
        <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-24">
          {teamSections.map((section, idx) => {
            const accent = teamAccentStyles[teamSectionAccents[idx]];

            return (
              <section
                className="scroll-mt-24"
                key={section.title}
                aria-labelledby={`team-section-${idx}`}
              >
                <motion.h2
                  id={`team-section-${idx}`}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="mb-8 text-center font-display text-title text-ink sm:mb-10"
                >
                  <span className={`inline-flex px-4 pt-3 ${accent.label} ${accent.topBorder}`}>
                    {section.title}
                  </span>
                </motion.h2>

                <motion.div
                  initial="initial"
                  whileInView="animate"
                  variants={staggerContainer}
                  viewport={{ once: true, amount: 0.2 }}
                  className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
                >
                  {section.data.map((member) => (
                    <TeamMemberCard
                      key={member.name}
                      member={member}
                      accent={accent}
                      entranceVariants={fadeInUp}
                      shouldReduceMotion={shouldReduceMotion}
                    />
                  ))}
                </motion.div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Team;
