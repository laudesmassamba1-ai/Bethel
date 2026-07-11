export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  category: string;
  image: string;
  badge?: string;
  is_promotion?: boolean;
  promotion_prix?: number | null;
  spicy?: boolean;
  rating: number;
  time: string;
  menu_id: number | null;
}

export interface CartItem extends MenuItem {
  qty: number;
}

export const CURRENCY = "FCFA";

export const DEFAULT_CATEGORIES = ["Tous", "Burgers", "Pizzas", "Tacos", "Desserts", "Boissons"];

export const CATEGORY_COLORS: Record<string, { primary: string; secondary: string; light: string; gradient: string }> = {
  Burgers: { primary: "#19B000", secondary: "#000000", light: "#F0FAF0", gradient: "linear-gradient(135deg, #19B000, #0D8A00)" },
  Pizzas: { primary: "#000000", secondary: "#19B000", light: "#F0F0F0", gradient: "linear-gradient(135deg, #000000, #333333)" },
  Tacos: { primary: "#19B000", secondary: "#F5F1EA", light: "#F0FAF0", gradient: "linear-gradient(135deg, #19B000, #0D8A00)" },
  Desserts: { primary: "#000000", secondary: "#19B000", light: "#F0F0F0", gradient: "linear-gradient(135deg, #000000, #333333)" },
  Boissons: { primary: "#19B000", secondary: "#000000", light: "#F0FAF0", gradient: "linear-gradient(135deg, #19B000, #0D8A00)" },
};

export function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? { primary: "#19B000", secondary: "#000000", light: "#F0FAF0", gradient: "linear-gradient(135deg, #19B000, #0D8A00)" };
}

export const formatPrice = (n: number) => `${n.toLocaleString("fr-FR")} ${CURRENCY}`;

export function getDisplayPrice(item: MenuItem): number {
  if (item.is_promotion && item.promotion_prix != null) {
    return item.promotion_prix;
  }
  return item.price;
}

export const buildWhatsAppUrl = (message: string, whatsappNumber?: string) =>
  `https://wa.me/${whatsappNumber ?? "237690788315"}?text=${encodeURIComponent(message)}`;

export const buildOrderMessage = (items: CartItem[], total: number, restaurantName?: string) =>
  `Bonjour ${restaurantName ?? "Bethel Grill"} ! Je souhaite passer la commande suivante :\n\n${items.map((i) => `- ${i.name} x${i.qty}  (${formatPrice(getDisplayPrice(i) * i.qty)})`).join("\n")}\n\nTotal : ${formatPrice(total)}\n\nMerci !`;
