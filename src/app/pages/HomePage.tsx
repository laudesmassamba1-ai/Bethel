import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  ArrowRight, Sparkles, Star, Clock, Flame,
  ChefHat, MapPin, Phone, MessageCircle, ChevronDown,
} from "lucide-react";
import { useSiteConfig } from "../context/SiteConfigContext";
import { fetchPlats } from "../utils/api";
import { formatPrice, getDisplayPrice, buildWhatsAppUrl } from "../utils/constants";
import { LuxuryBackground } from "../components/3d/LuxuryBackground";
import { ParticleField3D } from "../components/3d/ParticleField3D";
import { FloatingIngredients3D } from "../components/3d/FloatingIngredients3D";
import { PlatDetailModal } from "../components/menu/PlatDetailModal";
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

const SCATTER = [
  { r: -8, tx: 0, ty: 0 },
  { r: 5, tx: 10, ty: -20 },
  { r: -3, tx: -15, ty: 10 },
  { r: 9, tx: 5, ty: -5 },
  { r: -6, tx: -8, ty: 15 },
  { r: 4, tx: 12, ty: -10 },
  { r: -10, tx: -5, ty: 5 },
  { r: 7, tx: 8, ty: -15 },
];

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
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

function ScatteredPhoto({ item, index, onClick }: { item: MenuItem; index: number; onClick: () => void }) {
  const s = SCATTER[index % SCATTER.length];
  const col = index % 4;
  const row = Math.floor(index / 4);
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        width: "clamp(130px, 20vw, 190px)",
        zIndex: index + 1,
        left: `calc(${8 + col * 23}% + ${s.tx}px)`,
        top: `calc(${row * 55 + 8}% + ${s.ty}px)`,
      }}
      initial={{ opacity: 0, scale: 0.6, rotate: s.r * 2 }}
      whileInView={{ opacity: 1, scale: 1, rotate: s.r }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        scale: 1.15,
        rotate: 0,
        zIndex: 50,
        y: -20,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 1.05 }}
      onClick={onClick}
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-auto block"
        style={{
          aspectRatio: "1",
          objectFit: "cover",
          borderRadius: 4,
          boxShadow: "0 6px 20px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)",
          filter: "saturate(0.85) contrast(1.05) brightness(0.95)",
        }}
        loading="lazy"
      />
      <div
        className="absolute bottom-0 left-0 right-0 px-2 py-1.5 opacity-0 transition-opacity duration-300"
        style={{
          background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
          borderRadius: "0 0 4px 4px",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <p className="text-[10px] font-bold truncate m-0" style={{ fontFamily: "Montserrat, sans-serif", color: "#fff" }}>
          {item.name}
        </p>
        <p className="text-[9px] m-0" style={{ fontFamily: "Open Sans, sans-serif", color: "#19B000" }}>
          {formatPrice(getDisplayPrice(item))}
        </p>
      </div>
    </motion.div>
  );
}

