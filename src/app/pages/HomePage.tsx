import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  ArrowRight, Sparkles, Star, Clock, Flame,
  ChefHat, MapPin, Phone, MessageCircle, X, ChevronDown,
} from "lucide-react";
import { useCategories } from "../context/CategoriesContext";
import { BookMenu } from "../components/menu/BookMenu";
import { useCart } from "../context/CartContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import { fetchPlats } from "../utils/api";
import { formatPrice, getDisplayPrice, buildWhatsAppUrl } from "../utils/constants";
import type { MenuItem } from "../utils/constants";

const FALLBACK_ITEMS: MenuItem[] = [
  { id: 1, name: "Burger Classic", description: "Steak hache, salade, tomate, oignons, sauce maison", price: 3500, original_price: null, category: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=75", badge: "Populaire", is_promotion: false, promotion_prix: null, spicy: false, rating: 4.8, time: "15 min", menu_id: null },
  { id: 2, name: "Double Cheese", description: "Double steak, cheddar fondant, bacon croustillant", price: 4500, original_price: 5000, category: "Burgers", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=75", badge: "Promo", is_promotion: true, promotion_prix: 4000, spicy: false, rating: 4.9, time: "18 min", menu_id: null },
  { id: 3, name: "Pizza Margherita", description: "Tomate, mozzarella, basilic frais, huile d'olive", price: 4000, original_price: null, category: "Pizzas", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=75", badge: "Classique", is_promotion: false, promotion_prix: null, spicy: false, rating: 4.7, time: "20 min", menu_id: null },
  { id: 4, name: "Tacos Poulet", description: "Poulet grille, guacamole, fromage, salsa verte", price: 3000, original_price: null, category: "Tacos", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=75", badge: "Nouveau", is_promotion: false, promotion_prix: null, spicy: false, rating: 4.5, time: "12 min", menu_id: null },
  { id: 5, name: "Tiramisu", description: "Mascarpone, cafe, cacao, biscuits italiens", price: 2500, original_price: null, category: "Desserts", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=75", badge: "Chef", is_promotion: false, promotion_prix: null, spicy: false, rating: 4.9, time: "5 min", menu_id: null },
  { id: 6, name: "Pepperoni Pizza", description: "Sauce tomate, mozzarella, pepperoni genereux", price: 5000, original_price: null, category: "Pizzas", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=75", badge: undefined, is_promotion: false, promotion_prix: null, spicy: true, rating: 4.6, time: "22 min", menu_id: null },
  { id: 7, name: "Tacos Boeuf", description: "Boeuf epice, oignons, coriandre, sauce piquante", price: 3500, original_price: null, category: "Tacos", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=75", badge: undefined, is_promotion: false, promotion_prix: null, spicy: true, rating: 4.8, time: "14 min", menu_id: null },
  { id: 8, name: "Coca-Cola", description: "Coca-Cola glace 33cl", price: 1000, original_price: null, category: "Boissons", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=75", badge: undefined, is_promotion: false, promotion_prix: null, spicy: false, rating: 4.0, time: "2 min", menu_id: null },
];

/* ─── Video URLs (free stock cooking/grill videos) ─── */
const HERO_VIDEO = "https://videos.pexels.com/video-files/3296396/3296396-uhd_2560_1440_25fps.mp4";
const CTA_VIDEO = "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4";

/* ─── Section Reveal wrapper ─── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Featured Dish Card ─── */
function DishCard({ item, index, onAdd }: { item: MenuItem; index: number; onAdd: () => void }) {
  return (
    <Reveal delay={index * 0.1}>
      <motion.div
        className="group relative overflow-hidden cursor-pointer"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 8,
        }}
        whileHover={{ y: -6, borderColor: "rgba(25,176,0,0.3)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          {item.badge && (
            <span
              className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase"
              style={{
                background: item.is_promotion ? "#E53E30" : "#19B000",
                color: "#fff",
                borderRadius: 4,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {item.badge}
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className="text-sm font-bold leading-tight"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#fff" }}
            >
              {item.name}
            </h3>
            <span
              className="text-sm font-bold whitespace-nowrap"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}
            >
              {formatPrice(getDisplayPrice(item))}
            </span>
          </div>
          <p
            className="text-xs leading-relaxed mb-3 line-clamp-2"
            style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.5)" }}
          >
            {item.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {item.rating && (
                <span className="flex items-center gap-1 text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <Star size={11} fill="#FFD700" stroke="none" /> {item.rating}
                </span>
              )}
              {item.time && (
                <span className="flex items-center gap-1 text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <Clock size={11} /> {item.time}
                </span>
              )}
            </div>
            <motion.button
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className="px-3 py-1.5 text-[11px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #19B000, #0D8A00)",
                border: "none",
                borderRadius: 999,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              Ajouter
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
}

/* ─── Stats counter ─── */
function StatItem({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-2">
        <Icon size={20} style={{ color: "#19B000" }} />
      </div>
      <div
        className="text-2xl sm:text-3xl font-black mb-1"
        style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}
      >
        {value}
      </div>
      <div
        className="text-xs"
        style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.4)" }}
      >
        {label}
      </div>
    </div>
  );
}

/* ─── Main HomePage ─── */
interface Props {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onAddToCart: (item: MenuItem) => void;
}

export function HomePage({ activeCategory, onCategoryChange, onAddToCart }: Props) {
  const { categories } = useCategories();
  const { cartCount, cartTotal } = useCart();
  const { config } = useSiteConfig();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(FALLBACK_ITEMS);
  const [bookOpen, setBookOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const displayCategories = categories.filter((c) => c !== "Tous");

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    fetchPlats(controller.signal)
      .then((plats) => {
        clearTimeout(timer);
        if (plats.length > 0) setMenuItems(plats);
      })
      .catch(() => clearTimeout(timer));
    return () => { clearTimeout(timer); controller.abort(); };
  }, []);

  const featuredItems = menuItems.slice(0, 6);

  return (
    <div className="relative" style={{ background: "#0A0A0A" }}>

      {/* ═══════════════════════════════════════════════
          SECTION 1: FULL-SCREEN VIDEO HERO
         ═══════════════════════════════════════════════ */}
      <section className="relative w-full" style={{ height: "100vh", minHeight: 600 }}>
        {/* Video background */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className="w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: videoLoaded ? 1 : 0 }}
            poster="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80"
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
          {/* Fallback gradient if video doesn't load */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #0A0A0A 0%, #1A0F0A 30%, #2C1810 60%, #0A0A0A 100%)",
              opacity: videoLoaded ? 0 : 1,
              transition: "opacity 1s ease",
            }}
          />
        </div>

        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        {/* Green accent glow at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: 200,
            background: "radial-gradient(ellipse at 50% 100%, rgba(25,176,0,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6"
              style={{
                background: "rgba(25,176,0,0.12)",
                border: "1px solid rgba(25,176,0,0.25)",
                borderRadius: 999,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Flame size={13} style={{ color: "#19B000" }} />
              <span
                className="text-[11px] font-semibold tracking-wider uppercase"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}
              >
                Grillades Premium
              </span>
            </motion.div>

            {/* Main title */}
            <motion.h1
              className="leading-[0.9] mb-4"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(3rem, 10vw, 7rem)",
                letterSpacing: "-0.03em",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span style={{ color: "#19B000" }}>BETHEL</span>
              <br />
              <span style={{ color: "#FFFFFF" }}>GRILL</span>
            </motion.h1>

            {/* Ornamental line */}
            <motion.div
              className="flex items-center justify-center gap-3 mb-5"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <span style={{ width: 50, height: 1, background: "linear-gradient(90deg, transparent, rgba(25,176,0,0.5))", display: "block" }} />
              <span style={{ width: 6, height: 6, background: "#19B000", display: "block", borderRadius: "50%", opacity: 0.6 }} />
              <span style={{ width: 50, height: 1, background: "linear-gradient(90deg, rgba(25,176,0,0.5), transparent)", display: "block" }} />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-base sm:text-lg max-w-md mx-auto mb-8 leading-relaxed"
              style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.6)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              L'excellence du detail, la passion du gout. Des grillades premium qui eveillent vos sens.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <motion.button
                onClick={() => setBookOpen(true)}
                className="flex items-center gap-2 px-8 py-4 text-sm font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #19B000, #0D8A00)",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  boxShadow: "0 4px 20px rgba(25,176,0,0.3), 6px 6px 0 rgba(0,0,0,0.3)",
                }}
                whileHover={{ scale: 1.04, y: -3, boxShadow: "0 8px 30px rgba(25,176,0,0.4), 8px 8px 0 rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.97 }}
              >
                <Sparkles size={16} /> Voir le menu <ArrowRight size={16} />
              </motion.button>

              <motion.a
                href={buildWhatsAppUrl("Bonjour ! Je souhaite commander.", config.whatsapp_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 text-sm font-bold"
                style={{
                  background: "transparent",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 6,
                  fontFamily: "Montserrat, sans-serif",
                  textDecoration: "none",
                  backdropFilter: "blur(4px)",
                }}
                whileHover={{ borderColor: "rgba(25,176,0,0.5)", color: "#19B000", scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <MessageCircle size={16} /> Commander
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <span
                className="text-[10px] tracking-[0.3em] uppercase"
                style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.3)" }}
              >
                Decouvrir
              </span>
              <ChevronDown size={18} style={{ color: "rgba(255,255,255,0.3)" }} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2: ABOUT (overlaps hero with negative margin)
         ═══════════════════════════════════════════════ */}
      <section
        className="relative px-4"
        style={{
          marginTop: -100,
          zIndex: 20,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 sm:p-12"
              style={{
                background: "rgba(20,20,20,0.95)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(25,176,0,0.05)",
              }}
            >
              {/* Image side */}
              <div className="relative overflow-hidden rounded-lg" style={{ minHeight: 280 }}>
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
                  alt="Bethel Grill restaurant"
                  className="w-full h-full object-cover"
                  style={{ minHeight: 280 }}
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(25,176,0,0.15) 0%, transparent 60%)",
                  }}
                />
                {/* Floating stat badge */}
                <div
                  className="absolute bottom-4 left-4 px-4 py-3"
                  style={{
                    background: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(25,176,0,0.3)",
                    borderRadius: 8,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Star size={16} fill="#FFD700" stroke="none" />
                    <span
                      className="text-lg font-black"
                      style={{ fontFamily: "Montserrat, sans-serif", color: "#fff" }}
                    >
                      4.9
                    </span>
                    <span
                      className="text-[11px]"
                      style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.5)" }}
                    >
                      / 5.0
                    </span>
                  </div>
                </div>
              </div>

              {/* Text side */}
              <div className="flex flex-col justify-center">
                <span
                  className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-3"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000", opacity: 0.7 }}
                >
                  Notre Histoire
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-black leading-tight mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#FFFFFF" }}
                >
                  La passion des{" "}
                  <span style={{ color: "#19B000" }}>grillades</span>{" "}
                  depuis toujours
                </h2>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.5)" }}
                >
                  Chez Bethel Grill, chaque plat est une invitation au voyage. Nos grillades sont preparees avec des ingredients frais et des recettes transmises de generation en generation.
                </p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <StatItem value="2K+" label="Clients" icon={ChefHat} />
                  <StatItem value="15+" label="Plats" icon={Flame} />
                  <StatItem value="4.9" label="Note" icon={Star} />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <MapPin size={13} style={{ color: "#19B000" }} /> Cotonou, Benin
                  </div>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <Clock size={13} style={{ color: "#19B000" }} /> 11h - 22h
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3: FEATURED MENU
         ═══════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-28 px-4">
        {/* Background texture */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #0A0A0A 0%, #111 50%, #0A0A0A 100%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          <Reveal className="text-center mb-14">
            <span
              className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-3 block"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000", opacity: 0.7 }}
            >
              Nos Specialites
            </span>
            <h2
              className="text-3xl sm:text-4xl font-black leading-tight mb-4"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#FFFFFF" }}
            >
              Des plats qui font{" "}
              <span style={{ color: "#19B000" }}>rever</span>
            </h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(25,176,0,0.4))", display: "block" }} />
              <span style={{ width: 6, height: 6, background: "#19B000", display: "block", borderRadius: "50%", opacity: 0.5 }} />
              <span style={{ width: 40, height: 1, background: "linear-gradient(90deg, rgba(25,176,0,0.4), transparent)", display: "block" }} />
            </div>
            <p
              className="text-sm max-w-md mx-auto"
              style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.4)" }}
            >
              Decouvrez notre selection de plats prepares avec passion et savoir-faire.
            </p>
          </Reveal>

          {/* Dish grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {featuredItems.map((item, i) => (
              <DishCard
                key={item.id}
                item={item}
                index={i}
                onAdd={() => onAddToCart(item)}
              />
            ))}
          </div>

          {/* Full menu CTA */}
          <Reveal className="text-center">
            <motion.button
              onClick={() => setBookOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #19B000, #0D8A00)",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                boxShadow: "0 4px 20px rgba(25,176,0,0.25), 6px 6px 0 rgba(0,0,0,0.3)",
              }}
              whileHover={{ scale: 1.04, y: -3, boxShadow: "0 8px 30px rgba(25,176,0,0.35), 8px 8px 0 rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.97 }}
            >
              <ChefHat size={16} /> Voir tout le menu <ArrowRight size={16} />
            </motion.button>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4: VIDEO CTA BANNER
         ═══════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden" style={{ height: "60vh", minHeight: 400 }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"
        >
          <source src={CTA_VIDEO} type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(25,176,0,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <Reveal>
            <span
              className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-4 block"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}
            >
              Pret a savourer ?
            </span>
            <h2
              className="text-3xl sm:text-5xl font-black leading-tight mb-6"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#FFFFFF" }}
            >
              Commandez en{" "}
              <span style={{ color: "#19B000" }}>quelques clics</span>
            </h2>
            <p
              className="text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed"
              style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.5)" }}
            >
              Discutez directement avec notre equipe via WhatsApp. Votre commande arrive chaude et fraiche chez vous.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.a
                href={buildWhatsAppUrl("Bonjour ! Je souhaite commander.", config.whatsapp_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 text-sm font-bold text-white"
                style={{
                  background: "#25D366",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(37,211,102,0.3), 6px 6px 0 rgba(0,0,0,0.3)",
                }}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <MessageCircle size={16} /> WhatsApp
              </motion.a>
              <motion.a
                href="tel:+229000000000"
                className="flex items-center gap-2 px-8 py-4 text-sm font-bold"
                style={{
                  background: "transparent",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 6,
                  fontFamily: "Montserrat, sans-serif",
                  textDecoration: "none",
                  backdropFilter: "blur(4px)",
                }}
                whileHover={{ borderColor: "rgba(25,176,0,0.5)", color: "#19B000" }}
              >
                <Phone size={16} /> Appeler
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5: MAP / LOCATION
         ═══════════════════════════════════════════════ */}
      <section className="relative py-20 px-4" style={{ background: "#0A0A0A" }}>
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <span
              className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-3 block"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000", opacity: 0.7 }}
            >
              Nous Trouver
            </span>
            <h2
              className="text-2xl sm:text-3xl font-black leading-tight mb-8"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#FFFFFF" }}
            >
              A <span style={{ color: "#19B000" }}>votre service</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-8"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
              }}
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-full"
                  style={{ background: "rgba(25,176,0,0.12)", border: "1px solid rgba(25,176,0,0.2)" }}
                >
                  <MapPin size={20} style={{ color: "#19B000" }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ fontFamily: "Montserrat, sans-serif", color: "#fff" }}>
                    Adresse
                  </p>
                  <p className="text-xs mt-1" style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.4)" }}>
                    Cotonou, Benin
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-full"
                  style={{ background: "rgba(25,176,0,0.12)", border: "1px solid rgba(25,176,0,0.2)" }}
                >
                  <Clock size={20} style={{ color: "#19B000" }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ fontFamily: "Montserrat, sans-serif", color: "#fff" }}>
                    Horaires
                  </p>
                  <p className="text-xs mt-1" style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.4)" }}>
                    Lun-Sam: 11h - 22h
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-full"
                  style={{ background: "rgba(25,176,0,0.12)", border: "1px solid rgba(25,176,0,0.2)" }}
                >
                  <Phone size={20} style={{ color: "#19B000" }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ fontFamily: "Montserrat, sans-serif", color: "#fff" }}>
                    Telephone
                  </p>
                  <p className="text-xs mt-1" style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.4)" }}>
                    +229 00 00 00 00
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BOOK MENU MODAL
         ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {bookOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
              onClick={() => setBookOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Close button */}
            <motion.button
              onClick={() => setBookOpen(false)}
              className="absolute top-4 right-4 z-[110] flex items-center justify-center w-10 h-10"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "50%",
                cursor: "pointer",
                color: "#fff",
              }}
              whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.2 }}
            >
              <X size={18} />
            </motion.button>

            {/* Book content */}
            <motion.div
              className="relative z-[105] w-full max-w-5xl mx-4"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <BookMenu
                categories={displayCategories}
                menuItems={menuItems}
                activeCategory={activeCategory}
                onCategoryChange={onCategoryChange}
                onAddToCart={onAddToCart}
                onClose={() => setBookOpen(false)}
                cartItemCount={cartCount}
                cartTotal={cartTotal}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
