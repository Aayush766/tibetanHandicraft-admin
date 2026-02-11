import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Components & Pages
import HeroAdmin from "./components/Hero";
import ProductStudio from "./components/ProductStudio";
import AdminLogin from "./pages/AdminLogin";
import AdminInquiries from "./pages/AdminInquiries";
import AdminContactSettings from "./pages/AdminContactSettings";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminProductShowcase from "./pages/AdminProductShowcase";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminFooter from "./pages/AdminFooter";
import AdminAbout from "./pages/AdminAbout";

// Updated: Using AdminDashboard instead of Dashboard
import AdminDashboard from "./pages/AdminDashboard";

// Layout
import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Route: No Sidebar --- */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* --- Protected Admin Routes: Shared Sidebar via AdminLayout --- */}
        <Route
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          {/* The /admin-dashboard path now correctly renders 
              the AdminDashboard component (with the grid cards). 
          */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          
          <Route path="/hero-admin" element={<HeroAdmin />} />
          <Route path="/studio" element={<ProductStudio />} />
          <Route path="/admin-inquiries" element={<AdminInquiries />} />
          <Route path="/admin-contact-settings" element={<AdminContactSettings />} />
          <Route path="/admin-product-showcase" element={<AdminProductShowcase />} />
          <Route path="/admin-footer" element={<AdminFooter />} />
          <Route path="/admin-about" element={<AdminAbout />} />
          <Route path="/admin-testimonials" element={<AdminTestimonials />} />
        </Route>

        {/* --- Fallbacks --- */}
        <Route path="/" element={<Navigate to="/admin-login" />} />
        <Route path="*" element={<Navigate to="/admin-login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;