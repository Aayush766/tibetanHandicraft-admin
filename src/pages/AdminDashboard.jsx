import { useNavigate } from "react-router-dom";
import {
  SwatchIcon,
  CubeIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const Card = ({ icon: Icon, title, desc, path }) => (
    <div
      onClick={() => navigate(path)}
      className="cursor-pointer bg-white border border-stone-200 rounded-[2.5rem] p-10 text-center shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]"
    >
      <Icon className="w-12 h-12 mx-auto text-amber-700 mb-6" />
      <h2 className="text-3xl font-serif italic text-stone-800">{title}</h2>
      <p className="text-stone-400 text-sm mt-4">{desc}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center font-sans">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 p-10">
        
        <Card
          icon={SwatchIcon}
          title="Hero Section CMS"
          desc="Manage homepage slides, text, styles and visuals"
          path="/hero-admin"
        />

        <Card
          icon={CubeIcon}
          title="Product Studio"
          desc="Manage products, gallery, pricing and metadata"
          path="/studio"
        />

        <Card
          icon={EnvelopeIcon}
          title="Contact Inquiries"
          desc="View and reply to customer inquiries"
          path="/admin-inquiries"
        />

        <Card
          icon={MapPinIcon}
          title="Contact Settings"
          desc="Edit phone, email, location and Google map"
          path="/admin-contact-settings"
        />
        
      </div>
    </div>
  );
}
