import type { Transition, Variants } from 'framer-motion';

export type RevealVariant = 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale';

interface MotionPresetOptions {
  reducedMotion?: boolean;
  delay?: number;
  duration?: number;
  stagger?: number;
}

export const dreamEase: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const quickExitEase: [number, number, number, number] = [0.4, 0, 1, 1];

const entranceTransition = ({
  reducedMotion = false,
  delay = 0,
  duration = 0.72,
  stagger = 0,
}: MotionPresetOptions): Transition => ({
  delay: reducedMotion ? 0 : delay,
  delayChildren: reducedMotion ? 0 : delay,
  duration: reducedMotion ? 0.16 : duration,
  ease: dreamEase,
  staggerChildren: reducedMotion ? 0 : stagger,
});

export const getPageEntrance = (options: MotionPresetOptions = {}): Variants => {
  const { reducedMotion = false } = options;

  return {
    initial: reducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 18, scale: 0.985 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: entranceTransition({ duration: 0.58, ...options }),
    },
    exit: reducedMotion
      ? { opacity: 0, transition: { duration: 0.1 } }
      : {
          opacity: 0,
          y: -8,
          scale: 0.995,
          transition: { duration: 0.18, ease: quickExitEase },
        },
  };
};

const revealOrigin = (variant: RevealVariant, reducedMotion: boolean) => {
  if (reducedMotion) return { opacity: 0 };

  switch (variant) {
    case 'fade':
      return { opacity: 0 };
    case 'slide-left':
      return { opacity: 0, x: -44 };
    case 'slide-right':
      return { opacity: 0, x: 44 };
    case 'scale':
      return { opacity: 0, scale: 0.94 };
    case 'slide-up':
    default:
      return { opacity: 0, y: 38 };
  }
};

export const getSectionReveal = (
  variant: RevealVariant = 'slide-up',
  options: MotionPresetOptions = {},
): Variants => ({
  hidden: revealOrigin(variant, options.reducedMotion ?? false),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: entranceTransition(options),
  },
});

export const getStaggeredChildren = (options: MotionPresetOptions = {}): Variants => ({
  hidden: {},
  visible: {
    transition: entranceTransition({ stagger: 0.1, ...options }),
  },
});

export const getSlideUp = (options: MotionPresetOptions = {}) =>
  getSectionReveal('slide-up', options);

export const getSlideLeft = (options: MotionPresetOptions = {}) =>
  getSectionReveal('slide-left', options);

export const getSlideRight = (options: MotionPresetOptions = {}) =>
  getSectionReveal('slide-right', options);

export const getScaleFade = (options: MotionPresetOptions = {}) =>
  getSectionReveal('scale', options);

export const getFloatingDecoration = (reducedMotion = false): Variants => ({
  rest: { opacity: 1, rotate: 0, y: 0 },
  float: reducedMotion
    ? { opacity: 1, rotate: 0, y: 0 }
    : {
        opacity: [0.82, 1, 0.82],
        rotate: [0, 0.8, 0],
        y: [0, -10, 0],
        transition: { duration: 8, ease: 'easeInOut', repeat: Infinity },
      },
});
