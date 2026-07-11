import { useRef, useCallback, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
  span?: string;
}

export function BentoGlassCard({ children, className = "", onClick, delay = 0, span }: Props) {
  const ref = useRef<HTMLDivElement>(null!);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const tiltX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const tiltY = useSpring(rotateY, { stiffness: 300, damping: 30 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [glowOpacity, setGlowOpacity] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPos({ x, y });
    setGlowOpacity(1);
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    rotateX.set((ny - 0.5) * -8);
    rotateY.set((nx - 0.5) * 8);
  }, [rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    setGlowOpacity(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${span || ""} ${className}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "rgba(255, 255, 255, 0.7)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 16,
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        cursor: onClick ? "pointer" : undefined,
        boxShadow: "0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
        rotateX: tiltX,
        rotateY: tiltY,
        perspective: 800,
        willChange: "transform, opacity",
      }}
      whileHover={
        onClick
          ? {
              y: -6,
              boxShadow: "0 16px 48px rgba(25,176,0,0.1), inset 0 1px 0 rgba(255,255,255,1)",
              transition: { duration: 0.3, ease: "easeOut" },
            }
          : undefined
      }
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: `radial-gradient(circle 200px at ${glowPos.x}% ${glowPos.y}%, rgba(25,176,0,0.12), transparent 70%)`,
          opacity: glowOpacity,
          transition: "opacity 0.3s ease",
        }}
      />
      <div className="relative z-0">{children}</div>
    </motion.div>
  );
}
