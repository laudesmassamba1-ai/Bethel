import { type ReactNode } from "react";
import { motion } from "motion/react";

type Direction = "up" | "down" | "left" | "right";

interface Props {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}

const directionMap: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 40,
  className = "",
  once = true,
}: Props) {
  const offset = directionMap[direction];
  const customOffset = {
    x: offset.x ? (offset.x > 0 ? distance : -distance) : 0,
    y: offset.y ? (offset.y > 0 ? distance : -distance) : 0,
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...customOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
