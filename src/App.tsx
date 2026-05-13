import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./i18n/config";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { IndustriesPage } from "./pages/IndustriesPage";
import { RequestQuotePage } from "./pages/RequestQuotePage";
import { ContactPage } from "./pages/ContactPage";
import { ProtectedRoute } from "./admin/components/ProtectedRoute";
import { AdminLayout } from "./admin/components/AdminLayout";
import { DashboardPage } from "./admin/pages/DashboardPage";
import { AdminProductsPage } from "./admin/pages/AdminProductsPage";
import { AdminQuotesPage } from "./admin/pages/AdminQuotesPage";
import { AdminImagesPage } from "./admin/pages/AdminImagesPage";

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
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailsPage />} />
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/request-quote" element={<RequestQuotePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="quotes" element={<AdminQuotesPage />} />
          <Route path="images" element={<AdminImagesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
