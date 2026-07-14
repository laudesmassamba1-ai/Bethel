import { useCallback } from "react";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { buildWhatsAppUrl } from "../../utils/constants";
import { useSiteConfig } from "../../context/SiteConfigContext";

export function FloatingWhatsApp() {
  const { config } = useSiteConfig();
  const url = buildWhatsAppUrl("Bonjour ! Je souhaite plus d'informations.", config.whatsapp_number);

  const handleClick = useCallback(() => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#25D366", "#D4AF37", "#F4F1EA"],
    });
    setTimeout(() => window.open(url, "_blank"), 150);
  }, [url]);

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-20 sm:bottom-20 right-4 sm:right-6 z-30 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 font-black text-white text-xs sm:text-sm"
      style={{
        background: "#25D366",
        border: "3px solid #1D1D1D",
        boxShadow: "5px 5px 0 #1D1D1D",
        fontFamily: "Nunito, sans-serif",
        cursor: "pointer",
      }}
      whileHover={{ scale: 1.05, boxShadow: "7px 7px 0 #1D1D1D" }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
    >
      <MessageCircle size={19} />
      <span className="hidden sm:inline">Commander sur WhatsApp</span>
      <span className="sm:hidden">WhatsApp</span>
    </motion.button>
  );
}
