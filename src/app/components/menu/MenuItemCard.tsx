import { useState } from "react";
import { motion } from "motion/react";
import { Star, Clock, Flame, ShoppingBag, Sparkles, Tag } from "lucide-react";
import { toast } from "sonner";
import type { MenuItem } from "../../utils/constants";
import { formatPrice, getDisplayPrice } from "../../utils/constants";
import { ImageWithFallback } from "../shared/ImageWithFallback";
import { BentoGlassCard } from "../ui/BentoGlassCard";

interface Props {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  onDetail: (item: MenuItem) => void;
  index: number;
}

export function MenuItemCard({ item, onAdd, onDetail, index }: Props) {
  const [justAdded, setJustAdded] = useState(false);
  const [imgReady, setImgReady] = useState(false);

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
    <BentoGlassCard
      onClick={() => onDetail(item)}
      delay={index * 0.06}
      className="flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "clamp(160px, 24vw, 220px)" }}>
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          style={{
            filter: "saturate(1.1) contrast(1.04)",
            scale: imgReady ? 1 : 1.04,
            opacity: imgReady ? 1 : 0.7,
            transition: "scale 0.5s ease, opacity 0.4s ease",
          }}
          onLoad={() => setImgReady(true)}
        />

        {/* Subtle gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.3) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Badge */}
        {item.badge && (
          <motion.div
            className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold tracking-wide"
            style={{
              background: item.is_promotion ? "#19B000" : "rgba(0,0,0,0.7)",
              color: "#FFFFFF",
              borderRadius: "0.375rem",
              fontFamily: "Montserrat, sans-serif",
              backdropFilter: "blur(8px)",
            }}
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: index * 0.06 + 0.1 }}
          >
            <span className="flex items-center gap-1">
              {item.is_promotion ? <Tag size={10} strokeWidth={2.5} /> : <Sparkles size={10} strokeWidth={2.5} />}
              {item.badge}
            </span>
          </motion.div>
        )}

        {/* Spicy indicator */}
        {item.spicy && (
          <motion.div
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center"
            style={{
              background: "#DC2626",
              borderRadius: "50%",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, delay: index * 0.06 + 0.15 }}
          >
            <Flame size={13} color="#fff" strokeWidth={2.5} />
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category tag */}
        <span
          className="text-xs font-semibold tracking-wider uppercase"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}
        >
          {item.category}
        </span>

        <h3
          className="text-base leading-tight font-bold"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
        >
          {item.name}
        </h3>

        <p
          className="text-sm leading-snug flex-1"
          style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}
        >
          {item.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs" style={{ fontFamily: "Open Sans, sans-serif" }}>
          <span className="flex items-center gap-1 font-semibold" style={{ color: "#19B000" }}>
            <Star size={12} fill="#19B000" stroke="none" /> {item.rating}
          </span>
          <span className="flex items-center gap-1" style={{ color: "#6B6357" }}>
            <Clock size={12} /> {item.time}
          </span>
        </div>

        {/* Price + Add button */}
        <div className="flex items-center justify-between mt-1 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          <div className="flex items-center gap-2">
            <span
              className="text-xl font-bold"
              style={{
                fontFamily: "Montserrat, sans-serif",
                color: "#000000",
              }}
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

          <motion.button
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleAdd(); }}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.06 }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white"
            style={{
              background: justAdded ? "#000000" : "#19B000",
              borderRadius: "0.375rem",
              border: "none",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              transition: "background 0.2s ease",
            }}
          >
            {justAdded ? (
              <motion.span
                className="flex items-center gap-1"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
              >
                <Sparkles size={12} /> Ajouté
              </motion.span>
            ) : (
              <span className="flex items-center gap-1.5">
                <ShoppingBag size={12} /> Ajouter
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </BentoGlassCard>
  );
}
