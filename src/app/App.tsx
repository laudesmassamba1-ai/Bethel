import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AnimatePresence, motion } from "motion/react";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SiteConfigProvider } from "./context/SiteConfigContext";
import { CategoriesProvider } from "./context/CategoriesContext";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { RootLayout } from "./layouts/RootLayout";
import type { MenuItem } from "./utils/constants";
import { useCart } from "./context/CartContext";

const HomePage = lazy(() => import("./pages/HomePage").then((m) => ({ default: m.HomePage })));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage").then((m) => ({ default: m.CheckoutPage })));
const LoginPage = lazy(() => import("./pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const AdminPage = lazy(() => import("./pages/AdminPage").then((m) => ({ default: m.AdminPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));

function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#FAFAF8" }}>
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full" style={{ border: "3px solid rgba(25,176,0,0.1)" }} />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "3px solid transparent",
            borderTopColor: "#19B000",
            borderRightColor: "#19B000",
            animation: "spin 0.8s cubic-bezier(0.68,-0.55,0.27,1.55) infinite",
          }}
        />
      </div>
      <p className="text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "Montserrat, sans-serif", color: "#19B000" }}>
        Chargement
      </p>
    </div>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<HomePageWrapper />} />
            <Route path="/checkout" element={<RootLayout hideNav hideFooter><CheckoutPage /></RootLayout>} />
            <Route path="/login" element={<RootLayout hideNav hideFooter><LoginPage /></RootLayout>} />
            <Route path="/dashboard" element={<RootLayout hideNav hideFooter><AdminPage /></RootLayout>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );
}

function HomePageWrapper() {
  const { addToCart } = useCart();

  return (
    <RootLayout>
      <HomePage onAddToCart={(item: MenuItem) => addToCart(item)} />
    </RootLayout>
  );
}

function SEOHead() {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#19B000" />
      <meta name="description" content="Bethel Grill - Commandez vos plats en ligne. Des saveurs authentiques." />
      <meta property="og:title" content="Bethel Grill - Restaurant en ligne" />
      <meta property="og:description" content="Commandez vos plats préférés en ligne. Livraison rapide." />
      <meta property="og:type" content="website" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://bethelgrill.com" />
    </Helmet>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <SiteConfigProvider>
            <CartProvider>
              <AuthProvider>
                <CategoriesProvider>
                  <SEOHead />
                  <AnimatedRoutes />
                </CategoriesProvider>
              </AuthProvider>
            </CartProvider>
          </SiteConfigProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>
  );
}
