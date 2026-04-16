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
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";

/* ================= DEFAULT DATA (EXTRACTED FROM YOUR LIST) ================= */
const DEFAULT_SHOWCASE_DATA = {
  label: "Global Archive",
  heading: "50M+ \n Product Sold",
  description:
    "An exclusive collection of 50M+ artifacts, preserved through time and delivered to your space.",
  buttonText: "Discover All",
  buttonLink: "/discover",
  buttonTextColor: "#ffffff",
  buttonBgColor: "#1c1917",

  sliderItems: [
    {
      id: "01",
      category: "Pottery",
      title: "Hand-Thrown Vessel",
      image: "/Pot.png",
      imagePosition: "center",
    },
    {
      id: "02",
      category: "Sculpture",
      title: "Ancient Deity",
      image: "/Statues.png",
      imagePosition: "center",
    },
    {
      id: "03",
      category: "Artifact",
      title: "Ritual Bowl",
      image: "/Bowl.png",
      imagePosition: "center",
    },
    {
      id: "04",
      category: "Mask",
      title: "Ceremonial Face",
      image: "/item.png",
      imagePosition: "center",
    },
    {
      id: "05",
      category: "Metalware",
      title: "Temple Bell",
      image: "/decore.png",
      imagePosition: "center",
    },
  ],
};


