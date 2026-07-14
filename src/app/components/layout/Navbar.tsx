import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Menu as MenuIcon, MessageCircle, Shield } from "lucide-react";
import { buildWhatsAppUrl } from "../../utils/constants";
import { useSiteConfig } from "../../context/SiteConfigContext";

interface Props {
  scrolled: boolean;
  cartCount: number;
  onCartOpen: () => void;
}

export function Navbar({ scrolled, cartCount, onCartOpen }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { config } = useSiteConfig();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? "rgba(250,250,248,0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(40px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(40px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.05)" : "1px solid transparent",
        transition: "all 0.5s ease",
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between h-12 sm:h-14">
        <motion.div
          className="flex items-center gap-1 select-none"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
              color: "#19B000",
              letterSpacing: "0.06em",
            }}
          >
            BETHEL
          </span>
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
              color: "#000000",
              letterSpacing: "0.04em",
              transition: "color 0.5s ease",
            }}
          >
            GRILL
          </span>
        </motion.div>

        <div className="flex items-center gap-2">
          <motion.a
            href={buildWhatsAppUrl("Bonjour ! Je souhaite plus d'informations.", config.whatsapp_number)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase"
            style={{
              color: "#000000",
              background: "#FFFFFF",
              border: "2px solid #000000",
              textDecoration: "none",
              fontFamily: "Montserrat, sans-serif",
              boxShadow: "2px 2px 0 #000000",
            }}
            whileHover={{ x: -1, y: -1, boxShadow: "3px 3px 0 #000000" }}
            whileTap={{ x: 1, y: 1, boxShadow: "1px 1px 0 #000000" }}
          >
            <MessageCircle size={13} strokeWidth={2.5} /> WhatsApp
          </motion.a>

          <motion.a
            href="/dashboard"
            className="hidden sm:flex items-center justify-center w-7 h-7"
            style={{
              color: "#6B6357",
              background: "transparent",
              border: "none",
              textDecoration: "none",
              fontFamily: "Montserrat, sans-serif",
              opacity: 0.3,
            }}
            whileHover={{ opacity: 1 }}
            title="Administration"
          >
            <Shield size={14} strokeWidth={1.5} />
          </motion.a>

          <motion.button
            onClick={onCartOpen}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase"
            style={{
              background: "#19B000",
              color: "#FFFFFF",
              border: "2px solid #000000",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              boxShadow: "2px 2px 0 #000000",
            }}
            whileHover={{ x: -1, y: -1, boxShadow: "3px 3px 0 #000000" }}
            whileTap={{ x: 1, y: 1, boxShadow: "1px 1px 0 #000000" }}
          >
            <ShoppingCart size={14} strokeWidth={2.5} />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 1.7 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[9px] font-bold text-white flex items-center justify-center"
                style={{
                  background: "#000000",
                  borderRadius: "50%",
                }}
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>

          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-8 h-8"
            style={{
              border: "2px solid #000000",
              color: "#000000",
              background: "#FFFFFF",
              cursor: "pointer",
              boxShadow: "2px 2px 0 #000000",
            }}
            whileTap={{ x: 1, y: 1, boxShadow: "1px 1px 0 #000000" }}
            aria-label="Menu"
          >
            <MenuIcon size={16} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              borderTop: "1px solid rgba(0,0,0,0.06)",
              overflow: "hidden",
              background: "rgba(250,250,248,0.95)",
              backdropFilter: "blur(40px)",
            }}
          >
            <div className="px-4 py-3 flex flex-col gap-2">
              <a
                href={buildWhatsAppUrl("Bonjour ! Je souhaite commander.", config.whatsapp_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase"
                style={{
                  color: "#000000",
                  background: "#FFFFFF",
                  border: "2px solid #000000",
                  fontFamily: "Montserrat, sans-serif",
                  textDecoration: "none",
                  boxShadow: "2px 2px 0 #000000",
                }}
              >
                <MessageCircle size={14} strokeWidth={2.5} /> WhatsApp
              </a>
              <a
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase"
                style={{
                  color: "#000000",
                  background: "#FFFFFF",
                  border: "2px solid #000000",
                  fontFamily: "Montserrat, sans-serif",
                  textDecoration: "none",
                  boxShadow: "2px 2px 0 #000000",
                }}
              >
                <Shield size={14} strokeWidth={2.5} /> Administration
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}