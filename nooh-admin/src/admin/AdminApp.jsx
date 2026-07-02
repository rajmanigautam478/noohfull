import { Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "./context/AuthContext";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Products from "./pages/Products";
import Projects from "./pages/Projects";
import Testimonials from "./pages/Testimonials";
import Inquiries from "./pages/Inquiries";
import HeroBanner from "./pages/HeroBanner";
import Settings from "./pages/Settings";
import "./styles/admin.css";

/**
 * AdminApp
 * ---------------------------------------------------------------------------
 * Drop this into your existing router like so (in your main App.jsx):
 *
 *   import AdminApp from "./admin/AdminApp";
 *   ...
 *   <Route path="/admin/*" element={<AdminApp />} />
 *
 * Everything under /admin — login, dashboard, and every management page —
 * is self-contained inside this one component, so it won't interfere with
 * your existing public-site routes or styles.
 */
export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="services" element={<Services />} />
          <Route path="products" element={<Products />} />
          <Route path="projects" element={<Projects />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="hero-banner" element={<HeroBanner />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
