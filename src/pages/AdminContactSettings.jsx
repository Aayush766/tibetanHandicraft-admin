"use client";

import { useEffect, useState } from "react";
import { API } from "../api";
import { 
  Phone, 
  Mail, 
  MapPin, 
  ChevronDown, 
  Globe, 
  Save, 
  Loader2, 
  RotateCcw, 
  Plus, 
  Trash2 
} from "lucide-react";

/**
 * DEFAULT DATA
 * Extracted from your original static ContactSection
 */
const DEFAULT_SETTINGS = {
  phone: "+91 98765 43210",
  email: "studio@tibetanarts.com",
  locationText: "Bodh Gaya, India",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14457.777478696808!2d84.98184515!3d24.69510165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f32c3f30960557%3A0x6e949829f03a6285!2sBodh%20Gaya%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  inquiryTypes: ["Tibetan Jewellery", "Traditional Handicrafts", "Wholesale & Archive"]
};

/**
 * PREVIEW COMPONENT
 */
function ContactPreview({ data }) {
  return (
    <div className="w-full bg-[#fcfaf7] py-12 border rounded-xl overflow-hidden shadow-inner pointer-events-none select-none scale-[0.85] origin-top">
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative bg-white shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-stone-100">
          
          <div className="w-full lg:w-[60%] p-10 space-y-8">
            <header className="space-y-3">
              <span className="text-[9px] uppercase tracking-[0.4em] text-amber-700 font-bold">Inquiry</span>
              <h2 className="text-3xl font-serif text-stone-900 leading-tight">
                Get in <span className="italic font-light text-stone-500">Touch</span>
              </h2>
            </header>

            <div className="grid grid-cols-2 gap-4">
              <div className="border-b border-stone-200 pb-2 text-stone-300 text-xs">Your Name *</div>
              <div className="border-b border-stone-200 pb-2 text-stone-300 text-xs">Email Address *</div>
            </div>

            <div className="relative border-b border-stone-200 pb-2 text-stone-400 text-xs flex justify-between items-center">
               <span>Nature of Inquiry</span>
               <ChevronDown size={12} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-50">
              <div className="space-y-1">
                <Phone size={14} className="text-amber-700" />
                <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Phone</p>
                <p className="text-stone-800 text-[11px] font-medium truncate">{data.phone || "---"}</p>
              </div>
              <div className="space-y-1">
                <Mail size={14} className="text-amber-700" />
                <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Email</p>
                <p className="text-stone-800 text-[11px] font-medium truncate">{data.email || "---"}</p>
              </div>
              <div className="space-y-1">
                <MapPin size={14} className="text-amber-700" />
                <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Studio</p>
                <p className="text-stone-800 text-[11px] font-medium truncate">{data.locationText || "---"}</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[40%] min-h-[300px] bg-stone-100 flex items-center justify-center relative">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-700 z-10" />
            {data.mapEmbedUrl ? (
              <iframe
                src={data.mapEmbedUrl}
                className="absolute inset-0 w-full h-full border-0 grayscale"
                title="Map Preview"
              />
            ) : (
              <div className="text-stone-400 text-xs text-center p-4">
                <Globe size={24} className="mx-auto mb-2 opacity-20" />
                No Map URL set
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * MAIN ADMIN COMPONENT
 */
export default function AdminContactSettings() {
  const [form, setForm] = useState({
    phone: "",
    email: "",
    locationText: "",
    mapEmbedUrl: "",
    inquiryTypes: []
  });
  
  const [newType, setNewType] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Use absolute URL to fix the 404 issue you encountered
  const BASE_URL = "http://localhost:5000/api/contact";

  useEffect(() => {
    API.get(`${BASE_URL}/settings`)
      .then(res => {
        if (res.data) setForm(res.data);
      })
      .catch((err) => {
        console.error("Fetch failed, loading defaults", err);
        setForm(DEFAULT_SETTINGS);
      })
      .finally(() => setFetching(false));
  }, []);

  const handleInputChange = (field, value) => {
    if (field === "mapEmbedUrl" && value.includes("<iframe")) {
      const match = value.match(/src="([^"]+)"/);
      if (match) value = match[1];
    }
    setForm({ ...form, [field]: value });
  };

  const addInquiryType = () => {
    if (!newType.trim()) return;
    setForm({ ...form, inquiryTypes: [...form.inquiryTypes, newType.trim()] });
    setNewType("");
  };

  const removeInquiryType = (index) => {
    setForm({ ...form, inquiryTypes: form.inquiryTypes.filter((_, i) => i !== index) });
  };

  const handleReset = () => {
    if (window.confirm("Reset all fields to original defaults? (Changes won't save until you click Save Changes)")) {
      setForm(DEFAULT_SETTINGS);
    }
  };

  const save = async () => {
    setLoading(true);
    try {
      await API.post(`${BASE_URL}/settings`, form, { withCredentials: true });
      alert("Contact settings updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving settings. Ensure backend is running at :5000");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-stone-500 italic font-serif">Loading configuration...</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* LEFT: Editor Panel */}
      <div className="w-full lg:w-[450px] p-8 border-r border-stone-100 flex flex-col h-screen overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-serif italic text-stone-900">Contact Setup</h1>
          <p className="text-xs text-stone-400 mt-1">Manage public contact details and form categories.</p>
        </div>

        <div className="space-y-6 flex-grow">
          {/* Information Fields */}
          {[
            { id: "phone", label: "Phone Number", icon: <Phone size={14} /> },
            { id: "email", label: "Public Email", icon: <Mail size={14} /> },
            { id: "locationText", label: "Display Location", icon: <MapPin size={14} /> },
            { id: "mapEmbedUrl", label: "Google Map URL", icon: <Globe size={14} /> }
          ].map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-500">
                {field.icon} {field.label}
              </label>
              <input
                value={form[field.id] || ""}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="w-full border border-stone-200 p-3 rounded-lg text-sm bg-stone-50 focus:bg-white focus:ring-1 focus:ring-amber-700 transition-all outline-none"
              />
            </div>
          ))}

          {/* Inquiry Types Manager */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 flex items-center gap-2">
               <ChevronDown size={14} /> Inquiry Categories
            </label>
            <div className="flex gap-2">
              <input 
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="Add e.g. 'Wholesale'"
                className="flex-grow border border-stone-200 p-2 rounded-lg text-sm outline-none focus:border-amber-700"
                onKeyPress={(e) => e.key === 'Enter' && addInquiryType()}
              />
              <button 
                onClick={addInquiryType} 
                className="p-2 bg-stone-900 text-white rounded-lg hover:bg-amber-800 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {form.inquiryTypes?.map((type, i) => (
                <span key={i} className="flex items-center gap-2 bg-amber-50 text-amber-900 px-3 py-1.5 rounded-full text-[11px] font-medium border border-amber-100 group">
                  {type}
                  <button onClick={() => removeInquiryType(i)} className="text-amber-300 hover:text-red-600 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-4 bg-stone-100 text-stone-500 py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-red-50 hover:text-red-600 transition-all"
            title="Reset to Defaults"
          >
            <RotateCcw size={18} />
          </button>
          
          <button
            onClick={save}
            disabled={loading}
            className="flex-grow flex items-center justify-center gap-2 bg-stone-900 text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-amber-800 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* RIGHT: Live Preview Panel */}
      <div className="flex-grow bg-[#fcfaf7] overflow-y-auto p-12 hidden md:block">
        <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto border-b border-stone-200 pb-4">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400">Live Component Preview</span>
          <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
          </div>
        </div>
        
        <ContactPreview data={form} />
        
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white border border-stone-100 rounded-xl">
           <h4 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-4">Map Integration Tip</h4>
           <p className="text-xs text-stone-500 leading-relaxed">
             Go to Google Maps, click <strong>Share</strong>, then <strong>Embed a map</strong>. 
             Simply copy the HTML and paste it into the "Google Map URL" field above. 
             The system will automatically extract the clean source link for you.
           </p>
        </div>
      </div>
    </div>
  );
}