/** * --- LIVE PREVIEW COMPONENT --- */
function ShowcasePreview({ data }) {
  const [active, setActive] = useState(0);
  const items = data?.sliderItems || [];

  // Logic to show up to 3 cards in the stack, but only if they exist
  const displayOffsets = items.length >= 3 ? [0, 1, 2] : items.length === 2 ? [0, 1] : items.length === 1 ? [0] : [];

  const getIndex = (offset) => {
    if (items.length === 0) return 0;
    return (active + offset) % items.length;
  };

  const cardVariants = {
    active: { x: 0, opacity: 1, scale: 1, left: "0%", zIndex: 30 },
    next: { x: 0, opacity: 1, scale: 0.85, left: "30%", zIndex: 20 },
    upcoming: { x: 0, opacity: 0.8, scale: 0.70, left: "55%", zIndex: 10 },
    enter: { x: 100, opacity: 0, scale: 0.6 },
    exit: { x: -100, opacity: 0, zIndex: 0 },
  };

  return (
    <div className="w-full min-h-[500px] bg-[#fcfaf7] flex flex-col items-center justify-center p-4 overflow-hidden rounded-xl border shadow-inner">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 items-center">
        {/* Left Content */}
        <div className="space-y-4 text-left">
          <span className="text-amber-800 text-[8px] uppercase tracking-[0.5em] font-bold">{data.label}</span>
          <h1 className="text-3xl font-serif font-bold text-stone-900 leading-tight whitespace-pre-line">{data.heading}</h1>
          <p className="text-stone-500 text-xs leading-relaxed max-w-xs">{data.description}</p>
          <button 
            style={{ backgroundColor: data.buttonBgColor, color: data.buttonTextColor }}
            className="px-6 py-3 text-[9px] font-bold uppercase tracking-widest"
          >
            {data.buttonText}
          </button>
        </div>

        {/* Stacked Slider */}
        <div className="relative h-[350px] w-full flex items-center">
          <AnimatePresence initial={false} mode="popLayout">
            {displayOffsets.map((offset) => {
              const itemIndex = getIndex(offset);
              const item = items[itemIndex];

              return (
                <motion.div
                  key={item.id || itemIndex}
                  variants={cardVariants}
                  initial="enter"
                  animate={offset === 0 ? "active" : offset === 1 ? "next" : "upcoming"}
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute top-0 w-[220px] h-[300px] bg-white border-[6px] border-white shadow-xl overflow-hidden cursor-pointer"
                  onClick={() => setActive((active + 1) % items.length)}
                >
                  <img
                    src={item.image || "https://via.placeholder.com/400x600"}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: item.imagePosition || "center" }}
                    alt={item.title}
                  />
                  {offset === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-sm">
                       <p className="text-[7px] font-bold text-amber-800 uppercase tracking-widest">{item.category}</p>
                       <h3 className="text-sm font-serif text-stone-900 truncate">{item.title}</h3>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {items.length === 0 && (
            <div className="text-stone-400 italic text-sm">No items in archive...</div>
          )}
        </div>
      </div>
    </div>
  );
}

/** * --- MAIN CMS PAGE --- */
export default function AdminProductShowcase() {
  const [data, setData] = useState(null);
  const [previewScale, setPreviewScale] = useState(0.8);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("https://thj-backend.onrender.com/api/product-showcase");
      if (res.data && Object.keys(res.data).length > 0) {
        setData(res.data);
      } else {
        setData(DEFAULT_SHOWCASE_DATA);
      }
    } catch (err) {
      setData(DEFAULT_SHOWCASE_DATA);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset to default archive collection?")) return;
    setLoading(true);
    try {
        await API.post("https://thj-backend.onrender.com/api/product-showcase/reset");
        setData(DEFAULT_SHOWCASE_DATA); 
        alert("Reset successful!");
    } catch (err) {
        setData(DEFAULT_SHOWCASE_DATA);
        alert("Reset applied locally.");
    } finally {
        setLoading(false);
    }
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
    const nextId = (items.length + 1).toString().padStart(2, '0');
    setData({
      ...data,
      sliderItems: [...items, { id: nextId, category: "New", title: "New Title", image: "", imagePosition: "center" }],
    });
  };

  const deleteItem = (idx) => {
    const items = data.sliderItems.filter((_, i) => i !== idx);
    setData({ ...data, sliderItems: items });
  };

  const uploadImage = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      setLoading(true);
      const res = await API.post("https://thj-backend.onrender.com/api/products/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      handleItemChange(idx, "image", res.data.url);
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      setLoading(true);
      await API.put("https://thj-backend.onrender.com/api/product-showcase", data);
      alert("Archive Updated Successfully");
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <div className="p-20 text-center italic">Initialising Global Archive...</div>;

  return (
    <div className="flex h-screen bg-[#FDFCFB] overflow-hidden">
      
      {/* LEFT: EDITOR PANEL */}
      <div className="w-1/2 h-full overflow-y-auto border-r bg-white p-8">
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-white pb-4 z-10 border-b">
          <div className="flex flex-col">
            <h1 className="text-2xl font-serif italic tracking-tight text-stone-900">Showcase Editor</h1>
            {loading && <span className="text-[10px] text-amber-600 animate-pulse font-bold uppercase tracking-widest">Processing Collection...</span>}
          </div>
          <div className="flex gap-3">
            <button onClick={handleReset} className="p-2 text-stone-400 hover:text-red-500 transition-colors" title="Reset to Archive Defaults">
                <ArrowUturnLeftIcon className="w-5" />
            </button>
            <button onClick={fetchData} className="p-2 text-stone-400 hover:text-black" title="Refresh">
                <ArrowPathIcon className="w-5" />
            </button>
            <button onClick={save} disabled={loading} className="bg-stone-900 text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-amber-900 transition-colors disabled:bg-stone-300">
                Save All
            </button>
          </div>
        </div>

        <div className="space-y-12">
          {/* CONTENT SECTION */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">Main Content</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-stone-500">Editorial Label</label>
                <input value={data.label} onChange={(e) => handleChange("label", e.target.value)} placeholder="e.g. Global Archive" className="border p-3 rounded-lg text-sm bg-stone-50 focus:bg-white outline-none focus:ring-1 focus:ring-stone-200" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-stone-500">Main Heading</label>
                <input value={data.heading} onChange={(e) => handleChange("heading", e.target.value)} placeholder="e.g. 50M+ Sold" className="border p-3 rounded-lg text-sm bg-stone-50 focus:bg-white outline-none focus:ring-1 focus:ring-stone-200" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-stone-500">Narrative Description</label>
                <textarea value={data.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Description..." className="w-full border p-3 rounded-lg text-sm h-24 bg-stone-50 focus:bg-white outline-none focus:ring-1 focus:ring-stone-200" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-stone-500">CTA Button Text</label>
                <input value={data.buttonText} onChange={(e) => handleChange("buttonText", e.target.value)} placeholder="e.g. Discover All" className="border p-3 rounded-lg text-sm bg-stone-50 focus:bg-white outline-none focus:ring-1 focus:ring-stone-200" />
              </div>
              <div className="flex items-center gap-4 border p-2 rounded-lg mt-5 bg-stone-50">
                <div className="flex flex-col items-center flex-1">
                    <span className="text-[8px] uppercase font-bold text-stone-400">Text</span>
                    <input type="color" value={data.buttonTextColor} onChange={(e) => handleChange("buttonTextColor", e.target.value)} className="w-full h-8 cursor-pointer border-none bg-transparent" />
                </div>
                <div className="flex flex-col items-center flex-1">
                    <span className="text-[8px] uppercase font-bold text-stone-400">Bg</span>
                    <input type="color" value={data.buttonBgColor} onChange={(e) => handleChange("buttonBgColor", e.target.value)} className="w-full h-8 cursor-pointer border-none bg-transparent" />
                </div>
              </div>
            </div>
          </section>

          {/* SLIDER ITEMS */}
          <section className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">Artifact Cards ({data.sliderItems?.length || 0})</h2>
              <button onClick={addItem} className="text-amber-800 text-[10px] font-bold uppercase hover:underline tracking-widest">+ Add New Artifact</button>
            </div>

            <div className="space-y-4">
              {data.sliderItems?.map((item, idx) => (
                <div key={item.id || idx} className="p-4 border rounded-xl bg-stone-50 space-y-4 relative group hover:border-stone-300 transition-colors">
                  <button onClick={() => deleteItem(idx)} className="absolute top-4 right-4 text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon className="w-4"/></button>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase font-bold text-stone-400">Category</span>
                        <input value={item.category} onChange={(e) => handleItemChange(idx, "category", e.target.value)} className="border p-2 rounded text-xs bg-white" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase font-bold text-stone-400">Title</span>
                        <input value={item.title} onChange={(e) => handleItemChange(idx, "title", e.target.value)} className="border p-2 rounded text-xs bg-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-16 h-16 bg-white border border-dashed rounded-lg flex items-center justify-center cursor-pointer overflow-hidden hover:bg-stone-100 transition-colors group/img">
                        {item.image ? <img src={item.image} className="object-cover w-full h-full" alt="thumb" /> : <PhotoIcon className="w-6 text-stone-300 group-hover/img:text-stone-400"/>}
                        <input type="file" hidden onChange={(e) => uploadImage(e, idx)} />
                    </label>
                    <div className="flex-1 flex flex-col gap-1">
                         <span className="text-[9px] uppercase font-bold text-stone-400">Image Focal Point (e.g. center, top)</span>
                         <input value={item.imagePosition} onChange={(e) => handleItemChange(idx, "imagePosition", e.target.value)} className="border p-2 rounded text-xs bg-white" />
                    </div>
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
            <button onClick={() => setPreviewScale(0.5)} className="p-2 bg-white rounded-lg shadow-sm border hover:border-stone-900 transition-all"><DevicePhoneMobileIcon className="w-4 text-stone-400"/></button>
            <button onClick={() => setPreviewScale(0.85)} className="p-2 bg-white rounded-lg shadow-sm border hover:border-stone-900 transition-all"><ComputerDesktopIcon className="w-4 text-stone-900"/></button>
        </div>
        <div style={{ transform: `scale(${previewScale})`, transformOrigin: "top center" }} className="transition-transform duration-500">
            <ShowcasePreview data={data} />
        </div>
      </div>

    </div>
  );
}