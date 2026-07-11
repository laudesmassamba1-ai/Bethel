import { lazy, Suspense, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, MessageCircle, Star, Clock } from "lucide-react";
import { buildWhatsAppUrl } from "../../utils/constants";
import { useSiteConfig } from "../../context/SiteConfigContext";

const LuxuryBackground = lazy(() =>
  import("../3d/LuxuryBackground").then((m) => ({ default: m.LuxuryBackground }))
);
const LiquidBrandLogo = lazy(() =>
  import("../3d/LiquidBrandLogo").then((m) => ({ default: m.LiquidBrandLogo }))
);
const LiquidMorph3D = lazy(() =>
  import("../3d/LiquidMorph3D").then((m) => ({ default: m.LiquidMorph3D }))
);

export function Hero() {
  const { config } = useSiteConfig();
  const sectionRef = useRef<HTMLDivElement>(null!);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const morphScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const morphOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ minHeight: "85vh", background: "#000000" }}
    >
      {/* WebGL Water Background (parallax) */}
      <motion.div style={{ y: bgY }}>
        <Suspense fallback={null}>
          <LuxuryBackground />
        </Suspense>
      </motion.div>

      {/* Z-Pattern Layout */}
      <motion.div
        className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative z-10 flex flex-col lg:flex-row items-center gap-12 min-h-[85vh]"
        style={{ y: contentY }}
      >

        {/* Left: Brand Logo + Content */}
        <div className="flex-1 flex flex-col items-start gap-8">
          {/* LiquidMetal Brand Logo */}
          <Suspense fallback={null}>
            <motion.div
              className="w-full"
              style={{ height: "clamp(80px, 12vw, 120px)" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <LiquidBrandLogo className="w-full h-full" />
            </motion.div>
          </Suspense>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1
              className="leading-tight mb-4"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
              }}
            >
              <span style={{ color: "#19B000" }}>BETHEL</span>{" "}
              <span style={{ color: "#FFFFFF" }}>GRILL</span>
            </h1>

            <p
              className="text-lg md:text-xl mb-6 max-w-md leading-relaxed"
              style={{
                fontFamily: "Open Sans, sans-serif",
                fontWeight: 400,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {config.hero_copy}
            </p>
          </motion.div>

          {/* Rating strip */}
          <motion.div
            className="flex items-center gap-6 text-sm"
            style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Open Sans, sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="flex items-center gap-1.5">
              <Star size={14} fill="#19B000" stroke="none" /> 4.9
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} stroke="#19B000" /> 25 min
            </span>
            <span style={{ color: "#19B000" }}>•</span>
            <span>{config.hero_subtitle}</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg, #19B000, #0D8A00)",
                color: "#FFFFFF",
                fontFamily: "Montserrat, sans-serif",
                border: "none",
                cursor: "pointer",
                boxShadow: "4px 4px 0 rgba(0,0,0,0.2), 0 8px 32px rgba(25,176,0,0.3)",
              }}
            >
              {config.hero_cta_label} <ArrowRight size={16} />
            </motion.button>

            <motion.a
              href={buildWhatsAppUrl(`Bonjour ${config.brand_name} ${config.brand_accent} !`, config.whatsapp_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold"
              style={{
                background: "transparent",
                color: "#FFFFFF",
                fontFamily: "Montserrat, sans-serif",
                border: "1px solid rgba(255,255,255,0.3)",
                textDecoration: "none",
                cursor: "pointer",
                backdropFilter: "blur(20px) saturate(180%)",
              }}
              whileHover={{ scale: 1.04, y: -2, borderColor: "rgba(25,176,0,0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle size={16} /> Nous contacter
            </motion.a>
          </motion.div>
        </div>

        {/* Right: 3D Morphing Logo (parallax depth) */}
        <motion.div
          className="flex-shrink-0 hidden lg:block"
          style={{
            width: "clamp(300px, 35vw, 420px)",
            height: "clamp(300px, 35vw, 420px)",
            scale: morphScale,
            opacity: morphOpacity,
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={null}>
            <LiquidMorph3D />
          </Suspense>
        </motion.div>
      </motion.div>

      {/* Bottom chalk section */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "160px",
          background: "linear-gradient(to bottom, transparent, #2D2A24)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* Chalk quote bar */}
      <motion.div
        className="relative z-10 flex items-center justify-center gap-3 px-4 py-3"
        style={{
          background: "rgba(45,42,36,0.6)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(245,240,232,0.08)",
          color: "#F5F0E8",
          fontFamily: "Montserrat, sans-serif",
          fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
          letterSpacing: "0.08em",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <span style={{ opacity: 0.3 }}>✦</span>
        <span style={{ opacity: 0.7 }}>LA GRILLADE EST UN ART</span>
        <span style={{ opacity: 0.3 }}>✦</span>
      </motion.div>
    </section>
  );
}
