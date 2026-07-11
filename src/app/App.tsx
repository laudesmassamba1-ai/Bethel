import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { Helmet, HelmetProvider } from "react-helmet-async";
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

function SuspenseFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F1EA" }}>
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "#19B000", borderTopColor: "transparent" }} />
    </div>
  );
}

function HomePageWrapper() {
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const { addToCart } = useCart();

  return (
    <RootLayout hideNav hideFooter>
      <HomePage
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onAddToCart={(item: MenuItem) => addToCart(item)}
      />
    </RootLayout>
  );
}

function SEOHead() {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <meta name="theme-color" content="#19B000" />
      <meta name="description" content="Bethel Grill - Commandez vos grillades en ligne. Des saveurs authentiques." />
      <meta property="og:title" content="Bethel Grill - Restaurant en ligne" />
      <meta property="og:description" content="Commandez vos plats préférés en ligne. Livraison rapide." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/dist/assets/og-image.png" />
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
                  <Suspense fallback={<SuspenseFallback />}>
                    <Routes>
                      <Route path="/" element={<HomePageWrapper />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/dashboard" element={<AdminPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                </CategoriesProvider>
              </AuthProvider>
            </CartProvider>
          </SiteConfigProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>
  );
}
