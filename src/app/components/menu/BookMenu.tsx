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

/* ─── Shared decorative elements ─── */

const GG = "linear-gradient(135deg, rgba(25,176,0,0.5), rgba(25,176,0,0.10))";

function DecoLine({ width = 40, gradient = GG }: { width?: number; gradient?: string }) {
  return <span style={{ width, height: 1.5, background: gradient, display: "block", borderRadius: 2 }} />;
}

function DecoDot({ color = "#E53E30", size = 6 }: { color?: string; size?: number }) {
  return <span style={{ width: size, height: size, background: color, display: "block", borderRadius: "50%", opacity: 0.4 }} />;
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-2">
      <DecoLine width={24} />
      <DecoDot color="#19B000" />
      <DecoLine width={24} />
    </div>
  );
}

/* ─── Taped Photo (polaroid + scotch tape) ─── */

function TapedPhoto({ src, alt, rot, size = 64 }: { src: string; alt: string; rot: number; size?: number }) {
  return (
    <div
      className="relative inline-block flex-shrink-0"
      style={{
        background: "#fff",
        padding: "4px 4px 14px",
        boxShadow: "1px 2px 6px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)",
        transform: `rotate(${rot}deg)`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <img
        src={src}
        alt={alt}
        className="block object-cover"
        style={{ width: size, height: size }}
        loading="lazy"
      />
      <div
        style={{
          position: "absolute",
          top: -5,
          left: "50%",
          transform: "translateX(-50%) rotate(-2deg)",
          width: 52,
          height: 14,
          background: "rgba(255,255,230,0.50)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ─── Cover Page ─── */
function CoverPage() {
  return (
    <div className="relative w-full h-full select-none overflow-hidden flex flex-col items-center justify-center text-center p-8 sm:p-12"
      style={{ background: "linear-gradient(180deg, #FDFBF7 0%, #F5F1EA 100%)" }}
    >
      <div className="absolute top-0 left-0 right-0" style={{ height: 3, background: "linear-gradient(90deg, #19B000 0%, #19B000 30%, transparent 30%, transparent 70%, #0D8A00 70%, #0A7000 100%)" }} />

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center gap-2 mb-6"
      >
        <DecoLine width={40} />
        <DecoDot color="#19B000" />
        <DecoLine width={40} />
      </motion.div>

      <motion.span className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-5"
        style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000", opacity: 0.5 }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Menu Gastronomique
      </motion.span>

      <motion.h1 className="leading-none mb-4"
        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(2.8rem, 7vw, 4.5rem)", color: "#000000", letterSpacing: "-0.03em" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <span style={{ color: "#19B000" }}>BETHEL</span>
        <br />
        <span style={{ color: "#000000", fontSize: "clamp(1.6rem, 4vw, 2.8rem)" }}>GRILL</span>
      </motion.h1>

      <motion.p className="text-sm sm:text-base max-w-xs mx-auto mb-5 leading-relaxed"
        style={{ fontFamily: "Open Sans, sans-serif", color: "#8B7D6B" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        L'excellence du detail, la passion du gout.
      </motion.p>

      <motion.div className="flex items-center justify-center gap-4 text-xs mb-8"
        style={{ color: "#6B6357", fontFamily: "Open Sans, sans-serif" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <span className="flex items-center gap-1.5">
          <Star size={13} fill="#FFD700" stroke="none" /> 4.9
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={13} stroke="#19B000" /> 25 min
        </span>
        <span style={{ background: GG, width: 1.5, height: 14, display: "block" }} />
        <span>Grillades & Saveurs</span>
      </motion.div>

      <motion.p className="text-[11px] max-w-[220px] leading-relaxed"
        style={{ fontFamily: "Open Sans, sans-serif", color: "#9B9385", fontStyle: "italic" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
      >
        Faites defiler les pages comme un vrai livre
      </motion.p>

      <motion.div className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <SectionDivider />
      </motion.div>
    </div>
  );
}

/* ─── Back Cover ─── */
function BackCoverPage() {
  return (
    <div className="relative w-full h-full select-none overflow-hidden flex flex-col items-center justify-center text-center p-8 sm:p-12"
      style={{ background: "linear-gradient(180deg, #FDFBF7 0%, #F5F1EA 100%)" }}
    >
      <SectionDivider />

      <motion.span className="text-[10px] font-semibold tracking-[0.3em] uppercase mt-6 mb-4"
        style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000", opacity: 0.5 }}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Contact & Commandes
      </motion.span>

      <motion.h2 className="text-xl sm:text-2xl font-bold leading-tight mb-4"
        style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        Commandez directement<br />sur WhatsApp
      </motion.h2>

      <motion.p className="text-sm mb-8 max-w-xs leading-relaxed"
        style={{ fontFamily: "Open Sans, sans-serif", color: "#8B7D6B" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Discutez avec notre equipe, passez votre commande et recevez-la chez vous.
      </motion.p>

      <motion.a href="https://wa.me/237690788315?text=Bonjour%20%21%20Je%20souhaite%20commander."
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 inline-flex"
        style={{
          background: "#25D366",
          border: "none",
          borderRadius: "0.5rem",
          cursor: "pointer",
          fontFamily: "Montserrat, sans-serif",
          textDecoration: "none",
          boxShadow: "6px 6px 0 rgba(0,0,0,0.08), 0 8px 24px rgba(37,211,102,0.15)",
        }}
        whileHover={{ scale: 1.03, y: -2, boxShadow: "8px 8px 0 rgba(0,0,0,0.08), 0 12px 32px rgba(37,211,102,0.2)" }}
        whileTap={{ scale: 0.97 }}
      >
        <MessageCircle size={18} /> Commander maintenant
      </motion.a>

      <a href="/dashboard"
        className="flex items-center gap-1.5 mt-6 text-[10px] font-semibold transition-all duration-200 hover:opacity-60"
        style={{
          fontFamily: "Montserrat, sans-serif",
          color: "#9B9385",
          textDecoration: "none",
          letterSpacing: "0.05em",
        }}
      >
        <Shield size={11} strokeWidth={1.5} />
        Administration
        <ExternalLink size={10} strokeWidth={1.5} />
      </a>

      <motion.div className="mt-6 pt-6 text-xs"
        style={{ borderTop: "1px solid rgba(0,0,0,0.05)", fontFamily: "Open Sans, sans-serif", color: "#9B9385" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="mb-1">Bethel Grill Kitchen</p>
        <p>Ouvert 7j/7 -- 11h a 22h</p>
      </motion.div>

      <SectionDivider />
    </div>
  );
}

/* ─── Category Page ─── */
function CategoryPage({
  category, items, onAddToCart, onDetail, startIdx,
}: {
  category: string; items: MenuItem[]; onAddToCart: (item: MenuItem) => void; onDetail: (item: MenuItem) => void;
  startIdx: number;
}) {
  return (
    <div className="relative w-full h-full overflow-y-auto p-6 sm:p-8"
      style={{ background: "linear-gradient(180deg, #FDFBF7 0%, #FAF8F3 100%)" }}
    >
      <div className="mb-5 text-center">
        <motion.span className="text-[10px] font-semibold tracking-[0.25em] uppercase block"
          style={{
            fontFamily: "Montserrat, sans-serif",
            color: "#19B000",
            opacity: 0.6,
          }}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Notre Selection
        </motion.span>
        <motion.h2 className="mt-1 leading-none"
          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(1.3rem, 3.5vw, 2rem)", color: "#000000", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {category}
        </motion.h2>
        <div className="flex items-center justify-center gap-2 mt-3">
          <DecoLine width={20} />
          <DecoDot color="#19B000" />
          <DecoLine width={20} />
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
            background: "linear-gradient(135deg, rgba(229,62,48,0.08), rgba(255,215,0,0.05))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ChefHat size={22} style={{ color: "rgba(0,0,0,0.12)" }} />
          </div>
          <p className="text-sm" style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}>
            Aucun plat dans cette categorie
          </p>
          <p className="text-[10px]" style={{ fontFamily: "Open Sans, sans-serif", color: "#9B9385", fontStyle: "italic" }}>
            Decouvrez bientot notre nouvelle selection
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-0">
          {items.map((item, idx) => (
            <motion.div key={item.id} className="group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.3 }}
            >
              <motion.div onClick={() => onDetail(item)}
                className="flex items-start gap-3 px-2 py-3.5 transition-all duration-300 cursor-pointer"
                style={{
                  borderBottom: idx < items.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                }}
                whileHover={{ x: 2 }}
              >
                <TapedPhoto
                  src={item.image}
                  alt={item.name}
                  size={60}
                  rot={(startIdx + idx) * 3.7 % 6 - 3}
                />
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold leading-tight" style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}>
                      {item.name}
                    </h3>
                    <span className="text-sm font-bold whitespace-nowrap flex-shrink-0" style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}>
                      {formatPrice(getDisplayPrice(item))}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 leading-relaxed line-clamp-2" style={{ fontFamily: "Open Sans, sans-serif", color: "#8B7D6B" }}>
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.badge && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-semibold"
                        style={{
                          background: item.is_promotion ? "linear-gradient(135deg, rgba(229,62,48,0.85), rgba(220,38,38,0.85))" : "#000000",
                          color: "#FFFFFF",
                          borderRadius: "2px",
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.rating && (
                      <span className="flex items-center gap-0.5 text-[10px]" style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}>
                        <Star size={10} fill="#FFD700" stroke="none" />
                        {item.rating}
                      </span>
                    )}
                  </div>
                </div>
                <motion.button onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
                  className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #19B000, #0D8A00)",
                    border: "none",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontFamily: "Montserrat, sans-serif",
                    marginTop: 4,
                    boxShadow: "2px 2px 0 rgba(0,0,0,0.1)",
                  }}
                  whileHover={{ scale: 1.08, boxShadow: "3px 3px 0 rgba(0,0,0,0.1)" }}
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
            rotateY: [0, 0.8, 0, -0.8, 0],
            rotateX: [0, 0.2, 0, -0.2, 0],
            y: [0, -1.5, 0, -1.5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        >
          {/* Paper stack edges with depth (thicker for bigger book) */}
          <div className="absolute inset-x-0 mx-auto pointer-events-none" style={{ bottom: -3, width: "99%", height: 5, background: "#F0ECE2", borderRadius: "0 0 2px 2px", border: "1px solid rgba(0,0,0,0.04)", zIndex: 0 }} />
          <div className="absolute inset-x-0 mx-auto pointer-events-none" style={{ bottom: -6, width: "97.5%", height: 5, background: "#E8E4DA", borderRadius: "0 0 2px 2px", border: "1px solid rgba(0,0,0,0.03)", zIndex: 0 }} />
          <div className="absolute inset-x-0 mx-auto pointer-events-none" style={{ bottom: -9, width: "96%", height: 8, background: "#E0DCD2", borderRadius: "0 0 2px 2px", border: "1px solid rgba(0,0,0,0.02)", zIndex: 0 }} />
          <div className="absolute inset-x-0 mx-auto pointer-events-none" style={{ bottom: -13, width: "94%", height: 5, background: "#D8D4CA", borderRadius: "0 0 2px 2px", zIndex: 0 }} />
          <div className="absolute inset-x-0 mx-auto pointer-events-none" style={{ bottom: -17, width: "91%", height: 4, background: "#D0CCC2", borderRadius: "0 0 2px 2px", zIndex: 0 }} />

          {/* Spine accent stripe with gradient (thicker) */}
          <div className="relative" style={{ zIndex: 5 }}>
            <div style={{
              height: 5,
              background: "linear-gradient(90deg, #19B000 0%, #19B000 40%, #0D8A00 70%, #095E00 100%)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
            }} />
          </div>

          {onClose && (
            <motion.button onClick={onClose}
              className="absolute top-2 right-2 z-20 flex items-center justify-center w-8 h-8 transition-all duration-200"
              style={{
                background: "rgba(0,0,0,0.06)",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                color: "#000",
                backdropFilter: "blur(4px)",
              }}
              whileHover={{ background: "rgba(0,0,0,0.1)", scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Fermer le livre"
            >
              <X size={16} />
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
                    <CoverPage />
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

          {/* Right edge shadow with depth */}
          <div className="absolute right-0 top-0 bottom-0 pointer-events-none"
            style={{
              width: 12,
              background: "linear-gradient(270deg, rgba(0,0,0,0.08), transparent)",
              zIndex: 2,
            }}
          />

          {/* Bottom page curl shadow */}
          <div className="absolute bottom-0 right-0 pointer-events-none"
            style={{
              width: 80,
              height: 40,
              background: "radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.06), transparent)",
              zIndex: 2,
            }}
          />
        </motion.div>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between w-full mt-5" style={{ maxWidth: 800 }}>
        <motion.button onClick={prev} disabled={pageIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-all duration-300"
          style={{
            fontFamily: "Montserrat, sans-serif",
            color: pageIndex === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,0.1)",
            background: pageIndex === 0 ? "transparent" : "rgba(255,255,255,0.05)",
            cursor: pageIndex === 0 ? "default" : "pointer",
            opacity: pageIndex === 0 ? 0.3 : 1,
            borderRadius: "4px",
            backdropFilter: "blur(4px)",
          }}
          whileHover={pageIndex !== 0 ? { x: -4, borderColor: "rgba(25,176,0,0.3)" } : {}}
          whileTap={pageIndex !== 0 ? { scale: 0.96 } : {}}
        >
          <ChevronLeft size={14} strokeWidth={2.5} />
          Precedent
        </motion.button>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 py-2">
          {pages.map((p, i) => (
            <motion.button key={i} onClick={() => goTo(i)}
              className="transition-all duration-500 ease-out"
              style={{
                width: i === pageIndex ? 28 : 8,
                height: 8,
                background: i === pageIndex ? "#19B000" : "rgba(255,255,255,0.15)",
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
              }}
              whileHover={i !== pageIndex ? { scale: 1.2, background: "rgba(255,255,255,0.25)" } : {}}
              whileTap={{ scale: 0.9 }}
              aria-label={p.label}
            />
          ))}
        </div>

        <motion.button onClick={next} disabled={pageIndex === totalPages - 1}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-all duration-300"
          style={{
            fontFamily: "Montserrat, sans-serif",
            color: pageIndex === totalPages - 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,0.1)",
            background: pageIndex === totalPages - 1 ? "transparent" : "rgba(255,255,255,0.05)",
            cursor: pageIndex === totalPages - 1 ? "default" : "pointer",
            opacity: pageIndex === totalPages - 1 ? 0.3 : 1,
            borderRadius: "4px",
            backdropFilter: "blur(4px)",
          }}
          whileHover={pageIndex !== totalPages - 1 ? { x: 4, borderColor: "rgba(25,176,0,0.3)" } : {}}
          whileTap={pageIndex !== totalPages - 1 ? { scale: 0.96 } : {}}
        >
          Suivant
          <ChevronRight size={14} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Cart + Admin bar */}
      <div className="flex items-center justify-between w-full mt-3" style={{ maxWidth: 800 }}>
        {cartItemCount != null && cartItemCount > 0 ? (
          <motion.button onClick={() => window.dispatchEvent(new CustomEvent("open-cart"))}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold transition-all duration-200"
            style={{
              background: "rgba(25,176,0,0.12)",
              border: "1px solid rgba(25,176,0,0.2)",
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              color: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(4px)",
            }}
            whileHover={{ background: "rgba(25,176,0,0.2)", borderColor: "rgba(25,176,0,0.4)" }}
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
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>
                {formatPrice(cartTotal)}
              </span>
            )}
          </motion.button>
        ) : (
          <div />
        )}

        <a href="/dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold transition-all duration-200"
          style={{
            fontFamily: "Montserrat, sans-serif",
            color: "rgba(255,255,255,0.25)",
            textDecoration: "none",
          }}
        >
          <Shield size={11} strokeWidth={1.5} />
          Administration
          <ExternalLink size={10} strokeWidth={1.5} />
        </a>
      </div>

      <p className="text-[10px] font-semibold mt-2"
        style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.15)", letterSpacing: "0.15em" }}
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
            0 2px 4px rgba(0,0,0,0.04),
            0 8px 24px rgba(0,0,0,0.06),
            0 20px 56px rgba(0,0,0,0.08),
            0 40px 100px rgba(0,0,0,0.06) !important;
          border: 1px solid rgba(0,0,0,0.08) !important;
          border-left: 5px solid rgba(0,0,0,0.06) !important;
          border-radius: 1px !important;
          background: #FDFBF7 !important;
        }
        .book-page {
          background: #FDFBF7;
          overflow: hidden;
          height: 100%;
          width: 100%;
        }
        .book-page[data-density="hard"] {
          background: linear-gradient(180deg, #FDFBF7 0%, #F5F1EA 100%);
        }
      `}</style>
    </div>
  );
}
