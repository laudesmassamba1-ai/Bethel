import { useRef, useCallback, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
  style?: React.CSSProperties;
  whileTap?: any;
}

export function MagneticButton({ children, className = "", onClick, strength = 0.3, style, whileTap }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * strength);
      y.set((e.clientY - centerY) * strength);
    },
    [x, y, strength]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        x: springX,
        y: springY,
        ...style,
      }}
      whileTap={whileTap || { scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}
