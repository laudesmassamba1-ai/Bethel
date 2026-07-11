import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { CartDrawer } from "../components/cart/CartDrawer";
import { FloatingCart } from "../components/cart/FloatingCart";
import { FloatingWhatsApp } from "../components/cart/FloatingWhatsApp";
import { ToasterProvider } from "../components/shared/ToasterProvider";
import { useScrollPosition } from "../hooks/useScrollPosition";
import { useCart } from "../context/CartContext";

interface Props {
  children: ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
}

export function RootLayout({ children, hideNav, hideFooter }: Props) {
  const [cartOpen, setCartOpen] = useState(false);
  const scrolled = useScrollPosition(40);
  const { cart, cartCount, cartTotal, addById, removeById, clearCart } = useCart();

  useEffect(() => {
    const handler = () => setCartOpen((o) => !o);
    window.addEventListener("open-cart", handler);
    return () => window.removeEventListener("open-cart", handler);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "Montserrat, sans-serif", background: "#FAFAF8" }}>
      <ToasterProvider />

      {!hideNav && (
        <Navbar
          scrolled={scrolled}
          cartCount={cartCount}
          onCartOpen={() => setCartOpen(true)}
        />
      )}

      {children}

      {!hideFooter && <Footer onCategoryClick={() => {}} />}

      <CartDrawer
        open={cartOpen}
        cart={cart}
        cartTotal={cartTotal}
        onClose={() => setCartOpen(false)}
        onAdd={addById}
        onRemove={removeById}
        onClear={clearCart}
      />

      <FloatingWhatsApp />
      <FloatingCart
        visible={cartCount > 0}
        cartOpen={cartOpen}
        itemCount={cartCount}
        total={cartTotal}
        onOpen={() => setCartOpen(true)}
      />

      <ScrollToTop />

      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F0F0EE; }
        ::-webkit-scrollbar-thumb { background: #19B000; border-radius: 3px; }
        * { scrollbar-width: thin; scrollbar-color: #19B000 #F0F0EE; }
        *:focus-visible { outline: 2px solid #19B000; outline-offset: 2px; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(25,176,0,0.2); color: #000000; }

        body {
          background: #FAFAF8;
        }
      `}</style>
    </div>
  );
}

function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center w-10 h-10"
          style={{
            background: "#000000",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          }}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Retour en haut"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
