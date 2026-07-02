import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: "▢", end: true },
  { to: "/admin/services", label: "Services", icon: "✦" },
  { to: "/admin/products", label: "Products", icon: "◧" },
  { to: "/admin/projects", label: "Projects", icon: "◫" },
  { to: "/admin/testimonials", label: "Testimonials", icon: "❝" },
  { to: "/admin/inquiries", label: "Inquiries", icon: "✉" },
  { to: "/admin/hero-banner", label: "Hero Banner", icon: "▦" },
  { to: "/admin/settings", label: "Settings", icon: "⚙" },
];

export default function Sidebar({ open, onNavigate }) {
  return (
    <aside className={`admin-sidebar ${open ? "open" : ""}`}>
      <div className="brand">
        <div className="name">
          N<span>O</span>OH <span style={{ fontSize: 14 }}>Admin</span>
        </div>
        <div className="tag">Living Elevated</div>
      </div>
      <nav className="admin-nav">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="nav-link"
          style={{ fontSize: 12.5 }}
        >
          <span className="nav-icon">↗</span> View Live Site
        </a>
      </div>
    </aside>
  );
}
