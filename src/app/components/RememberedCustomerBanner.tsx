import { motion } from "motion/react";
import { UserCheck, X } from "lucide-react";
import type { CustomerVerifyDTO } from "../utils/api";

interface RememberedCustomerBannerProps {
  customer: CustomerVerifyDTO;
  onDismiss: () => void;
  onClear: () => void;
}

export function RememberedCustomerBanner({ customer, onDismiss, onClear }: RememberedCustomerBannerProps) {
  return (
    <motion.div
      className="w-full mb-4 p-3 flex items-start gap-2"
      style={{
        background: "rgba(25,176,0,0.06)",
        border: "1px solid rgba(25,176,0,0.2)",
        borderRadius: "0.5rem",
      }}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
    >
      <UserCheck size={18} color="#19B000" className="flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
        >
          Bon retour, {customer.name} !
        </p>
        <p
          className="text-xs"
          style={{ color: "#6B6357", fontFamily: "Open Sans, sans-serif" }}
        >
          {customer.phone} &middot; {customer.order_count} commande{customer.order_count > 1 ? "s" : ""}
          {customer.loyalty_tier !== "Nouveau" && (
            <> &middot; Fidélité <span style={{ color: customer.loyalty_color }}>{customer.loyalty_tier}</span></>
          )}
        </p>
        <button
          onClick={onClear}
          className="text-xs font-semibold underline mt-1"
          style={{ color: "#19B000", background: "none", border: "none", cursor: "pointer", fontFamily: "Open Sans, sans-serif" }}
        >
          Oublier mes informations
        </button>
      </div>
      <button onClick={onDismiss} className="flex-shrink-0 p-1" style={{ background: "none", border: "none", cursor: "pointer" }}>
        <X size={14} color="#6B6357" />
      </button>
    </motion.div>
  );
}
