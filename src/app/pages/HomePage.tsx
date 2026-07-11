import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useCategories } from "../context/CategoriesContext";
import { BookMenu } from "../components/menu/BookMenu";
import { LuxuryBackground } from "../components/3d/LuxuryBackground";
import { ParticleField3D } from "../components/3d/ParticleField3D";
import { FloatingIngredients3D } from "../components/3d/FloatingIngredients3D";
import { LiquidBrandLogo } from "../components/3d/LiquidBrandLogo";
import { useCart } from "../context/CartContext";
import { fetchPlats } from "../utils/api";
import type { MenuItem } from "../utils/constants";

const FALLBACK_ITEMS: MenuItem[] = [
  { id: 1, name: "Burger Classic", description: "Steak hache, salade, tomate, oignons, sauce maison", price: 3500, original_price: null, category: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=60", badge: "Populaire", is_promotion: false, promotion_prix: null, spicy: false, rating: 4.8, time: "15 min", menu_id: null },
  { id: 2, name: "Double Cheese", description: "Double steak, cheddar fondant, bacon croustillant", price: 4500, original_price: 5000, category: "Burgers", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200&q=60", badge: "Promo", is_promotion: true, promotion_prix: 4000, spicy: false, rating: 4.9, time: "18 min", menu_id: null },
  { id: 3, name: "Pizza Margherita", description: "Tomate, mozzarella, basilic frais, huile d'olive", price: 4000, original_price: null, category: "Pizzas", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&q=60", badge: "Classique", is_promotion: false, promotion_prix: null, spicy: false, rating: 4.7, time: "20 min", menu_id: null },
  { id: 4, name: "Pepperoni Pizza", description: "Sauce tomate, mozzarella, pepperoni genereux", price: 5000, original_price: null, category: "Pizzas", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&q=60", badge: undefined, is_promotion: false, promotion_prix: null, spicy: true, rating: 4.6, time: "22 min", menu_id: null },
  { id: 5, name: "Tacos Poulet", description: "Poulet grille, guacamole, fromage, salsa verte", price: 3000, original_price: null, category: "Tacos", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&q=60", badge: "Nouveau", is_promotion: false, promotion_prix: null, spicy: false, rating: 4.5, time: "12 min", menu_id: null },
  { id: 6, name: "Tacos Boeuf", description: "Boeuf epice, oignons, coriandre, sauce piquante", price: 3500, original_price: null, category: "Tacos", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=200&q=60", badge: undefined, is_promotion: false, promotion_prix: null, spicy: true, rating: 4.8, time: "14 min", menu_id: null },
  { id: 7, name: "Tiramisu", description: "Mascarpone, cafe, cacao, biscuits italiens", price: 2500, original_price: null, category: "Desserts", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200&q=60", badge: "Chef", is_promotion: false, promotion_prix: null, spicy: false, rating: 4.9, time: "5 min", menu_id: null },
  { id: 8, name: "Coca-Cola", description: "Coca-Cola glace 33cl", price: 1000, original_price: null, category: "Boissons", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&q=60", badge: undefined, is_promotion: false, promotion_prix: null, spicy: false, rating: 4.0, time: "2 min", menu_id: null },
];

interface Props {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onAddToCart: (item: MenuItem) => void;
}

export function HomePage({ activeCategory, onCategoryChange, onAddToCart }: Props) {
  const { categories } = useCategories();
  const { cartCount, cartTotal } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(FALLBACK_ITEMS);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    fetchPlats(controller.signal)
      .then((plats) => {
        clearTimeout(timer);
        if (plats.length > 0) setMenuItems(plats);
      })
      .catch(() => {
        clearTimeout(timer);
      });
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  const displayCategories = categories.filter((c) => c !== "Tous");

  return (
    <div className="relative min-h-screen overflow-hidden">
      <LuxuryBackground />
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <ParticleField3D particleCount={2500} color="#19B000" accentColor="#FFFFFF" />
      </div>
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <FloatingIngredients3D />
      </div>
      <div className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="cover"
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -30, rotateX: 5 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="relative flex flex-col items-center justify-center text-center select-none"
                style={{
                  width: "clamp(380px, 85vw, 560px)",
                  minHeight: "clamp(540px, 80vh, 740px)",
                  background: "linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 50%, #0D0D0D 100%)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "2px",
                  transformStyle: "preserve-3d",
                  transform: "perspective(1400px) rotateX(2deg)",
                }}
                animate={{
                  rotateY: [0, 1.5, 0, -1.5, 0],
                  y: [0, -2, 0, -2, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.25, 0.5, 0.75, 1],
                }}
                whileHover={{ rotateY: -3, transition: { duration: 0.3 } }}
              >
                {/* Cover 3D shadow */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{
                    boxShadow: "inset 0 0 60px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3), 0 20px 60px rgba(0,0,0,0.4), 0 40px 100px rgba(0,0,0,0.3)",
                    zIndex: 1,
                  }}
                />

                {/* Spine left edge */}
                <div className="absolute left-0 top-0 bottom-0"
                  style={{
                    width: 7,
                    background: "linear-gradient(180deg, #19B000, #0D8A00, #095E00)",
                    boxShadow: "3px 0 10px rgba(0,0,0,0.4)",
                    zIndex: 3,
                  }}
                />

                {/* Book block edges (simulated pages on right side) */}
                <div className="absolute right-0 top-0 bottom-0 pointer-events-none" style={{ zIndex: 0 }}>
                  <div style={{ width: 5, height: "100%", background: "#1A1A1A", position: "absolute", right: -5, border: "1px solid rgba(255,255,255,0.03)" }} />
                  <div style={{ width: 4, height: "100%", background: "#222", position: "absolute", right: -9, border: "1px solid rgba(255,255,255,0.02)" }} />
                  <div style={{ width: 3, height: "100%", background: "#2A2A2A", position: "absolute", right: -12, border: "1px solid rgba(255,255,255,0.02)" }} />
                </div>

                {/* Top accent line (green only) */}
                <div className="absolute top-0 left-0 right-0"
                  style={{
                    height: 2,
                    background: "linear-gradient(90deg, transparent, rgba(25,176,0,0.2) 50%, transparent)",
                    zIndex: 2,
                  }}
                />

                <div className="mb-6" style={{ width: 110, height: 110 }}>
                  <LiquidBrandLogo />
                </div>

                <motion.div className="flex items-center justify-center gap-2 mb-5"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span style={{ width: 40, height: 1.5, background: "linear-gradient(90deg, rgba(25,176,0,0.35), rgba(25,176,0,0.08))", display: "block" }} />
                  <span style={{ width: 6, height: 6, background: "#19B000", display: "block", borderRadius: "50%", opacity: 0.5 }} />
                  <span style={{ width: 40, height: 1.5, background: "linear-gradient(90deg, rgba(25,176,0,0.08), rgba(25,176,0,0.35))", display: "block" }} />
                </motion.div>

                <motion.span className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-5"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000", opacity: 0.6 }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Menu Gastronomique
                </motion.span>

                <motion.h1 className="leading-none mb-3"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(3rem, 8vw, 5rem)", color: "#FFFFFF", letterSpacing: "-0.03em" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <span style={{ color: "#19B000" }}>BETHEL</span>
                  <br />
                  <span style={{ color: "#FFFFFF", fontSize: "clamp(1.8rem, 5vw, 3rem)", opacity: 0.9 }}>GRILL</span>
                </motion.h1>

                <motion.p className="text-sm max-w-xs mx-auto mb-8 leading-relaxed"
                  style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.4)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  L'excellence du detail, la passion du gout.
                </motion.p>

                <motion.button onClick={() => setIsOpen(true)}
                  className="flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #19B000, #0D8A00)",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Montserrat, sans-serif",
                    boxShadow: "6px 6px 0 rgba(0,0,0,0.25), 0 8px 24px rgba(25,176,0,0.15)",
                  }}
                  whileHover={{ scale: 1.03, y: -3, boxShadow: "8px 8px 0 rgba(0,0,0,0.25), 0 12px 32px rgba(25,176,0,0.2)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Sparkles size={16} /> Ouvrir le menu <ArrowRight size={16} />
                </motion.button>

                <motion.div className="flex items-center justify-center gap-3 mt-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                >
                  <span style={{ width: 24, height: 1, background: "rgba(255,255,255,0.06)", display: "block" }} />
                  <span style={{ width: 6, height: 6, background: "#19B000", display: "block", borderRadius: "50%", opacity: 0.25 }} />
                  <span style={{ width: 24, height: 1, background: "rgba(255,255,255,0.06)", display: "block" }} />
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="opened"
              className="w-full py-6 sm:py-10"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <BookMenu
                categories={displayCategories}
                menuItems={menuItems}
                activeCategory={activeCategory}
                onCategoryChange={onCategoryChange}
                onAddToCart={onAddToCart}
                onClose={() => setIsOpen(false)}
                cartItemCount={cartCount}
                cartTotal={cartTotal}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
