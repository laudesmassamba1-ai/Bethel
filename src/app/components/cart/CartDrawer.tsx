import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, X, Plus, Minus, ShoppingBag, UtensilsCrossed, Trash2 } from "lucide-react";
import { ImageWithFallback } from "../shared/ImageWithFallback";
import { formatPrice, getDisplayPrice } from "../../utils/constants";
import type { CartItem } from "../../utils/constants";

interface Props {
  open: boolean;
  cart: CartItem[];
  cartTotal: number;
  onClose: () => void;
  onAdd: (id: number) => void;
  onRemove: (id: number) => void;
  onClear: () => void;
}

export function CartDrawer({ open, cart, cartTotal, onClose, onAdd, onRemove, onClear }: Props) {
  const navigate = useNavigate();
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleOrderClick = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
            style={{
              width: "min(420px, 100vw)",
              background: "#FFFFFF",
              borderLeft: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "-8px 0 32px rgba(0,0,0,0.12)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", background: "#F5F1EA" }}
            >
              <div className="flex items-center gap-2" style={{ color: "#000000" }}>
                <ShoppingCart size={20} strokeWidth={2} />
                <h2
                  className="text-lg font-bold"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Mon Panier ({itemCount})
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={onClear}
                    className="w-8 h-8 flex items-center justify-center"
                    style={{
                      border: "1px solid rgba(0,0,0,0.12)",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      background: "transparent",
                      color: "#6B6357",
                    }}
                    title="Vider le panier"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center"
                  style={{
                    border: "1px solid rgba(0,0,0,0.12)",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    background: "transparent",
                    color: "#6B6357",
                  }}
                  aria-label="Fermer le panier"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-2 sm:gap-3">
              {cart.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-full gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <UtensilsCrossed size={48} strokeWidth={1.2} color="#19B000" opacity={0.3} />
                  <p
                    className="text-base font-semibold"
                    style={{ fontFamily: "Montserrat, sans-serif", color: "#6B6357" }}
                  >
                    Votre panier est vide
                  </p>
                  <p
                    className="text-sm text-center"
                    style={{ fontFamily: "Open Sans, sans-serif", color: "#9B9385" }}
                  >
                    Ajoutez des plats depuis le menu pour commencer votre commande
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                      transition={{ type: "spring", damping: 25, stiffness: 250 }}
                      className="flex gap-2 sm:gap-3 p-2 sm:p-3"
                      style={{
                        background: "rgba(255,255,255,0.8)",
                        border: "1px solid rgba(0,0,0,0.06)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-12 sm:w-16 h-12 sm:h-16 object-cover flex-shrink-0"
                        style={{ borderRadius: "0.375rem" }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-semibold text-sm leading-tight"
                          style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                        >
                          {item.name}
                        </p>
                        <p
                          className="text-sm font-semibold mt-1"
                          style={{ color: "#19B000", fontFamily: "Montserrat, sans-serif" }}
                        >
                          {formatPrice(getDisplayPrice(item) * item.qty)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => onRemove(item.id)}
                          className="w-7 h-7 flex items-center justify-center"
                          style={{
                            border: "1px solid rgba(0,0,0,0.1)",
                            borderRadius: "0.375rem",
                            background: "#F5F1EA",
                            cursor: "pointer",
                            color: "#000000",
                          }}
                          aria-label={`Retirer un ${item.name}`}
                        >
                          <Minus size={12} />
                        </button>
                        <motion.span
                          key={item.qty}
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                          className="w-5 text-center font-semibold text-sm"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {item.qty}
                        </motion.span>
                        <button
                          onClick={() => onAdd(item.id)}
                          className="w-7 h-7 flex items-center justify-center"
                          style={{
                            border: "1px solid rgba(25,176,0,0.3)",
                            borderRadius: "0.375rem",
                            background: "#19B000",
                            cursor: "pointer",
                            color: "#FFFFFF",
                          }}
                          aria-label={`Ajouter un ${item.name}`}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <motion.div
                className="p-3 sm:p-4"
                style={{ borderTop: "1px solid rgba(0,0,0,0.08)", background: "#F5F1EA" }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span
                    className="font-semibold text-base"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Total
                  </span>
                  <motion.span
                    key={cartTotal}
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    className="text-xl sm:text-2xl font-bold"
                    style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                  >
                    {formatPrice(cartTotal)}
                  </motion.span>
                </div>
                <motion.button
                  onClick={handleOrderClick}
                  className="flex items-center justify-center gap-2 w-full py-3.5 text-white font-semibold text-base"
                  style={{
                    background: "#19B000",
                    borderRadius: "0.5rem",
                    border: "none",
                    fontFamily: "Montserrat, sans-serif",
                    cursor: "pointer",
                    boxShadow: "0 8px 32px rgba(25,176,0,0.35)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingBag size={18} />
                  Passer la commande
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
