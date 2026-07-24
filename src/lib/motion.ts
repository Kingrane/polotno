/**
 * Shared Framer Motion presets — Apple HIG timing (150–250ms springs).
 * Keep motion purposeful: explain UI state, never decorate for its own sake.
 */

export const springs = {
  snappy: { type: 'spring' as const, stiffness: 520, damping: 38, mass: 0.8 },
  soft: { type: 'spring' as const, stiffness: 320, damping: 32, mass: 0.9 },
  bouncy: { type: 'spring' as const, stiffness: 420, damping: 22, mass: 0.7 },
  gentle: { type: 'spring' as const, stiffness: 220, damping: 28, mass: 1 },
};

export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Floating chrome: toolbar, nav islands, style panel shell */
export const panelMount = {
  initial: { opacity: 0, y: 14, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: springs.soft,
};

export const panelMountFromTop = {
  initial: { opacity: 0, y: -12, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: springs.soft,
};

export const panelMountFromLeft = {
  initial: { opacity: 0, x: -18, scale: 0.97 },
  animate: { opacity: 1, x: 0, scale: 1 },
  transition: springs.soft,
};

/** Modal overlay + dialog */
export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springs.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: { duration: 0.15, ease: easeOut },
  },
};

/** Dropdown / popover menus */
export const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.94, y: -6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springs.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -4,
    transition: { duration: 0.12 },
  },
};

/** Stagger children for lists / tool rows */
export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.03, delayChildren: 0.04 },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: springs.snappy,
  },
};

/** Tap / hover for icon buttons */
export const pressable = {
  whileHover: { scale: 1.06 },
  whileTap: { scale: 0.92 },
  transition: springs.snappy,
};

export const pressableSubtle = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
  transition: springs.snappy,
};
