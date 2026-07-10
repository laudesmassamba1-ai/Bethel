import { useState, useEffect } from "react";
import { Hero } from "../components/layout/Hero";
import { MenuGrid } from "../components/menu/MenuGrid";
import { ContactBanner } from "../components/layout/ContactBanner";
import { fetchPlats } from "../utils/api";
import type { MenuItem } from "../utils/constants";

interface Props {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onAddToCart: (item: MenuItem) => void;
}

export function HomePage({ activeCategory, onCategoryChange, onAddToCart }: Props) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchPlats()
      .then((plats) => {
        setMenuItems(plats);
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Erreur de chargement:", err);
        setError("Impossible de charger le menu. Rafraîchissez ou réessayez plus tard.");
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <>
      <Hero />
      {loading ? (
        <div className="flex items-center justify-center py-32" style={{ background: "#F5F1EA" }}>
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: "#19B000", borderTopColor: "transparent" }}
            />
            <p
              className="font-semibold text-sm"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}
            >
              Chargement du menu…
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-32 px-4" style={{ background: "#F5F1EA" }}>
          <div className="text-center max-w-md">
            <p
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
            >
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 font-semibold text-sm text-white"
              style={{
                background: "#19B000",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                boxShadow: "0 4px 16px rgba(25,176,0,0.3)",
              }}
            >
              Rafraîchir
            </button>
          </div>
        </div>
      ) : (
        <MenuGrid
          menuItems={menuItems}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
          onAddToCart={onAddToCart}
        />
      )}
      <ContactBanner />
    </>
  );
}
