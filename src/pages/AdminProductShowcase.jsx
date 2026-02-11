import { useEffect, useState } from "react";
import { API } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  PhotoIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";

/** * --- LIVE PREVIEW COMPONENT ---
 * A replica of your client-side slider that accepts 'data' props
 */
function ShowcasePreview({ data }) {
  const [active, setActive] = useState(0);
  const items = data.sliderItems || [];

  const getIndex = (offset) => {
    if (items.length === 0) return 0;
    return (active + offset + items.length) % items.length;
  };

  const cardVariants = {
    active: { x: 0, opacity: 1, scale: 1, left: "0%", zIndex: 30 },
    next: { x: 0, opacity: 1, scale: 0.85, left: "35%", zIndex: 20 },
    upcoming: { x: 0, opacity: 0.8, scale: 0.70, left: "65%", zIndex: 10 },
    enter: { x: 50, opacity: 0, scale: 0.6, left: "80%" },
    exit: { opacity: 0, zIndex: 0 },
  };

  return (
    <div className="w-full min-h-[600px] bg-[#fcfaf7] flex flex-col items-center justify-center p-4 overflow-hidden rounded-xl border shadow-inner">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-[35%_65%] gap-8 items-center">
        
        {/* LEFT TEXT PREVIEW */}
        <div className="space-y-4 text-left">
          <span className="text-amber-800 text-[8px] uppercase tracking-[0.5em] font-bold">
            {data.label || "Label"}
          </span>
          <h1 className="text-4xl font-serif font-bold text-stone-900 leading-tight whitespace-pre-line">
            {data.heading || "Heading"}
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed max-w-xs font-light">
            {data.description || "Description text goes here..."}
          </p>
          <button 
            style={{ backgroundColor: data.buttonBgColor, color: data.buttonTextColor }}
            className="px-6 py-3 text-[9px] font-bold uppercase tracking-widest transition-opacity"
          >
            {data.buttonText || "Button"}
          </button>
        </div>

        {/* RIGHT SLIDER PREVIEW */}
        <div className="relative h-[400px] w-full flex items-center">
          <AnimatePresence initial={false} mode="popLayout">
            {items.length > 0 ? [0, 1, 2].map((offset) => {
              const itemIndex = getIndex(offset);
              const item = items[itemIndex];
              if (!item) return null;

              let variantState = "enter";
              if (offset === 0) variantState = "active";
              else if (offset === 1) variantState = "next";
              else if (offset === 2) variantState = "upcoming";

              return (
                <motion.div
                  key={itemIndex}
                  variants={cardVariants}
                  initial="enter"
                  animate={variantState}
                  exit="exit"
                  className="absolute top-0 w-[240px] h-[320px] bg-white border-[6px] border-white shadow-lg overflow-hidden cursor-pointer"
                  onClick={() => setActive(itemIndex)}
                >
                  <img
                    src={item.image || "https://via.placeholder.com/400x600?text=No+Image"}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: item.imagePosition }}
                    alt=""
                  />
                  {offset === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm">
                       <p className="text-[7px] font-bold text-amber-800 uppercase tracking-widest">{item.category}</p>
                       <h3 className="text-lg font-serif text-stone-900">{item.title}</h3>
                    </div>
                  )}
                </motion.div>
              );
            }) : (
                <div className="w-full h-64 border-2 border-dashed flex items-center justify-center text-stone-400">
                    Add cards to see preview
                </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** * --- MAIN CMS PAGE ---
 */
export default function AdminProductShowcase() {
  const [data, setData] = useState(null);
  const [previewScale, setPreviewScale] = useState(0.8);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await API.get("http://localhost:5000/api/product-showcase");
    setData(res.data || {
      label: "", heading: "", description: "", buttonText: "", buttonLink: "",
      buttonTextColor: "#ffffff", buttonBgColor: "#000000", sliderItems: [],
    });
  };

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (idx, field, value) => {
    const items = [...(data.sliderItems || [])];
    items[idx] = { ...items[idx], [field]: value };
    setData({ ...data, sliderItems: items });
  };

  const addItem = () => {
    const items = data.sliderItems || [];
    setData({
      ...data,
      sliderItems: [...items, { category: "New", title: "Title", image: "", imagePosition: "center" }],
    });
  };

  const deleteItem = (idx) => {
    const items = data.sliderItems.filter((_, i) => i !== idx);
    setData({ ...data, sliderItems: items });
  };

  const uploadImage = async (e, idx) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    const res = await API.post("http://localhost:5000/api/products/upload", formData);
    handleItemChange(idx, "image", res.data.url);
  };

  const save = async () => {
    await API.put("http://localhost:5000/api/product-showcase", data);
    alert("Saved Successfully");
  };

  if (!data) return <div className="p-20 text-center italic">Loading CMS...</div>;

  return (
    <div className="flex h-screen bg-[#FDFCFB] overflow-hidden">
      
      {/* LEFT: EDITOR PANEL */}
      <div className="w-1/2 h-full overflow-y-auto border-r bg-white p-8">
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-white pb-4 z-10 border-b">
          <h1 className="text-2xl font-serif italic">Showcase Editor</h1>
          <div className="flex gap-3">
            <button onClick={fetchData} className="p-2 text-stone-400 hover:text-black"><ArrowPathIcon className="w-5" /></button>
            <button onClick={save} className="bg-black text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">Save All</button>
          </div>
        </div>

        <div className="space-y-12">
          {/* CONTENT SECTION */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">Main Content</h2>
            <div className="grid grid-cols-2 gap-4">
              <input value={data.label} onChange={(e) => handleChange("label", e.target.value)} placeholder="Label" className="border p-3 rounded-lg text-sm" />
              <input value={data.heading} onChange={(e) => handleChange("heading", e.target.value)} placeholder="Heading" className="border p-3 rounded-lg text-sm" />
            </div>
            <textarea value={data.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Description" className="w-full border p-3 rounded-lg text-sm h-24" />
            
            <div className="grid grid-cols-2 gap-4">
              <input value={data.buttonText} onChange={(e) => handleChange("buttonText", e.target.value)} placeholder="Button Text" className="border p-3 rounded-lg text-sm" />
              <div className="flex items-center gap-4 border p-2 rounded-lg">
                <div className="flex flex-col items-center">
                    <span className="text-[8px] uppercase font-bold">Text</span>
                    <input type="color" value={data.buttonTextColor} onChange={(e) => handleChange("buttonTextColor", e.target.value)} className="w-8 h-8 cursor-pointer" />
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[8px] uppercase font-bold">BG</span>
                    <input type="color" value={data.buttonBgColor} onChange={(e) => handleChange("buttonBgColor", e.target.value)} className="w-8 h-8 cursor-pointer" />
                </div>
              </div>
            </div>
          </section>

          {/* SLIDER ITEMS */}
          <section className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">Slider Cards ({data.sliderItems.length})</h2>
              <button onClick={addItem} className="text-amber-700 text-[10px] font-bold uppercase">+ Add Card</button>
            </div>

            <div className="space-y-4">
              {data.sliderItems.map((item, idx) => (
                <div key={idx} className="p-4 border rounded-xl bg-stone-50 space-y-4 relative group">
                  <button onClick={() => deleteItem(idx)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon className="w-4"/></button>
                  <div className="grid grid-cols-2 gap-3">
                    <input value={item.category} onChange={(e) => handleItemChange(idx, "category", e.target.value)} placeholder="Category" className="border p-2 rounded text-xs" />
                    <input value={item.title} onChange={(e) => handleItemChange(idx, "title", e.target.value)} placeholder="Title" className="border p-2 rounded text-xs" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-12 h-12 bg-white border border-dashed rounded flex items-center justify-center cursor-pointer overflow-hidden">
                        {item.image ? <img src={item.image} className="object-cover w-full h-full" /> : <PhotoIcon className="w-4 text-stone-300"/>}
                        <input type="file" hidden onChange={(e) => uploadImage(e, idx)} />
                    </label>
                    <input value={item.imagePosition} onChange={(e) => handleItemChange(idx, "imagePosition", e.target.value)} placeholder="Image Pos (e.g. center)" className="flex-1 border p-2 rounded text-xs" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* RIGHT: PREVIEW PANEL */}
      <div className="w-1/2 h-full bg-stone-100 p-12 overflow-y-auto">
        <div className="sticky top-0 z-10 flex justify-center gap-4 mb-6">
            <button onClick={() => setPreviewScale(0.6)} className="p-2 bg-white rounded-lg shadow-sm border"><DevicePhoneMobileIcon className="w-4 text-stone-400"/></button>
            <button onClick={() => setPreviewScale(0.85)} className="p-2 bg-white rounded-lg shadow-sm border"><ComputerDesktopIcon className="w-4 text-stone-900"/></button>
        </div>
        <div style={{ transform: `scale(${previewScale})`, transformOrigin: "top center" }} className="transition-transform duration-500">
            <ShowcasePreview data={data} />
        </div>
      </div>

    </div>
  );
}