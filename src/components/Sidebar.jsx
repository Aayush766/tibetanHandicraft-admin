import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Squares2X2Icon,
  SwatchIcon,
  CubeIcon,
  EnvelopeIcon,
  MapPinIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

// Import your logo - ensure the path to your assets is correct
import logo from "../assets/logo.png"; 

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const allItems = [
    { name: "Overview", icon: Squares2X2Icon, path: "/admin-dashboard" },
    { name: "Hero CMS", icon: SwatchIcon, path: "/hero-admin" },
    { name: "Product Studio", icon: CubeIcon, path: "/studio" },
    { name: "Inquiries", icon: EnvelopeIcon, path: "/admin-inquiries", badge: 1 },
    { name: "Showcase", icon: SwatchIcon, path: "/admin-product-showcase" },
    { name: "Testimonials", icon: SwatchIcon, path: "/admin-testimonials" },
    { name: "About", icon: SwatchIcon, path: "/admin-about" },
    { name: "Contact Settings", icon: MapPinIcon, path: "/admin-contact-settings" },
    { name: "Footer", icon: Squares2X2Icon, path: "/admin-footer" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Example cleanup
    navigate("/admin-login");
  };

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;

    return (
      <div
        onClick={() => navigate(item.path)}
        className={`group flex items-center justify-between px-4 py-3 cursor-pointer rounded-xl transition-all duration-300 mb-1 ${
          isActive
            ? "bg-emerald-500 text-white shadow-[0_10px_20px_-5px_rgba(16,185,129,0.4)]"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <div className="flex items-center gap-4">
          <item.icon
            className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
              isActive ? "text-white" : "text-slate-500 group-hover:text-emerald-400"
            }`}
          />
          <span className="text-[14px] font-semibold font-['Inter'] tracking-wide">
            {item.name}
          </span>
        </div>
        {item.badge && (
          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              isActive ? "bg-white text-emerald-600" : "bg-emerald-500 text-white"
            }`}
          >
            {item.badge}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-[280px] h-screen bg-slate-900 flex flex-col fixed left-0 top-0 z-50 border-r border-slate-800 shadow-2xl">
      
      {/* Brand Logo Section */}
      <div className="p-10 flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden p-1">
            {/* Logo Image Rendering */}
            <img 
              src={logo} 
              alt="Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          {/* Subtle glow effect behind logo */}
          <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-10 -z-10"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-white leading-none tracking-tighter">
            TBH CMS
          </span>
          <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em] mt-1">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-6 space-y-1 overflow-y-auto custom-scrollbar pt-2">
        {allItems.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-6">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full bg-slate-800 text-slate-300 hover:bg-red-500 hover:text-white px-4 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border border-slate-700 hover:border-red-400 active:scale-95 shadow-lg"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;