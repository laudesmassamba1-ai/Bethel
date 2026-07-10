import { CategoryIcon } from "./CategoryIcon";
import { getCategoryColor } from "../../utils/constants";

interface Props {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
  counts: Record<string, number>;
}

export function CategoryFilter({ categories, active, onChange, counts }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const colors = getCategoryColor(cat);
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all"
            style={{
              fontFamily: "Montserrat, sans-serif",
              background: isActive ? colors.gradient : "rgba(255,255,255,0.6)",
              color: isActive ? "#FFFFFF" : "#000000",
              border: isActive ? "1px solid transparent" : "1px solid rgba(0,0,0,0.1)",
              borderRadius: "0.375rem",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              boxShadow: isActive ? `0 4px 16px ${colors.primary}44` : "none",
            }}
          >
            {cat !== "Tous" && <CategoryIcon cat={cat} size={12} />}
            {cat}
            {cat !== "Tous" && (
              <span style={{ opacity: 0.6, fontSize: 10 }}>({counts[cat] ?? 0})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
