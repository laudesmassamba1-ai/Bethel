import { motion, AnimatePresence } from "motion/react";
import { X, Star, Clock, Flame, ShoppingBag, Sparkles, Tag } from "lucide-react";
import type { MenuItem } from "../../utils/constants";
import { formatPrice, getDisplayPrice } from "../../utils/constants";
import { ImageWithFallback } from "../shared/ImageWithFallback";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  item: MenuItem | null;
  onClose: () => void;
  onAdd: (item: MenuItem) => void;
}

export function PlatDetailModal({ item, onClose, onAdd }: Props) {
  const [justAdded, setJustAdded] = useState(false);

  if (!item) return null;

  const handleAdd = () => {
    onAdd(item);
    setJustAdded(true);
    const displayPrice = getDisplayPrice(item);
    toast(`${item.name} ajouté au panier`, {
      description: `${formatPrice(displayPrice)} • ${item.category}`,
      duration: 2500,
    });
    setTimeout(() => setJustAdded(false), 800);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          className="relative w-full max-w-lg flex flex-col overflow-hidden"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.1)",
            maxHeight: "90vh",
            boxShadow: "12px 12px 0 rgba(0,0,0,0.12), 0 24px 80px rgba(0,0,0,0.15)",
          }}
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: "spring", damping: 26, stiffness: 280 }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center"
              style={{
                background: "#000000",
                border: "none",
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            aria-label="Fermer"
          >
            <X size={16} />
          </button>

          <div className="relative" style={{ height: "clamp(180px, 35vw, 280px)", overflow: "hidden" }}>
            <ImageWithFallback
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              style={{ filter: "saturate(1.08) contrast(1.03)" }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.4) 100%)",
                pointerEvents: "none",
              }}
            />

            {item.badge && (
              <motion.div
                className="absolute top-3 left-3 px-3 py-1 text-xs font-bold tracking-wide flex items-center gap-1"
              style={{
                background: item.is_promotion ? "#19B000" : "#000000",
                color: "#FFFFFF",
                fontFamily: "Montserrat, sans-serif",
              }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {item.is_promotion ? <Tag size={12} strokeWidth={2.5} /> : <Sparkles size={12} strokeWidth={2.5} />}
                {item.badge}
              </motion.div>
            )}

            {item.spicy && (
              <motion.div
                className="absolute top-3 right-14 w-9 h-9 flex items-center justify-center"
                style={{ background: "#DC2626", borderRadius: "50%" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Flame size={16} color="#fff" strokeWidth={2.5} />
              </motion.div>
            )}
          </div>

          <div className="flex flex-col flex-1 p-5 sm:p-6 gap-3 sm:gap-4 overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <span
                  className="text-xs font-semibold tracking-wider uppercase block mb-1"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}
                >
                  {item.category}
                </span>
                <h2
                  className="text-xl leading-tight font-bold"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                >
                  {item.name}
                </h2>
              </div>
              <div className="flex flex-col items-end flex-shrink-0">
                <span
                  className="text-2xl font-bold"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                >
                  {formatPrice(getDisplayPrice(item))}
                </span>
                {item.is_promotion && item.original_price && (
                  <span
                    className="text-xs line-through"
                    style={{ fontFamily: "Open Sans, sans-serif", color: "#9B9385" }}
                  >
                    {formatPrice(item.original_price)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm" style={{ fontFamily: "Open Sans, sans-serif" }}>
              <span className="flex items-center gap-1 font-semibold" style={{ color: "#19B000" }}>
                <Star size={14} fill="#19B000" stroke="none" /> {item.rating}
              </span>
              <span className="flex items-center gap-1" style={{ color: "#6B6357" }}>
                <Clock size={14} /> {item.time}
              </span>
            </div>

            <div
              className="p-3 text-sm leading-relaxed"
              style={{
                background: "rgba(25,176,0,0.04)",
                border: "1px solid rgba(25,176,0,0.12)",
                fontFamily: "Open Sans, sans-serif",
                color: "#333333",
              }}
            >
              {item.description}
            </div>

            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white"
              style={{
                background: justAdded ? "#000000" : "linear-gradient(135deg, #19B000, #0D8A00)",
                border: "none",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                boxShadow: justAdded ? "none" : "4px 4px 0 rgba(0,0,0,0.2), 0 8px 24px rgba(25,176,0,0.25)",
                transition: "background 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              {justAdded ? (
                <motion.span className="flex items-center gap-2" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                  <Sparkles size={16} /> Ajouté au panier
                </motion.span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShoppingBag size={16} /> Ajouter au panier — {formatPrice(getDisplayPrice(item))}
                </span>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