function StatItem({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-2">
        <Icon size={20} style={{ color: "#19B000" }} />
      </div>
      <div className="text-2xl sm:text-3xl font-black mb-1" style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}>
        {value}
      </div>
      <div className="text-xs" style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.4)" }}>
        {label}
      </div>
    </div>
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
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);

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

  const photos = menuItems.slice(0, 8);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ═══ GRADIENT BACKGROUND + 3D LAYERS ═══ */}
      <LuxuryBackground />
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <ParticleField3D particleCount={2500} color="#19B000" accentColor="#FFFFFF" />
      </div>
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <FloatingIngredients3D />
      </div>
      <div className="absolute inset-0 z-[3] pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)" }}
      />

      {/* ═══ HERO ═══ */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4" style={{ minHeight: "100vh" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6"
            style={{ background: "rgba(25,176,0,0.12)", border: "1px solid rgba(25,176,0,0.25)", borderRadius: 999 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Flame size={13} style={{ color: "#19B000" }} />
            <span className="text-[11px] font-semibold tracking-wider uppercase" style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}>
              Grillades Premium
            </span>
          </motion.div>

          <motion.h1
            className="leading-[0.9] mb-4"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(3rem, 10vw, 7rem)", letterSpacing: "-0.03em" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{ color: "#19B000" }}>BETHEL</span>
            <br />
            <span style={{ color: "#FFFFFF" }}>GRILL</span>
          </motion.h1>

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

          <motion.p
            className="text-base sm:text-lg max-w-md mx-auto mb-8 leading-relaxed"
            style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            L'excellence du detail, la passion du gout.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <motion.a
              href="#plats"
              className="flex items-center gap-2 px-8 py-4 text-sm font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #19B000, #0D8A00)",
                border: "none", borderRadius: 6, cursor: "pointer",
                fontFamily: "Montserrat, sans-serif", textDecoration: "none",
                boxShadow: "0 4px 20px rgba(25,176,0,0.3), 6px 6px 0 rgba(0,0,0,0.3)",
              }}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              <Sparkles size={16} /> Decouvrir nos plats <ArrowRight size={16} />
            </motion.a>
            <motion.a
              href={buildWhatsAppUrl("Bonjour ! Je souhaite commander.", config.whatsapp_number)}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 text-sm font-bold"
              style={{
                background: "transparent", color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6,
                fontFamily: "Montserrat, sans-serif", textDecoration: "none",
              }}
              whileHover={{ borderColor: "rgba(25,176,0,0.5)", color: "#19B000" }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle size={16} /> Commander
            </motion.a>
          </motion.div>
        </motion.div>

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
            <span className="text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.3)" }}>
              Decouvrir
            </span>
            <ChevronDown size={18} style={{ color: "rgba(255,255,255,0.3)" }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ SCATTERED PHOTOS ON TABLE ═══ */}
      <section id="plats" className="relative z-10 py-16 sm:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-3 block"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000", opacity: 0.7 }}>
              Nos Plats
            </span>
            <h2 className="text-3xl sm:text-5xl font-black leading-tight mb-4"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#FFFFFF" }}>
              Des saveurs qui <span style={{ color: "#19B000" }}>font rever</span>
            </h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(25,176,0,0.4))", display: "block" }} />
              <span style={{ width: 6, height: 6, background: "#19B000", display: "block", borderRadius: "50%", opacity: 0.5 }} />
              <span style={{ width: 40, height: 1, background: "linear-gradient(90deg, rgba(25,176,0,0.4), transparent)", display: "block" }} />
            </div>
            <p className="text-sm max-w-md mx-auto" style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.4)" }}>
              Cliquez sur une photo pour decouvrir le plat.
            </p>
          </Reveal>

          {/* Table surface */}
          <div
            className="relative mx-auto"
            style={{
              width: "100%",
              maxWidth: 900,
              minHeight: 500,
              padding: "40px 20px",
            }}
          >
            {/* Wood table texture */}
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #1A0F0A 0%, #2C1810 30%, #1A0F0A 60%, #2C1810 100%)",
                border: "1px solid rgba(200,164,92,0.1)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 0 80px rgba(0,0,0,0.3)",
              }}
            />
            {/* Wood grain lines */}
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(200,164,92,0.03) 40px, rgba(200,164,92,0.03) 41px)",
                opacity: 0.6,
              }}
            />

            {/* Scattered photos */}
            <div className="relative" style={{ height: 460 }}>
              {photos.map((item, i) => (
                <ScatteredPhoto key={item.id} item={item} index={i} onClick={() => setDetailItem(item)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="relative z-10 py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 sm:p-12"
              style={{
                background: "rgba(20,20,20,0.8)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              <div className="relative overflow-hidden rounded-lg" style={{ minHeight: 280 }}>
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
                  alt="Bethel Grill" className="w-full h-full object-cover" style={{ minHeight: 280 }} loading="lazy"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(25,176,0,0.15) 0%, transparent 60%)" }} />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-3"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000", opacity: 0.7 }}>
                  Notre Histoire
                </span>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-4"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#FFFFFF" }}>
                  La passion des <span style={{ color: "#19B000" }}>grillades</span> depuis toujours
                </h2>
                <p className="text-sm leading-relaxed mb-6"
                  style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.5)" }}>
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

      {/* ═══ CTA ═══ */}
      <section className="relative z-10 py-20 sm:py-28 px-4 text-center">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(25,176,0,0.08) 0%, transparent 70%)" }} />
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
            style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.5)" }}>
            Discutez directement avec notre equipe via WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.a
              href={buildWhatsAppUrl("Bonjour ! Je souhaite commander.", config.whatsapp_number)}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 text-sm font-bold text-white"
              style={{
                background: "#25D366", border: "none", borderRadius: 6, cursor: "pointer",
                fontFamily: "Montserrat, sans-serif", textDecoration: "none",
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
                background: "transparent", color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6,
                fontFamily: "Montserrat, sans-serif", textDecoration: "none",
              }}
              whileHover={{ borderColor: "rgba(25,176,0,0.5)", color: "#19B000" }}
            >
              <Phone size={16} /> Appeler
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* ═══ DETAIL MODAL ═══ */}
      <PlatDetailModal item={detailItem} onClose={() => setDetailItem(null)} onAdd={onAddToCart} />
    </div>
  );
}
