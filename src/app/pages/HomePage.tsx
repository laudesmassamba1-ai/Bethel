import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  ArrowRight, Sparkles, MessageCircle, ChevronDown, Beef, Pizza,
  Sandwich, CakeSlice, Coffee, UtensilsCrossed, Flame,
} from "lucide-react";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useCategories } from "../context/CategoriesContext";
import { fetchPlats } from "../utils/api";
import { formatPrice, getDisplayPrice, buildWhatsAppUrl } from "../utils/constants";
import { LuxuryBackground } from "../components/3d/LuxuryBackground";
import { ParticleField3D } from "../components/3d/ParticleField3D";
import { FloatingIngredients3D } from "../components/3d/FloatingIngredients3D";
import { LiquidBrandLogo } from "../components/3d/LiquidBrandLogo";
import { PlatDetailModal } from "../components/menu/PlatDetailModal";
import type { MenuItem } from "../utils/constants";

const FALLBACK_ITEMS: MenuItem[] = [
  { id: 1, name: "Burger Classic", description: "Steak hache, salade, tomate, oignons, sauce maison", price: 3500, original_price: null, category: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=75", badge: "Populaire", is_promotion: false, promotion_prix: null, spicy: false, rating: 4.8, time: "15 min", menu_id: null },
  { id: 2, name: "Double Cheese", description: "Double steak, cheddar fondant, bacon croustillant", price: 4500, original_price: 5000, category: "Burgers", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=75", badge: "Promo", is_promotion: true, promotion_prix: 4000, spicy: false, rating: 4.9, time: "18 min", menu_id: null },
  { id: 3, name: "Burger BBQ", description: "Steak, bacon, oignons caramelises, sauce BBQ fumee", price: 4200, original_price: null, category: "Burgers", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&q=75", badge: undefined, is_promotion: false, promotion_prix: null, spicy: false, rating: 4.7, time: "16 min", menu_id: null },
  { id: 4, name: "Pizza Margherita", description: "Tomate, mozzarella, basilic frais, huile d'olive", price: 4000, original_price: null, category: "Pizzas", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=75", badge: "Classique", is_promotion: false, promotion_prix: null, spicy: false, rating: 4.7, time: "20 min", menu_id: null },
  { id: 5, name: "Pepperoni Pizza", description: "Sauce tomate, mozzarella, pepperoni genereux", price: 5000, original_price: null, category: "Pizzas", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=75", badge: undefined, is_promotion: false, promotion_prix: null, spicy: true, rating: 4.6, time: "22 min", menu_id: null },
  { id: 6, name: "Pizza 4 Fromages", description: "Mozzarella, chevre, emmental, parmesan, creme", price: 5500, original_price: null, category: "Pizzas", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=75", badge: "Chef", is_promotion: false, promotion_prix: null, spicy: false, rating: 4.8, time: "22 min", menu_id: null },
  { id: 7, name: "Tacos Poulet", description: "Poulet grille, guacamole, fromage, salsa verte", price: 3000, original_price: null, category: "Tacos", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=75", badge: "Nouveau", is_promotion: false, promotion_prix: null, spicy: false, rating: 4.5, time: "12 min", menu_id: null },
  { id: 8, name: "Tacos Boeuf", description: "Boeuf epice, oignons, coriandre, sauce piquante", price: 3500, original_price: null, category: "Tacos", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=75", badge: undefined, is_promotion: false, promotion_prix: null, spicy: true, rating: 4.8, time: "14 min", menu_id: null },
  { id: 9, name: "Tacos Poisson", description: "Poisson grille, sauce citronnee, legumes croquants", price: 3200, original_price: null, category: "Tacos", image: "https://images.unsplash.com/photo-1611250188496-e966043a0629?w=400&q=75", badge: undefined, is_promotion: false, promotion_prix: null, spicy: false, rating: 4.4, time: "13 min", menu_id: null },
  { id: 10, name: "Tiramisu", description: "Mascarpone, cafe, cacao, biscuits italiens", price: 2500, original_price: null, category: "Desserts", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=75", badge: "Chef", is_promotion: false, promotion_prix: null, spicy: false, rating: 4.9, time: "5 min", menu_id: null },
  { id: 11, name: "Brownie Chocolat", description: "Chocolat noir fondant, noix de pecan, glace vanille", price: 3000, original_price: null, category: "Desserts", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=75", badge: undefined, is_promotion: false, promotion_prix: null, spicy: false, rating: 4.7, time: "8 min", menu_id: null },
  { id: 12, name: "Coca-Cola", description: "Coca-Cola glace 33cl", price: 1000, original_price: null, category: "Boissons", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=75", badge: undefined, is_promotion: false, promotion_prix: null, spicy: false, rating: 4.0, time: "2 min", menu_id: null },
  { id: 13, name: "Jus de Goyave", description: "Jus de goyave frais presse 33cl", price: 1500, original_price: null, category: "Boissons", image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=75", badge: "Frais", is_promotion: false, promotion_prix: null, spicy: false, rating: 4.3, time: "3 min", menu_id: null },
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
        boxShadow: "0 14px 40px rgba(0,0,0,0.4)",
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: pos.scale * 1.08 }}
      onClick={onClick}
    >
      <div
        className="relative overflow-hidden"
        style={{
          background: "rgba(20,20,20,0.85)",
          border: "1px solid rgba(25,176,0,0.15)",
          padding: 4,
          paddingBottom: nameSize * 3,
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          backdropFilter: "blur(8px)",
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
          style={{ paddingBottom: 3, paddingTop: 2, background: "rgba(10,10,10,0.9)" }}>
          <p className="truncate leading-tight"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: nameSize, color: "#FFFFFF", lineHeight: 1.15 }}>
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
      className="flex items-center gap-2.5 px-5 py-3 cursor-pointer"
      style={{
        fontFamily: "Montserrat, sans-serif",
        background: isActive
          ? "linear-gradient(135deg, rgba(25,176,0,0.25), rgba(25,176,0,0.08))"
          : "rgba(255,255,255,0.04)",
        color: isActive ? "#19B000" : "rgba(255,255,255,0.5)",
        border: isActive ? "1px solid rgba(25,176,0,0.4)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        backdropFilter: "blur(12px)",
        boxShadow: isActive ? "0 0 30px rgba(25,176,0,0.12)" : "none",
        transition: "all 0.35s ease",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.06, y: -2, borderColor: "rgba(25,176,0,0.3)" }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
      <span className="text-xs font-bold tracking-wide">{cat}</span>
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
        style={{
          background: isActive ? "rgba(25,176,0,0.2)" : "rgba(255,255,255,0.06)",
          color: isActive ? "#19B000" : "rgba(255,255,255,0.3)",
        }}>
        {count}
      </span>
    </motion.button>
  );
}

function PlateMenuSection({ menuItems, onAddToCart }: {
  menuItems: MenuItem[]; onAddToCart: (item: MenuItem) => void;
}) {
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const plateRef = useRef<HTMLDivElement>(null);

  const plateRadius = 280;
  const plateDiameter = plateRadius * 2;
  const cardSize = Math.max(64, Math.min(100, plateRadius * 0.28));

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
    <section id="menu" className="relative py-20 sm:py-28 px-4" style={{ background: "linear-gradient(180deg, #000000 0%, #071a07 50%, #000000 100%)" }}>
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(25,176,0,0.06) 0%, transparent 60%)" }} />

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
            style={{ fontFamily: "Montserrat, sans-serif", color: "#FFFFFF" }}>
            Des saveurs qui <span style={{ color: "#19B000" }}>font rever</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-3">
            <span style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(25,176,0,0.4))", display: "block" }} />
            <span style={{ width: 6, height: 6, background: "#19B000", display: "block", borderRadius: "50%", opacity: 0.5 }} />
            <span style={{ width: 40, height: 1, background: "linear-gradient(90deg, rgba(25,176,0,0.4), transparent)", display: "block" }} />
          </div>
          <p className="text-sm" style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.35)" }}>
            Explorez nos plats, cliquez pour decouvrir
          </p>
        </motion.div>

        {/* Category chips */}
        <motion.div className="flex flex-wrap justify-center gap-3 mb-14"
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

        {/* Plate */}
        <motion.div
          ref={plateRef}
          className="relative mx-auto"
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
            className="absolute inset-0"
            style={{
              borderRadius: "50%",
              transform: `perspective(1200px) rotateY(${mousePos.x * 2}deg) rotateX(${-mousePos.y * 2}deg)`,
              transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {/* Dark ceramic surface */}
            <div className="absolute inset-0"
              style={{
                borderRadius: "50%",
                background: "radial-gradient(circle at 42% 38%, #1a1a1a 0%, #111 55%, #0a0a0a 78%, #050505 100%)",
                boxShadow: `
                  inset 0 0 60px rgba(25,176,0,0.04),
                  0 0 0 8px rgba(25,176,0,0.08),
                  0 0 0 9px rgba(255,255,255,0.05),
                  0 0 0 12px rgba(25,176,0,0.04),
                  0 24px 80px rgba(0,0,0,0.6),
                  0 10px 30px rgba(0,0,0,0.4)
                `,
              }} />

            {/* Inner rings */}
            <div className="absolute" style={{ inset: "7%", borderRadius: "50%", border: "1px solid rgba(25,176,0,0.06)" }} />
            <div className="absolute" style={{ inset: "9%", borderRadius: "50%", border: "0.5px solid rgba(255,255,255,0.02)" }} />

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
                <UtensilsCrossed size={48} strokeWidth={1} color="rgba(255,255,255,0.1)" />
                <p className="text-sm font-semibold" style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.25)" }}>
                  Aucun plat dans cette categorie
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.p className="text-center mt-8 text-xs"
          style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.25)" }}
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}>
          {activeCategory === "Tous"
            ? `${filtered.length} plats au total`
            : `${filtered.length} plat${filtered.length > 1 ? "s" : ""} en ${activeCategory}`}
        </motion.p>
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
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onAddToCart: (item: MenuItem) => void;
}

export function HomePage({ onAddToCart }: Props) {
  const { config } = useSiteConfig();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(FALLBACK_ITEMS);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    fetchPlats(controller.signal)
      .then((plats) => { clearTimeout(timer); if (plats.length > 0) setMenuItems(plats); })
      .catch(() => clearTimeout(timer));
    return () => { clearTimeout(timer); controller.abort(); };
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative" style={{ height: "100vh", minHeight: 600 }}>
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
            <span style={{ color: "#FFFFFF" }}>KITCHEN</span>
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
              className="flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #19B000, #0D8A00)", border: "none", borderRadius: 6,
                cursor: "pointer", fontFamily: "Montserrat, sans-serif", textDecoration: "none",
                boxShadow: "0 4px 20px rgba(25,176,0,0.3), 6px 6px 0 rgba(0,0,0,0.3)",
              }}
              whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Sparkles size={15} /> Decouvrir le menu <ArrowRight size={15} />
            </motion.a>
            <motion.a
              href={buildWhatsAppUrl("Bonjour ! Je souhaite commander.", config.whatsapp_number)}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3.5 text-sm font-bold"
              style={{
                background: "transparent", color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6,
                fontFamily: "Montserrat, sans-serif", textDecoration: "none",
              }}
              whileHover={{ borderColor: "rgba(25,176,0,0.5)", color: "#19B000" }}
              whileTap={{ scale: 0.97 }}>
              <MessageCircle size={15} /> Commander
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
      <PlateMenuSection menuItems={menuItems} onAddToCart={onAddToCart} />

      {/* ═══ CTA ═══ */}
      <section className="relative py-20 sm:py-28 px-4 text-center"
        style={{ background: "linear-gradient(180deg, #000000 0%, #0a1a0a 50%, #000000 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(25,176,0,0.06) 0%, transparent 70%)" }} />
        <Reveal>
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-4 block"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}>
            Pret a savourer ?
          </span>
          <h2 className="text-3xl sm:text-5xl font-black leading-tight mb-6"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#FFFFFF" }}>
            Commandez en <span style={{ color: "#19B000" }}>quelques clics</span>
          </h2>
          <p className="text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed"
            style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.4)" }}>
            Discutez directement avec notre equipe via WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.a
              href={buildWhatsAppUrl("Bonjour ! Je souhaite commander.", config.whatsapp_number)}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white"
              style={{
                background: "#25D366", border: "none", borderRadius: 6, cursor: "pointer",
                fontFamily: "Montserrat, sans-serif", textDecoration: "none",
                boxShadow: "0 4px 20px rgba(37,211,102,0.3), 6px 6px 0 rgba(0,0,0,0.3)",
              }}
              whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <MessageCircle size={15} /> WhatsApp
            </motion.a>
            <motion.a href="tel:+229000000000"
              className="flex items-center gap-2 px-8 py-3.5 text-sm font-bold"
              style={{
                background: "transparent", color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6,
                fontFamily: "Montserrat, sans-serif", textDecoration: "none",
              }}
              whileHover={{ borderColor: "rgba(25,176,0,0.5)", color: "#19B000" }}>
              Appeler
            </motion.a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
