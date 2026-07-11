import { useRef, useEffect } from "react";

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const blobs = [
      { x: 0.2, y: 0.3, r: 0.35, color: [25, 176, 0], speed: 0.0003, phase: 0 },
      { x: 0.7, y: 0.6, r: 0.3, color: [13, 138, 0], speed: 0.0004, phase: 2 },
      { x: 0.5, y: 0.2, r: 0.25, color: [9, 94, 0], speed: 0.0005, phase: 4 },
      { x: 0.3, y: 0.8, r: 0.2, color: [25, 176, 0], speed: 0.0002, phase: 1.5 },
    ];

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      const t = time * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      blobs.forEach((blob) => {
        const bx = (blob.x + Math.sin(t * blob.speed * 1000 + blob.phase) * 0.15) * canvas.width;
        const by = (blob.y + Math.cos(t * blob.speed * 800 + blob.phase) * 0.1) * canvas.height;
        const br = blob.r * Math.min(canvas.width, canvas.height);

        const gradient = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        gradient.addColorStop(0, `rgba(${blob.color.join(",")}, 0.08)`);
        gradient.addColorStop(0.5, `rgba(${blob.color.join(",")}, 0.03)`);
        gradient.addColorStop(1, `rgba(${blob.color.join(",")}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.7,
      }}
    />
  );
}
