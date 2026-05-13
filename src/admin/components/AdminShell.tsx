import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminLayout } from "./AdminLayout";

const DashboardPage = lazy(() => import("../pages/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const AdminProductsPage = lazy(() => import("../pages/AdminProductsPage").then((m) => ({ default: m.AdminProductsPage })));
const AdminProductFormPage = lazy(() => import("../pages/AdminProductFormPage").then((m) => ({ default: m.AdminProductFormPage })));
const AdminPagesPage = lazy(() => import("../pages/AdminPagesPage").then((m) => ({ default: m.AdminPagesPage })));
const AdminQuotesPage = lazy(() => import("../pages/AdminQuotesPage").then((m) => ({ default: m.AdminQuotesPage })));
const AdminImagesPage = lazy(() => import("../pages/AdminImagesPage").then((m) => ({ default: m.AdminImagesPage })));

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AdminRoutes() {
  return (
    <Suspense fallback={<div className="animate-pulse text-on-surface-variant p-8">Loading...</div>}>
      <Routes>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductFormPage />} />
        <Route path="products/edit/:id" element={<AdminProductFormPage />} />
        <Route path="pages" element={<AdminPagesPage />} />
        <Route path="quotes" element={<AdminQuotesPage />} />
        <Route path="images" element={<AdminImagesPage />} />
      </Routes>
    </Suspense>
  );
}

export default function AdminShell() {
  const content = (
    <AdminLayout>
      <AdminRoutes />
    </AdminLayout>
  );

  const wrapped = clerkKey ? (
    <ClerkProvider publishableKey={clerkKey}>
      <ProtectedRoute>{content}</ProtectedRoute>
    </ClerkProvider>
  ) : (
    <ProtectedRoute>{content}</ProtectedRoute>
  );

  return wrapped;
}
