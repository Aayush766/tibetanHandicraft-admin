import { useEffect, useState } from "react";
import axios from "axios";

/* ================= DEFAULT DATA ================= */

const DEFAULT_ABOUT_DATA = {
  banner: { title: "Our Heritage", breadcrumb: "About", image: "/contact-banner.png" },
  intro: {
    tag: "Since 1984",
    heading1: "Preserving the",
    heading2: "Sacred Craft",
    para1: "Rooted in the high plateaus of Tibet, our collective was born from a desire to keep the ancient traditions of metalwork and sacred symbolism alive in a modern world.",
    para2: "Every piece in our collection is more than just an object; it is a vessel of spirituality, handcrafted by artisans who have spent decades perfecting the delicate balance between raw earth and divine form.",
    buttonText: "Explore the Collection",
    buttonLink: "/products",
  },
  images: { main: "/decore.png", square: "/Bowl.png", wide: "/Bowl.png" },
  experience: { years: "40+", label: "Years of Craft" },
  philosophy: {
    quote: "We do not just sell jewellery; we archive the soul of Tibet.",
    blocks: [
      { title: "Authenticity", text: "Every stone and metal is ethically sourced." },
      { title: "Tradition", text: "Using techniques passed down through generations." },
      { title: "Impact", text: "10% of proceeds support education." },
    ],
  },
};

/* ================= ADMIN CMS MAIN ================= */

