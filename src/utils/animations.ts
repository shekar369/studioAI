/**
 * Framer Motion Animation Variants
 * Reusable animation configurations for Studio AI
 */

import type { Transition } from 'framer-motion';

// ========================================
// FADE ANIMATIONS
// ========================================

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

// ========================================
// SCALE ANIMATIONS
// ========================================

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const scaleInCenter = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

// ========================================
// STAGGER CONTAINERS
// ========================================

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// ========================================
// STAGGER CHILDREN
// ========================================

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
};

export const staggerItemScale = {
  initial: { opacity: 0, scale: 0.9, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
};

// ========================================
// HOVER & TAP ANIMATIONS
// ========================================

export const cardHover = {
  rest: {
    scale: 1,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 0 30px rgba(124, 58, 237, 0.3)',
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  },
  tap: {
    scale: 0.98,
  },
};

export const buttonHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeOut' as const,
    },
  },
  tap: { scale: 0.95 },
};

export const glowHover = {
  rest: {
    boxShadow: '0 0 0px rgba(124, 58, 237, 0)',
  },
  hover: {
    boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)',
    transition: {
      duration: 0.3,
    },
  },
};

export const imageHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

// ========================================
// PAGE TRANSITIONS
// ========================================

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  },
};

export const slidePageLeft = {
  initial: { opacity: 0, x: 50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 0.3,
    },
  },
};

export const slidePageRight = {
  initial: { opacity: 0, x: -50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: {
      duration: 0.3,
    },
  },
};

// ========================================
// SPECIAL EFFECTS
// ========================================

export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(124, 58, 237, 0.4)',
      '0 0 40px rgba(124, 58, 237, 0.8)',
      '0 0 20px rgba(124, 58, 237, 0.4)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

export const float = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

export const shimmer = {
  animate: {
    backgroundPosition: ['-1000px 0', '1000px 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear' as const,
    },
  },
};

// ========================================
// PARALLAX EFFECTS
// ========================================

export const parallaxSlow = {
  initial: { y: 0 },
  animate: (scrollY: number) => ({
    y: scrollY * 0.3,
  }),
};

export const parallaxFast = {
  initial: { y: 0 },
  animate: (scrollY: number) => ({
    y: scrollY * 0.6,
  }),
};

// ========================================
// TRANSITION PRESETS
// ========================================

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const smoothTransition: Transition = {
  duration: 0.4,
  ease: 'easeOut',
};

export const quickTransition: Transition = {
  duration: 0.2,
  ease: 'easeOut',
};

export const slowTransition: Transition = {
  duration: 0.6,
  ease: 'easeOut',
};

// ========================================
// SCROLL REVEAL VARIANTS
// ========================================

export const scrollReveal = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

export const scrollRevealLeft = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

export const scrollRevealRight = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

export const scrollRevealScale = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

// ========================================
// LOADING STATES
// ========================================

export const loadingDots = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

export const loadingPulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

export const loadingSpin = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear' as const,
    },
  },
};

// ========================================
// SUCCESS/ERROR STATES
// ========================================

export const successPop = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 1],
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

export const errorShake = {
  animate: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
    },
  },
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Create a stagger container with custom timing
 */
export function createStaggerContainer(
  staggerDelay: number = 0.1,
  childDelay: number = 0.1
) {
  return {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: childDelay,
      },
    },
  };
}

/**
 * Create custom fade-in variant with specific offset and duration
 */
export function createFadeIn(
  offsetY: number = 20,
  duration: number = 0.4
) {
  return {
    initial: { opacity: 0, y: offsetY },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: 'easeOut' as const,
      },
    },
    exit: {
      opacity: 0,
      y: -offsetY,
      transition: {
        duration: duration * 0.75,
      },
    },
  };
}

export default {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  scaleInCenter,
  staggerContainer,
  staggerContainerFast,
  staggerContainerSlow,
  staggerItem,
  staggerItemScale,
  cardHover,
  buttonHover,
  glowHover,
  imageHover,
  pageTransition,
  slidePageLeft,
  slidePageRight,
  glowPulse,
  float,
  shimmer,
  springTransition,
  smoothTransition,
  quickTransition,
  slowTransition,
  scrollReveal,
  scrollRevealLeft,
  scrollRevealRight,
  scrollRevealScale,
  loadingDots,
  loadingPulse,
  loadingSpin,
  successPop,
  errorShake,
  createStaggerContainer,
  createFadeIn,
};
