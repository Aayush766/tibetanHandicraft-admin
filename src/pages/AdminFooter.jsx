import { useEffect, useState } from "react";
import axios from "axios";

/* ================= FOOTER PREVIEW ================= */

function FooterPreview({ data }) {
  if (!data) return null;

  const currentYear = new Date().getFullYear();

  return (
    <div className="scale-[0.8] origin-top border rounded-3xl overflow-hidden shadow-2xl">
      <footer className="w-full bg-[#fcfaf7] border-t border-stone-200 relative overflow-hidden font-sans">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 pt-20 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">

            {/* BRAND */}
            <div className="lg:col-span-4 space-y-8">
              <div className="relative w-[180px] h-[100px]">
                <img
                  src="/logo.png"
                  className="object-contain w-full h-full"
                />
              </div>

              <p className="text-stone-500 text-lg leading-relaxed max-w-sm">
                {data.brandText}
              </p>

              <div className="flex gap-6">
                {Object.entries(data.socials).map(([key, val]) => (
                  <a
                    key={key}
                    href={val}
                    target="_blank"
                    className="text-[10px] uppercase tracking-[0.2em] text-stone-400 hover:text-amber-700"
                  >
                    {key}
                  </a>
                ))}
              </div>
            </div>

            {/* STATIC BLOCKS (same as client) */}
            <div className="lg:col-span-2 space-y-8">
              <h4 className="text-[11px] uppercase tracking-[0.4em] font-semibold">Links</h4>
              <ul className="space-y-4 text-sm text-stone-500">
                <li>Home</li>
                <li>Products</li>
                <li>Our Story</li>
                <li>Contact</li>
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <h4 className="text-[11px] uppercase tracking-[0.4em] font-semibold">Help</h4>
              <ul className="space-y-4 text-sm text-stone-500">
                <li>Payment Options</li>
                <li>Returns</li>
                <li>Privacy Policies</li>
              </ul>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <h4 className="text-[11px] uppercase tracking-[0.4em] font-semibold">Newsletter</h4>
              <div className="border-b py-3 text-sm text-stone-400">
                ENTER YOUR EMAIL ADDRESS
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-stone-200 text-center text-[10px] uppercase text-stone-400">
            &copy; {currentYear} The Cyber Loom. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ================= ADMIN CMS ================= */

export default function AdminFooter() {
  const [data, setData] = useState(null);

  const fetchData = () => {
    axios.get("http://localhost:5000/api/footer")
      .then(res => setData(res.data));
  };

  useEffect(fetchData, []);

  const save = async () => {
    await axios.put("http://localhost:5000/api/footer", data);
    alert("Saved");
  };

  const reset = async () => {
    if (!confirm("Reset footer to default?")) return;
    await axios.post("http://localhost:5000/api/footer/reset");
    fetchData();
  };

  if (!data) return <div className="p-20">Loading...</div>;

  return (
    <div className="grid grid-cols-12 min-h-screen bg-[#f3f3f3]">

      {/* LEFT — CMS */}
      <div className="col-span-5 p-12 bg-white border-r space-y-10 overflow-y-auto h-screen">

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-serif italic">Footer CMS</h1>
          <div className="flex gap-4">
            <button onClick={reset} className="text-xs uppercase">Reset</button>
            <button onClick={save} className="bg-black text-white px-6 py-2">Save</button>
          </div>
        </div>

        {/* Brand Text */}
        <Section title="Brand Description">
          <textarea
            value={data.brandText}
            onChange={e => setData({ ...data, brandText: e.target.value })}
            className="w-full border p-3 rounded-xl"
            rows={4}
          />
        </Section>

        {/* Social Links */}
        <Section title="Social Links">
          {Object.keys(data.socials).map(key => (
            <Input
              key={key}
              label={key}
              value={data.socials[key]}
              onChange={(v) =>
                setData({
                  ...data,
                  socials: { ...data.socials, [key]: v }
                })
              }
            />
          ))}
        </Section>

      </div>

      {/* RIGHT — LIVE PREVIEW */}
      <div className="col-span-7 flex items-start justify-center p-10 overflow-auto">
        <FooterPreview data={data} />
      </div>
    </div>
  );
}

/* ========== UI ========== */

const Section = ({ title, children }) => (
  <div className="bg-stone-50 p-6 rounded-2xl border space-y-4">
    <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400">{title}</h2>
    {children}
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="block text-[10px] uppercase text-stone-500 mb-1">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border p-2 rounded-lg"
    />
  </div>
);
