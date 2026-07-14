import { useState, useEffect, type FormEvent } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ShoppingBag, MessageCircle, ArrowLeft, CheckCircle, Download } from "lucide-react";
import confetti from "canvas-confetti";
import { useCart } from "../context/CartContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import { ImageWithFallback } from "../components/shared/ImageWithFallback";
import { CookieConsentBanner } from "../components/CookieConsentBanner";
import { RememberedCustomerBanner } from "../components/RememberedCustomerBanner";
import { useCustomerCookie } from "../hooks/useCustomerCookie";
import { formatPrice, getDisplayPrice, buildWhatsAppUrl, buildOrderMessage } from "../utils/constants";
import { submitOrder } from "../utils/api";

type Step = "form" | "confirm";

export function CheckoutPage() {
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const { config } = useSiteConfig();
  const { showConsent, savedCustomer, ready, acceptConsent, declineConsent, saveCustomer, clearSavedCustomer } = useCustomerCookie();
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showReminder, setShowReminder] = useState(true);

  useEffect(() => {
    if (savedCustomer) {
      setName(savedCustomer.name);
      setPhone(savedCustomer.phone);
    }
  }, [savedCustomer]);

  const whatsappMessage = buildOrderMessage(cart, cartTotal, `${config.brand_name} ${config.brand_accent}`);
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage, config.whatsapp_number);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Veuillez entrer votre nom.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = cart.map((item) => ({
        id: item.id,
        title: item.name,
        quantity: item.qty,
        price: getDisplayPrice(item),
      }));

      const msgToSend = buildOrderMessage(cart, cartTotal, `${config.brand_name} ${config.brand_accent}`);
      const urlToSend = buildWhatsAppUrl(msgToSend, config.whatsapp_number);

      const result = await submitOrder(payload, cartTotal, msgToSend, name, phone);
      setOrderId(result.order_id);

      const consentCookie = document.cookie.includes("bethel-consent=true");
      if (consentCookie && result.customer_id) {
        saveCustomer({ customer_id: result.customer_id, name, phone });
      }

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#19B000", "#000000", "#F5F1EA", "#25D366"],
      });

      clearCart();

      setTimeout(() => window.open(urlToSend, "_blank"), 300);
      setStep("confirm");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la commande. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0 && step === "form") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F5F1EA" }}>
        <div className="text-center max-w-sm">
          <ShoppingBag size={56} strokeWidth={1.2} color="#19B000" opacity={0.3} className="mx-auto mb-4" />
          <h1
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
          >
            Votre panier est vide
          </h1>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white"
            style={{
              background: "#19B000",
              borderRadius: "0.5rem",
              textDecoration: "none",
              fontFamily: "Montserrat, sans-serif",
              boxShadow: "0 4px 16px rgba(25,176,0,0.3)",
            }}
          >
            <ArrowLeft size={14} /> Retour au menu
          </Link>
        </div>
        <CookieConsentBanner visible={showConsent} onAccept={acceptConsent} onDecline={declineConsent} />
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F5F1EA" }}>
        <motion.div
          className="w-full max-w-md p-5 sm:p-8 text-center"
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "1rem",
            border: "1px solid rgba(25,176,0,0.2)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
          }}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.15 }}
          >
            <CheckCircle size={64} color="#19B000" strokeWidth={1.5} className="mx-auto mb-4" />
          </motion.div>

          <motion.h1
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Commande confirmée !
          </motion.h1>

          {orderId && (
            <p className="text-sm mb-4" style={{ color: "#6B6357", fontFamily: "Open Sans, sans-serif" }}>
              N° de commande : <span style={{ color: "#19B000", fontWeight: 700 }}>#{orderId}</span>
            </p>
          )}

          <p
            className="text-sm mb-6"
            style={{ color: "#333333", fontFamily: "Open Sans, sans-serif" }}
          >
            Votre commande a été enregistrée. Un message WhatsApp s'est ouvert pour finaliser la commande avec notre équipe.
          </p>

          <div className="flex flex-col gap-3">
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white"
              style={{
                background: "#25D366",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontFamily: "Montserrat, sans-serif",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.35 }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle size={16} /> Rouvrir WhatsApp
            </motion.a>
            {orderId && (
              <motion.a
                href={`/ticket/${orderId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 text-sm font-semibold"
                style={{
                  background: "#F5F1EA",
                  color: "#000000",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(0,0,0,0.1)",
                  textDecoration: "none",
                  fontFamily: "Montserrat, sans-serif",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.35 }}
                whileTap={{ scale: 0.97 }}
              >
                <Download size={16} /> Télécharger le ticket
              </motion.a>
            )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.35 }}
            >
            <Link
              to="/"
              className="flex items-center justify-center gap-2 py-3 text-sm font-semibold"
              style={{
                background: "#000000",
                color: "#FFFFFF",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              <ArrowLeft size={16} /> Retour au menu
            </Link>
            </motion.div>
          </div>
        </motion.div>
        <CookieConsentBanner visible={showConsent} onAccept={acceptConsent} onDecline={declineConsent} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F5F1EA" }}>
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6"
          style={{ color: "#6B6357", fontFamily: "Open Sans, sans-serif", textDecoration: "none" }}
        >
          <ArrowLeft size={14} /> Retour au menu
        </Link>

        <h1
          className="text-2xl font-bold mb-6"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
        >
          Finaliser la commande
        </h1>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="flex-1">
            {ready && savedCustomer && showReminder && (
              <RememberedCustomerBanner
                customer={savedCustomer}
                onDismiss={() => setShowReminder(false)}
                onClear={() => { clearSavedCustomer(); setName(""); setPhone(""); }}
              />
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div
                  className="p-3 text-sm font-semibold text-white"
                  style={{ background: "#DC2626", borderRadius: "0.5rem" }}
                >
                  {error}
                </div>
              )}

              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                >
                  Votre nom *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Utilisateur non défini"
                  className="w-full px-3 py-2.5 text-sm outline-none"
                  style={{
                    border: "1px solid rgba(0,0,0,0.12)",
                    borderRadius: "0.5rem",
                    background: "#FFFFFF",
                    fontFamily: "Open Sans, sans-serif",
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                >
                  Telephone *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: 690 000 000"
                  className="w-full px-3 py-2.5 text-sm outline-none"
                  style={{
                    border: "1px solid rgba(0,0,0,0.12)",
                    borderRadius: "0.5rem",
                    background: "#FFFFFF",
                    fontFamily: "Open Sans, sans-serif",
                  }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 w-full py-3.5 text-sm font-semibold text-white"
                style={{
                  background: submitting ? "#6B6357" : "#19B000",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  boxShadow: submitting ? "none" : "0 8px 32px rgba(25,176,0,0.35)",
                }}
              >
                <MessageCircle size={18} />
                {submitting ? "Envoi en cours…" : `Confirmer — ${formatPrice(cartTotal)}`}
              </motion.button>
            </form>
          </div>

          <div className="w-full lg:w-72 lg:flex-shrink-0">
            <div
              className="p-4"
              style={{
                background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "0.75rem",
                backdropFilter: "blur(8px)",
              }}
            >
              <h3
                className="text-sm font-semibold mb-3"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
              >
                Récapitulatif ({cartCount} article{cartCount > 1 ? "s" : ""})
              </h3>
              <div className="flex flex-col gap-2 mb-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 flex-shrink-0 overflow-hidden"
                      style={{ borderRadius: "0.375rem" }}
                    >
                      <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-semibold leading-tight truncate"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "#6B6357", fontFamily: "Open Sans, sans-serif" }}
                      >
                        x{item.qty}
                      </p>
                    </div>
                    <span
                      className="text-xs font-semibold flex-shrink-0"
                      style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}
                    >
                      {formatPrice(getDisplayPrice(item) * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="flex justify-between items-center pt-3"
                style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
              >
                <span
                  className="font-semibold text-sm"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Total
                </span>
                <span
                  className="text-lg font-bold"
                  style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
                >
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CookieConsentBanner visible={showConsent} onAccept={acceptConsent} onDecline={declineConsent} />
    </div>
  );
}
