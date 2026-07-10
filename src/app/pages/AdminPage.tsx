import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";
import { LogOut, ExternalLink, TrendingUp, ShoppingBag, Wallet, Calendar, Clock, Star, UtensilsCrossed } from "lucide-react";
import { fetchStats } from "../utils/api";
import { formatPrice } from "../utils/constants";
import type { StatsDTO } from "../utils/api";

const RING_COLORS = ["#19B000", "#000000", "#19B000", "#000000", "#19B000"];

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub?: string; color: string }) {
  return (
    <div
      className="flex flex-col p-4 sm:p-5"
      style={{
        background: "rgba(255,255,255,0.6)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: "0.75rem",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-semibold tracking-wider uppercase"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#6B6357" }}
        >
          {label}
        </span>
        <span style={{ color }}>{icon}</span>
      </div>
      <span
        className="text-xl sm:text-2xl font-bold leading-none"
        style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
      >
        {value}
      </span>
      {sub && (
        <span
          className="text-xs mt-1"
          style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}

function CategoryPie({ data }: { data: { category: string; count: number }[] }) {
  const total = data.reduce((s, c) => s + c.count, 0);
  if (total === 0) {
    return (
      <div
        className="flex items-center justify-center h-48 text-sm"
        style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}
      >
        Aucun plat
      </div>
    );
  }
  const segments = data.map((c, i) => {
    const pct = (c.count / total) * 100;
    return { ...c, pct, color: RING_COLORS[i % RING_COLORS.length] };
  });
  const conicGradient = segments
    .map((s, i) => {
      const start = segments.slice(0, i).reduce((a, b) => a + b.pct, 0);
      return `${s.color} ${start}% ${start + s.pct}%`;
    })
    .join(", ");
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
        <div
          className="w-full h-full rounded-full"
          style={{ background: `conic-gradient(${conicGradient})` }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 56,
            height: 56,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "#000000",
          }}
        >
          {total}
        </div>
      </div>
      <div className="flex flex-col gap-1 text-xs">
        {segments.map((c) => (
          <div
            key={c.category}
            className="flex items-center gap-2"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
            <span className="truncate max-w-28 font-semibold">{c.category}</span>
            <span style={{ color: "#6B6357" }}>{c.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersChart({ data }: { data: StatsDTO["chart_14_days"] }) {
  const maxOrders = Math.max(...data.map((d) => d.orders), 1);
  return (
    <div className="flex items-end gap-1 h-32 sm:h-40">
      {data.map((d) => {
        const pct = (d.orders / maxOrders) * 100;
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5">
            <span
              className="text-[10px] font-semibold"
              style={{ fontFamily: "Montserrat, sans-serif", color: d.orders > 0 ? "#19B000" : "#6B6357" }}
            >
              {d.orders}
            </span>
            <div
              className="w-full rounded-t-sm transition-all"
              style={{
                height: `${Math.max(pct, 2)}%`,
                background: d.orders > 0 ? "#19B000" : "rgba(0,0,0,0.06)",
              }}
            />
            <span
              className="text-[9px] font-semibold truncate w-full text-center"
              style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}
            >
              {d.label.split(" ")[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function RevenueChart({ data }: { data: StatsDTO["chart_14_days"] }) {
  const maxRev = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="flex items-end gap-1 h-32 sm:h-40">
      {data.map((d) => {
        const pct = (d.revenue / maxRev) * 100;
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5">
            <span
              className="text-[10px] font-semibold"
              style={{ fontFamily: "Montserrat, sans-serif", color: d.revenue > 0 ? "#000000" : "#6B6357" }}
            >
              {d.revenue > 0 ? `${(d.revenue / 1000).toFixed(0)}k` : ""}
            </span>
            <div
              className="w-full rounded-t-sm transition-all"
              style={{
                height: `${Math.max(pct, 2)}%`,
                background: d.revenue > 0 ? "#000000" : "rgba(0,0,0,0.06)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F1EA" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "#19B000", borderTopColor: "transparent" }} />
        <p
          className="text-sm font-semibold"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}
        >
          Chargement du tableau de bord...
        </p>
      </div>
    </div>
  );
}

export function AdminPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<StatsDTO | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchStats()
      .then(setStats)
      .catch((err) => setStatsError(err.message || "Erreur de chargement"))
      .finally(() => setStatsLoading(false));
  }, [user]);

  if (authLoading) return <LoadingSkeleton />;
  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen" style={{ background: "#F5F1EA" }}>
      <header
        className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", background: "#FFFFFF" }}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 900,
                fontSize: "1.2rem",
                color: "#19B000",
                letterSpacing: "0.06em",
              }}
            >
              BETHEL
            </span>
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "#000000",
                letterSpacing: "0.04em",
              }}
            >
              KITCHEN
            </span>
          </div>
          <p
            className="text-xs truncate"
            style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}
          >
            {user.name}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <a
            href="/admin"
            rel="noopener noreferrer"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 text-xs font-semibold"
            style={{
              background: "#F5F1EA",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "0.375rem",
              textDecoration: "none",
              fontFamily: "Montserrat, sans-serif",
              color: "#000000",
            }}
          >
            <ExternalLink size={12} />
            <span className="hidden sm:inline">Filament</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 text-xs font-semibold text-white"
            style={{
              background: "#000000",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            <LogOut size={12} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {statsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "#19B000", borderTopColor: "transparent" }} />
          </div>
        ) : statsError ? (
          <div
            className="p-6 text-center"
            style={{
              background: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: "0.75rem",
            }}
          >
            <p
              className="text-sm font-semibold mb-3"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#DC2626" }}
            >
              {statsError}
            </p>
            <button
              onClick={() => { setStatsLoading(true); setStatsError(null); fetchStats().then(setStats).catch((e) => setStatsError(e.message)).finally(() => setStatsLoading(false)); }}
              type="button"
              className="px-4 py-2 font-semibold text-sm text-white"
              style={{
                background: "#19B000",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Réessayer
            </button>
          </div>
        ) : stats ? (
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <StatCard icon={<TrendingUp size={18} />} label="Revenu total" value={formatPrice(stats.total_revenue)} color="#19B000" />
              <StatCard icon={<ShoppingBag size={18} />} label="Commandes" value={String(stats.total_orders)} sub={`${stats.orders_this_month} ce mois`} color="#000000" />
              <StatCard icon={<Calendar size={18} />} label="Clients" value={String(stats.total_customers)} sub={`${stats.new_customers_this_month} ce mois`} color="#19B000" />
              <StatCard icon={<Wallet size={18} />} label="Panier moyen" value={formatPrice(stats.avg_order_value)} color="#000000" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div
                className="lg:col-span-2 p-4 sm:p-5"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "0.75rem",
                }}
              >
                <h3
                  className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                >
                  <TrendingUp size={15} color="#19B000" /> Commandes (14 jours)
                </h3>
                <OrdersChart data={stats.chart_14_days} />
              </div>

              <div
                className="p-4 sm:p-5"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "0.75rem",
                }}
              >
                <h3
                  className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                >
                  <Wallet size={15} color="#000000" /> Revenu (14 jours)
                </h3>
                <RevenueChart data={stats.chart_14_days} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div
                className="p-4 sm:p-5"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "0.75rem",
                }}
              >
                <h3
                  className="text-sm font-semibold mb-4 flex items-center gap-2"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                >
                  <Star size={15} color="#19B000" fill="#19B000" /> Top 5 plats
                </h3>
                {stats.top_plats.length === 0 ? (
                  <p
                    className="text-xs text-center py-6"
                    style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}
                  >
                    Aucune commande pour le moment
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {stats.top_plats.map((plat, i) => {
                      const maxQty = Math.max(...stats.top_plats.map((p) => p.total_qty), 1);
                      const pct = (plat.total_qty / maxQty) * 100;
                      return (
                        <div key={plat.id} className="flex items-center gap-3">
                          <span
                            className="w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{
                              background: i < 3 ? RING_COLORS[i] : "rgba(0,0,0,0.06)",
                              color: i < 3 ? "#FFFFFF" : "#6B6357",
                              borderRadius: "0.25rem",
                              fontFamily: "Montserrat, sans-serif",
                            }}
                          >
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span
                                className="text-xs font-semibold truncate"
                                style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                              >
                                {plat.name}
                              </span>
                              <span
                                className="text-xs font-semibold flex-shrink-0 ml-2"
                                style={{ fontFamily: "Open Sans, sans-serif", color: "#19B000" }}
                              >
                                x{plat.total_qty}
                              </span>
                            </div>
                            <div
                              className="w-full h-1.5"
                              style={{ background: "rgba(0,0,0,0.06)", borderRadius: "0.25rem" }}
                            >
                              <div
                                className="h-full transition-all rounded-full"
                                style={{
                                  width: `${pct}%`,
                                  background: i < 3 ? RING_COLORS[i] : "#6B6357",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div
                className="p-4 sm:p-5"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "0.75rem",
                }}
              >
                <h3
                  className="text-sm font-semibold mb-4 flex items-center gap-2"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                >
                  <UtensilsCrossed size={15} color="#19B000" /> Répartition par catégorie
                </h3>
                <CategoryPie data={stats.category_breakdown} />
              </div>
            </div>

            <div
              className="p-4 sm:p-5"
              style={{
                background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "0.75rem",
              }}
            >
              <h3
                className="text-sm font-semibold mb-4 flex items-center gap-2"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
              >
                <Clock size={15} color="#6B6357" /> Dernières commandes
              </h3>
              {stats.recent_orders.length === 0 ? (
                <p
                  className="text-xs text-center py-6"
                  style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}
                >
                  Aucune commande pour le moment
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs" style={{ fontFamily: "Open Sans, sans-serif" }}>
                    <thead>
                      <tr
                        className="text-left font-semibold"
                        style={{ color: "#6B6357", borderBottom: "1px solid rgba(0,0,0,0.08)" }}
                      >
                        <th className="py-2 pr-3">N°</th>
                        <th className="py-2 pr-3">Client</th>
                        <th className="py-2 pr-3">Contact</th>
                        <th className="py-2 pr-3 text-right">Articles</th>
                        <th className="py-2 pr-3 text-right">Total</th>
                        <th className="py-2 pr-3 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recent_orders.map((o) => (
                        <tr key={o.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                          <td className="py-2 pr-3 font-bold" style={{ color: "#19B000" }}>#{o.id}</td>
                          <td className="py-2 pr-3 truncate max-w-24 sm:max-w-32">{o.customer_name || "Anonyme"}</td>
                          <td className="py-2 pr-3">{o.customer_phone || "--"}</td>
                          <td className="py-2 pr-3 text-right">{o.items_count}</td>
                          <td className="py-2 pr-3 text-right font-bold" style={{ color: "#19B000" }}>{formatPrice(o.total_amount)}</td>
                          <td className="py-2 pr-3 text-right whitespace-nowrap" style={{ color: "#6B6357" }}>
                            {new Date(o.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <a
                href="/admin"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white"
                style={{
                  background: "#19B000",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  fontFamily: "Montserrat, sans-serif",
                  boxShadow: "0 8px 32px rgba(25,176,0,0.35)",
                }}
              >
                <ExternalLink size={16} /> Gérer les plats, menus et paramètres
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
