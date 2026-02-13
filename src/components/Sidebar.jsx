import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Squares2X2Icon,
  SwatchIcon,
  CubeIcon,
  EnvelopeIcon,
  MapPinIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import logo from "../assets/logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuGroups = [
    {
      group: "Core",
      items: [
        { name: "Overview", icon: Squares2X2Icon, path: "/admin-dashboard" },
        { name: "Inquiries", icon: EnvelopeIcon, path: "/admin-inquiries", badge: 1 },
      ]
    },
    {
      group: "Inventory",
      items: [
        { name: "Product Studio", icon: CubeIcon, path: "/studio" },
        { name: "Listed Products", icon: CubeIcon, path: "/admin-products" },
      ]
    },
    {
      group: "Content CMS",
      items: [
        { name: "Hero CMS", icon: SwatchIcon, path: "/hero-admin" },
        { name: "Showcase", icon: SparklesIcon, path: "/admin-product-showcase" },
        { name: "Testimonials", icon: SwatchIcon, path: "/admin-testimonials" },
        { name: "About", icon: SwatchIcon, path: "/admin-about" },
      ]
    },
    {
      group: "System",
      items: [
        { name: "Contact Settings", icon: MapPinIcon, path: "/admin-contact-settings" },
        { name: "Footer", icon: Squares2X2Icon, path: "/admin-footer" },
      ]
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;

    return (
      <div
        onClick={() => navigate(item.path)}
        className={`group flex items-center justify-between px-4 py-3 cursor-pointer rounded-xl transition-all duration-300 mb-1.5 relative overflow-hidden ${
          isActive
            ? "bg-emerald-500 text-white shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)]"
            : "text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1"
        }`}
      >
        {/* Active Glow Decor */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent pointer-events-none" />
        )}
        
        <div className="flex items-center gap-4 z-10">
          <item.icon
            className={`w-5 h-5 transition-all duration-300 ${
              isActive ? "text-white scale-110" : "text-slate-500 group-hover:text-emerald-400"
            }`}
          />
          <span className="text-[13px] font-bold tracking-wide">
            {item.name}
          </span>
        </div>

        {item.badge && (
          <span className={`z-10 text-[9px] font-black px-2 py-0.5 rounded-full ring-2 ${
              isActive ? "bg-white text-emerald-600 ring-emerald-400" : "bg-emerald-500 text-white ring-slate-900"
            }`}>
            {item.badge}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-[280px] h-screen bg-[#0f172a] flex flex-col fixed left-0 top-0 z-50 border-r border-slate-800/50 shadow-2xl">
      
      {/* Brand Section */}
      <div className="p-8 pb-10 flex items-center gap-4">
        <div className="relative group">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl overflow-hidden p-1.5 transition-transform duration-500 group-hover:rotate-12">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 -z-10 group-hover:opacity-40 transition-opacity"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black text-white leading-tight tracking-tighter">
            TIBETAN<br/>HANDICRAFT
          </span>
          <span className="text-[9px] text-emerald-500 font-black uppercase tracking-[0.3em] mt-0.5">
            Admin Portal
          </span>
        </div>
      </div>

      {/* Navigation - Hidden Scrollbar Logic */}
      <nav className="flex-1 px-4 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <p className="px-4 text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-3">
              {group.group}
            </p>
            {group.items.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
        ))}
      </nav>

      {/* Logout Footer */}
      <div className="p-6 bg-slate-900/50 backdrop-blur-md">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full bg-slate-800/50 text-slate-400 hover:bg-red-500 hover:text-white px-4 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 border border-slate-700/50 hover:border-red-400 shadow-inner group"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Log Out System
        </button>
      </div>
    </div>
  );
};

export default Sidebar;