export default function AdminAbout() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Data from Backend
  const fetchData = () => {
    axios.get("http://localhost:5000/api/about")
      .then((res) => setData(res.data || DEFAULT_ABOUT_DATA))
      .catch(() => setData(DEFAULT_ABOUT_DATA));
  };

  useEffect(fetchData, []);

  // 2. Handle Text Changes
  const handleChange = (path, value) => {
    const keys = path.split(".");
    const copy = JSON.parse(JSON.stringify(data));
    let cur = copy;
    keys.forEach((k, i) => {
      if (i === keys.length - 1) cur[k] = value;
      else cur = cur[k];
    });
    setData(copy);
  };

  // 3. Handle Cloudinary Uploads
  const handleUpload = async (path, file) => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData);
      handleChange(path, res.data.url); // Updates path with Cloudinary URL
    } catch (err) {
      alert("Upload failed. Check backend/Cloudinary logs.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Save to Database
  const save = async () => {
    try {
      await axios.put("http://localhost:5000/api/about", data);
      alert("Changes saved to database!");
    } catch (err) {
      alert("Error saving data");
    }
  };

  // 5. Reset to Default
  const reset = async () => {
    if (!confirm("Reset to default? This will overwrite existing data.")) return;
    setData(DEFAULT_ABOUT_DATA);
    await axios.put("http://localhost:5000/api/about", DEFAULT_ABOUT_DATA);
  };

  if (!data) return <div className="p-20 text-center font-serif italic text-2xl">Loading...</div>;

  return (
    <div className="grid grid-cols-12 min-h-screen bg-[#f3f3f3]">
      {/* LEFT SIDE — FORM */}
      <div className="col-span-5 p-12 space-y-10 overflow-y-auto h-screen bg-white border-r">
        <div className="flex justify-between items-center border-b pb-6">
          <h1 className="text-3xl font-serif italic">About Page CMS</h1>
          <div className="flex gap-4">
            <button onClick={reset} className="text-[10px] uppercase font-bold tracking-widest text-red-500 hover:text-red-700">Reset</button>
            <button 
              onClick={save} 
              disabled={loading}
              className="bg-stone-900 text-white px-8 py-2 rounded-full text-xs uppercase tracking-widest hover:bg-amber-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Save Changes"}
            </button>
          </div>
        </div>

        <Section title="Header Banner">
          <Input label="Title" value={data.banner.title} onChange={(v) => handleChange("banner.title", v)} />
          <ImageUpload 
            label="Banner Image" 
            value={data.banner.image} 
            onUpload={(file) => handleUpload("banner.image", file)} 
          />
        </Section>

        <Section title="Intro Content">
          <Input label="Tagline" value={data.intro.tag} onChange={(v) => handleChange("intro.tag", v)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Heading 1" value={data.intro.heading1} onChange={(v) => handleChange("intro.heading1", v)} />
            <Input label="Heading 2" value={data.intro.heading2} onChange={(v) => handleChange("intro.heading2", v)} />
          </div>
          <Textarea label="Paragraph 1" value={data.intro.para1} onChange={(v) => handleChange("intro.para1", v)} />
          <Textarea label="Paragraph 2" value={data.intro.para2} onChange={(v) => handleChange("intro.para2", v)} />
        </Section>

        <Section title="Visual Assets">
          <div className="space-y-6">
            <ImageUpload label="Main Vertical" value={data.images.main} onUpload={(file) => handleUpload("images.main", file)} />
            <ImageUpload label="Square Detail" value={data.images.square} onUpload={(file) => handleUpload("images.square", file)} />
            <ImageUpload label="Wide Detail" value={data.images.wide} onUpload={(file) => handleUpload("images.wide", file)} />
          </div>
        </Section>

        <Section title="Philosophy Blocks">
          <Textarea label="Main Quote" value={data.philosophy.quote} onChange={(v) => handleChange("philosophy.quote", v)} />
          <div className="space-y-6 pt-4 border-t">
            {data.philosophy.blocks.map((block, idx) => (
              <div key={idx} className="p-4 bg-white border rounded-lg space-y-2 shadow-sm">
                <p className="text-[9px] font-bold text-amber-700 uppercase">Block {idx + 1}</p>
                <Input label="Title" value={block.title} onChange={(v) => handleChange(`philosophy.blocks.${idx}.title`, v)} />
                <Textarea label="Text" value={block.text} onChange={(v) => handleChange(`philosophy.blocks.${idx}.text`, v)} />
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* RIGHT SIDE — LIVE PREVIEW */}
      <div className="col-span-7 flex items-start justify-center p-10 overflow-auto bg-stone-200 shadow-inner">
        <AboutPreview data={data} />
      </div>
    </div>
  );
}

/* ========== UI COMPONENTS ========== */

const Section = ({ title, children }) => (
  <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4">
    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">{title}</h2>
    {children}
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div className="w-full">
    <label className="block text-[9px] uppercase font-bold text-stone-500 mb-1 ml-1">{label}</label>
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border bg-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amber-600 transition-all shadow-sm"
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div className="w-full">
    <label className="block text-[9px] uppercase font-bold text-stone-500 mb-1 ml-1">{label}</label>
    <textarea
      rows={3}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border bg-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amber-600 transition-all shadow-sm"
    />
  </div>
);

const ImageUpload = ({ label, value, onUpload }) => (
  <div className="space-y-2">
    <label className="block text-[9px] uppercase font-bold text-stone-500 ml-1">{label}</label>
    <div className="flex items-center gap-4 p-3 border rounded-xl bg-stone-50">
      {value && <img src={value} alt="Preview" className="w-12 h-12 object-cover rounded border bg-white" />}
      <div className="flex-1 overflow-hidden">
        <p className="text-[10px] text-stone-400 truncate">{value || "No image uploaded"}</p>
      </div>
      <label className="cursor-pointer bg-white border border-stone-300 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-stone-100 transition-colors">
        UPLOAD
        <input type="file" className="hidden" accept="image/*" onChange={(e) => onUpload(e.target.files[0])} />
      </label>
    </div>
  </div>
);

/* ================= PREVIEW COMPONENT ================= */

function AboutPreview({ data }) {
  if (!data) return null;

  return (
    <div className="bg-[#fcfaf7] scale-[0.78] origin-top font-sans border rounded-3xl overflow-hidden shadow-2xl min-w-[1000px]">
      <div className="relative h-[260px] w-full overflow-hidden bg-stone-200">
        <img src={data.banner.image} className="absolute inset-0 w-full h-full object-cover" alt="Banner" 
          onError={(e) => (e.target.src = "https://placehold.co/1200x400?text=Image+Not+Found")} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-5xl font-serif mb-3">{data.banner.title}</h1>
          <p className="text-xs uppercase tracking-[0.4em] opacity-80">{data.banner.breadcrumb}</p>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-16 grid grid-cols-12 gap-16">
          <div className="col-span-5 space-y-8">
            <span className="text-[10px] uppercase tracking-[0.5em] text-amber-700 font-bold">{data.intro.tag}</span>
            <h2 className="text-6xl font-serif leading-[1.1]">
              {data.intro.heading1} <br />
              <span className="italic">{data.intro.heading2}</span>
            </h2>
            <p className="text-stone-600 leading-relaxed">{data.intro.para1}</p>
            <p className="text-stone-600 leading-relaxed">{data.intro.para2}</p>
            <div className="px-10 py-5 bg-black text-white inline-block uppercase text-[10px] tracking-widest cursor-pointer">
              {data.intro.buttonText}
            </div>
          </div>

          <div className="col-span-7 grid grid-cols-12 gap-4">
            <div className="col-span-8 relative aspect-[4/5] overflow-hidden bg-stone-200">
              <img src={data.images.main} className="w-full h-full object-cover" alt="Main" />
            </div>
            <div className="col-span-4 space-y-4">
              <div className="relative aspect-square overflow-hidden bg-stone-200">
                <img src={data.images.square} className="w-full h-full object-cover" alt="Square" />
              </div>
              <div className="bg-amber-700 p-8 text-white">
                <h4 className="text-4xl italic">{data.experience.years}</h4>
                <p className="text-[9px] uppercase tracking-widest">{data.experience.label}</p>
              </div>
            </div>
            <div className="col-span-10 col-start-3 relative h-48 overflow-hidden bg-stone-200">
              <img src={data.images.wide} className="w-full h-full object-cover" alt="Wide" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-900 text-white py-24 px-10 text-center">
        <h3 className="text-4xl italic font-serif max-w-4xl mx-auto mb-16">"{data.philosophy.quote}"</h3>
        <div className="grid grid-cols-3 gap-10">
          {data.philosophy.blocks?.map((block, i) => (
            <div key={i} className="space-y-4">
              <h4 className="text-xl font-light">{block.title}</h4>
              <p className="text-stone-400 text-sm leading-relaxed">{block.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}