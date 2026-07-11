import { motion } from "motion/react";
import { MessageCircle, MapPin, Phone, Clock, Camera, Share2, Shield, ArrowUp } from "lucide-react";
import { CategoryIcon } from "../menu/CategoryIcon";
import { buildWhatsAppUrl } from "../../utils/constants";
import { useSiteConfig } from "../../context/SiteConfigContext";
import { useCategories } from "../../context/CategoriesContext";

interface Props {
  onCategoryClick: (cat: string) => void;
}

export function Footer({ onCategoryClick }: Props) {
  const { config } = useSiteConfig();
  const { categories } = useCategories();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={{ background: "#19B000", color: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="mb-4">
              <span
                className="block"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                  color: "#FFFFFF",
                  letterSpacing: "0.06em",
                }}
              >
                BETHEL
              </span>
              <span
                className="block"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                  color: "#FFFFFF",
                  letterSpacing: "0.06em",
                  opacity: 0.7,
                  marginTop: "-4px",
                }}
              >
                KITCHEN
              </span>
            </div>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.85)" }}
            >
              Des grillades premium qui eveillent vos sens. Fait avec passion, servi avec le sourire.
            </p>
            <div className="flex gap-3">
              <motion.a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full"
                style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
                whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.3)" }}
                aria-label="Instagram"
              >
                <Camera size={16} />
              </motion.a>
              <motion.a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full"
                style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
                whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.3)" }}
                aria-label="Facebook"
              >
                <Share2 size={16} />
              </motion.a>
            </div>
          </div>

          <div>
            <h4
              className="mb-4 text-sm font-bold tracking-widest uppercase"
              style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.5)" }}
            >
              Navigation
            </h4>
            <ul className="space-y-2" style={{ fontFamily: "Open Sans, sans-serif" }}>
              {categories.filter((c) => c !== "Tous").map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onCategoryClick(cat);
                      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex items-center gap-1.5 text-sm transition-all duration-200"
                    style={{
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.85)",
                      padding: 0,
                    }}
                  >
                    <CategoryIcon cat={cat} size={12} />
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="mb-4 text-sm font-bold tracking-widest uppercase"
              style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.5)" }}
            >
              Contact
            </h4>
            <ul className="space-y-3" style={{ fontFamily: "Open Sans, sans-serif" }}>
              <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
                <Phone size={14} /> +229 00 00 00 00
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
                <MapPin size={14} /> Cotonou, Benin
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
                <Clock size={14} /> Lun-Sam: 10h - 22h
              </li>
            </ul>
          </div>

          <div>
            <h4
              className="mb-4 text-sm font-bold tracking-widest uppercase"
              style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.5)" }}
            >
              Commander
            </h4>
            <motion.a
              href={buildWhatsAppUrl("Bonjour ! Je souhaite commander.", config.whatsapp_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold mb-3"
              style={{
                background: "#000000",
                color: "#FFFFFF",
                fontFamily: "Montserrat, sans-serif",
                textDecoration: "none",
                display: "inline-flex",
              }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle size={14} /> Commander via WhatsApp
            </motion.a>
            <motion.a
              href="/login"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
              style={{
                background: "transparent",
                color: "#FFFFFF",
                fontFamily: "Montserrat, sans-serif",
                border: "1px solid rgba(255,255,255,0.25)",
                textDecoration: "none",
                display: "inline-flex",
              }}
              whileHover={{ borderColor: "rgba(255,255,255,0.5)" }}
            >
              <Shield size={14} /> Administrateur
            </motion.a>
          </div>
        </div>
      </div>

      <div
        className="py-3 px-4 text-center"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.15)",
          fontFamily: "Open Sans, sans-serif",
        }}
      >
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
          &copy; 2026 BETHEL KITCHEN &mdash; Fait avec soin et generosite
        </p>
      </div>

      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-20 flex items-center justify-center w-10 h-10"
        style={{
          background: "#000000",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Retour en haut"
      >
        <ArrowUp size={18} />
      </motion.button>
    </footer>
  );
}
