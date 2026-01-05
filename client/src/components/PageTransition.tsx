import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

// Custom easing curve
const smoothEase = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: smoothEase,
      when: "beforeChildren" as const,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    transition: {
      duration: 0.3,
      ease: smoothEase,
    },
  },
};

// Staggered children variants for content animation
export const staggerContainer = {
  initial: {},
  enter: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 30,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: smoothEase,
    },
  },
};

export const fadeIn = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

export const scaleIn = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: smoothEase,
    },
  },
};

export const slideInLeft = {
  initial: {
    opacity: 0,
    x: -50,
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: smoothEase,
    },
  },
};

export const slideInRight = {
  initial: {
    opacity: 0,
    x: 50,
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: smoothEase,
    },
  },
};

// Main page transition wrapper
export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated section wrapper
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fadeInUp" | "fadeIn" | "scaleIn" | "slideInLeft" | "slideInRight";
}

const variantMap = {
  fadeInUp,
  fadeIn,
  scaleIn,
  slideInLeft,
  slideInRight,
};

export function AnimatedSection({ 
  children, 
  className = "", 
  delay = 0,
  variant = "fadeInUp" 
}: AnimatedSectionProps) {
  const selectedVariant = variantMap[variant];
  
  return (
    <motion.div
      initial="initial"
      whileInView="enter"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        initial: selectedVariant.initial,
        enter: {
          ...selectedVariant.enter,
          transition: {
            duration: 0.5,
            ease: smoothEase,
            delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated list container
interface AnimatedListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function AnimatedList({ children, className = "", staggerDelay = 0.1 }: AnimatedListProps) {
  return (
    <motion.div
      initial="initial"
      whileInView="enter"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        initial: {},
        enter: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated list item
interface AnimatedListItemProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedListItem({ children, className = "" }: AnimatedListItemProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Hover scale animation wrapper
interface HoverScaleProps {
  children: ReactNode;
  className?: string;
  scale?: number;
}

export function HoverScale({ children, className = "", scale = 1.02 }: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Glow card with hover animation
interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "cyan" | "purple" | "mixed";
}

export function GlowCard({ children, className = "", glowColor = "cyan" }: GlowCardProps) {
  const glowStyles = {
    cyan: {
      boxShadow: "0 0 30px rgba(0, 212, 255, 0.3), 0 0 60px rgba(0, 212, 255, 0.2)",
    },
    purple: {
      boxShadow: "0 0 30px rgba(123, 44, 191, 0.3), 0 0 60px rgba(123, 44, 191, 0.2)",
    },
    mixed: {
      boxShadow: "0 0 30px rgba(0, 212, 255, 0.3), 0 0 60px rgba(123, 44, 191, 0.2)",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{
        y: -8,
        ...glowStyles[glowColor],
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      transition={{ duration: 0.4, ease: smoothEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Text reveal animation
interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ children, className = "", delay = 0 }: TextRevealProps) {
  const words = children.split(" ");

  return (
    <motion.span
      initial="initial"
      whileInView="enter"
      viewport={{ once: true }}
      variants={{
        initial: {},
        enter: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            initial: { opacity: 0, y: 20 },
            enter: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, ease: smoothEase },
            },
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default PageTransition;
