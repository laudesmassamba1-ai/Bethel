import { useState, type ReactNode } from "react";
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
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export function RootLayout({ children, activeCategory, onCategoryChange }: Props) {
  const [cartOpen, setCartOpen] = useState(false);
  const scrolled = useScrollPosition(40);
  const { cart, cartCount, cartTotal, addById, removeById, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "Nunito, sans-serif" }}>
      <ToasterProvider />

      <Navbar
        scrolled={scrolled}
        cartCount={cartCount}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
        onCartOpen={() => setCartOpen(true)}
      />

      {children}

      <Footer onCategoryClick={onCategoryChange} />

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
        ::-webkit-scrollbar-track { background: #F4F1EA; }
        ::-webkit-scrollbar-thumb { background: #9B1B30; border: 1px solid #1D1D1D; }
        * { scrollbar-width: thin; scrollbar-color: #9B1B30 #F4F1EA; }
        *:focus-visible { outline: 3px solid #D4AF37; outline-offset: 2px; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
