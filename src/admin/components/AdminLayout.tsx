import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { LayoutDashboard, Package, MessageSquare, Image, LogOut, Factory, Menu, X } from "lucide-react";

const navItems = [
  { label: "dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "products", href: "/admin/products", icon: Package },
  { label: "quotes", href: "/admin/quotes", icon: MessageSquare },
  { label: "images", href: "/admin/images", icon: Image },
];

export function AdminLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40 w-64 bg-surface border-r border-outline-variant flex flex-col
          transition-transform duration-200 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-outline-variant">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors duration-200"
            onClick={() => setSidebarOpen(false)}
          >
            <Factory className="w-5 h-5" />
            <span className="font-headline-md text-lg font-semibold">{t("admin.title")}</span>
          </Link>
          <button
            className="md:hidden text-on-surface-variant hover:text-on-surface p-1"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 font-body-sm text-body-sm transition-colors duration-150 ${
                  active
                    ? "bg-primary-container text-on-primary-container font-semibold border-r-2 border-primary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t(`admin.${item.label}`)}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-outline-variant">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center text-sm font-semibold">
              {user?.firstName?.charAt(0) ?? "A"}
            </div>
            <div className="text-sm">
              <p className="font-medium text-on-surface">{user?.fullName ?? t("admin.title")}</p>
              <p className="text-on-surface-variant text-xs">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
          <SignOutButton>
            <button className="flex items-center gap-2 px-2 py-2 w-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors duration-150 text-sm">
              <LogOut className="w-4 h-4" />
              {t("admin.signOut")}
            </button>
          </SignOutButton>
        </div>
      </aside>

      <main className="flex-1 overflow-auto min-w-0">
        <div className="sticky top-0 z-20 md:hidden bg-surface border-b border-outline-variant px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="text-on-surface-variant hover:text-on-surface p-1"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-headline-md text-base font-semibold text-on-surface">{t("admin.title")}</span>
        </div>
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
