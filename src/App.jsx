import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HeroAdmin from "./components/Hero";
import ProductStudio from "./components/ProductStudio";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminInquiries from "./pages/AdminInquiries";
import AdminContactSettings from "./pages/AdminContactSettings";

import AdminProtectedRoute from "./components/AdminProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* Hero CMS */}
        <Route
          path="/hero-admin"
          element={
            <AdminProtectedRoute>
              <HeroAdmin />
            </AdminProtectedRoute>
          }
        />

        {/* Product CMS */}
        <Route
          path="/studio"
          element={
            <AdminProtectedRoute>
              <ProductStudio />
            </AdminProtectedRoute>
          }
        />

        {/* Contact Inquiries (CRM) */}
        <Route
          path="/admin-inquiries"
          element={
            <AdminProtectedRoute>
              <AdminInquiries />
            </AdminProtectedRoute>
          }
        />

        {/* Contact Settings (Live Contact Page Control) */}
        <Route
          path="/admin-contact-settings"
          element={
            <AdminProtectedRoute>
              <AdminContactSettings />
            </AdminProtectedRoute>
          }
        />

        {/* Default */}
        <Route path="/" element={<Navigate to="/admin-login" />} />
        <Route path="*" element={<Navigate to="/admin-login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
