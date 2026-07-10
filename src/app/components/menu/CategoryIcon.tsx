import { Beef, Pizza, Sandwich, CakeSlice, Coffee, UtensilsCrossed } from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  Burgers: <Beef size={14} strokeWidth={2.5} />,
  Pizzas: <Pizza size={14} strokeWidth={2.5} />,
  Tacos: <Sandwich size={14} strokeWidth={2.5} />,
  Desserts: <CakeSlice size={14} strokeWidth={2.5} />,
  Boissons: <Coffee size={14} strokeWidth={2.5} />,
};

export function CategoryIcon({ cat, size = 14 }: { cat: string; size?: number }) {
  const scaled = { size, strokeWidth: 2.5 };
  const icon = ICON_MAP[cat];
  if (!icon) return <UtensilsCrossed {...scaled} />;
  return <>{icon}</>;
}
