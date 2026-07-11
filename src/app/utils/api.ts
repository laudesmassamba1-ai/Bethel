import type { MenuItem } from "./constants";

const API_BASE = "/api";

async function fetchJson<T>(url: string, signal?: AbortSignal, headers?: Record<string, string>): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, { signal, headers });
  if (!res.ok) {
    let msg = `Erreur API ${res.status}: ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.message) msg = body.message;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export interface PlatDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  category: string;
  image: string;
  badge: string | null;
  is_promotion: boolean;
  promotion_prix: number | null;
  spicy: boolean;
  menu_id: number | null;
}

function toMenuItem(p: PlatDTO): MenuItem {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    original_price: p.original_price,
    category: p.category as MenuItem["category"],
    image: p.image,
    badge: p.badge ?? undefined,
    is_promotion: p.is_promotion,
    promotion_prix: p.promotion_prix,
    spicy: p.spicy,
    menu_id: p.menu_id,
  };
}

export async function fetchPlats(signal?: AbortSignal): Promise<{ plats: MenuItem[]; mostOrderedPlatId: number | null }> {
  const json = await fetchJson<{ data: PlatDTO[]; most_ordered_plat_id: number | null }>("/plats", signal);
  return { plats: json.data.map(toMenuItem), mostOrderedPlatId: json.most_ordered_plat_id };
}

export interface MenuDTO {
  id: number;
  nom: string;
  description: string | null;
  is_active: boolean;
}

export interface SiteConfigDTO {
  brand_name: string;
  brand_accent: string;
  hero_subtitle: string;
  hero_title: string;
  hero_copy: string | null;
  whatsapp_number: string;
  hero_cta_label: string;
  cart_open_label: string;
  menu_section_label: string;
  menu_section_title: string;
  menu_section_description: string | null;
  menu_cta_label: string;
  cart_clear_text: string;
  cart_header: string;
  cart_checkout_label: string;
}

export interface StatsDTO {
  total_orders: number;
  total_revenue: number;
  orders_today: number;
  orders_this_week: number;
  orders_this_month: number;
  avg_order_value: number;
  total_customers: number;
  new_customers_this_month: number;
  top_plats: { id: number; name: string; total_qty: number }[];
  recent_orders: { id: number; customer_name: string | null; customer_phone: string | null; total_amount: number; items_count: number; created_at: string }[];
  chart_14_days: { date: string; label: string; orders: number; revenue: number }[];
  category_breakdown: { category: string; count: number }[];
}

export async function fetchStats(token?: string): Promise<StatsDTO> {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const json = await fetchJson<{ data: StatsDTO }>("/stats", undefined, headers);
  return json.data;
}

export async function submitOrder(cart: { id: number; title: string; quantity: number; price: number }[], total: number, message?: string, customerName?: string, customerPhone?: string): Promise<{ success: boolean; order_id: number; customer_id?: number }> {
  const res = await fetch(`${API_BASE}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ cart, total, message, customer_name: customerName, customer_phone: customerPhone }),
  });
  if (!res.ok) throw new Error(`Erreur de commande ${res.status}: ${res.statusText}`);
  return res.json();
}

export interface CustomerVerifyDTO {
  id: number;
  name: string;
  phone: string;
  order_count: number;
  loyalty_tier: string;
  loyalty_color: string;
}

export async function verifyCustomer(customerId: number, phone: string): Promise<CustomerVerifyDTO | null> {
  try {
    const res = await fetch(`${API_BASE}/customer/verify?customer_id=${customerId}&phone=${encodeURIComponent(phone)}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function resetAllData(token: string): Promise<{ message: string; backup: string }> {
  const res = await fetch(`${API_BASE}/stats/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ confirm: "reset_all_data" }),
  });
  if (!res.ok) throw new Error(`Erreur reset ${res.status}: ${res.statusText}`);
  return res.json();
}


