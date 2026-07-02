import { useAuth } from "../context/AuthContext";

export default function Topbar({ title, onMenuClick }) {
  const { logout } = useAuth();

  return (
    <header className="admin-topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          className="btn btn-outline btn-icon mobile-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          ☰
        </button>
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="user-pill">
        <div className="avatar">A</div>
        <div>
          <div style={{ fontWeight: 600 }}>Admin</div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={logout}>
          Log out
        </button>
      </div>
    </header>
  );
}
