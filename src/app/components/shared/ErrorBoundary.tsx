import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary a capturé:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F5F1EA" }}>
          <div className="text-center max-w-sm">
            <h1
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#000000" }}
            >
              Une erreur est survenue
            </h1>
            <p className="text-sm mb-4" style={{ color: "#6B6357", fontFamily: "Open Sans, sans-serif" }}>
              {this.state.error?.message || "Erreur inattendue"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 text-sm font-semibold text-white"
              style={{
                background: "#19B000",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                boxShadow: "0 4px 16px rgba(25,176,0,0.3)",
              }}
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
