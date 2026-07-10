import { useCallback } from "react";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { buildWhatsAppUrl } from "../../utils/constants";
import { useSiteConfig } from "../../context/SiteConfigContext";

export function ContactBanner() {
  const { config } = useSiteConfig();
  const url = buildWhatsAppUrl("Bonjour ! Je souhaite commander.", config.whatsapp_number);

  const handleClick = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#19B000", "#25D366", "#000000", "#F5F1EA"],
    });
    setTimeout(() => window.open(url, "_blank"), 150);
  }, [url]);

  return (
    <motion.section
      className="py-12 sm:py-16 mt-4 relative overflow-hidden"
      style={{ background: "#000000" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(25,176,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(25,176,0,0.03) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          pointerEvents: "none",
        }}
      />

      <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3
            className="leading-none mb-2"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              color: "#FFFFFF",
              letterSpacing: "-0.01em",
            }}
          >
            {config.menu_cta_label}
          </h3>
          <p
            className="font-semibold"
            style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(25,176,0,0.8)" }}
          >
            Discutez directement avec notre équipe sur WhatsApp
          </p>
        </div>

        <motion.button
          onClick={handleClick}
          className="flex items-center gap-3 px-8 py-4 text-base font-semibold text-white whitespace-nowrap flex-shrink-0"
          style={{
            background: "#19B000",
            borderRadius: "0.5rem",
            border: "none",
            fontFamily: "Montserrat, sans-serif",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(25,176,0,0.35)",
          }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <MessageCircle size={20} /> {config.menu_cta_label}
        </motion.button>
      </div>
    </motion.section>
  );
}
