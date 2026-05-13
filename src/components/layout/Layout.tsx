import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1 pt-20" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
