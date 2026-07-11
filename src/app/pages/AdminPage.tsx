import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";
import {
  LogOut, ExternalLink, TrendingUp, ShoppingBag, Calendar, Wallet,
  Clock, Star, UtensilsCrossed, RefreshCw, AlertCircle, RotateCcw,
} from "lucide-react";
import { fetchStats } from "../utils/api";
import { formatPrice } from "../utils/constants";
import type { StatsDTO } from "../utils/api";

const RING_COLORS = ["#19B000", "#000000", "#0D8A00", "#333333", "#095E00"];

/* ─── Confirm Modal ─── */
function ConfirmModal({ open, title, message, confirmLabel, onConfirm, onCancel }: {
  open: boolean; title: string; message: string; confirmLabel: string;
  onConfirm: () => void; onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm p-6"
        style={{
          background: "#FFFFFF",
          borderRadius: "0.75rem",
          boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-bold mb-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}>{title}</h3>
        <p className="text-sm mb-5" style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}>{message}</p>
        <div className="flex items-center justify-end gap-2">
          <button onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold"
            style={{ background: "transparent", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "0.375rem", cursor: "pointer", fontFamily: "Montserrat, sans-serif", color: "#000000" }}
          >
            Annuler
          </button>
          <button onClick={onConfirm}
            className="px-4 py-2 text-xs font-semibold text-white"
            style={{ background: "#DC2626", border: "none", borderRadius: "0.375rem", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ icon, label, value, sub, color, loading }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; color: string; loading?: boolean;
}) {
  return (
    <div
      className="flex flex-col p-4 sm:p-5 transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.6)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: "0.75rem",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold tracking-wider uppercase"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#6B6357" }}
        >
          {label}
        </span>
        <span style={{ color, opacity: loading ? 0.3 : 1 }}>{icon}</span>
      </div>
      {loading ? (
        <div className="h-6 w-24 rounded" style={{ background: "rgba(0,0,0,0.06)" }} />
      ) : (
        <span className="text-xl sm:text-2xl font-bold leading-none"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
        >
          {value}
        </span>
      )}
      {sub && !loading && (
        <span className="text-xs mt-1" style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}>
          {sub}
        </span>
      )}
    </div>
  );
}

