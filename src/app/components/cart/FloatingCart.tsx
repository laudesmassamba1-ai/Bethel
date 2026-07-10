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
          className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-30 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 font-black text-xs sm:text-sm"
          style={{
            background: "#D4AF37",
            border: "3px solid #1D1D1D",
            boxShadow: "4px 4px 0 #1D1D1D",
            fontFamily: "Nunito, sans-serif",
            cursor: "pointer",
            maxWidth: "calc(100vw - 2rem)",
          }}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingCart size={16} className="sm:size-[17px]" />
          <span className="whitespace-nowrap overflow-hidden text-ellipsis">
            <span className="hidden sm:inline">{itemCount} article{itemCount > 1 ? "s" : ""}</span>
            <span className="sm:hidden">{itemCount} art.</span>
            <span className="mx-1">•</span>
            <span style={{ color: "#9B1B30" }}>{formatPrice(total)}</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
