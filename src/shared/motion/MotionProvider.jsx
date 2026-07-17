/**
 * shared/motion/MotionProvider.jsx
 *
 * Wrapper around Framer Motion. Mobile sections NEVER import
 * framer-motion directly — they import from here.
 *
 * Benefit: if the animation library is ever swapped (Motion One,
 * CSS-only, etc.), only this file changes. All mobile components
 * remain untouched.
 */

export {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
} from 'framer-motion';

import React from 'react';
import { motion } from 'framer-motion';

/** Fade in + slide up on scroll entry */
export function FadeIn({ children, delay = 0, duration = 0.55, y = 20, className, style, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Stagger children on entry */
export function StaggerIn({ children, stagger = 0.07, delay = 0, className, ...rest }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden:  {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Child item for StaggerIn */
export function StaggerItem({ children, y = 16, className, ...rest }) {
  return (
    <motion.div
      variants={{
        hidden:  { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Scale in on entry */
export function ScaleIn({ children, delay = 0, className, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.34, 1.56, 0.64, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Slide up from bottom (for dock, modals) */
export function SlideUp({ children, delay = 0, className, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.4, delay, ease: [0.34, 1.56, 0.64, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