/* ─── Category Pie (conic-gradient) ─── */
function CategoryPie({ data }: { data: { category: string; count: number }[] }) {
  const total = data.reduce((s, c) => s + c.count, 0);
  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2">
        <UtensilsCrossed size={24} style={{ color: "rgba(0,0,0,0.12)" }} />
        <p className="text-sm" style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}>Aucune donnee</p>
      </div>
    );
  }
  const segments = data.map((c, i) => {
    const pct = (c.count / total) * 100;
    return { ...c, pct, color: RING_COLORS[i % RING_COLORS.length] };
  });
  const conic = segments.map((s, i) => {
    const start = segments.slice(0, i).reduce((a, b) => a + b.pct, 0);
    return `${s.color} ${start}% ${start + s.pct}%`;
  }).join(", ");
  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <div className="relative flex-shrink-0" style={{ width: 130, height: 130 }}>
        <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(${conic})` }} />
        <div className="absolute rounded-full flex items-center justify-center flex-col"
          style={{
            width: 58, height: 58, top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#FFFFFF",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          <span style={{ fontWeight: 900, fontSize: "1.1rem", color: "#000000", lineHeight: 1 }}>{total}</span>
          <span style={{ fontSize: 7, color: "#6B6357", fontWeight: 600 }}>plats</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 text-xs w-full">
        {segments.map((c) => (
          <div key={c.category} className="flex items-center gap-2"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
            <span className="truncate font-semibold flex-1">{c.category}</span>
            <span style={{ color: "#6B6357" }}>{c.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Animated Bar Chart ─── */
function BarChart({ data, valueKey, color, formatter }: {
  data: StatsDTO["chart_14_days"];
  valueKey: "orders" | "revenue";
  color: string;
  formatter: (v: number) => string;
}) {
  const maxVal = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div className="flex items-end gap-1 h-36 sm:h-44">
      {data.map((d) => {
        const v = d[valueKey];
        const pct = (v / maxVal) * 100;
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group">
            <span className="text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
            >
              {v > 0 ? formatter(v) : ""}
            </span>
            <div className="w-full rounded-sm relative overflow-hidden"
              style={{
                height: `${Math.max(pct, 3)}%`,
                background: v > 0 ? `linear-gradient(180deg, ${color}, ${color}88)` : "rgba(0,0,0,0.04)",
                transition: "height 0.8s ease, background 0.3s",
              }}
            />
            <span className="text-[9px] font-semibold truncate w-full text-center"
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

/* ─── Loading Skeleton ─── */
function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F1EA" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "#19B000", borderTopColor: "transparent" }} />
        <p className="text-sm font-semibold" style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}>
          Chargement...
        </p>
      </div>
    </div>
  );
}

/* ─── AdminPage ─── */
export function AdminPage() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<StatsDTO | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const loadStats = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setStatsLoading(true);
    setStatsError(null);
    try {
      const data = await fetchStats(token);
      setStats(data);
    } catch (err: any) {
      if (!silent) setStatsError(err.message || "Erreur de chargement des statistiques");
    } finally {
      if (!silent) setStatsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!user) return;
    loadStats();
  }, [user, loadStats]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => loadStats(true), 60000);
    return () => clearInterval(interval);
  }, [user, loadStats]);

  const handleRetry = useCallback(async () => {
    setRetrying(true);
    setStatsError(null);
    try {
      const data = await fetchStats(token ?? undefined);
      setStats(data);
    } catch (err: any) {
      setStatsError(err.message || "Erreur de chargement");
    } finally {
      setRetrying(false);
      setStatsLoading(false);
    }
  }, [token]);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  if (authLoading) return <LoadingSkeleton />;
  if (!user) return <Navigate to="/login" replace />;

  const iconSize = 16;

  return (
    <div className="min-h-screen" style={{ background: "#F5F1EA" }}>
      <ConfirmModal
        open={showLogoutConfirm}
        title="Deconnexion"
        message="Voulez-vous vraiment vous deconnecter du tableau de bord ?"
        confirmLabel="Se deconnecter"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", background: "#FFFFFF" }}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "1.2rem", color: "#19B000", letterSpacing: "0.06em" }}>
              BETHEL
            </span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#000000", letterSpacing: "0.04em" }}>
              GRILL
            </span>
          </div>
          <p className="text-xs truncate" style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}>
            {user.name}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button onClick={() => loadStats(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 text-xs font-semibold transition-all duration-200"
            style={{
              background: "transparent",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              color: "#6B6357",
            }}
            title="Actualiser les donnees"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>

          <a href="/admin" rel="noopener noreferrer"
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

          <button onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 text-xs font-semibold text-white transition-all duration-200"
            style={{
              background: "#000000",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            <LogOut size={12} />
            <span className="hidden sm:inline">Quitter</span>
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {statsLoading && !stats ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <StatCard key={i} icon={<TrendingUp size={iconSize} />} label="..." value="" color="#19B000" loading />
            ))}
          </div>
        ) : statsError && !stats ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4"
            style={{
              background: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: "0.75rem",
            }}
          >
            <AlertCircle size={32} style={{ color: "#DC2626" }} />
            <p className="text-sm font-semibold" style={{ fontFamily: "Montserrat, sans-serif", color: "#DC2626" }}>
              {statsError}
            </p>
            <button onClick={handleRetry} disabled={retrying}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200"
              style={{
                background: retrying ? "#6B6357" : "#19B000",
                border: "none",
                borderRadius: "0.5rem",
                cursor: retrying ? "not-allowed" : "pointer",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {retrying ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <RotateCcw size={16} />
              )}
              {retrying ? "Chargement..." : "Reessayer"}
            </button>
          </div>
        ) : stats ? (
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <StatCard icon={<TrendingUp size={iconSize} />} label="Revenu total" value={formatPrice(stats.total_revenue)} color="#19B000" />
              <StatCard icon={<ShoppingBag size={iconSize} />} label="Commandes" value={String(stats.total_orders)} sub={`${stats.orders_today} aujourdhui, ${stats.orders_this_month} ce mois`} color="#000000" />
              <StatCard icon={<Calendar size={iconSize} />} label="Clients" value={String(stats.total_customers)} sub={`+${stats.new_customers_this_month} ce mois`} color="#19B000" />
              <StatCard icon={<Wallet size={iconSize} />} label="Panier moyen" value={formatPrice(stats.avg_order_value)} color="#000000" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 p-4 sm:p-5"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "0.75rem",
                }}
              >
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                >
                  <TrendingUp size={15} color="#19B000" /> Commandes (14 jours)
                </h3>
                <BarChart data={stats.chart_14_days} valueKey="orders" color="#19B000" formatter={(v) => String(v)} />
              </div>

              <div className="p-4 sm:p-5"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "0.75rem",
                }}
              >
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                >
                  <Wallet size={15} color="#000000" /> Revenu (14 jours)
                </h3>
                <BarChart data={stats.chart_14_days} valueKey="revenue" color="#000000" formatter={(v) => `${(v / 1000).toFixed(1)}k`} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-4 sm:p-5"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "0.75rem",
                }}
              >
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                >
                  <Star size={15} color="#19B000" fill="#19B000" /> Top plats
                </h3>
                {stats.top_plats.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-2">
                    <UtensilsCrossed size={22} style={{ color: "rgba(0,0,0,0.12)" }} />
                    <p className="text-xs" style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}>
                      Aucune commande pour le moment
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {stats.top_plats.map((plat, i) => {
                      const maxQty = Math.max(...stats.top_plats.map((p) => p.total_qty), 1);
                      const pct = (plat.total_qty / maxQty) * 100;
                      return (
                        <div key={plat.id} className="flex items-center gap-3">
                          <span className="w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0"
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
                            <div className="flex items-center justify-between mb-0.5 gap-2">
                              <span className="text-xs font-semibold truncate"
                                style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                              >
                                {plat.name}
                              </span>
                              <span className="text-xs font-semibold flex-shrink-0"
                                style={{ fontFamily: "Open Sans, sans-serif", color: "#19B000" }}
                              >
                                x{plat.total_qty}
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
                              <div className="h-full rounded-full transition-all duration-700"
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

              <div className="p-4 sm:p-5"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "0.75rem",
                }}
              >
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                >
                  <UtensilsCrossed size={15} color="#19B000" /> Repartition par categorie
                </h3>
                <CategoryPie data={stats.category_breakdown} />
              </div>
            </div>

            <div className="p-4 sm:p-5"
              style={{
                background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "0.75rem",
              }}
            >
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
              >
                <Clock size={15} color="#6B6357" /> Dernieres commandes
              </h3>
              {stats.recent_orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <ShoppingBag size={22} style={{ color: "rgba(0,0,0,0.12)" }} />
                  <p className="text-xs" style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}>
                    Aucune commande pour le moment
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs" style={{ fontFamily: "Open Sans, sans-serif" }}>
                    <thead>
                      <tr className="text-left font-semibold"
                        style={{ color: "#6B6357", borderBottom: "1px solid rgba(0,0,0,0.08)" }}
                      >
                        <th className="py-2 pr-3">N</th>
                        <th className="py-2 pr-3">Client</th>
                        <th className="py-2 pr-3">Contact</th>
                        <th className="py-2 pr-3 text-right">Articles</th>
                        <th className="py-2 pr-3 text-right">Total</th>
                        <th className="py-2 pr-3 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recent_orders.map((o) => (
                        <tr key={o.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                          className="hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                        >
                          <td className="py-2.5 pr-3 font-bold" style={{ color: "#19B000" }}>#{o.id}</td>
                          <td className="py-2.5 pr-3 truncate max-w-24 sm:max-w-32">{o.customer_name || "Anonyme"}</td>
                          <td className="py-2.5 pr-3">{o.customer_phone || "--"}</td>
                          <td className="py-2.5 pr-3 text-right">{o.items_count}</td>
                          <td className="py-2.5 pr-3 text-right font-bold" style={{ color: "#19B000" }}>{formatPrice(o.total_amount)}</td>
                          <td className="py-2.5 pr-3 text-right whitespace-nowrap" style={{ color: "#6B6357" }}>
                            {new Date(o.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-center pt-2">
              <a href="/admin" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all duration-200"
                style={{
                  background: "#19B000",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  fontFamily: "Montserrat, sans-serif",
                  boxShadow: "0 8px 32px rgba(25,176,0,0.3)",
                }}
              >
                <ExternalLink size={16} /> Gerer les plats, menus et parametres
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
