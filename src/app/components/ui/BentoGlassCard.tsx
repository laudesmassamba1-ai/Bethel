import { useRef, useCallback, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
}

export function BentoGlassCard({ children, className = "", onClick, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null!);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const tiltX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const tiltY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!onClick) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      rotateX.set((y - 0.5) * -6);
      rotateY.set((x - 0.5) * 6);
    },
    [onClick]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.08)",
        cursor: onClick ? "pointer" : undefined,
        boxShadow: "6px 6px 0 rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)",
        rotateX: tiltX,
        rotateY: tiltY,
        perspective: 800,
      }}
      whileHover={
        onClick
          ? {
              y: -4,
              boxShadow: "10px 10px 0 rgba(0,0,0,0.1), 0 12px 32px rgba(0,0,0,0.1)",
              transition: { duration: 0.25, ease: "easeOut" },
            }
          : undefined
      }
      whileTap={onClick ? { scale: 0.97 } : undefined}
    >
      {children}
    </motion.div>
  );
}
