import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext"; // Adjust path to your theme context
import { Quote } from "lucide-react";

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
    <div
      className={`relative w-full max-w-xs overflow-hidden rounded-3xl border p-8 ${
        isDark
          ? "border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset]"
          : "border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-lg"
      }`}
    >
      {isDark && (
        <div className="absolute -top-5 -left-5 -z-10 h-40 w-40 rounded-full bg-gradient-to-b from-blue-500/10 to-transparent blur-md"></div>
      )}

      <Quote className={`w-8 h-8 mb-4 ${isDark ? "text-blue-400" : "text-blue-600"} opacity-60`} />

      <div className={`leading-relaxed ${isDark ? "text-gray-200" : "text-gray-700"}`}>{body}</div>

      <div className="mt-6 flex items-center gap-3">
        <div className="relative">
          <div
            className={`h-12 w-12 rounded-full transition-transform duration-200 hover:scale-105 ${
              isDark
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

// Testimonials Data Array
const testimonials = [
  {
    name: "Vedant Suresh Mahalle ",
    username: "@vedantmahalle45",
    body: "Being selected as the Co-Documentation Head through HackerEarth has been an incredible opportunity to combine my technical and creative skills. From working on web, aptitude, and DSA content to collaborating on documentation and project organization, this experience has strengthened my ability to communicate ideas clearly and contribute effectively to a team. It has truly been a rewarding journey of learning, leadership, and growth.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Hello",
    username: "@sara.codes",
    body: "The DSA learning path helped me crack my dream company's coding interview. The practice problems are perfectly curated.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Devon Carter",
    username: "@devninja",
    body: "Our team built a full-stack project in 2 weeks using the web development resources. Saved so much learning time.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
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
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
  },
];

// Testimonial Slider Component with continuous sliding using Framer Motion
export default function TestimonialSlider() {
  const cardWidth = 320; // Approximate card width including padding and gap in px
  const gap = 24; // Tailwind gap-6 = 6*4px = 24px
  const totalCards = testimonials.length;
  const totalWidth = (cardWidth + gap) * totalCards * 2; // doubled for seamless looping

  return (
    <div className="overflow-hidden w-full">
      <motion.div
        className="flex gap-6"
        style={{ width: totalWidth }}
        animate={{ x: [0, -totalWidth / 2] }}
        transition={{ repeat: Infinity, repeatType: "loop", duration: 20, ease: "linear" }}
      >
        {testimonials.concat(testimonials).map((testimonial, i) => (
          <TestimonialCard
            key={i}
            img={testimonial.img}
            name={testimonial.name}
            username={testimonial.username}
            body={testimonial.body}
          />
        ))}
      </motion.div>
    </div>
  );
}
