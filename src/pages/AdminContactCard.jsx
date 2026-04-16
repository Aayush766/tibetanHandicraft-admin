"use client";

import { useEffect, useState } from "react";
import { API } from "../api";
import { Phone, Mail, MapPin } from "lucide-react";

/* ================= DEFAULT FALLBACK ================= */
const DEFAULT_CONTACT_CARD = {
  phone: "+91 98765 43210",
  email: "info@yourbrand.com",
  locationText: "Jaipur, Rajasthan, India",
};

export default function AdminContactCard() {
  const [data, setData] = useState(DEFAULT_CONTACT_CARD);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCard();
  }, []);

  const fetchCard = async () => {
    try {
      const res = await API.get("/contact/card");
      if (res.data) setData(res.data);
    } catch {
      setData(DEFAULT_CONTACT_CARD);
    }
  };

  const save = async () => {
    try {
      setLoading(true);
      await API.put("/contact/card", data);
      alert("Contact Card Updated Successfully");
    } catch (err) {
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFCFB] overflow-hidden">
      
      {/* LEFT — EDITOR */}
      <div className="w-1/2 bg-white border-r p-10 overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 pb-6 border-b mb-8">
          <h1 className="text-2xl font-serif italic text-stone-900">
            Contact Card Editor
          </h1>
          {loading && (
            <p className="text-[10px] uppercase tracking-widest text-amber-700 animate-pulse mt-1">
              Saving changes…
            </p>
          )}
        </div>

        <div className="space-y-8">
          <Field
            label="Phone Number"
            value={data.phone}
            onChange={(v) => setData({ ...data, phone: v })}
          />

          <Field
            label="Email Address"
            value={data.email}
            onChange={(v) => setData({ ...data, email: v })}
          />

          <Textarea
            label="Location Text"
            value={data.locationText}
            onChange={(v) => setData({ ...data, locationText: v })}
          />

          <button
            onClick={save}
            disabled={loading}
            className="
              mt-6
              bg-stone-900 text-white
              px-8 py-3
              text-[10px] font-bold
              uppercase tracking-[0.4em]
              hover:bg-amber-900
              transition-colors
              disabled:bg-stone-300
            "
          >
            Save Contact Card
          </button>
        </div>
      </div>

      {/* RIGHT — LIVE PREVIEW */}
      <div className="w-1/2 bg-stone-100 flex items-center justify-center p-12">
        <ContactCardPreview data={data} />
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function Field({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
        {label}
      </p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full border p-3 rounded-lg
          bg-stone-50 text-sm
          focus:bg-white
          outline-none
          focus:ring-1 focus:ring-stone-300
        "
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
        {label}
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full border p-3 rounded-lg
          bg-stone-50 text-sm
          h-24 resize-none
          focus:bg-white
          outline-none
          focus:ring-1 focus:ring-stone-300
        "
      />
    </div>
  );
}

/* ================= LIVE PREVIEW ================= */

function ContactCardPreview({ data }) {
  return (
    <div className="bg-[#fcfaf7] w-[380px] p-10 shadow-2xl">
      <h2 className="text-2xl font-serif text-center mb-8">
        Concierge <br />
        <span className="italic text-stone-500 text-lg">
          Inquiry Service
        </span>
      </h2>

      <div className="space-y-6 text-sm">
        <PreviewItem icon={<Phone size={16} />} label="Phone" value={data.phone} />
        <PreviewItem icon={<Mail size={16} />} label="Email" value={data.email} />
        <PreviewItem icon={<MapPin size={16} />} label="Location" value={data.locationText} />
      </div>

      <button
        className="
          mt-8 w-full h-[56px]
          bg-stone-900 text-white
          text-[11px] font-bold
          uppercase tracking-[0.3em]
          hover:bg-amber-800
          transition-all
        "
      >
        Instant WhatsApp
      </button>
    </div>
  );
}

function PreviewItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-amber-700 mt-0.5">{icon}</div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
          {label}
        </p>
        <p className="text-stone-800 text-[13px] font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}
