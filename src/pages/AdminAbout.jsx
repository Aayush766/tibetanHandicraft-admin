import { useEffect, useState } from "react";
import axios from "axios";

/* ================= PREVIEW (NO PageBanner) ================= */

function AboutPreview({ data }) {
  if (!data) return null;

  return (
    <div className="bg-[#fcfaf7] scale-[0.78] origin-top font-sans border rounded-3xl overflow-hidden shadow-2xl">

      {/* Banner */}
      <div className="relative h-[260px] w-full overflow-hidden">
        <img src={data.banner.image} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-5xl font-serif mb-3">{data.banner.title}</h1>
          <p className="text-xs uppercase tracking-[0.4em] opacity-80">
            {data.banner.breadcrumb}
          </p>
        </div>
      </div>

      {/* Intro */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-16 grid grid-cols-12 gap-16">
          <div className="col-span-5 space-y-8">
            <span className="text-[10px] uppercase tracking-[0.5em] text-amber-700 font-bold">
              {data.intro.tag}
            </span>

            <h2 className="text-6xl font-serif leading-[1.1]">
              {data.intro.heading1}<br />
              <span className="italic">{data.intro.heading2}</span>
            </h2>

            <p className="text-stone-600">{data.intro.para1}</p>
            <p className="text-stone-600">{data.intro.para2}</p>

            <a href={data.intro.buttonLink} className="px-10 py-5 bg-black text-white inline-block">
              {data.intro.buttonText}
            </a>
          </div>

          <div className="col-span-7 grid grid-cols-12 gap-4">
            <div className="col-span-8 relative aspect-[4/5] overflow-hidden">
              <img src={data.images.main} className="w-full h-full object-cover" />
            </div>

            <div className="col-span-4 space-y-4">
              <div className="relative aspect-square overflow-hidden">
                <img src={data.images.square} className="w-full h-full object-cover" />
              </div>

              <div className="bg-amber-700 p-8 text-white">
                <h4 className="text-4xl italic">{data.experience.years}</h4>
                <p className="text-[9px] uppercase tracking-widest">
                  {data.experience.label}
                </p>
              </div>
            </div>

            <div className="col-span-10 col-start-3 relative h-48 overflow-hidden">
              <img src={data.images.wide} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-stone-900 text-white py-24 text-center">
        <h3 className="text-5xl italic font-serif max-w-4xl mx-auto">
          "{data.philosophy.quote}"
        </h3>
      </section>
    </div>
  );
}

/* ================= ADMIN CMS ================= */

export default function AdminAbout() {
  const [data, setData] = useState(null);

  const fetchData = () => {
    axios.get("http://localhost:5000/api/about").then((res) => {
      setData(res.data);
    });
  };

  useEffect(fetchData, []);

  const handleChange = (path, value) => {
    const keys = path.split(".");
    const copy = { ...data };
    let cur = copy;

    keys.forEach((k, i) => {
      if (i === keys.length - 1) cur[k] = value;
      else cur = cur[k];
    });

    setData(copy);
  };

  const save = async () => {
    await axios.put("http://localhost:5000/api/about", data);
    alert("Saved");
  };

  const reset = async () => {
    if (!confirm("Reset to default?")) return;
    await axios.post("http://localhost:5000/api/about/reset");
    fetchData();
  };

  if (!data) return <div className="p-20">Loading...</div>;

  return (
    <div className="grid grid-cols-12 min-h-screen bg-[#f3f3f3]">
      
      {/* LEFT SIDE — FORM */}
      <div className="col-span-5 p-12 space-y-10 overflow-y-auto h-screen bg-white border-r">

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-serif italic">About CMS</h1>
          <div className="flex gap-4">
            <button onClick={reset} className="text-xs uppercase">Reset</button>
            <button onClick={save} className="bg-black text-white px-6 py-2">Save</button>
          </div>
        </div>

        <Section title="Banner">
          <Input label="Title" value={data.banner.title}
            onChange={(v)=>handleChange("banner.title",v)} />
          <Input label="Breadcrumb" value={data.banner.breadcrumb}
            onChange={(v)=>handleChange("banner.breadcrumb",v)} />
          <Input label="Image URL" value={data.banner.image}
            onChange={(v)=>handleChange("banner.image",v)} />
        </Section>

        <Section title="Intro">
          <Input label="Tag" value={data.intro.tag}
            onChange={(v)=>handleChange("intro.tag",v)} />
          <Input label="Heading 1" value={data.intro.heading1}
            onChange={(v)=>handleChange("intro.heading1",v)} />
          <Input label="Heading 2" value={data.intro.heading2}
            onChange={(v)=>handleChange("intro.heading2",v)} />
          <Textarea label="Paragraph 1" value={data.intro.para1}
            onChange={(v)=>handleChange("intro.para1",v)} />
          <Textarea label="Paragraph 2" value={data.intro.para2}
            onChange={(v)=>handleChange("intro.para2",v)} />
          <Input label="Button Text" value={data.intro.buttonText}
            onChange={(v)=>handleChange("intro.buttonText",v)} />
          <Input label="Button Link" value={data.intro.buttonLink}
            onChange={(v)=>handleChange("intro.buttonLink",v)} />
        </Section>

        <Section title="Images">
          <Input label="Main Image" value={data.images.main}
            onChange={(v)=>handleChange("images.main",v)} />
          <Input label="Square Image" value={data.images.square}
            onChange={(v)=>handleChange("images.square",v)} />
          <Input label="Wide Image" value={data.images.wide}
            onChange={(v)=>handleChange("images.wide",v)} />
        </Section>

        <Section title="Experience">
          <Input label="Years" value={data.experience.years}
            onChange={(v)=>handleChange("experience.years",v)} />
          <Input label="Label" value={data.experience.label}
            onChange={(v)=>handleChange("experience.label",v)} />
        </Section>

        <Section title="Philosophy">
          <Textarea label="Quote" value={data.philosophy.quote}
            onChange={(v)=>handleChange("philosophy.quote",v)} />
        </Section>

      </div>

      {/* RIGHT SIDE — LIVE PREVIEW */}
      <div className="col-span-7 flex items-start justify-center p-10 overflow-auto">
        <AboutPreview data={data} />
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

const Textarea = ({ label, value, onChange }) => (
  <div>
    <label className="block text-[10px] uppercase text-stone-500 mb-1">{label}</label>
    <textarea
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border p-2 rounded-lg"
    />
  </div>
);
