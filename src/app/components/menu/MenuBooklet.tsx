import { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Star, UtensilsCrossed } from "lucide-react";
import type { MenuItem } from "../../utils/constants";
import { formatPrice, getDisplayPrice } from "../../utils/constants";
import { PlatDetailModal } from "./PlatDetailModal";

interface Props {
  categories: string[];
  menuItems: MenuItem[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onAddToCart: (item: MenuItem) => void;
  coverContent?: ReactNode;
  backContent?: ReactNode;
}

/* ─── Realistic Book Page with 3D perspective ─── */
function BookPage({ children, direction }: { children: ReactNode; direction: number }) {
  return (
    <motion.div
      className="absolute inset-0 overflow-y-auto"
      style={{
        background: "#FDFBF7",
        borderRadius: "2px",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        boxShadow: direction > 0
          ? "-4px 0 12px rgba(0,0,0,0.06)"
          : "4px 0 12px rgba(0,0,0,0.06)",
      }}
      initial={{
        opacity: 0,
        x: direction > 0 ? 160 : -160,
        rotateY: direction > 0 ? -12 : 12,
        scale: 0.93,
        filter: "blur(4px)",
        transformPerspective: 1200,
      }}
      animate={{
        opacity: 1,
        x: 0,
        rotateY: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      exit={{
        opacity: 0,
        x: direction > 0 ? -140 : 140,
        rotateY: direction > 0 ? 8 : -8,
        scale: 0.92,
        filter: "blur(5px)",
        transition: {
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
    >
      {/* Paper grain texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.35,
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,119,90,0.02) 2px, rgba(139,119,90,0.02) 3px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139,119,90,0.015) 2px, rgba(139,119,90,0.015) 3px)
          `,
        }}
      />
      {children}
    </motion.div>
  );
}

/* ─── Navigation Dots ─── */
function PageDots({
  total,
  current,
  labels,
  onChange,
}: {
  total: number;
  current: number;
  labels: string[];
  onChange: (i: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className="transition-all duration-500 ease-out"
          style={{
            width: i === current ? 28 : 8,
            height: 8,
            background: i === current
              ? "linear-gradient(90deg, #19B000, #0D8A00)"
              : "rgba(0,0,0,0.08)",
            borderRadius: 4,
            border: "none",
            cursor: "pointer",
          }}
          aria-label={labels[i]}
        />
      ))}
    </div>
  );
}

export function MenuBooklet({
  categories,
  menuItems,
  onAddToCart,
  coverContent,
  backContent,
}: Props) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);
  const bookletRef = useRef<HTMLDivElement>(null);

  const totalPages = 1 + categories.length + (backContent ? 1 : 0);

  const pageLabels = [
    "Couverture",
    ...categories,
    ...(backContent ? ["Contact"] : []),
  ];

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(i, totalPages - 1));
      setDirection(clamped > page ? 1 : -1);
      setPage(clamped);
    },
    [page, totalPages]
  );

  const next = useCallback(() => {
    if (page < totalPages - 1) {
      setDirection(1);
      setPage((p) => p + 1);
    }
  }, [page, totalPages]);

  const prev = useCallback(() => {
    if (page > 0) {
      setDirection(-1);
      setPage((p) => p - 1);
    }
  }, [page]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  useEffect(() => {
    if (page > 0 && page <= categories.length) {
      categories[page - 1];
    }
  }, [page, categories]);

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-4">
      {/* Top decorative label */}
      <motion.div
        className="mb-5 flex items-center gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <span style={{ width: 40, height: 1.5, background: "#E53E30", opacity: 0.3, display: "block" }} />
        <span
          className="text-[10px] font-semibold tracking-[0.3em] uppercase"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000", opacity: 0.5 }}
        >
          Notre Carte
        </span>
        <span style={{ width: 40, height: 1.5, background: "#E53E30", opacity: 0.3, display: "block" }} />
      </motion.div>

      {/* Book Container with 3D perspective */}
      <div
        ref={bookletRef}
        className="relative w-full"
        style={{
          maxWidth: 780,
          perspective: "1400px",
        }}
      >
        {/* Stacked paper edges (book block effect) */}
        <div
          className="absolute inset-x-0 mx-auto pointer-events-none"
          style={{
            bottom: -3,
            width: "98.5%",
            height: 6,
            background: "#F0ECE2",
            borderRadius: "0 0 3px 3px",
            border: "1px solid rgba(0,0,0,0.04)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            zIndex: 0,
          }}
        />
        <div
          className="absolute inset-x-0 mx-auto pointer-events-none"
          style={{
            bottom: -6,
            width: "97%",
            height: 6,
            background: "#E8E4DA",
            borderRadius: "0 0 3px 3px",
            border: "1px solid rgba(0,0,0,0.03)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
            zIndex: 0,
          }}
        />
        <div
          className="absolute inset-x-0 mx-auto pointer-events-none"
          style={{
            bottom: -9,
            width: "95.5%",
            height: 8,
            background: "#E0DCD2",
            borderRadius: "0 0 3px 3px",
            border: "1px solid rgba(0,0,0,0.02)",
            zIndex: 0,
          }}
        />

        {/* Book spine left shadow */}
        <div
          className="absolute left-0 top-0 bottom-0 pointer-events-none"
          style={{
            width: 12,
            background: "linear-gradient(90deg, rgba(0,0,0,0.04), transparent)",
            zIndex: 2,
          }}
        />

        {/* Main book */}
        <div
          className="relative overflow-hidden"
          style={{
            maxWidth: 780,
            minHeight: "clamp(520px, 78vh, 700px)",
            background: "#FDFBF7",
            border: "1px solid rgba(0,0,0,0.08)",
            borderLeft: "3px solid rgba(0,0,0,0.06)",
            borderRadius: "1px",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.08)",
            zIndex: 1,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Book top spine accent (green + red + yellow) */}
          <div
            style={{
              height: 4,
              background: "linear-gradient(90deg, #19B000 0%, #19B000 40%, #FFD700 70%, #E53E30 100%)",
            }}
          />

          <div className="relative" style={{ height: "calc(100% - 4px)" }}>
            <AnimatePresence mode="wait" custom={direction}>
              <BookPage key={page} direction={direction}>
                {page === 0 ? (
                  coverContent
                ) : page <= categories.length ? (
                  <CategoryPage
                    category={categories[page - 1]}
                    items={menuItems.filter(
                      (i) => i.category === categories[page - 1]
                    )}
                    onAddToCart={onAddToCart}
                    onDetail={(item) => setDetailItem(item)}
                  />
                ) : (
                  backContent
                )}
              </BookPage>
            </AnimatePresence>
          </div>
        </div>

        {/* Book edge right shadow */}
        <div
          className="absolute right-0 top-0 bottom-0 pointer-events-none"
          style={{
            width: 8,
            background: "linear-gradient(270deg, rgba(0,0,0,0.03), transparent)",
            zIndex: 2,
          }}
        />
      </div>

      {/* Page curl hint at bottom corners */}
      <div
        className="relative w-full mt-1"
        style={{ maxWidth: 780 }}
      >
        <div
          className="mx-auto"
          style={{
            width: "50%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.04), transparent)",
          }}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between w-full mt-4" style={{ maxWidth: 780 }}>
        <motion.button
          onClick={prev}
          disabled={page === 0}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-all duration-300"
          style={{
            fontFamily: "Montserrat, sans-serif",
            color: page === 0 ? "rgba(0,0,0,0.12)" : "#000000",
            border: page === 0 ? "1px solid transparent" : "1px solid rgba(0,0,0,0.06)",
            background: page === 0 ? "transparent" : "rgba(255,215,0,0.05)",
            cursor: page === 0 ? "default" : "pointer",
            opacity: page === 0 ? 0.3 : 1,
            borderRadius: "4px",
          }}
          whileHover={page !== 0 ? { x: -4, borderColor: "rgba(229,62,48,0.2)" } : {}}
          whileTap={page !== 0 ? { scale: 0.96 } : {}}
        >
          <ChevronLeft size={14} strokeWidth={2.5} />
          Précédent
        </motion.button>

        <PageDots
          total={totalPages}
          current={page}
          labels={pageLabels}
          onChange={goTo}
        />

        <motion.button
          onClick={next}
          disabled={page === totalPages - 1}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-all duration-300"
          style={{
            fontFamily: "Montserrat, sans-serif",
            color: page === totalPages - 1 ? "rgba(0,0,0,0.12)" : "#000000",
            border: page === totalPages - 1 ? "1px solid transparent" : "1px solid rgba(0,0,0,0.06)",
            background: page === totalPages - 1 ? "transparent" : "rgba(255,215,0,0.05)",
            cursor: page === totalPages - 1 ? "default" : "pointer",
            opacity: page === totalPages - 1 ? 0.3 : 1,
            borderRadius: "4px",
          }}
          whileHover={page !== totalPages - 1 ? { x: 4, borderColor: "rgba(229,62,48,0.2)" } : {}}
          whileTap={page !== totalPages - 1 ? { scale: 0.96 } : {}}
        >
          Suivant
          <ChevronRight size={14} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Page number */}
      <motion.p
        className="text-[10px] font-semibold mt-2"
        style={{
          fontFamily: "Open Sans, sans-serif",
          color: "rgba(0,0,0,0.12)",
          letterSpacing: "0.15em",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {page + 1} / {totalPages}
      </motion.p>

      <PlatDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onAdd={onAddToCart}
      />
    </div>
  );
}

/* ─── Category Page (Menu Section with red/yellow accents) ─── */
function CategoryPage({
  category,
  items,
  onAddToCart,
  onDetail,
}: {
  category: string;
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onDetail: (item: MenuItem) => void;
}) {
  return (
    <div className="p-6 sm:p-10">
      {/* Section header */}
      <div className="mb-6 text-center">
        <motion.span
          className="text-[10px] font-semibold tracking-[0.25em] uppercase block"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#E53E30", opacity: 0.6 }}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          Notre Sélection
        </motion.span>

        <motion.h2
          className="mt-1 leading-none"
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
            color: "#000000",
            letterSpacing: "-0.02em",
          }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          {category}
        </motion.h2>

        {/* Decorative divider with green + red + yellow */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <span style={{ width: 20, height: 1.5, background: "#19B000", display: "block", borderRadius: 1 }} />
          <span style={{ width: 5, height: 5, background: "#E53E30", display: "block", borderRadius: "50%", opacity: 0.7 }} />
          <span style={{ width: 12, height: 1.5, background: "#FFD700", display: "block", borderRadius: 1, opacity: 0.5 }} />
          <span style={{ width: 5, height: 5, background: "#19B000", display: "block", borderRadius: "50%", opacity: 0.7 }} />
          <span style={{ width: 20, height: 1.5, background: "#19B000", display: "block", borderRadius: 1 }} />
        </div>
      </div>

      {/* Menu items */}
      <div className="flex flex-col gap-0">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            className="group"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * idx, duration: 0.35 }}
          >
            <div
              onClick={() => onDetail(item)}
              className="flex items-start gap-4 px-3 py-4 transition-all duration-300 cursor-pointer hover:bg-[rgba(229,62,48,0.02)]"
              style={{
                borderBottom: idx < items.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
              }}
            >
              {/* Dish image (circular) */}
              <div
                className="flex-shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-105"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#F5F1EA",
                  border: "2px solid rgba(229,62,48,0.08)",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 min-w-0 pt-1">
                {/* Name + Price */}
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="text-sm font-bold leading-tight"
                    style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                  >
                    {item.name}
                  </h3>
                  <span
                    className="text-sm font-bold whitespace-nowrap flex-shrink-0"
                    style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}
                  >
                    {formatPrice(getDisplayPrice(item))}
                  </span>
                </div>

                {/* Description */}
                <p
                  className="text-xs mt-1 leading-relaxed"
                  style={{ fontFamily: "Open Sans, sans-serif", color: "#8B7D6B" }}
                >
                  {item.description}
                </p>

                {/* Badge + meta */}
                <div className="flex items-center gap-2 mt-1.5">
                  {item.badge && (
                    <span
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-semibold"
                      style={{
                        background: item.is_promotion
                          ? "linear-gradient(135deg, #E53E30, #DC2626)"
                          : "#000000",
                        color: "#FFFFFF",
                        borderRadius: "2px",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.rating && (
                    <span
                      className="flex items-center gap-0.5 text-[10px]"
                      style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}
                    >
                      <Star size={10} fill="#FFD700" stroke="none" />
                      {item.rating}
                    </span>
                  )}
                </div>
              </div>

              {/* Add to cart button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(item);
                }}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #19B000, #0D8A00)",
                  border: "none",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  marginTop: 4,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.94 }}
              >
                +
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center py-16 gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <UtensilsCrossed size={28} style={{ color: "rgba(0,0,0,0.1)" }} />
          <p
            className="text-sm"
            style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}
          >
            Aucun plat dans cette catégorie
          </p>
        </motion.div>
      )}
    </div>
  );
}
