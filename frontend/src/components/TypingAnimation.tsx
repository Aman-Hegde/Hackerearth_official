"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import { motion, useInView, type MotionProps } from "framer-motion";

interface TypingAnimationProps extends MotionProps {
  children: string;
  className?: string;
  duration?: number; // ms per character
  delay?: number; // ms before starting
  as?: React.ElementType;
  startOnView?: boolean;
}

export function TypingAnimation({
  children,
  className,
  duration = 100,
  delay = 0,
  as: Component = "div",
  startOnView = false,
  ...props
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  const elementRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(elementRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  });

  // Start typing when conditions are met
  useEffect(() => {
    if (!startOnView) {
      const startTimeout = setTimeout(() => {
        setStarted(true);
      }, delay);
      return () => clearTimeout(startTimeout);
    }
    if (isInView) {
      const startTimeout = setTimeout(() => {
        setStarted(true);
      }, delay);
      return () => clearTimeout(startTimeout);
    }
  }, [delay, startOnView, isInView]);

  // Typing animation effect
  useEffect(() => {
    if (!started) return;
    const chars = Array.from(children);
    let i = 0;
    const typingEffect = setInterval(() => {
      setDisplayedText(chars.slice(0, i + 1).join(""));
      i++;
      if (i === chars.length) clearInterval(typingEffect);
    }, duration);
    return () => clearInterval(typingEffect);
  }, [children, duration, started]);

  const MotionComponent = motion(Component as React.ElementType);

  return (
    <MotionComponent
      ref={elementRef}
      className={cn(
        "text-4xl font-bold leading-[5rem] tracking-tight",
        className
      )}
      {...props}
    >
      {displayedText}
    </MotionComponent>
  );
}
