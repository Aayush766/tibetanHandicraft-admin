import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SwatchIcon,
  CubeIcon,
  EnvelopeIcon,
  MapPinIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { Settings, LifeBuoy, LayoutDashboard } from "lucide-react";

// --- Sidebar Item Sub-component ---
const SidebarItem = ({ icon: Icon, label, path, active = false, badge = null, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between px-6 py-3 cursor-pointer transition-all duration-200
      ${active ? "text-[#10b981] bg-emerald-50 border-r-4 border-[#10b981]" : "text-[#1e293b] hover:bg-gray-50"}`}
  >
    <div className="flex items-center gap-4">
      <Icon
        size={22}
        className={`w-5 h-5 ${active ? "text-[#10b981]" : "text-[#1e293b]"}`}
        strokeWidth={2.5}
      />
      <span className="text-[16px] font-medium tracking-tight">{label}</span>
    </div>
    {badge && (
      <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold text-red-500 bg-red-100 rounded-full">
        {badge}
      </span>
    )}
  </div>
);

// --- Sidebar Component ---
const DashboardSidebar = ({ notifications, handleNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard Home", icon: LayoutDashboard, path: "/admin" }, // Added to go back to grid
    { label: "Hero Section CMS", icon: SwatchIcon, path: "/hero-admin" },
    { label: "Product Studio", icon: CubeIcon, path: "/studio" },
    { label: "Contact Inquiries", icon: EnvelopeIcon, path: "/admin-inquiries", badge: notifications > 0 ? notifications : null },
    { label: "Contact Settings", icon: MapPinIcon, path: "/admin-contact-settings" },
    { label: "Product Showcase CMS", icon: SwatchIcon, path: "/admin-product-showcase" },
    { label: "Testimonials CMS", icon: SwatchIcon, path: "/admin-testimonials" },
    { label: "Footer CMS", icon: Squares2X2Icon, path: "/admin-footer" },
    { label: "About Page CMS", icon: SwatchIcon, path: "/admin-about" },
  ];

  return (
    <div className="w-72 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 py-6 font-sans z-10">
      <div className="px-6 mb-8">
        <h1 className="text-xl font-bold text-stone-800 tracking-tighter">ZACK CMS</h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            active={location.pathname === item.path}
            onClick={() => handleNavigate(item.path)}
          />
        ))}
        <div className="my-4 border-t border-gray-100" />
        <SidebarItem icon={Settings} label="Settings" active={location.pathname === "/settings"} onClick={() => navigate("/settings")} />
        <SidebarItem icon={LifeBuoy} label="Help" active={location.pathname === "/help"} onClick={() => navigate("/help")} />
      </nav>
    </div>
  );
};

// --- Main Dashboard Component ---
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(1);

  const handleNavigate = (path) => {
    navigate(path);
    if (path === "/admin-inquiries") setNotifications(0);
  };

  const Card = ({ icon: Icon, title, desc, path }) => (
    <div
      onClick={() => handleNavigate(path)}
      className="cursor-pointer bg-white border border-stone-100 rounded-[2rem] p-8 text-center shadow-sm hover:shadow-xl transition-all hover:scale-[1.02] flex flex-col items-center justify-center group"
    >
      <Icon className="w-10 h-10 text-amber-700 mb-4 group-hover:scale-110 transition-transform" />
      <h2 className="text-xl font-serif italic text-stone-800">{title}</h2>
      <p className="text-stone-400 text-xs mt-3 leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FDFCFB]">
      {/* Sidebar Integration */}
      <DashboardSidebar notifications={notifications} handleNavigate={handleNavigate} />

      {/* Main Content Area - Shifted Right to accommodate Sidebar */}
      <main className="flex-1 ml-72 p-12">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold text-stone-800">Admin Control Center</h1>
          <p className="text-stone-500 mt-2">Manage your website content and digital assets.</p>
        </header>

        <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card icon={SwatchIcon} title="Hero Section CMS" desc="Manage homepage slides, text, styles and visuals" path="/hero-admin" />
          <Card icon={CubeIcon} title="Product Studio" desc="Manage products, gallery, pricing and metadata" path="/studio" />
          <Card icon={EnvelopeIcon} title="Contact Inquiries" desc="View and reply to customer inquiries" path="/admin-inquiries" />
          <Card icon={MapPinIcon} title="Contact Settings" desc="Edit phone, email, location and Google map" path="/admin-contact-settings" />
          <Card icon={SwatchIcon} title="Product Showcase" desc="Edit stacked gallery, text, button and visuals" path="/admin-product-showcase" />
          <Card icon={SwatchIcon} title="Testimonials" desc="Drag, resize and edit reviews visually" path="/admin-testimonials" />
          <Card icon={Squares2X2Icon} title="Footer CMS" desc="Edit socials, links, brand text and info" path="/admin-footer" />
          <Card icon={SwatchIcon} title="About Page CMS" desc="Edit heritage story, images and philosophy" path="/admin-about" />
        </div>
      </main>
    </div>
  );
}