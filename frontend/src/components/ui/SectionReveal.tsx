import type { ReactNode } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { getSectionReveal, type RevealVariant } from '../../lib/motion';

interface SectionRevealProps
  extends Omit<
    HTMLMotionProps<'div'>,
    'animate' | 'children' | 'initial' | 'transition' | 'variants' | 'whileInView'
  > {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
}

const SectionReveal = ({
  children,
  variant = 'slide-up',
  delay = 0,
  duration = 0.72,
  stagger = 0,
  once = true,
  amount = 0.2,
  className,
  ...props
}: SectionRevealProps) => {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const variants = getSectionReveal(variant, {
    reducedMotion: shouldReduceMotion,
    delay,
    duration,
    stagger,
  });

  return (
    <motion.div
      {...props}
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
