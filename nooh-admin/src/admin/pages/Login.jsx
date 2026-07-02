import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/admin.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/admin";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) navigate(redirectTo, { replace: true });
    else setError(res.error);
  }

  return (
    <div className="nooh-admin login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">
          N<span>O</span>OH
        </div>
        <div className="login-sub">Admin Panel</div>

        {error && <div className="login-error">{error}</div>}

        <div className="form-field" style={{ marginBottom: 14 }}>
          <label>Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@noohliving.com"
            required
          />
        </div>
        <div className="form-field">
          <label>Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <p className="login-hint">
          Demo credentials: admin@noohliving.com / nooh@admin123
          <br />
          Replace with real backend auth before launch.
        </p>
      </form>
    </div>
  );
}
