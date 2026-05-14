import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { LayoutDashboard, Package, MessageSquare, Image, FileText, LogOut } from "lucide-react";

const navItems = [
  { label: "dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "products", href: "/admin/products", icon: Package },
  { label: "pages", href: "/admin/pages", icon: FileText },
  { label: "quotes", href: "/admin/quotes", icon: MessageSquare },
  { label: "images", href: "/admin/images", icon: Image },
];

const navLabelMap: Record<string, string> = {
  "/admin": "dashboard",
  "/admin/products": "products",
  "/admin/pages": "pages",
  "/admin/quotes": "quotes",
  "/admin/images": "images",
};

interface AdminLayoutProps {
  children?: ReactNode;
}

function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [locked]);
}

function useFocusTrap(ref: React.RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    el.addEventListener("keydown", onTab);
    return () => el.removeEventListener("keydown", onTab);
  }, [ref, active]);
}

function useSwipeToClose(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    let startX = 0;
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && dx < -40) {
        onClose();
      }
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [ref, onClose, enabled]);
}

function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close sidebar" : "Open sidebar"}
      className="relative w-9 h-9 flex items-center justify-center -ml-2 text-white/50 hover:text-white transition-colors"
    >
      <span className="sr-only">{open ? "Close sidebar" : "Open sidebar"}</span>
      <span className="flex flex-col items-center justify-center w-5 h-5" aria-hidden="true">
        <span
          className={`block w-5 h-px bg-current rounded-full transition-all duration-200 ease-out-strong origin-center ${
            open ? "translate-y-0 rotate-45" : "-translate-y-1.5"
          }`}
        />
        <span
          className={`block w-5 h-px bg-current rounded-full transition-all duration-200 ease-out-strong ${
            open ? "opacity-0 scale-x-0" : "opacity-100"
          }`}
        />
        <span
          className={`block w-5 h-px bg-current rounded-full transition-all duration-200 ease-out-strong origin-center ${
            open ? "translate-y-0 -rotate-45" : "translate-y-1.5"
          }`}
        />
      </span>
    </button>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((p) => !p), []);

  useBodyLock(sidebarOpen);
  useFocusTrap(sidebarRef, sidebarOpen);
  useSwipeToClose(sidebarRef, closeSidebar, sidebarOpen);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen, closeSidebar]);

  const currentPageLabel = navLabelMap[pathname];

  return (
    <div className="min-h-[100dvh] bg-surface-container-low flex">
      <div
        className={`fixed inset-0 bg-inverse-surface/50 z-30 md:hidden transition-opacity duration-250 ease-out-strong ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside
        ref={sidebarRef}
        role="dialog"
        aria-modal={sidebarOpen || undefined}
        aria-label={t("admin.sidebarNav")}
        className={`
          fixed md:static inset-y-0 start-0 z-40 w-64 flex flex-col
          bg-pyramid-navy
          transition-transform duration-250 ease-out-strong
          ${sidebarOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          <Link
            to="/admin"
            className="flex items-center gap-2.5"
            onClick={closeSidebar}
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
            onClick={closeSidebar}
            aria-label={t("admin.closeSidebar")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5" aria-label={t("admin.navigation")}>
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={closeSidebar}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium min-h-11 overflow-hidden
                  transition-all duration-200 ease-out
                  will-change-transform
                  ${sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"}
                  ${active
                    ? "bg-primary text-white"
                    : "text-white/55 hover:bg-white/10 hover:text-white/90"
                  }`}
                style={{ transitionDelay: sidebarOpen ? `${80 + i * 40}ms` : "0ms" }}
              >
                <span
                  className={`absolute start-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-e-full bg-white
                    transition-all duration-200 ease-out
                    ${active ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}
                  aria-hidden="true"
                />
                <Icon className="w-4 h-4 shrink-0 relative" />
                <span className="relative">{t(`admin.${item.label}`)}</span>
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
            <button className="flex items-center gap-2 px-3 py-2 w-full text-white/40 hover:text-white/80 hover:bg-white/8 rounded-lg transition-colors duration-150 text-xs min-h-11">
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
          <MenuButton open={sidebarOpen} onClick={toggleSidebar} />
          <span className="text-white/90 font-semibold text-sm">
            {currentPageLabel ? t(`admin.${currentPageLabel}`) : t("admin.title")}
          </span>
        </div>
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
