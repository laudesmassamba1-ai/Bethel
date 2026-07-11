import { useState, useEffect, type ReactNode } from "react";
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
    <div className="min-h-screen" style={{ fontFamily: "Montserrat, sans-serif", background: "#000000" }}>
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

      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #19B000; border-radius: 3px; }
        * { scrollbar-width: thin; scrollbar-color: #19B000 #0a0a0a; }
        *:focus-visible { outline: 2px solid #19B000; outline-offset: 2px; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(25,176,0,0.3); color: #FFFFFF; }

        body {
          background: #000000;
        }
      `}</style>
    </div>
  );
}
