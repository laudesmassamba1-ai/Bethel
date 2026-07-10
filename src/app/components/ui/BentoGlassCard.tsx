import { motion } from "motion/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
}

export function BentoGlassCard({ children, className = "", onClick, delay = 0 }: Props) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.015, y: -2 }}
      style={{
        background: "rgba(255, 255, 255, 0.12)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.25)",
        borderRadius: "1rem",
        cursor: onClick ? "pointer" : undefined,
        transition: "border-color 0.3s ease",
      }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(25, 176, 0, 0.5)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255, 255, 255, 0.25)";
      }}
    >
      {/* Subtle inner glow at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(25,176,0,0.4), transparent)",
        }}
      />
      {children}
    </motion.div>
  );
}
