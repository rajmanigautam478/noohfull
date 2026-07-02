import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const TITLES = {
  "/admin": "Dashboard",
  "/admin/services": "Services",
  "/admin/products": "Products",
  "/admin/projects": "Projects",
  "/admin/testimonials": "Testimonials",
  "/admin/inquiries": "Contact Inquiries",
  "/admin/hero-banner": "Hero Banner",
  "/admin/settings": "Settings",
};

function titleFor(pathname) {
  if (TITLES[pathname]) return TITLES[pathname];
  const base = "/" + pathname.split("/").slice(1, 3).join("/");
  return TITLES[base] || "Admin";
}

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="nooh-admin">
      <div className="admin-shell">
        <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
        <div className="admin-main">
          <Topbar title={titleFor(pathname)} onMenuClick={() => setMenuOpen((o) => !o)} />
          <main className="admin-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
