import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#F5F1EA" }}
    >
      <div className="text-center max-w-sm">
        <p
          className="text-6xl font-black mb-2"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}
        >
          404
        </p>
        <p
          className="text-lg font-semibold mb-1"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
        >
          Page introuvable
        </p>
        <p
          className="text-sm mb-6"
          style={{ fontFamily: "Open Sans, sans-serif", color: "#6B6357" }}
        >
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #19B000, #0D8A00)",
            textDecoration: "none",
            boxShadow: "3px 3px 0 rgba(0,0,0,0.15)",
          }}
        >
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}