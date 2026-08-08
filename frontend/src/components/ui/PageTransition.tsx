import type { ReactNode } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { getPageEntrance } from '../../lib/motion';

interface PageTransitionProps
  extends Omit<
    HTMLMotionProps<'div'>,
    'animate' | 'children' | 'exit' | 'initial' | 'variants'
  > {
  children: ReactNode;
}

const PageTransition = ({ children, className, ...props }: PageTransitionProps) => {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      {...props}
      className={cn('min-h-full origin-top', className)}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={getPageEntrance({ reducedMotion: shouldReduceMotion })}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
