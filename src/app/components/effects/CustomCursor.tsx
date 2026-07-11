import { useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useMotionValue(-100);
  const trailY = useMotionValue(-100);

  const springCursorX = useSpring(cursorX, { stiffness: 500, damping: 35 });
  const springCursorY = useSpring(cursorY, { stiffness: 500, damping: 35 });
  const springTrailX = useSpring(trailX, { stiffness: 150, damping: 25 });
  const springTrailY = useSpring(trailY, { stiffness: 150, damping: 25 });

  const dotRef = useRef<HTMLDivElement>(null);
  const isPointer = useRef(false);

  const updateCursor = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    trailX.set(e.clientX);
    trailY.set(e.clientY);

    const target = e.target as HTMLElement;
    const newIsPointer = !!(
      target.closest("a") ||
      target.closest("button") ||
      target.closest("[role='button']") ||
      window.getComputedStyle(target).cursor === "pointer"
    );
    if (newIsPointer !== isPointer.current) {
      isPointer.current = newIsPointer;
      if (dotRef.current) {
        dotRef.current.style.transform = newIsPointer
          ? "translate(-50%, -50%) scale(2.5)"
          : "translate(-50%, -50%) scale(1)";
      }
    }
  }, [cursorX, cursorY, trailX, trailY]);

  useEffect(() => {
    window.addEventListener("mousemove", updateCursor, { passive: true });
    return () => window.removeEventListener("mousemove", updateCursor);
  }, [updateCursor]);

  return (
    <>
      {/* Trail ring */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "1.5px solid rgba(25,176,0,0.35)",
          pointerEvents: "none",
          zIndex: 99999,
          x: springTrailX,
          y: springTrailY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
        }}
      />
      {/* Glow dot */}
      <motion.div
        ref={dotRef as any}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#19B000",
          pointerEvents: "none",
          zIndex: 99999,
          boxShadow: "0 0 12px rgba(25,176,0,0.6), 0 0 24px rgba(25,176,0,0.3)",
          x: springCursorX,
          y: springCursorY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
        }}
      />
      <style>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
        @media (pointer: coarse) {
          .custom-cursor-hidden { display: none !important; }
        }
      `}</style>
    </>
  );
}
