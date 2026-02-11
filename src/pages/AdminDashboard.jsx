import React from "react";
import { useNavigate } from "react-router-dom";
import {
  SwatchIcon,
  CubeIcon,
  EnvelopeIcon,
  MapPinIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const Card = ({ icon: Icon, title, desc, path }) => (
    <div
      onClick={() => navigate(path)}
      className="group cursor-pointer bg-white border border-slate-100 rounded-[2rem] p-8 text-center shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300 hover:scale-[1.02] flex flex-col items-center justify-center"
    >
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
        <Icon className="w-8 h-8 text-slate-700 group-hover:text-emerald-600 transition-colors" />
      </div>
      <h2 className="text-xl font-serif italic text-slate-800">{title}</h2>
      <p className="text-slate-400 text-xs mt-3 leading-relaxed px-4">{desc}</p>
    </div>
  );

  return (
    <>
      <header className="mb-12">
        <h1 className="text-4xl font-semibold text-slate-900 tracking-tight">
          Admin Control Center
        </h1>
        <p className="text-slate-500 mt-3 text-lg font-light">
          Welcome back. Manage your digital footprint from one place.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card icon={SwatchIcon} title="Hero Section CMS" desc="Manage homepage slides, text, and visuals" path="/hero-admin" />
        <Card icon={CubeIcon} title="Product Studio" desc="Manage gallery, pricing and metadata" path="/studio" />
        <Card icon={EnvelopeIcon} title="Contact Inquiries" desc="View and reply to customer inquiries" path="/admin-inquiries" />
        <Card icon={MapPinIcon} title="Contact Settings" desc="Edit phone, email, and locations" path="/admin-contact-settings" />
        <Card icon={SwatchIcon} title="Product Showcase" desc="Edit stacked gallery and button visuals" path="/admin-product-showcase" />
        <Card icon={SwatchIcon} title="Testimonials" desc="Manage reviews and visual placement" path="/admin-testimonials" />
        <Card icon={Squares2X2Icon} title="Footer CMS" desc="Edit socials, links, and company info" path="/admin-footer" />
        <Card icon={SwatchIcon} title="About Page CMS" desc="Edit heritage story and images" path="/admin-about" />
      </div>
    </>
  );
};

export default AdminDashboard;