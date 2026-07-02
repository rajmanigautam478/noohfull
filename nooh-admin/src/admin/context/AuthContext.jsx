/**
 * AuthContext.jsx
 * ---------------------------------------------------------------------------
 * Minimal admin authentication.
 *
 * IMPORTANT: The credential check below is a placeholder so the panel is
 * usable immediately. It is NOT secure for production — anyone who reads
 * your bundled JS can see the password. Replace `login()` with a real call
 * to your backend (e.g. POST /api/auth/login) that returns a signed JWT.
 * Everything else (context, ProtectedRoute, logout) stays the same.
 */
import { createContext, useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const AuthContext = createContext(null);
const TOKEN_KEY = "nooh_admin_token";

// Placeholder credentials — move to backend before going live.
const DEMO_ADMIN = { email: "admin@noohliving.com", password: "nooh@admin123" };

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  async function login(email, password) {
    // --- Replace this block with a real API call ---
    await new Promise((res) => setTimeout(res, 300));
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      const fakeToken = btoa(`${email}:${Date.now()}`);
      setToken(fakeToken);
      return { ok: true };
    }
    return { ok: false, error: "Invalid email or password." };
    // --- End replace ---
  }

  function logout() {
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
}
