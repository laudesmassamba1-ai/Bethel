import { motion } from "motion/react";
import { Camera, Share2 } from "lucide-react";
import { CategoryIcon } from "../menu/CategoryIcon";
import { useSiteConfig } from "../../context/SiteConfigContext";
import { useCategories } from "../../context/CategoriesContext";

interface Props {
  onCategoryClick: (cat: string) => void;
}

export function Footer({ onCategoryClick }: Props) {
  const { config } = useSiteConfig();
  const { categories } = useCategories();

  return (
    <footer style={{ background: "#19B000", color: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          <div className="md:col-span-1">
            <div className="mb-4">
              <span
                className="block"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                  color: "#FFFFFF",
                  letterSpacing: "0.06em",
                }}
              >
                BETHEL
              </span>
              <span
                className="block"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                  color: "#FFFFFF",
                  letterSpacing: "0.06em",
                  opacity: 0.7,
                  marginTop: "-4px",
                }}
              >
                GRILL
              </span>
            </div>

            <div className="flex gap-3">
              <motion.a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full"
                style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
                whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.3)" }}
                aria-label="Instagram"
              >
                <Camera size={16} />
              </motion.a>
              <motion.a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full"
                style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
                whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.3)" }}
                aria-label="Facebook"
              >
                <Share2 size={16} />
              </motion.a>
            </div>
          </div>

          <div>
            <h4
              className="mb-4 text-sm font-bold tracking-widest uppercase"
              style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.5)" }}
            >
              Navigation
            </h4>
            <ul className="space-y-2" style={{ fontFamily: "Open Sans, sans-serif" }}>
              {categories.filter((c) => c !== "Tous").map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onCategoryClick(cat);
                      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex items-center gap-1.5 text-sm transition-all duration-200"
                    style={{
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.85)",
                      padding: 0,
                    }}
                  >
                    <CategoryIcon cat={cat} size={12} />
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        className="py-3 px-4 text-center"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.15)",
          fontFamily: "Open Sans, sans-serif",
        }}
      >
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
          &copy; 2026 BETHEL GRILL
        </p>
      </div>
    </footer>
  );
}