import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "border-2 border-foreground shadow-cel-4",
        style: {
          fontFamily: "Nunito, sans-serif",
          fontWeight: 700,
          background: "#F4F1EA",
          color: "#1D1D1D",
          border: "2px solid #1D1D1D",
          boxShadow: "4px 4px 0 #1D1D1D",
          borderRadius: 0,
        },
      }}
      closeButton
      richColors={false}
    />
  );
}
