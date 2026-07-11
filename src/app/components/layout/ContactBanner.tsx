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
      style={{
        background: "#1A1815",
        backgroundImage: "radial-gradient(circle at 70% 30%, rgba(25,176,0,0.06) 0%, transparent 50%), radial-gradient(circle at 20% 70%, rgba(0,0,0,0.3) 0%, transparent 50%)",
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 3px)",
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
            Discutez directement avec notre equipe sur WhatsApp
          </p>
        </div>

          <motion.button
          onClick={handleClick}
          className="flex items-center gap-3 px-8 py-4 text-base font-semibold text-white whitespace-nowrap flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #19B000, #0D8A00)",
            border: "none",
            fontFamily: "Montserrat, sans-serif",
            cursor: "pointer",
            boxShadow: "4px 4px 0 rgba(0,0,0,0.2), 0 8px 24px rgba(25,176,0,0.25)",
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
