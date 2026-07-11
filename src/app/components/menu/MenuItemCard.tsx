import { useState } from "react";
import { motion } from "motion/react";
import { Flame, ShoppingBag, Sparkles, Tag } from "lucide-react";
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
      className="flex flex-col group/poster"
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "clamp(160px, 24vw, 220px)" }}>
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover/poster:scale-105"
          style={{
            filter: "saturate(1.1) contrast(1.04)",
            scale: imgReady ? 1 : 1.04,
            opacity: imgReady ? 1 : 0.7,
            transition: "scale 0.5s ease, opacity 0.4s ease, transform 0.7s ease",
          }}
          onLoad={() => setImgReady(true)}
        />

        {/* Poster-style gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Badge */}
        {item.badge && (
          <motion.div
            className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold tracking-wide"
            style={{
              background: item.is_promotion ? "#19B000" : "#000000",
              color: "#FFFFFF",
              fontFamily: "Montserrat, sans-serif",
              border: "1px solid rgba(255,255,255,0.15)",
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
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "0 2px 8px rgba(220,38,38,0.4)",
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
        {/* Category tag - poster style */}
        <span
          className="text-[10px] font-semibold tracking-[0.2em] uppercase"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000", opacity: 0.7 }}
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
          className="text-sm leading-snug flex-1 line-clamp-2"
          style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}
        >
          {item.description}
        </p>

        {/* Meta row */}
        </div>

        {/* Price + Add button */}
        <div className="flex items-center justify-between mt-1 pt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
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
              border: "none",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              transition: "background 0.2s ease, box-shadow 0.2s ease",
              boxShadow: justAdded ? "none" : "3px 3px 0 rgba(0,0,0,0.15)",
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
