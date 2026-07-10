import { Cookie } from "lucide-react";

interface CookieConsentBannerProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function CookieConsentBanner({ visible, onAccept, onDecline }: CookieConsentBannerProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-sm p-6"
        style={{
          background: "rgba(255,255,255,0.98)",
          borderRadius: "1rem",
          border: "1px solid rgba(25,176,0,0.2)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
        }}
      >
        <div className="flex items-start gap-3 mb-4">
          <Cookie size={28} color="#19B000" className="flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-semibold"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
            >
              Cookies de mémorisation
            </p>
            <p
              className="text-xs mt-2"
              style={{ color: "#6B6357", fontFamily: "Open Sans, sans-serif", lineHeight: 1.5 }}
            >
              Ce site utilise un cookie pour enregistrer vos nom et téléphone. Cela nous permet de vous reconnaître lors de vos prochaines commandes et de mieux suivre votre fidélité.
            </p>
            <p
              className="text-xs mt-2"
              style={{ color: "#9B9385", fontFamily: "Open Sans, sans-serif" }}
            >
              Vous pouvez refuser à tout moment.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAccept}
            className="flex-1 py-2.5 text-sm font-semibold"
            style={{
              background: "#19B000",
              border: "none",
              borderRadius: "0.375rem",
              fontFamily: "Montserrat, sans-serif",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            Accepter
          </button>
          <button
            onClick={onDecline}
            className="flex-1 py-2.5 text-sm font-semibold"
            style={{
              background: "transparent",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: "0.375rem",
              color: "#6B6357",
              fontFamily: "Montserrat, sans-serif",
              cursor: "pointer",
            }}
          >
            Refuser
          </button>
        </div>
      </div>
    </div>
  );
}
