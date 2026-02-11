import { useEffect, useState } from "react";
import { API } from "../api";
import { Phone, Mail, MapPin, ChevronDown, Globe, Save, Loader2 } from "lucide-react";

/**
 * PREVIEW COMPONENT
 * This renders inside the Admin page to show how the changes look.
 */
function ContactPreview({ data }) {
  return (
    <div className="w-full bg-[#fcfaf7] py-12 border rounded-xl overflow-hidden shadow-inner pointer-events-none select-none scale-[0.85] origin-top">
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative bg-white shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-stone-100">
          
          {/* Form Side Preview */}
          <div className="w-full lg:w-[60%] p-10 space-y-8">
            <header className="space-y-3">
              <span className="text-[9px] uppercase tracking-[0.4em] text-amber-700 font-bold">Inquiry</span>
              <h2 className="text-3xl font-serif text-stone-900 leading-tight">
                Get in <span className="italic font-light text-stone-500">Touch</span>
              </h2>
            </header>

            <div className="grid grid-cols-2 gap-4">
              <div className="border-b border-stone-200 pb-2 text-stone-300 text-xs">Name</div>
              <div className="border-b border-stone-200 pb-2 text-stone-300 text-xs">Email</div>
            </div>

            {/* Live Data Display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-50">
              <div className="space-y-1">
                <Phone size={14} className="text-amber-700" />
                <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Phone</p>
                <p className="text-stone-800 text-[11px] font-medium truncate">{data.phone || "+00 00000 00000"}</p>
              </div>
              <div className="space-y-1">
                <Mail size={14} className="text-amber-700" />
                <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Email</p>
                <p className="text-stone-800 text-[11px] font-medium truncate">{data.email || "studio@example.com"}</p>
              </div>
              <div className="space-y-1">
                <MapPin size={14} className="text-amber-700" />
                <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Studio</p>
                <p className="text-stone-800 text-[11px] font-medium truncate">{data.locationText || "City, Country"}</p>
              </div>
            </div>
          </div>

          {/* Map Side Preview */}
          <div className="w-full lg:w-[40%] min-h-[300px] bg-stone-100 flex items-center justify-center relative">
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
    mapEmbedUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    API.get("/contact/settings")
      .then(res => {
        if (res.data) setForm(res.data);
      })
      .finally(() => setFetching(false));
  }, []);

  const handleInputChange = (field, value) => {
    // If user pastes an iframe tag, extract the src URL automatically
    if (field === "mapEmbedUrl" && value.includes("<iframe")) {
      const match = value.match(/src="([^"]+)"/);
      if (match) value = match[1];
    }
    setForm({ ...form, [field]: value });
  };

  const save = async () => {
    setLoading(true);
    try {
      await API.post("/contact/settings", form, { withCredentials: true });
      alert("Contact settings updated successfully!");
    } catch (err) {
      alert("Error saving settings.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-stone-500 italic">Loading configuration...</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* LEFT: Editor Panel */}
      <div className="w-full lg:w-[400px] p-8 border-r border-stone-100 flex flex-col h-screen overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-serif italic text-stone-900">Contact Setup</h1>
          <p className="text-xs text-stone-400 mt-1">Updates the live contact page information.</p>
        </div>

        <div className="space-y-6 flex-grow">
          {[
            { id: "phone", label: "Phone Number", icon: <Phone size={14} />, placeholder: "+91..." },
            { id: "email", label: "Public Email", icon: <Mail size={14} />, placeholder: "studio@..." },
            { id: "locationText", label: "Display Location", icon: <MapPin size={14} />, placeholder: "Bodh Gaya, India" },
            { id: "mapEmbedUrl", label: "Google Map Embed URL", icon: <Globe size={14} />, placeholder: "https://google.com/maps/embed..." }
          ].map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-500">
                {field.icon} {field.label}
              </label>
              <input
                value={form[field.id] || ""}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full border border-stone-200 p-3 rounded-lg text-sm bg-stone-50 focus:bg-white focus:ring-1 focus:ring-amber-700 transition-all outline-none"
              />
            </div>
          ))}

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-[10px] text-amber-800 leading-relaxed">
              <strong>Tip:</strong> For the map, go to Google Maps → Share → Embed Map and paste the whole code. We'll extract the URL for you.
            </p>
          </div>
        </div>

        <button
          onClick={save}
          disabled={loading}
          className="mt-8 flex items-center justify-center gap-2 w-full bg-stone-900 text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-amber-800 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* RIGHT: Live Preview Panel */}
      <div className="flex-grow bg-[#fcfaf7] overflow-y-auto p-12">
        <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto border-b border-stone-200 pb-4">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400">Live Preview</span>
          <div className="flex gap-2">
             <div className="w-2 h-2 rounded-full bg-red-400" />
             <div className="w-2 h-2 rounded-full bg-amber-400" />
             <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
        </div>
        
        <ContactPreview data={form} />
      </div>
    </div>
  );
}