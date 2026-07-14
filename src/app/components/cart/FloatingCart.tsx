import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "../../utils/constants";

interface Props {
  visible: boolean;
  cartOpen: boolean;
  itemCount: number;
  total: number;
  onOpen: () => void;
}

export function FloatingCart({ visible, cartOpen, itemCount, total, onOpen }: Props) {
  return (
    <AnimatePresence>
      {visible && !cartOpen && (
        <motion.button
          onClick={onOpen}
          className="fixed bottom-5 left-5 z-30 flex items-center gap-2 px-4 py-3 text-xs font-bold"
          style={{
            background: "linear-gradient(135deg, #19B000, #0D8A00)",
            border: "none",
            boxShadow: "4px 4px 0 rgba(0,0,0,0.25), 0 8px 24px rgba(25,176,0,0.15)",
            cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
            color: "#FFFFFF",
            letterSpacing: "0.03em",
          }}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.05, y: -2, boxShadow: "6px 6px 0 rgba(0,0,0,0.25), 0 12px 32px rgba(25,176,0,0.2)" }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative">
            <ShoppingCart size={16} strokeWidth={2.5} />
            <span
              style={{
                position: "absolute",
                top: -6,
                right: -8,
                background: "#E53E30",
                color: "#fff",
                borderRadius: "50%",
                width: 16,
                height: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {itemCount}
            </span>
          </span>
          <span className="hidden sm:inline">Panier</span>
          <span className="mx-0.5 opacity-40">·</span>
          <span style={{ color: "rgba(255,255,255,0.7)" }}>{formatPrice(total)}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
