import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export interface TextRevealProps extends React.ComponentPropsWithoutRef<"div"> {
  children: string;
  className?: string;
}

export const TextReveal: React.FC<TextRevealProps> = ({ children, className }) => {
  const { isDark } = useTheme(); // Correctly destructure isDark here
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  if (typeof children !== "string") {
    throw new Error("TextReveal: children must be a string");
  }
  const words = children.split(" ");

  return (
    <div ref={containerRef} className={`relative z-0 h-[280vh] ${className || ""}`}>
      <div
        className={
          "sticky top-[20vh] mx-auto flex h-[40vh] max-w-4xl items-center bg-transparent"
        }
      >
        <span
          className={`flex flex-wrap p-5 text-2xl font-bold md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl ${
            isDark ? "text-white/20" : "text-black/20"
          }`}
        >
          {words.map((word, i) => {
            const maxProgress = 0.95;
            const start = (i / words.length) * maxProgress;
            const end = start + (1 / words.length) * maxProgress;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]} isDark={isDark}>
                {word}
              </Word>
            );
          })}
        </span>
      </div>
    </div>
  );
};

interface WordProps {
  children: React.ReactNode;
  progress: any; // MotionValue<number>
  range: [number, number];
  isDark: boolean;
}

const Word: React.FC<WordProps> = ({ children, progress, range, isDark }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative mx-1 lg:mx-1.5">
      <span className={`absolute opacity-20 ${isDark ? "text-white" : "text-black"}`}>
        {children}
      </span>
      <motion.span style={{ opacity }} className={isDark ? "text-white" : "text-black"}>
        {children}
      </motion.span>
    </span>
  );
};
