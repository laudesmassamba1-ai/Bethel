import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Menu as MenuIcon, MessageCircle, Shield } from "lucide-react";
import { CategoryIcon } from "../menu/CategoryIcon";
import { buildWhatsAppUrl } from "../../utils/constants";
import { useSiteConfig } from "../../context/SiteConfigContext";
import { useCategories } from "../../context/CategoriesContext";

interface Props {
  scrolled: boolean;
  cartCount: number;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onCartOpen: () => void;
}

export function Navbar({ scrolled, cartCount, activeCategory, onCategoryChange, onCartOpen }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { config } = useSiteConfig();
  const { categories } = useCategories();

  const handleCategoryClick = (cat: string) => {
    onCategoryChange(cat);
    setMobileMenuOpen(false);
    setTimeout(() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  return (
    <header
      className="sticky top-0 z-30"
      style={{
        background: scrolled ? "rgba(0,0,0,0.92)" : "rgba(0,0,0,0.5)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: scrolled ? "1px solid rgba(25,176,0,0.25)" : "1px solid rgba(255,255,255,0.1)",
        transition: "all 0.35s ease",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Brand */}
        <div className="flex items-center gap-1 select-none">
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(1.2rem, 3.5vw, 1.8rem)",
              color: "#19B000",
              letterSpacing: "0.08em",
            }}
          >
            BETHEL
          </span>
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.2rem, 3.5vw, 1.8rem)",
              color: "#FFFFFF",
              letterSpacing: "0.06em",
            }}
          >
            KITCHEN
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  onCategoryChange(cat);
                  document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  color: isActive ? "#19B000" : "rgba(255,255,255,0.7)",
                  background: isActive ? "rgba(25,176,0,0.12)" : "transparent",
                  border: isActive ? "1px solid rgba(25,176,0,0.3)" : "1px solid transparent",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                }}
              >
                <CategoryIcon cat={cat} size={12} />
                {cat}
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={buildWhatsAppUrl("Bonjour ! Je souhaite plus d'informations.", config.whatsapp_number)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold"
            style={{
              color: "#FFFFFF",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "0.375rem",
              textDecoration: "none",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            <MessageCircle size={14} /> WhatsApp
          </a>

          <a
            href="/dashboard"
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold"
            style={{
              color: "rgba(255,255,255,0.7)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "0.375rem",
              textDecoration: "none",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            <Shield size={14} />
            <span className="hidden sm:inline">Admin</span>
          </a>

          <motion.button
            onClick={onCartOpen}
            className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold"
            style={{
              background: "#19B000",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              boxShadow: "0 4px 16px rgba(25,176,0,0.3)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart size={15} />
            <span className="hidden sm:inline">{config.cart_open_label}</span>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 1.7 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 text-xs font-bold text-white flex items-center justify-center"
                style={{
                  background: "#000000",
                  borderRadius: "50%",
                  fontSize: "10px",
                }}
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9"
            style={{
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "0.375rem",
              color: "#FFFFFF",
              background: "transparent",
              cursor: "pointer",
            }}
            aria-label="Ouvrir le menu"
          >
            <MenuIcon size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}
          >
            <div className="px-4 pb-3 pt-2 flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold"
                    style={{
                      color: isActive ? "#19B000" : "rgba(255,255,255,0.7)",
                      background: isActive ? "rgba(25,176,0,0.12)" : "rgba(255,255,255,0.06)",
                      border: isActive ? "1px solid rgba(25,176,0,0.3)" : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    <CategoryIcon cat={cat} size={12} />
                    {cat}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
