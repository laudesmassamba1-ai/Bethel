import { Beef, Pizza, Sandwich, CakeSlice, Coffee, UtensilsCrossed, Flame } from "lucide-react";

function getIcon(cat: string, size: number) {
  const s = { size, strokeWidth: 2.5 } as const;
  switch (cat) {
    case "Boeuf":
    case "Burgers":
    case "Menu grillade":
      return <Beef {...s} />;
    case "Poulet Braisé":
    case "Poulet Braise":
    case "Menu du chef":
      return <Flame {...s} />;
    case "Pizzas":
      return <Pizza {...s} />;
    case "Tacos":
      return <Sandwich {...s} />;
    case "Desserts":
      return <CakeSlice {...s} />;
    case "Boissons":
    case "Menu rafraîchissant":
    case "Menu rafraichissant":
      return <Coffee {...s} />;
    default:
      return <UtensilsCrossed {...s} />;
  }
}

export function CategoryIcon({ cat, size = 14 }: { cat: string; size?: number }) {
  return <>{getIcon(cat, size)}</>;
}
