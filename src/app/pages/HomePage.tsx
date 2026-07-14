import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  ArrowRight, Sparkles, ChevronDown, Beef, Pizza,
  Sandwich, CakeSlice, Coffee, UtensilsCrossed, Flame,
} from "lucide-react";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useCategories } from "../context/CategoriesContext";
import { fetchPlats } from "../utils/api";
import { formatPrice, getDisplayPrice } from "../utils/constants";
import { LuxuryBackground } from "../components/3d/LuxuryBackground";
import { ParticleField3D } from "../components/3d/ParticleField3D";
import { FloatingIngredients3D } from "../components/3d/FloatingIngredients3D";
import { LiquidBrandLogo } from "../components/3d/LiquidBrandLogo";
import { PlatDetailModal } from "../components/menu/PlatDetailModal";
import type { MenuItem } from "../utils/constants";

const FALLBACK_ITEMS: MenuItem[] = [
  { id: 1, name: "Burger Classic", description: "Steak hache, salade, tomate, oignons, sauce maison", price: 3500, original_price: null, category: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=75", badge: "Populaire", is_promotion: false, promotion_prix: null, spicy: false, menu_id: null },
  { id: 2, name: "Double Cheese", description: "Double steak, cheddar fondant, bacon croustillant", price: 4500, original_price: 5000, category: "Burgers", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=75", badge: "Promo", is_promotion: true, promotion_prix: 4000, spicy: false, menu_id: null },
  { id: 3, name: "Burger BBQ", description: "Steak, bacon, oignons caramelises, sauce BBQ fumee", price: 4200, original_price: null, category: "Burgers", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&q=75", badge: undefined, is_promotion: false, promotion_prix: null, spicy: false, menu_id: null },
  { id: 4, name: "Pizza Margherita", description: "Tomate, mozzarella, basilic frais, huile d'olive", price: 4000, original_price: null, category: "Pizzas", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=75", badge: "Classique", is_promotion: false, promotion_prix: null, spicy: false, menu_id: null },
  { id: 5, name: "Pepperoni Pizza", description: "Sauce tomate, mozzarella, pepperoni genereux", price: 5000, original_price: null, category: "Pizzas", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=75", badge: undefined, is_promotion: false, promotion_prix: null, spicy: true, menu_id: null },
  { id: 6, name: "Pizza 4 Fromages", description: "Mozzarella, chevre, emmental, parmesan, creme", price: 5500, original_price: null, category: "Pizzas", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=75", badge: "Chef", is_promotion: false, promotion_prix: null, spicy: false, menu_id: null },
  { id: 7, name: "Tacos Poulet", description: "Poulet grille, guacamole, fromage, salsa verte", price: 3000, original_price: null, category: "Tacos", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=75", badge: "Nouveau", is_promotion: false, promotion_prix: null, spicy: false, menu_id: null },
  { id: 8, name: "Tacos Boeuf", description: "Boeuf epice, oignons, coriandre, sauce piquante", price: 3500, original_price: null, category: "Tacos", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=75", badge: undefined, is_promotion: false, promotion_prix: null, spicy: true, menu_id: null },
  { id: 9, name: "Tacos Poisson", description: "Poisson grille, sauce citronnee, legumes croquants", price: 3200, original_price: null, category: "Tacos", image: "https://images.unsplash.com/photo-1611250188496-e966043a0629?w=400&q=75", badge: undefined, is_promotion: false, promotion_prix: null, spicy: false, menu_id: null },
  { id: 10, name: "Tiramisu", description: "Mascarpone, cafe, cacao, biscuits italiens", price: 2500, original_price: null, category: "Desserts", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=75", badge: "Chef", is_promotion: false, promotion_prix: null, spicy: false, menu_id: null },
  { id: 11, name: "Brownie Chocolat", description: "Chocolat noir fondant, noix de pecan, glace vanille", price: 3000, original_price: null, category: "Desserts", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=75", badge: undefined, is_promotion: false, promotion_prix: null, spicy: false, menu_id: null },
  { id: 12, name: "Coca-Cola", description: "Coca-Cola glace 33cl", price: 1000, original_price: null, category: "Boissons", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=75", badge: undefined, is_promotion: false, promotion_prix: null, spicy: false, menu_id: null },
  { id: 13, name: "Jus de Goyave", description: "Jus de goyave frais presse 33cl", price: 1500, original_price: null, category: "Boissons", image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=75", badge: "Frais", is_promotion: false, promotion_prix: null, spicy: false, menu_id: null },
];

const CATEGORY_META: Record<string, { icon: React.ElementType; color: string }> = {
  Burgers: { icon: Beef, color: "#19B000" },
  Pizzas: { icon: Pizza, color: "#19B000" },
  Tacos: { icon: Sandwich, color: "#19B000" },
  Desserts: { icon: CakeSlice, color: "#19B000" },
  Boissons: { icon: Coffee, color: "#19B000" },
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface PlatePosition {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
}

function computePlatePositions(items: MenuItem[], plateRadius: number): PlatePosition[] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const cardW = Math.max(65, Math.min(105, plateRadius * 0.24));
  const maxR = plateRadius - cardW * 0.55;

  return items.map((item, i) => {
    const angle = i * goldenAngle + seededRandom(item.id * 3) * 0.5;
    const r = Math.sqrt((i + 0.5) / Math.max(items.length, 1)) * maxR * 0.88;
    return {
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      rotation: (seededRandom(item.id * 13) - 0.5) * 24,
      scale: 0.86 + seededRandom(item.id * 17) * 0.28,
      zIndex: Math.round((r / maxR) * 100) + i,
    };
  });
}

function PlateDecorations({ radius }: { radius: number }) {
  const items = useMemo(() => {
    const decorIcons = [Flame, Flame, Beef, Flame, Beef, Flame, Beef, Flame];
    return Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      dist: radius - 6,
      opacity: 0.08 + seededRandom(i * 59) * 0.1,
      Icon: decorIcons[i % decorIcons.length],
      rotation: (i / 8) * 360,
    }));
  }, [radius]);

  return (
    <>
      {items.map((h, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(calc(-50% + ${Math.cos(h.angle) * h.dist}px), calc(-50% + ${Math.sin(h.angle) * h.dist}px)) rotate(${h.rotation}deg)`,
            opacity: h.opacity,
          }}
        >
          <h.Icon size={14} strokeWidth={1.5} color="#19B000" />
        </div>
      ))}
    </>
  );
}

function PlateCard({
  item, pos, cardSize, onClick, index,
}: {
  item: MenuItem; pos: PlatePosition; cardSize: number; onClick: () => void; index: number;
}) {
  const nameSize = Math.max(7, cardSize * 0.09);
  const priceSize = Math.max(6, cardSize * 0.08);
  const badgeSize = Math.max(6, cardSize * 0.07);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ width: cardSize, left: "50%", top: "50%", zIndex: pos.zIndex }}
      initial={{ opacity: 0, scale: 0.2, rotate: pos.rotation * 3, x: 0, y: 0 }}
      animate={{
        opacity: 1, scale: pos.scale, rotate: pos.rotation,
        x: pos.x - cardSize / 2, y: pos.y - cardSize * 0.5,
      }}
      exit={{ opacity: 0, scale: 0.3, rotate: pos.rotation * 2 }}
      transition={{ delay: index * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        scale: pos.scale * 1.22, rotate: 0, zIndex: 300,
        y: pos.y - cardSize * 0.5 - 18,
        boxShadow: "0 14px 40px rgba(0,0,0,0.15)",
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: pos.scale * 1.08 }}
      onClick={onClick}
    >
      <div
        className="relative overflow-hidden"
        style={{
          background: "#FFFFFF",
          border: "2.5px solid #000000",
          padding: 4,
          paddingBottom: nameSize * 3,
          boxShadow: "3px 3px 0 #000000",
        }}
      >
        <img
          src={item.image} alt={item.name}
          className="w-full block"
          style={{ aspectRatio: "1", objectFit: "cover", filter: "saturate(1.15) contrast(1.05)" }}
          loading="lazy"
        />
        {item.badge && (
          <div className="absolute top-1 left-1 px-1.5 py-px font-bold tracking-wide"
            style={{
              background: item.is_promotion ? "#19B000" : "#000000",
              color: "#FFFFFF", fontFamily: "Montserrat, sans-serif", fontSize: badgeSize,
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
            {item.badge}
          </div>
        )}
        {item.spicy && (
          <div className="absolute top-1 right-1 flex items-center justify-center"
            style={{
              width: badgeSize * 2.4, height: badgeSize * 2.4,
              background: "#DC2626", borderRadius: "50%",
            }}>
            <Flame size={badgeSize * 1.6} color="#fff" strokeWidth={2.5} />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 px-1.5"
          style={{ paddingBottom: 3, paddingTop: 2, background: "rgba(255,255,255,0.95)" }}>
          <p className="truncate leading-tight"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: nameSize, color: "#000000", lineHeight: 1.15 }}>
            {item.name}
          </p>
          <p className="leading-tight"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: priceSize, color: "#19B000" }}>
            {formatPrice(getDisplayPrice(item))}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function CategoryChip({
  cat, icon: Icon, count, isActive, onClick, delay,
}: {
  cat: string; icon: React.ElementType; count: number;
  isActive: boolean; onClick: () => void; delay: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-5 py-2.5 sm:py-3 cursor-pointer flex-shrink-0"
      style={{
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 700,
        background: isActive ? "#19B000" : "#FFFFFF",
        color: isActive ? "#FFFFFF" : "#000000",
        border: "2.5px solid #000000",
        borderRadius: 4,
        boxShadow: isActive ? "3px 3px 0 #000000" : "3px 3px 0 #000000",
        transition: "all 0.1s ease",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ x: -1, y: -1, boxShadow: "5px 5px 0 #000000" }}
      whileTap={{ x: 1, y: 1, boxShadow: "1px 1px 0 #000000" }}
    >
      <Icon size={18} strokeWidth={2.5} />
      <span className="text-xs font-bold tracking-wide uppercase">{cat}</span>
      <span className="text-[10px] font-bold px-1.5 py-0.5"
        style={{
          background: isActive ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)",
          color: isActive ? "#FFFFFF" : "#000000",
          borderRadius: 2,
          border: `1.5px solid ${isActive ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.15)"}`,
        }}>
        {count}
      </span>
    </motion.button>
  );
}

function PlateMenuSection({ menuItems, onAddToCart, mostOrderedPlatId }: {
  menuItems: MenuItem[]; onAddToCart: (item: MenuItem) => void; mostOrderedPlatId: number | null;
}) {
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const plateRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const plateRadius = isMobile ? 140 : 280;
  const plateDiameter = plateRadius * 2;
  const cardSize = Math.max(48, Math.min(100, plateRadius * 0.28));

  const filtered = useMemo(
    () => (activeCategory === "Tous" ? menuItems : menuItems.filter((i) => i.category === activeCategory)),
    [menuItems, activeCategory]
  );

  const positions = useMemo(() => computePlatePositions(filtered, plateRadius), [filtered, plateRadius]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    menuItems.forEach((i) => { counts[i.category] = (counts[i.category] ?? 0) + 1; });
    return counts;
  }, [menuItems]);

  const displayCategories = useMemo(() => categories.filter((c) => c !== "Tous"), [categories]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!plateRef.current) return;
    const rect = plateRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => setMousePos({ x: 0, y: 0 }), []);

  return (
    <section id="menu" className="relative py-14 sm:py-20 md:py-28 px-3 sm:px-4 scroll-mt-16" style={{ background: "#FAFAF8" }}>
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(25,176,0,0.04) 0%, transparent 60%)" }} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-3 block"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000", opacity: 0.7 }}>
            Notre Carte
          </span>
          <h2 className="text-3xl sm:text-5xl font-black leading-tight mb-4"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}>
            Des saveurs qui <span style={{ color: "#19B000" }}>font rever</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-3">
            <span style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(25,176,0,0.4))", display: "block" }} />
            <span style={{ width: 6, height: 6, background: "#19B000", display: "block", borderRadius: "50%", opacity: 0.5 }} />
            <span style={{ width: 40, height: 1, background: "linear-gradient(90deg, rgba(25,176,0,0.4), transparent)", display: "block" }} />
          </div>
          <p className="text-sm" style={{ fontFamily: "Open Sans, sans-serif", color: "#9B9385" }}>
            Explorez nos plats, cliquez pour decouvrir
          </p>
        </motion.div>

        {/* Category chips */}
        <motion.div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-2.5 sm:gap-3 mb-10 sm:mb-14 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}>
          <CategoryChip
            cat="Tous" icon={UtensilsCrossed} count={menuItems.length}
            isActive={activeCategory === "Tous"}
            onClick={() => setActiveCategory("Tous")}
            delay={0.1}
          />
          {displayCategories.map((cat, i) => {
            const meta = CATEGORY_META[cat] || { icon: UtensilsCrossed, color: "#19B000" };
            return (
              <CategoryChip
                key={cat} cat={cat} icon={meta.icon}
                count={categoryCounts[cat] ?? 0}
                isActive={activeCategory === cat}
                onClick={() => setActiveCategory(activeCategory === cat ? "Tous" : cat)}
                delay={0.15 + i * 0.06}
              />
            );
          })}
        </motion.div>

        {/* Tout voir toggle */}
        <div className="flex justify-center mb-6">
          <motion.button
            onClick={() => setShowGrid(!showGrid)}
            className="flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase cursor-pointer"
            style={{
              fontFamily: "Montserrat, sans-serif",
              background: showGrid ? "#000000" : "#FFFFFF",
              color: showGrid ? "#FFFFFF" : "#000000",
              border: "2.5px solid #000000",
              borderRadius: 4,
              boxShadow: "3px 3px 0 #000000",
            }}
            whileHover={{ x: -1, y: -1, boxShadow: "5px 5px 0 #000000" }}
            whileTap={{ x: 1, y: 1, boxShadow: "1px 1px 0 #000000" }}
          >
            {showGrid ? (
              <><UtensilsCrossed size={14} strokeWidth={2.5} /> Voir l'assiette</>
            ) : (
              <><Flame size={14} strokeWidth={2.5} /> Tout voir</>
            )}
          </motion.button>
        </div>

        {/* Plate — desktop + mobile when grid is off */}
        {!showGrid && (
          <motion.div
            ref={plateRef}
            className="relative mx-auto overflow-hidden"
            style={{
              width: "100%",
              maxWidth: plateDiameter + 40,
              aspectRatio: `1 / 1`,
              perspective: 1200,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                borderRadius: "50%",
                transform: `perspective(1200px) rotateY(${mousePos.x * 2}deg) rotateX(${-mousePos.y * 2}deg)`,
                transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <div className="absolute inset-0"
                style={{
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 42% 38%, #FFFFFF 0%, #FAFAFA 55%, #F0F0F0 78%, #E8E8E8 90%, #DDDDDD 100%)",
                  boxShadow: `
                    inset 0 0 50px rgba(0,0,0,0.03),
                    0 0 0 8px rgba(0,0,0,0.03),
                    0 0 0 9px rgba(255,255,255,0.9),
                    0 0 0 12px rgba(0,0,0,0.04),
                    0 20px 60px rgba(0,0,0,0.1),
                    0 8px 24px rgba(0,0,0,0.06)
                  `,
                }} />
              <div className="absolute" style={{ inset: "7%", borderRadius: "50%", border: "1px solid rgba(0,0,0,0.04)" }} />
              <div className="absolute" style={{ inset: "9%", borderRadius: "50%", border: "0.5px solid rgba(0,0,0,0.02)" }} />
              <PlateDecorations radius={plateRadius} />
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <PlateCard key={item.id} item={item} pos={positions[i]} cardSize={cardSize}
                    index={i} onClick={() => setDetailItem(item)} />
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <UtensilsCrossed size={48} strokeWidth={1} color="rgba(0,0,0,0.1)" />
                  <p className="text-sm font-semibold" style={{ fontFamily: "Montserrat, sans-serif", color: "#9B9385" }}>
                    Aucun plat dans cette categorie
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Mobile grid view — beautiful readable cards */}
        {showGrid && (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                className="relative cursor-pointer overflow-hidden"
                style={{
                  background: "#FFFFFF",
                  border: "2.5px solid #000000",
                  borderRadius: 4,
                  boxShadow: "3px 3px 0 #000000",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setDetailItem(item)}
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full block"
                    style={{ aspectRatio: "1", objectFit: "cover", filter: "saturate(1.15) contrast(1.05)" }}
                    loading="lazy"
                  />
                  {item.badge && (
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 text-[9px] font-bold tracking-wide"
                      style={{
                        background: item.is_promotion ? "#19B000" : "#000000",
                        color: "#FFFFFF",
                        fontFamily: "Montserrat, sans-serif",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}>
                      {item.badge}
                    </div>
                  )}
                  {item.spicy && (
                    <div className="absolute top-1.5 right-1.5 flex items-center justify-center"
                      style={{
                        width: 20, height: 20,
                        background: "#DC2626", borderRadius: "50%",
                      }}>
                      <Flame size={12} color="#fff" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-bold leading-tight mb-0.5 truncate"
                    style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}>
                    {item.name}
                  </p>
                  <p className="text-[10px] leading-tight mb-1.5 line-clamp-2"
                    style={{ fontFamily: "Open Sans, sans-serif", color: "#9B9385" }}>
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black"
                      style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}>
                      {formatPrice(getDisplayPrice(item))}
                    </span>
                    {item.original_price && (
                      <span className="text-[9px] line-through"
                        style={{ fontFamily: "Open Sans, sans-serif", color: "#9B9385" }}>
                        {formatPrice(item.original_price)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center mt-1.5">
                    {item.id === mostOrderedPlatId && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5"
                        style={{ fontFamily: "Montserrat, sans-serif", background: "#19B000", color: "#FFFFFF", borderRadius: 2 }}>
                        Le plus commandé !
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-2 flex flex-col items-center justify-center py-16 gap-3">
                <UtensilsCrossed size={48} strokeWidth={1} color="rgba(0,0,0,0.1)" />
                <p className="text-sm font-semibold" style={{ fontFamily: "Montserrat, sans-serif", color: "#9B9385" }}>
                  Aucun plat dans cette categorie
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <PlatDetailModal item={detailItem} onClose={() => setDetailItem(null)} onAdd={onAddToCart} />
    </section>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

interface Props {
  onAddToCart: (item: MenuItem) => void;
}

export function HomePage({ onAddToCart }: Props) {
  const { config } = useSiteConfig();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(FALLBACK_ITEMS);
  const [mostOrderedPlatId, setMostOrderedPlatId] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    fetchPlats(controller.signal)
      .then((result) => { clearTimeout(timer); if (result.plats.length > 0) { setMenuItems(result.plats); setMostOrderedPlatId(result.mostOrderedPlatId); } })
      .catch(() => clearTimeout(timer));
    return () => { clearTimeout(timer); controller.abort(); };
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative" style={{ minHeight: "max(550px, 100vh)" }}>
        <LuxuryBackground />
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <ParticleField3D particleCount={1200} color="#19B000" accentColor="#FFFFFF" />
        </div>
        <div className="absolute inset-0 z-[2] pointer-events-none">
          <FloatingIngredients3D />
        </div>
        <div className="absolute inset-0 z-[3] pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)" }} />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-[min(300px,65vw)] h-[min(110px,25vw)] mb-6">
            <LiquidBrandLogo className="w-full h-full" />
          </motion.div>

          <motion.h1 className="text-center leading-[0.85] mb-3"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(2.4rem, 8vw, 5.5rem)", letterSpacing: "-0.03em" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <span style={{ color: "#19B000" }}>BETHEL</span>
            <br />
            <span style={{ color: "#FFFFFF" }}>GRILL</span>
          </motion.h1>

          <motion.p className="text-sm sm:text-base max-w-sm text-center mb-8 leading-relaxed"
            style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.5)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            L'excellence du detail, la passion du gout.
          </motion.p>

           <motion.div className="flex flex-col sm:flex-row items-center gap-3"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}>
            <motion.a href="#menu"
              className="flex items-center gap-2 px-8 py-3.5 text-sm font-extrabold text-white uppercase tracking-wide"
              style={{
                background: "#19B000",
                border: "3px solid #000000",
                borderRadius: 4,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                textDecoration: "none",
                boxShadow: "4px 4px 0 #000000",
                transition: "box-shadow 0.1s, transform 0.1s",
              }}
              whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0 #000000" }}
              whileTap={{ x: 2, y: 2, boxShadow: "2px 2px 0 #000000" }}>
              <Sparkles size={16} strokeWidth={2.5} /> Decouvrir le menu <ArrowRight size={16} strokeWidth={2.5} />
            </motion.a>
          </motion.div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <motion.div animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.3)" }}>
              Menu
            </span>
            <ChevronDown size={16} style={{ color: "rgba(255,255,255,0.3)" }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ PLATE MENU ═══ */}
      <PlateMenuSection menuItems={menuItems} onAddToCart={onAddToCart} mostOrderedPlatId={mostOrderedPlatId} />
    </div>
  );
}
