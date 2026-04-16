import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import axios from "axios";
import { Save, RotateCcw, Image as ImageIcon, Star } from "lucide-react";

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);

  /* ---------------- FETCH ---------------- */
  const fetchData = () => {
    axios
      .get("https://thj-backend.onrender.com/api/testimonials")
      .then((res) => setItems(res.data.items));
  };

  useEffect(fetchData, []);

  /* ---------------- UPDATE ITEM ---------------- */
  const updateItem = (index, newProps) => {
    const copy = [...items];
    copy[index] = { ...copy[index], ...newProps };
    setItems(copy);
  };

  /* ---------------- IMAGE UPLOAD ---------------- */
  const uploadImage = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(
      "https://thj-backend.onrender.com/api/testimonials/upload",
      formData
    );

    updateItem(index, { src: res.data.url });
  };

  /* ---------------- SAVE ---------------- */
  const save = async () => {
    await axios.put("https://thj-backend.onrender.com/api/testimonials", { items });
    alert("Saved Layout Successfully");
  };

  /* ---------------- RESET ---------------- */
  const reset = async () => {
    if (!confirm("Reset testimonials to default layout?")) return;
    await axios.post("https://thj-backend.onrender.com/api/testimonials/reset");
    fetchData();
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-10 pb-20">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif italic text-stone-900">Testimonials CMS</h1>
          <p className="text-sm text-stone-500 mt-1">Drag and resize cards to create the gallery layout.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={reset} 
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition"
          >
            <RotateCcw size={14} /> Reset Layout
          </button>
          <button 
            onClick={save} 
            className="flex items-center gap-2 px-8 py-3 bg-stone-900 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-emerald-600 transition shadow-lg shadow-stone-200"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      {/* ================= CANVAS SECTION ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400">Visual Designer Canvas</span>
           {/* <span className="text-[10px] text-stone-400">Scroll horizontally to view full width →</span> */}
        </div>
        
        <div className="w-full overflow-x-auto rounded-2xl border border-stone-200 bg-stone-50 shadow-inner p-4 custom-scrollbar">
          <div className="relative w-full min-h-screen bg-white rounded-lg shadow-sm border border-stone-100 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">

            {items.map((item, i) => (
              <Rnd
                key={item.id}
                size={{ width: item.w, height: item.h }}
                position={{ x: item.x, y: item.y }}
                bounds="parent"
                onDragStop={(e, d) => updateItem(i, { x: d.x, y: d.y })}
                onResizeStop={(e, dir, ref, delta, pos) =>
                  updateItem(i, {
                    w: parseInt(ref.style.width),
                    h: parseInt(ref.style.height),
                    ...pos,
                  })
                }
                className="group z-10"
              >
                <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-transparent group-hover:border-emerald-500 transition-all shadow-md group-active:shadow-2xl">
                  <img
                    src={item.src}
                    className="w-full h-full object-cover pointer-events-none"
                    alt="Testimonial thumbnail"
                  />

                  {/* Hover Upload Overlay */}
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold uppercase tracking-tighter cursor-pointer transition-all duration-300">
                    <ImageIcon size={20} className="mb-2" />
                    Replace Image
                    <input
                      hidden
                      type="file"
                      onChange={(e) => uploadImage(e, i)}
                    />
                  </label>
                  
                  {/* Position Badge */}
                  <div className="absolute top-2 left-2 bg-black/50 text-[8px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
                    X: {Math.round(item.x)} Y: {Math.round(item.y)}
                  </div>
                </div>
              </Rnd>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DATA EDITOR SECTION ================= */}
      <section className="space-y-6">
        <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400">Review Details Editor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <div key={i} className="bg-white p-6 border border-stone-100 rounded-2xl shadow-sm space-y-4 hover:border-stone-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden border border-stone-100">
                  <img src={item.src} className="w-full h-full object-cover" alt="User" />
                  <label className="absolute inset-0 bg-black/20 flex items-center justify-center text-white cursor-pointer opacity-0 hover:opacity-100 transition">
                    <ImageIcon size={14} />
                    <input hidden type="file" onChange={(e) => uploadImage(e, i)} />
                  </label>
                </div>
                <div className="flex-1">
                  <label className="text-[9px] font-bold uppercase text-stone-400 tracking-widest">Customer Name</label>
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(i, { name: e.target.value })}
                    placeholder="Enter name..."
                    className="w-full border-b border-stone-200 focus:border-emerald-500 outline-none py-1 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold uppercase text-stone-400 tracking-widest flex items-center gap-1">
                    <Star size={8} /> Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={item.rating}
                    onChange={(e) => updateItem(i, { rating: Number(e.target.value) })}
                    className="w-full bg-stone-50 rounded-lg border border-stone-100 p-2 text-sm mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase text-stone-400 tracking-widest">Testimonial Text</label>
                <textarea
                  value={item.review}
                  onChange={(e) => updateItem(i, { review: e.target.value })}
                  placeholder="What did they say?"
                  className="w-full bg-stone-50 rounded-lg border border-stone-100 p-3 text-sm mt-1 focus:bg-white transition-all outline-none"
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}