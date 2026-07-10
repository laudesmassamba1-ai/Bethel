import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { LogIn } from "lucide-react";

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, remember);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#000000" }}>
      <div
        className="w-full max-w-sm p-6 sm:p-8"
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: "1rem",
          border: "1px solid rgba(25,176,0,0.2)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
        }}
      >
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-1 mb-2">
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 900,
                fontSize: "1.8rem",
                color: "#19B000",
                letterSpacing: "0.08em",
              }}
            >
              BETHEL
            </span>
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "1.8rem",
                color: "#000000",
                letterSpacing: "0.06em",
              }}
            >
              KITCHEN
            </span>
          </div>
          <p
            className="text-sm"
            style={{ color: "#6B6357", fontFamily: "Open Sans, sans-serif" }}
          >
            Connectez-vous pour gérer le site
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div
              className="p-2.5 text-sm font-semibold text-center text-white"
              style={{ background: "#DC2626", borderRadius: "0.5rem" }}
            >
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2.5 text-sm outline-none"
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: "0.5rem",
              background: "#FFFFFF",
              fontFamily: "Open Sans, sans-serif",
            }}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2.5 text-sm outline-none"
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: "0.5rem",
              background: "#FFFFFF",
              fontFamily: "Open Sans, sans-serif",
            }}
          />

          <label
            className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none"
            style={{ fontFamily: "Open Sans, sans-serif", color: "#333333" }}
          >
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: "#19B000" }}
            />
            Se souvenir de moi
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-white"
            style={{
              background: loading ? "#6B6357" : "#19B000",
              borderRadius: "0.5rem",
              border: "none",
              fontFamily: "Montserrat, sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 8px 32px rgba(25,176,0,0.35)",
            }}
          >
            <LogIn size={16} />
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <a
          href="/"
          className="block text-center mt-4 text-xs font-semibold"
          style={{ color: "#6B6357", fontFamily: "Open Sans, sans-serif" }}
        >
          ← Retour au site
        </a>
      </div>
    </div>
  );
}
