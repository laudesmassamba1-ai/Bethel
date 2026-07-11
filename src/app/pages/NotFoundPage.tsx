import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#FAFAF8" }}
    >
      <motion.div
        className="text-center max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          className="text-6xl font-black mb-2"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
        >
          404
        </motion.p>
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white uppercase"
            style={{
              background: "#19B000",
              border: "2.5px solid #000000",
              textDecoration: "none",
              fontFamily: "Montserrat, sans-serif",
              boxShadow: "3px 3px 0 #000000",
            }}
          >
            <ArrowLeft size={16} strokeWidth={2.5} /> Retour à l'accueil
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
