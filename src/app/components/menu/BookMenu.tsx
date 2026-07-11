import { useRef, useCallback, useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ChevronLeft, ChevronRight, Star, Clock, X, MessageCircle,
  ShoppingCart, Shield, ExternalLink, ChefHat,
} from "lucide-react";
import HTMLFlipBook from "react-pageflip";
import type { MenuItem } from "../../utils/constants";
import { formatPrice, getDisplayPrice } from "../../utils/constants";
import { PlatDetailModal } from "./PlatDetailModal";

interface Props {
  categories: string[];
  menuItems: MenuItem[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onAddToCart: (item: MenuItem) => void;
  onClose?: () => void;
  cartItemCount?: number;
  cartTotal?: number;
}

/* ─── Leather & Gold Theme ─── */
const LEATHER_DARK = "#1A0F0A";
const LEATHER_MID = "#2C1810";
const LEATHER_LIGHT = "#3E2723";
const GOLD = "#C8A45C";
const GOLD_BRIGHT = "#D4AF37";
const GOLD_DIM = "#8B7355";
const PARCHMENT = "#F5ECD7";
const PARCHMENT_DARK = "#E8DCC8";
const INK = "#1A0F0A";

/* ─── Gold ornamental line ─── */
function GoldLine({ width = 60, opacity = 0.6 }: { width?: number; opacity?: number }) {
  return (
    <span style={{
      width, height: 1,
      background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
      display: "block", opacity,
    }} />
  );
}

/* ─── Decorative diamond ─── */
function GoldDiamond({ size = 6 }: { size?: number }) {
  return (
    <span style={{
      width: size, height: size,
      background: GOLD,
      display: "block",
      transform: "rotate(45deg)",
      opacity: 0.5,
    }} />
  );
}

/* ─── Ornamental divider ─── */
function OrnamentDivider({ style = "full" }: { style?: "full" | "simple" }) {
  if (style === "simple") {
    return (
      <div className="flex items-center justify-center gap-3">
        <GoldLine width={20} opacity={0.3} />
        <GoldDiamond size={4} />
        <GoldLine width={20} opacity={0.3} />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-3 my-4">
      <GoldLine width={40} opacity={0.4} />
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5Z" fill={GOLD} opacity={0.5} />
      </svg>
      <GoldLine width={40} opacity={0.4} />
    </div>
  );
}

/* ─── Corner ornament for covers ─── */
function CornerOrnament({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const styles: Record<string, React.CSSProperties> = {
    tl: { top: 12, left: 12 },
    tr: { top: 12, right: 12, transform: "scaleX(-1)" },
    bl: { bottom: 12, left: 12, transform: "scaleY(-1)" },
    br: { bottom: 12, right: 12, transform: "scale(-1)" },
  };
  return (
    <svg
      width="32" height="32" viewBox="0 0 32 32" fill="none"
      style={{ position: "absolute", ...styles[position], opacity: 0.35 }}
    >
      <path d="M2 2V10C2 10 2 16 8 20C14 24 20 28 28 30" stroke={GOLD} strokeWidth="1" fill="none" />
      <path d="M2 2H12" stroke={GOLD} strokeWidth="1.5" />
      <path d="M2 2V12" stroke={GOLD} strokeWidth="1.5" />
      <circle cx="4" cy="4" r="1.5" fill={GOLD} opacity="0.4" />
    </svg>
  );
}



/* ─── Photo frame (vintage polaroid on parchment) ─── */
function VintagePhoto({ src, alt, rot, size = 64 }: { src: string; alt: string; rot: number; size?: number }) {
  return (
    <div
      className="relative inline-block flex-shrink-0"
      style={{
        background: PARCHMENT,
        padding: "5px 5px 18px",
        boxShadow: "2px 3px 8px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(0,0,0,0.06)",
        transform: `rotate(${rot}deg)`,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        border: `1px solid ${GOLD_DIM}`,
      }}
    >
      <div style={{
        position: "absolute", top: -4, left: "50%", transform: "translateX(-50%) rotate(-1deg)",
        width: 48, height: 16,
        background: `linear-gradient(135deg, rgba(200,164,92,0.25), rgba(200,164,92,0.12))`,
        backdropFilter: "blur(2px)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        zIndex: 2, pointerEvents: "none",
        borderBottom: `1px solid ${GOLD}`,
      }} />
      <img
        src={src}
        alt={alt}
        className="block object-cover"
        style={{ width: size, height: size, filter: "saturate(0.85) contrast(1.05)" }}
        loading="lazy"
      />
    </div>
  );
}

/* ─── Cover Page (Leather-bound + Betty Bossi food photography) ─── */
function CoverPage({ featuredItems = [] }: { featuredItems?: MenuItem[] }) {
  const photos = featuredItems.slice(0, 4);

  return (
    <div className="relative w-full h-full select-none overflow-hidden flex flex-col"
      style={{
        background: `linear-gradient(145deg, ${LEATHER_MID} 0%, ${LEATHER_DARK} 40%, #0D0705 100%)`,
      }}
    >
      {/* Leather texture overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 3px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)`,
        pointerEvents: "none",
      }} />

      {/* Gold border frame */}
      <div style={{ position: "absolute", inset: 10, border: `1px solid ${GOLD}`, opacity: 0.2, pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", inset: 14, border: `1px solid ${GOLD}`, opacity: 0.1, pointerEvents: "none", zIndex: 1 }} />

      {/* Corner ornaments */}
      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />

      {/* Top section: Brand + Title */}
      <div className="relative flex flex-col items-center text-center pt-8 pb-3 px-4" style={{ zIndex: 2 }}>
        {/* Subtitle */}
        <motion.span
          className="text-[8px] font-semibold tracking-[0.4em] uppercase mb-3 block"
          style={{ fontFamily: "Montserrat, sans-serif", color: GOLD, opacity: 0.45 }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Menu Gastronomique
        </motion.span>

        {/* Main title — gold embossed */}
        <motion.h1
          className="leading-none mb-1"
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2rem, 5.5vw, 3.2rem)",
            letterSpacing: "0.08em",
            textShadow: `0 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(200,164,92,0.15)`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <span style={{ color: GOLD_BRIGHT }}>BETHEL</span>
        </motion.h1>

        <motion.h2
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1rem, 2.5vw, 1.6rem)",
            letterSpacing: "0.25em",
            color: GOLD_DIM,
            textShadow: `0 1px 3px rgba(0,0,0,0.4)`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          GRILL
        </motion.h2>

        {/* Ornamental line */}
        <motion.div
          className="flex items-center justify-center gap-3 my-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <GoldLine width={35} opacity={0.3} />
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <rect x="2.5" y="2.5" width="5" height="5" fill={GOLD} opacity="0.3" transform="rotate(45 5 5)" />
          </svg>
          <GoldLine width={35} opacity={0.3} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-[11px] max-w-[240px] mx-auto leading-relaxed italic"
          style={{ fontFamily: "Open Sans, sans-serif", color: GOLD_DIM, opacity: 0.6 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          "L'excellence du detail, la passion du gout."
        </motion.p>
      </div>

      {/* Betty Bossi-style food photography grid */}
      {photos.length > 0 && (
        <motion.div
          className="relative flex-1 mx-5 mb-3 grid grid-cols-2 gap-2"
          style={{ zIndex: 2 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {photos.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden"
              style={{
                borderRadius: 4,
                border: `1px solid rgba(200,164,92,0.2)`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                style={{ filter: "saturate(0.9) contrast(1.05) brightness(0.9)" }}
                loading="lazy"
              />
              {/* Overlay gradient */}
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%)`,
              }} />
              {/* Item name on photo */}
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5">
                <p className="text-[9px] font-bold leading-tight truncate"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
                >
                  {item.name}
                </p>
                <p className="text-[8px]"
                  style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.7)" }}
                >
                  {formatPrice(getDisplayPrice(item))}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Bottom section: Info + instruction */}
      <div className="relative flex flex-col items-center pb-6 px-4" style={{ zIndex: 2 }}>
        {/* Rating & info */}
        <motion.div
          className="flex items-center justify-center gap-4 text-[10px] mb-3"
          style={{ color: GOLD_DIM, fontFamily: "Open Sans, sans-serif", opacity: 0.5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <span className="flex items-center gap-1">
            <Star size={11} fill={GOLD_BRIGHT} stroke="none" /> 4.9
          </span>
          <span style={{ width: 1, height: 10, background: GOLD, opacity: 0.3 }} />
          <span className="flex items-center gap-1">
            <Clock size={11} stroke={GOLD} /> 25 min
          </span>
          <span style={{ width: 1, height: 10, background: GOLD, opacity: 0.3 }} />
          <span>Grillades & Saveurs</span>
        </motion.div>

        {/* Bottom ornament */}
        <OrnamentDivider style="simple" />

        {/* Instruction */}
        <motion.p
          className="text-[9px] mt-2 italic"
          style={{ fontFamily: "Open Sans, sans-serif", color: GOLD_DIM, opacity: 0.3 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          Faites defiler les pages comme un vrai livre
        </motion.p>
      </div>
    </div>
  );
}

/* ─── Back Cover ─── */
function BackCoverPage() {
  return (
    <div className="relative w-full h-full select-none overflow-hidden flex flex-col items-center justify-center text-center"
      style={{
        background: `linear-gradient(145deg, ${LEATHER_MID} 0%, ${LEATHER_DARK} 40%, #0D0705 100%)`,
        padding: "2rem 1.5rem",
      }}
    >
      {/* Leather texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 3px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)`,
        pointerEvents: "none",
      }} />

      {/* Gold border frame */}
      <div style={{ position: "absolute", inset: 10, border: `1px solid ${GOLD}`, opacity: 0.2, pointerEvents: "none" }} />
      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />

      <OrnamentDivider />

      <motion.span
        className="text-[9px] font-semibold tracking-[0.4em] uppercase mt-4 mb-4 block"
        style={{ fontFamily: "Montserrat, sans-serif", color: GOLD, opacity: 0.45 }}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Contact & Commandes
      </motion.span>

      <motion.h2
        className="text-lg sm:text-xl font-bold leading-tight mb-3"
        style={{
          fontFamily: "Montserrat, sans-serif",
          color: GOLD_BRIGHT,
          textShadow: "0 2px 4px rgba(0,0,0,0.4)",
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        Commandez directement<br />sur WhatsApp
      </motion.h2>

      <motion.p
        className="text-xs mb-6 max-w-[240px] leading-relaxed"
        style={{ fontFamily: "Open Sans, sans-serif", color: GOLD_DIM, opacity: 0.6 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Discutez avec notre equipe, passez votre commande et recevez-la chez vous.
      </motion.p>

      <motion.a
        href="https://wa.me/237690788315?text=Bonjour%20%21%20Je%20souhaite%20commander."
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 px-7 py-3 text-xs font-semibold transition-all duration-300 inline-flex"
        style={{
          background: "#25D366",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          fontFamily: "Montserrat, sans-serif",
          textDecoration: "none",
          color: "#fff",
          boxShadow: "0 4px 16px rgba(37,211,102,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
        whileHover={{ scale: 1.03, y: -2, boxShadow: "0 6px 24px rgba(37,211,102,0.4)" }}
        whileTap={{ scale: 0.97 }}
      >
        <MessageCircle size={16} /> Commander maintenant
      </motion.a>

      <a href="/dashboard"
        className="flex items-center gap-1.5 mt-5 text-[9px] font-semibold transition-all duration-200 hover:opacity-60"
        style={{ fontFamily: "Montserrat, sans-serif", color: GOLD_DIM, textDecoration: "none", letterSpacing: "0.05em", opacity: 0.4 }}
      >
        <Shield size={10} strokeWidth={1.5} />
        Administration
        <ExternalLink size={9} strokeWidth={1.5} />
      </a>

      <motion.div
        className="mt-5 pt-4 text-[10px]"
        style={{ borderTop: `1px solid ${GOLD}`, borderTopColor: "rgba(200,164,92,0.15)", fontFamily: "Open Sans, sans-serif", color: GOLD_DIM, opacity: 0.4 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="mb-1">Bethel Grill Kitchen</p>
        <p>Ouvert 7j/7 &mdash; 11h a 22h</p>
      </motion.div>

      <OrnamentDivider />
    </div>
  );
}

/* ─── Category Page (Parchment + gold accents) ─── */
function CategoryPage({
  category, items, onAddToCart, onDetail, startIdx,
}: {
  category: string; items: MenuItem[]; onAddToCart: (item: MenuItem) => void; onDetail: (item: MenuItem) => void;
  startIdx: number;
}) {
  return (
    <div className="relative w-full h-full overflow-y-auto"
      style={{
        background: `linear-gradient(180deg, ${PARCHMENT} 0%, ${PARCHMENT_DARK} 100%)`,
        padding: "1.5rem 1.2rem",
      }}
    >
      {/* Parchment texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(139,115,85,0.02) 1px, rgba(139,115,85,0.02) 2px)`,
        pointerEvents: "none",
      }} />

      {/* Page header */}
      <div className="relative mb-4 text-center">
        <motion.span
          className="text-[8px] font-semibold tracking-[0.3em] uppercase block"
          style={{ fontFamily: "Montserrat, sans-serif", color: GOLD_DIM, opacity: 0.5 }}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Notre Selection
        </motion.span>
        <motion.h2
          className="mt-1 leading-none"
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(1.1rem, 3vw, 1.7rem)",
            color: INK,
            letterSpacing: "0.04em",
          }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {category}
        </motion.h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <GoldLine width={24} opacity={0.3} />
          <GoldDiamond size={4} />
          <GoldLine width={24} opacity={0.3} />
        </div>
      </div>

      {items.length === 0 ? (
        <motion.div className="flex flex-col items-center justify-center py-16 gap-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: `linear-gradient(135deg, rgba(200,164,92,0.1), rgba(200,164,92,0.03))`,
            border: `1px solid rgba(200,164,92,0.15)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ChefHat size={22} style={{ color: GOLD_DIM, opacity: 0.3 }} />
          </div>
          <p className="text-xs" style={{ fontFamily: "Open Sans, sans-serif", color: GOLD_DIM }}>
            Aucun plat dans cette categorie
          </p>
          <p className="text-[9px]" style={{ fontFamily: "Open Sans, sans-serif", color: GOLD_DIM, fontStyle: "italic", opacity: 0.5 }}>
            Decouvrez bientot notre nouvelle selection
          </p>
        </motion.div>
      ) : (
        <div className="relative flex flex-col gap-0">
          {items.map((item, idx) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.3 }}
            >
              <motion.div
                onClick={() => onDetail(item)}
                className="flex items-start gap-3 px-1 py-3 cursor-pointer transition-all duration-300"
                style={{
                  borderBottom: idx < items.length - 1 ? `1px solid rgba(139,115,85,0.1)` : "none",
                }}
                whileHover={{ x: 2, backgroundColor: "rgba(200,164,92,0.04)" }}
              >
                <VintagePhoto
                  src={item.image}
                  alt={item.name}
                  size={56}
                  rot={(startIdx + idx) * 3.7 % 5 - 2.5}
                />
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[13px] font-bold leading-tight"
                      style={{ fontFamily: "Montserrat, sans-serif", color: INK }}
                    >
                      {item.name}
                    </h3>
                    <span className="text-[13px] font-bold whitespace-nowrap flex-shrink-0"
                      style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}
                    >
                      {formatPrice(getDisplayPrice(item))}
                    </span>
                  </div>
                  <p className="text-[11px] mt-0.5 leading-relaxed line-clamp-2"
                    style={{ fontFamily: "Open Sans, sans-serif", color: GOLD_DIM }}
                  >
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.badge && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold"
                        style={{
                          background: item.is_promotion
                            ? `linear-gradient(135deg, #C0392B, #E74C3C)`
                            : INK,
                          color: GOLD,
                          borderRadius: 2,
                          fontFamily: "Montserrat, sans-serif",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.rating && (
                      <span className="flex items-center gap-0.5 text-[9px]"
                        style={{ fontFamily: "Open Sans, sans-serif", color: GOLD_DIM, opacity: 0.7 }}
                      >
                        <Star size={9} fill={GOLD_BRIGHT} stroke="none" />
                        {item.rating}
                      </span>
                    )}
                  </div>
                </div>
                <motion.button
                  onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
                  className="flex-shrink-0 px-3 py-1.5 text-[11px] font-bold text-white transition-all duration-200"
                  style={{
                    background: `linear-gradient(135deg, #19B000, #0D8A00)`,
                    border: "none",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontFamily: "Montserrat, sans-serif",
                    marginTop: 4,
                    boxShadow: "2px 2px 0 rgba(0,0,0,0.15)",
                  }}
                  whileHover={{ scale: 1.08, boxShadow: "3px 3px 0 rgba(0,0,0,0.15)" }}
                  whileTap={{ scale: 0.92 }}
                >
                  +
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Mouse parallax hook ─── */
function useParallax() {
  const ref = useRef<HTMLDivElement>(null!);
  const [px, setPx] = useState(0);
  const [py, setPy] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setPx(x);
      setPy(y);
    };
    el.addEventListener("mousemove", handler);
    return () => el.removeEventListener("mousemove", handler);
  }, []);

  return { ref, px, py };
}

/* ─── BookMenu ─── */
export function BookMenu({
  categories, menuItems, onAddToCart, onClose, cartItemCount, cartTotal,
}: Props) {
  const bookRef = useRef<any>(null);
  const { ref: parallaxRef, px, py } = useParallax();
  const [pageIndex, setPageIndex] = useState(0);
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);

  const pages = [
    { type: "cover" as const, label: "Couverture" },
    ...categories.map((c) => ({ type: "category" as const, label: c })),
    { type: "backcover" as const, label: "Contact" },
  ];
  const totalPages = pages.length;

  const onFlip = useCallback((e: any) => {
    setPageIndex(e.data);
  }, []);

  const next = useCallback(() => {
    if (bookRef.current && pageIndex < totalPages - 1) {
      bookRef.current.pageFlip().flipNext();
    }
  }, [pageIndex, totalPages]);

  const prev = useCallback(() => {
    if (bookRef.current && pageIndex > 0) {
      bookRef.current.pageFlip().flipPrev();
    }
  }, [pageIndex]);

  const goTo = useCallback((i: number) => {
    if (bookRef.current) {
      bookRef.current.pageFlip().turnToPage(i);
    }
  }, []);

  let cumulativeIdx = 0;

  return (
    <div ref={parallaxRef} className="flex flex-col items-center w-full max-w-6xl mx-auto px-4">
      <div className="relative w-full flex justify-center" style={{ perspective: "2000px", perspectiveOrigin: "50% 50%" }}>
        <motion.div
          className="relative"
          style={{
            width: "100%",
            maxWidth: 960,
            transformStyle: "preserve-3d",
            ["--px" as string]: px,
            ["--py" as string]: py,
          }}
          animate={{
            rotateY: [0, 0.6, 0, -0.6, 0],
            rotateX: [0, 0.15, 0, -0.15, 0],
            y: [0, -2, 0, -2, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        >
          {/* Leather-bound page stack edges */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute inset-x-0 mx-auto pointer-events-none"
              style={{
                bottom: -(3 + i * 3.5),
                width: `${99 - i * 1.8}%`,
                height: i === 4 ? 6 : 4,
                background: `linear-gradient(180deg, ${i < 2 ? PARCHMENT_DARK : PARCHMENT}, ${i < 2 ? "#D4CFC0" : PARCHMENT_DARK})`,
                borderRadius: "0 0 2px 2px",
                border: "1px solid rgba(139,115,85,0.08)",
                zIndex: 0,
              }}
            />
          ))}

          {/* Leather spine accent */}
          <div className="relative" style={{ zIndex: 5 }}>
            <div style={{
              height: 6,
              background: `linear-gradient(90deg, ${LEATHER_DARK} 0%, ${LEATHER_MID} 20%, ${LEATHER_LIGHT} 50%, ${LEATHER_MID} 80%, ${LEATHER_DARK} 100%)`,
              boxShadow: `0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
              borderTop: `1px solid rgba(200,164,92,0.2)`,
              borderBottom: `1px solid rgba(0,0,0,0.3)`,
            }} />
          </div>

          {onClose && (
            <motion.button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 flex items-center justify-center w-8 h-8 transition-all duration-200"
              style={{
                background: "rgba(200,164,92,0.15)",
                border: `1px solid rgba(200,164,92,0.3)`,
                borderRadius: "50%",
                cursor: "pointer",
                color: GOLD,
                backdropFilter: "blur(4px)",
              }}
              whileHover={{ background: "rgba(200,164,92,0.25)", scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Fermer le livre"
            >
              <X size={14} />
            </motion.button>
          )}

          <HTMLFlipBook
            ref={bookRef}
            width={520}
            height={700}
            size="stretch"
            minWidth={380}
            maxWidth={1040}
            minHeight={540}
            maxHeight={920}
            drawShadow
            flippingTime={1100}
            usePortrait={false}
            startZIndex={0}
            autoSize
            maxShadowOpacity={0.85}
            showCover
            mobileScrollSupport
            clickEventForward
            useMouseEvents
            swipeDistance={25}
            showPageCorners
            disableFlipByClick={false}
            startPage={0}
            onFlip={onFlip}
            style={{ background: "transparent" }}
            className="book-flip-container"
          >
            {pages.map((page, idx) => {
              if (page.type === "cover") {
                return (
                  <div key={idx} className="book-page" data-density="hard">
                    <CoverPage featuredItems={menuItems.slice(0, 4)} />
                  </div>
                );
              }
              if (page.type === "backcover") {
                return (
                  <div key={idx} className="book-page" data-density="hard">
                    <BackCoverPage />
                  </div>
                );
              }
              const cat = page.label;
              const startHere = cumulativeIdx;
              const catItems = menuItems.filter((i) => i.category === cat);
              cumulativeIdx += catItems.length;
              return (
                <div key={idx} className="book-page">
                  <CategoryPage
                    category={cat}
                    items={catItems}
                    onAddToCart={onAddToCart}
                    onDetail={(item) => setDetailItem(item)}
                    startIdx={startHere}
                  />
                </div>
              );
            })}
          </HTMLFlipBook>

          {/* Right edge shadow */}
          <div className="absolute right-0 top-0 bottom-0 pointer-events-none"
            style={{
              width: 14,
              background: "linear-gradient(270deg, rgba(0,0,0,0.12), transparent)",
              zIndex: 2,
            }}
          />

          {/* Bottom curl shadow */}
          <div className="absolute bottom-0 right-0 pointer-events-none"
            style={{
              width: 80,
              height: 40,
              background: "radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.08), transparent)",
              zIndex: 2,
            }}
          />
        </motion.div>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between w-full mt-5" style={{ maxWidth: 800 }}>
        <motion.button
          onClick={prev}
          disabled={pageIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-all duration-300"
          style={{
            fontFamily: "Montserrat, sans-serif",
            color: pageIndex === 0 ? "rgba(200,164,92,0.2)" : GOLD,
            border: `1px solid rgba(200,164,92,${pageIndex === 0 ? 0.05 : 0.2})`,
            background: pageIndex === 0 ? "transparent" : "rgba(200,164,92,0.06)",
            cursor: pageIndex === 0 ? "default" : "pointer",
            opacity: pageIndex === 0 ? 0.3 : 1,
            borderRadius: 4,
            backdropFilter: "blur(4px)",
          }}
          whileHover={pageIndex !== 0 ? { x: -4, borderColor: GOLD } : {}}
          whileTap={pageIndex !== 0 ? { scale: 0.96 } : {}}
        >
          <ChevronLeft size={14} strokeWidth={2.5} />
          Precedent
        </motion.button>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 py-2">
          {pages.map((p, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-500 ease-out"
              style={{
                width: i === pageIndex ? 28 : 8,
                height: 8,
                background: i === pageIndex ? GOLD : "rgba(200,164,92,0.15)",
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
              }}
              whileHover={i !== pageIndex ? { scale: 1.2, background: "rgba(200,164,92,0.3)" } : {}}
              whileTap={{ scale: 0.9 }}
              aria-label={p.label}
            />
          ))}
        </div>

        <motion.button
          onClick={next}
          disabled={pageIndex === totalPages - 1}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-all duration-300"
          style={{
            fontFamily: "Montserrat, sans-serif",
            color: pageIndex === totalPages - 1 ? "rgba(200,164,92,0.2)" : GOLD,
            border: `1px solid rgba(200,164,92,${pageIndex === totalPages - 1 ? 0.05 : 0.2})`,
            background: pageIndex === totalPages - 1 ? "transparent" : "rgba(200,164,92,0.06)",
            cursor: pageIndex === totalPages - 1 ? "default" : "pointer",
            opacity: pageIndex === totalPages - 1 ? 0.3 : 1,
            borderRadius: 4,
            backdropFilter: "blur(4px)",
          }}
          whileHover={pageIndex !== totalPages - 1 ? { x: 4, borderColor: GOLD } : {}}
          whileTap={pageIndex !== totalPages - 1 ? { scale: 0.96 } : {}}
        >
          Suivant
          <ChevronRight size={14} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Cart + Admin bar */}
      <div className="flex items-center justify-between w-full mt-3" style={{ maxWidth: 800 }}>
        {cartItemCount != null && cartItemCount > 0 ? (
          <motion.button
            onClick={() => window.dispatchEvent(new CustomEvent("open-cart"))}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold transition-all duration-200"
            style={{
              background: "rgba(200,164,92,0.1)",
              border: `1px solid rgba(200,164,92,0.2)`,
              borderRadius: 4,
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              color: GOLD,
              backdropFilter: "blur(4px)",
            }}
            whileHover={{ background: "rgba(200,164,92,0.18)", borderColor: GOLD }}
            whileTap={{ scale: 0.96 }}
          >
            <ShoppingCart size={13} strokeWidth={2} />
            <span className="flex items-center gap-1">
              Panier
              <span style={{
                background: "#19B000",
                color: "#fff",
                borderRadius: "50%",
                width: 16,
                height: 16,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                fontWeight: 700,
              }}>
                {cartItemCount}
              </span>
            </span>
            {cartTotal != null && (
              <span style={{ color: GOLD_DIM, fontSize: 9, opacity: 0.6 }}>
                {formatPrice(cartTotal)}
              </span>
            )}
          </motion.button>
        ) : (
          <div />
        )}

        <a href="/dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold transition-all duration-200"
          style={{ fontFamily: "Montserrat, sans-serif", color: GOLD_DIM, textDecoration: "none", opacity: 0.3 }}
        >
          <Shield size={11} strokeWidth={1.5} />
          Administration
          <ExternalLink size={10} strokeWidth={1.5} />
        </a>
      </div>

      <p className="text-[10px] font-semibold mt-2"
        style={{ fontFamily: "Open Sans, sans-serif", color: GOLD_DIM, letterSpacing: "0.15em", opacity: 0.25 }}
      >
        {pageIndex + 1} / {totalPages}
      </p>

      <PlatDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onAdd={onAddToCart}
      />

      <style>{`
        .book-flip-container {
          box-shadow:
            0 4px 8px rgba(0,0,0,0.15),
            0 12px 32px rgba(0,0,0,0.2),
            0 24px 64px rgba(0,0,0,0.25),
            0 48px 120px rgba(0,0,0,0.2) !important;
          border: 1px solid rgba(200,164,92,0.15) !important;
          border-left: 6px solid ${LEATHER_MID} !important;
          border-radius: 2px !important;
          background: ${PARCHMENT} !important;
          overflow: hidden;
        }
        .book-flip-container::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 8px;
          background: linear-gradient(90deg, ${LEATHER_DARK}, ${LEATHER_MID}, transparent);
          z-index: 10;
          pointer-events: none;
          border-radius: 2px 0 0 2px;
        }
        .book-page {
          background: ${PARCHMENT};
          overflow: hidden;
          height: 100%;
          width: 100%;
        }
        .book-page[data-density="hard"] {
          background: linear-gradient(145deg, ${LEATHER_MID} 0%, ${LEATHER_DARK} 40%, #0D0705 100%);
        }
        .book-page img {
          transition: filter 0.3s ease;
        }
      `}</style>
    </div>
  );
}
