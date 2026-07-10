import { lazy, Suspense } from "react";
import { motion } from "motion/react";
import { ArrowRight, MessageCircle, Star, Clock } from "lucide-react";
import { buildWhatsAppUrl } from "../../utils/constants";
import { useSiteConfig } from "../../context/SiteConfigContext";

const LuxuryBackground = lazy(() =>
  import("../3d/LuxuryBackground").then((m) => ({ default: m.LuxuryBackground }))
);
const LiquidBrandLogo = lazy(() =>
  import("../3d/LiquidBrandLogo").then((m) => ({ default: m.LiquidBrandLogo }))
);
const Chef3DCanvas = lazy(() =>
  import("../3d/Chef3DCanvas").then((m) => ({ default: m.Chef3DCanvas }))
);

export function Hero() {
  const { config } = useSiteConfig();

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "85vh", background: "#000000" }}
    >
      {/* WebGL Water Background */}
      <Suspense fallback={null}>
        <LuxuryBackground />
      </Suspense>

      {/* Z-Pattern Layout */}
      <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative z-10 flex flex-col lg:flex-row items-center gap-12 min-h-[85vh]">

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
              <span style={{ color: "#FFFFFF" }}>KITCHEN</span>
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
                background: "#19B000",
                color: "#FFFFFF",
                fontFamily: "Montserrat, sans-serif",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(25, 176, 0, 0.35)",
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
                background: "rgba(255,255,255,0.08)",
                color: "#FFFFFF",
                fontFamily: "Montserrat, sans-serif",
                borderRadius: "0.5rem",
                border: "1px solid rgba(255,255,255,0.2)",
                textDecoration: "none",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
              }}
              whileHover={{ scale: 1.04, y: -2, borderColor: "rgba(25,176,0,0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle size={16} /> Nous contacter
            </motion.a>
          </motion.div>
        </div>

        {/* Right: 3D Rotating Element */}
        <motion.div
          className="flex-shrink-0 hidden lg:block"
          style={{
            width: "clamp(300px, 35vw, 480px)",
            height: "clamp(300px, 35vw, 480px)",
          }}
          initial={{ opacity: 0, scale: 0.85, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={
            <div style={{
              width: "100%",
              height: "100%",
              borderRadius: "1rem",
              background: "radial-gradient(circle at 40% 40%, rgba(25,176,0,0.15), rgba(0,0,0,0.3))",
            }} />
          }>
            <Chef3DCanvas className="w-full h-full" />
          </Suspense>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: "linear-gradient(to bottom, transparent, #F5F1EA)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />
    </section>
  );
}
