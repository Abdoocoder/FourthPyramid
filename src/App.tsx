import { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./i18n/config";
import { Layout } from "./components/layout/Layout";

const HomePage = lazy(() => import("./pages/HomePage").then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const ProductsPage = lazy(() => import("./pages/ProductsPage").then((m) => ({ default: m.ProductsPage })));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage").then((m) => ({ default: m.ProductDetailsPage })));
const IndustriesPage = lazy(() => import("./pages/IndustriesPage").then((m) => ({ default: m.IndustriesPage })));
const RequestQuotePage = lazy(() => import("./pages/RequestQuotePage").then((m) => ({ default: m.RequestQuotePage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const AdminShell = lazy(() => import("./admin/components/AdminShell"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center pt-32 pb-section-gap">
      <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
    </div>
  );
}

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

function DirectionSetter() {
  const { i18n } = useTranslation();
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <DirectionSetter />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Lazy><HomePage /></Lazy>} />
          <Route path="/about" element={<Lazy><AboutPage /></Lazy>} />
          <Route path="/products" element={<Lazy><ProductsPage /></Lazy>} />
          <Route path="/products/:slug" element={<Lazy><ProductDetailsPage /></Lazy>} />
          <Route path="/industries" element={<Lazy><IndustriesPage /></Lazy>} />
          <Route path="/request-quote" element={<Lazy><RequestQuotePage /></Lazy>} />
          <Route path="/contact" element={<Lazy><ContactPage /></Lazy>} />
        </Route>

        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div className="min-h-screen bg-surface-container-low flex items-center justify-center"><div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" /></div>}>
              <AdminShell />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
