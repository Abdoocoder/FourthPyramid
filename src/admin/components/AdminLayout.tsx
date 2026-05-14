import { useState, useEffect, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { LayoutDashboard, Package, MessageSquare, Image, FileText, LogOut, Menu, X } from "lucide-react";

const navItems = [
  { label: "dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "products", href: "/admin/products", icon: Package },
  { label: "pages", href: "/admin/pages", icon: FileText },
  { label: "quotes", href: "/admin/quotes", icon: MessageSquare },
  { label: "images", href: "/admin/images", icon: Image },
];

interface AdminLayoutProps {
  children?: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40 w-64 flex flex-col
          bg-pyramid-navy
          transition-transform duration-200 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        aria-label={t("admin.sidebarNav")}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          <Link
            to="/admin"
            className="flex items-center gap-2.5"
            onClick={() => setSidebarOpen(false)}
          >
            <img
              src="/logo.svg"
              alt="Fourth Pyramid"
              className="h-7 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <span className="text-white/90 font-semibold text-sm tracking-wide">
              {t("admin.title")}
            </span>
          </Link>
          <button
            className="md:hidden text-white/40 hover:text-white p-1.5 rounded transition-colors"
            onClick={() => setSidebarOpen(false)}
            aria-label={t("admin.closeSidebar")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5" aria-label={t("admin.navigation")}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  active
                    ? "bg-primary text-white"
                    : "text-white/55 hover:bg-white/10 hover:text-white/90"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {t(`admin.${item.label}`)}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-white shrink-0">
              {user?.firstName?.charAt(0) ?? "A"}
            </div>
            <div className="min-w-0">
              <p className="text-white/90 text-sm font-medium truncate">
                {user?.fullName ?? t("admin.title")}
              </p>
              <p className="text-white/35 text-xs truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          <SignOutButton>
            <button className="flex items-center gap-2 px-3 py-2 w-full text-white/40 hover:text-white/80 hover:bg-white/8 rounded-lg transition-colors duration-150 text-xs">
              <LogOut className="w-3.5 h-3.5" />
              {t("admin.signOut")}
            </button>
          </SignOutButton>
        </div>
      </aside>

      <main
        className="flex-1 overflow-auto min-w-0"
        inert={sidebarOpen || undefined}
      >
        <div className="sticky top-0 z-20 md:hidden bg-pyramid-navy px-4 h-14 flex items-center gap-3 border-b border-white/10">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label={t("admin.openSidebar")}
            className="text-white/50 hover:text-white p-2 -ml-2 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-white/90 font-semibold text-sm">{t("admin.title")}</span>
        </div>
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
