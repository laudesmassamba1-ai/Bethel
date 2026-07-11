import { motion } from "motion/react";

interface Orb {
  id: number;
  size: number;
  x: number;
  y: number;
  color: string;
  blur: number;
  duration: number;
  delay: number;
}

const orbs: Orb[] = [
  { id: 1, size: 200, x: 10, y: 20, color: "rgba(25,176,0,0.06)", blur: 80, duration: 18, delay: 0 },
  { id: 2, size: 300, x: 80, y: 60, color: "rgba(25,176,0,0.04)", blur: 100, duration: 22, delay: 2 },
  { id: 3, size: 150, x: 50, y: 80, color: "rgba(13,138,0,0.05)", blur: 70, duration: 15, delay: 4 },
  { id: 4, size: 180, x: 30, y: 40, color: "rgba(9,94,0,0.04)", blur: 90, duration: 20, delay: 1 },
  { id: 5, size: 120, x: 70, y: 15, color: "rgba(25,176,0,0.05)", blur: 60, duration: 16, delay: 3 },
];

export function FloatingOrbs() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          style={{
            position: "absolute",
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: orb.color,
            filter: `blur(${orb.blur}px)`,
          }}
          animate={{
            x: [0, 30, -20, 15, 0],
            y: [0, -25, 20, -15, 0],
            scale: [1, 1.15, 0.9, 1.1, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
