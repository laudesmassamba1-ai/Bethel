import { useCallback, useRef } from "react";

export function useRipple() {
  const containerRef = useRef<HTMLDivElement>(null);

  const createRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(25, 176, 0, 0.15);
      transform: translate(-50%, -50%);
      pointer-events: none;
      animation: ripple-expand 0.6s ease-out forwards;
    `;

    container.style.position = container.style.position || "relative";
    container.style.overflow = "hidden";
    container.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  return { containerRef, createRipple };
}

export function RippleStyles() {
  return (
    <style>{`
      @keyframes ripple-expand {
        to {
          width: 300px;
          height: 300px;
          opacity: 0;
        }
      }
    `}</style>
  );
}
