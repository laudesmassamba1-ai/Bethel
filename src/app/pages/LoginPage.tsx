import { useState, type FormEvent } from "react";
import { Navigate, useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { LogIn, AlertCircle } from "lucide-react";

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
    if (!email.trim() || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(email, password, remember);
      navigate("/dashboard");
    } catch (err: any) {
      if (err.message?.includes("fetch") || err.message?.includes("NetworkError")) {
        setError("Impossible de contacter le serveur. Verifiez votre connexion.");
      } else {
        setError(err.message || "Email ou mot de passe incorrect");
      }
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
              GRILL
            </span>
          </div>
          <p
            className="text-sm"
            style={{ color: "#6B6357", fontFamily: "Open Sans, sans-serif" }}
          >
            Connectez-vous pour gerer le site
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div
              className="flex items-center gap-2 p-2.5 text-sm font-semibold text-white"
              style={{ background: "#DC2626", borderRadius: "0.5rem" }}
            >
              <AlertCircle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-3 py-2.5 text-sm outline-none transition-all duration-200"
            style={{
              border: error ? "1px solid #DC2626" : "1px solid rgba(0,0,0,0.12)",
              borderRadius: "0.5rem",
              background: "#FFFFFF",
              fontFamily: "Open Sans, sans-serif",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#19B000"; }}
            onBlur={(e) => { e.target.style.borderColor = error ? "#DC2626" : "rgba(0,0,0,0.12)"; }}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full px-3 py-2.5 text-sm outline-none transition-all duration-200"
            style={{
              border: error ? "1px solid #DC2626" : "1px solid rgba(0,0,0,0.12)",
              borderRadius: "0.5rem",
              background: "#FFFFFF",
              fontFamily: "Open Sans, sans-serif",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#19B000"; }}
            onBlur={(e) => { e.target.style.borderColor = error ? "#DC2626" : "rgba(0,0,0,0.12)"; }}
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
            className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-white transition-all duration-200"
            style={{
              background: loading ? "#6B6357" : "#19B000",
              borderRadius: "0.5rem",
              border: "none",
              fontFamily: "Montserrat, sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 8px 32px rgba(25,176,0,0.35)",
            }}
          >
            {loading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <LogIn size={16} />
            )}
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <Link
          to="/"
          className="block text-center mt-4 text-xs font-semibold transition-all duration-200 hover:opacity-60"
          style={{ color: "#6B6357", fontFamily: "Open Sans, sans-serif" }}
        >
          Retour au site
        </Link>
      </div>
    </div>
  );
}
