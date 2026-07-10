import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, UtensilsCrossed } from "lucide-react";
import { MenuItemCard } from "./MenuItemCard";
import { CategoryFilter } from "./CategoryFilter";
import { PlatDetailModal } from "./PlatDetailModal";
import { useCategories } from "../../context/CategoriesContext";
import type { MenuItem } from "../../utils/constants";

interface Props {
  menuItems: MenuItem[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onAddToCart: (item: MenuItem) => void;
}

export function MenuGrid({ menuItems, activeCategory, onCategoryChange, onAddToCart }: Props) {
  const [search, setSearch] = useState("");
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);
  const { categories } = useCategories();

  const filteredMenu = useMemo(() => {
    let items = activeCategory === "Tous" ? menuItems : menuItems.filter((i) => i.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }
    return items;
  }, [menuItems, activeCategory, search]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    menuItems.forEach((item) => {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    });
    return counts;
  }, [menuItems]);

  return (
    <section id="menu" className="max-w-7xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4 }}
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2
              className="leading-none"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                color: "#000000",
                letterSpacing: "-0.02em",
              }}
            >
              Notre{" "}
              <span style={{ color: "#19B000" }}>Menu</span>
            </h2>
            <p
              className="text-sm mt-1.5"
              style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}
            >
              {filteredMenu.length} plat{filteredMenu.length > 1 ? "s" : ""} disponible{filteredMenu.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div
              className="flex items-center px-3"
              style={{
                background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "0.5rem",
                backdropFilter: "blur(8px)",
              }}
            >
              <Search size={14} color="#6B6357" strokeWidth={2} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none px-2 py-2 text-sm outline-none w-28 sm:w-36"
                style={{ fontFamily: "Open Sans, sans-serif", color: "#000000" }}
              />
            </div>

            <CategoryFilter
              categories={categories}
              active={activeCategory}
              onChange={onCategoryChange}
              counts={categoryCounts}
            />
          </div>
        </div>
      </motion.div>

      {/* Bento Grid */}
      {filteredMenu.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center py-20 gap-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <UtensilsCrossed size={56} strokeWidth={1.2} color="#19B000" opacity={0.4} />
          <p
            className="text-lg font-semibold"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#6B6357" }}
          >
            Aucun plat trouvé
          </p>
          <p
            className="text-sm"
            style={{ fontFamily: "Open Sans, sans-serif", color: "#9B9385" }}
          >
            Essayez de modifier votre recherche ou votre filtre
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="grid gap-5"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((item, i) => (
              <MenuItemCard key={item.id} item={item} onAdd={onAddToCart} onDetail={() => setDetailItem(item)} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <PlatDetailModal item={detailItem} onClose={() => setDetailItem(null)} onAdd={onAddToCart} />
    </section>
  );
}
