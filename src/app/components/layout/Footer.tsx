import { MessageCircle, MapPin, Phone, Clock, Camera, Share2, Shield } from "lucide-react";
import { CategoryIcon } from "../menu/CategoryIcon";
import { buildWhatsAppUrl } from "../../utils/constants";
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
      {/* Top accent line */}
      <div style={{ height: "3px", background: "#000000" }} />

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <span
                className="block mb-1"
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
                  color: "#000000",
                  letterSpacing: "0.06em",
                  marginTop: "-4px",
                }}
              >
                KITCHEN
              </span>
            </div>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.85)" }}
            >
              Une cuisine qui nourrit autant le corps que l'âme. Fait avec passion, servi avec le sourire.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full"
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
                aria-label="Instagram"
              >
                <Camera size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full"
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
                aria-label="Facebook"
              >
                <Share2 size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="mb-4 text-sm font-bold tracking-widest uppercase"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
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
                    className="flex items-center gap-1.5 text-sm hover:text-white transition-colors"
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

          {/* Contact */}
          <div>
            <h4
              className="mb-4 text-sm font-bold tracking-widest uppercase"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
            >
              Contact
            </h4>
            <ul className="space-y-3" style={{ fontFamily: "Open Sans, sans-serif" }}>
              <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
                <Phone size={14} /> +229 00 00 00 00
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
                <MapPin size={14} /> Cotonou, Bénin
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
                <Clock size={14} /> Lun-Sam: 10h – 22h
              </li>
            </ul>
          </div>

          {/* Commander */}
          <div>
            <h4
              className="mb-4 text-sm font-bold tracking-widest uppercase"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
            >
              Commander
            </h4>
            <a
              href={buildWhatsAppUrl("Bonjour ! Je souhaite commander.", config.whatsapp_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold mb-3"
              style={{
                background: "#FFFFFF",
                color: "#19B000",
                fontFamily: "Montserrat, sans-serif",
                borderRadius: "0.5rem",
                textDecoration: "none",
                display: "inline-flex",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
            >
              <MessageCircle size={14} /> Commander via WhatsApp
            </a>
            <a
              href="/login"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
              style={{
                background: "rgba(0,0,0,0.2)",
                color: "#FFFFFF",
                fontFamily: "Montserrat, sans-serif",
                borderRadius: "0.5rem",
                textDecoration: "none",
                display: "inline-flex",
              }}
            >
              <Shield size={14} /> Administration
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="py-3 px-4 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.2)", fontFamily: "Open Sans, sans-serif" }}
      >
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
          &copy; 2026 BETHEL KITCHEN &mdash; Fait avec soin et générosité
        </p>
      </div>
    </footer>
  );
}
