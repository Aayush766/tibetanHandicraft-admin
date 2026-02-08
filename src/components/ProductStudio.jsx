import React, { useState, useEffect, useRef } from "react";
import { API } from "../api"; 
import { motion, AnimatePresence } from "framer-motion"; // Ensure framer-motion is installed
import { 
  CloudArrowUpIcon, TrashIcon, PhotoIcon, 
  SwatchIcon, PlusIcon, XMarkIcon, ArchiveBoxIcon,
  TagIcon, ChatBubbleLeftRightIcon, BeakerIcon,
  EyeIcon, SparklesIcon, ScissorsIcon, PaintBrushIcon
} from "@heroicons/react/24/outline";
import { Star } from "lucide-react";

// --- Internal Preview Gallery Component ---
// Standard JavaScript JSX
function PreviewGallery({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
    setActiveIndex(index);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6">
      {/* Thumbnails */}
      <div className="hidden md:flex flex-col gap-3 w-20">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative aspect-[1/1] bg-white transition-all duration-500 overflow-hidden ${
              activeIndex === i ? "opacity-100 ring-1 ring-amber-700" : "opacity-40"
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      {/* Main Image */}
      <div className="relative flex-1 bg-white aspect-[4/5] overflow-hidden group border border-stone-100 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={images[activeIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover p-6"
          />
        </AnimatePresence>
        <div className="absolute top-4 left-4 w-4 h-[1px] bg-amber-700/30" />
        <div className="absolute top-4 left-4 h-4 w-[1px] bg-amber-700/30" />
      </div>
    </div>
  );
}

export default function ProductStudio() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [colorInput, setColorInput] = useState("#000000");
  const [sizeInput, setSizeInput] = useState("");

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const calculateDiscount = (curr, old) => {
    if (!old || old <= curr) return null;
    return Math.round(((old - curr) / old) * 100);
  };

  const handleFileUpload = async (e, type = "main") => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await API.post("/products/upload", formData);
      if (type === "main") {
        setEditingProduct({ ...editingProduct, image: res.data.url });
      } else {
        const newGallery = [...(editingProduct.gallery || []), res.data.url];
        setEditingProduct({ ...editingProduct, gallery: newGallery });
      }
    } catch (err) { alert("Upload failed"); } 
    finally { setIsUploading(false); }
  };

  const saveProduct = async () => {
    try {
      await API.post("/products/upsert", editingProduct);
      setEditingProduct(null);
      fetchProducts();
      alert("Archive Synchronized.");
    } catch (err) { alert("Save Error"); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Remove this masterpiece from the archives?")) return;
    try {
      await API.delete(`/products/${id}`);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) { alert("Delete failed"); }
  };

  const addTag = () => {
    if (!tagInput) return;
    const currentTags = editingProduct.tags || [];
    if (!currentTags.includes(tagInput)) {
      setEditingProduct({ ...editingProduct, tags: [...currentTags, tagInput] });
    }
    setTagInput("");
  };

  const addColor = () => {
    const currentColors = editingProduct.colors || [];
    if (!currentColors.includes(colorInput)) {
      setEditingProduct({ ...editingProduct, colors: [...currentColors, colorInput] });
    }
  };

  const addSize = () => {
    if (!sizeInput) return;
    const currentSizes = editingProduct.sizes || [];
    if (!currentSizes.includes(sizeInput.toUpperCase())) {
      setEditingProduct({ ...editingProduct, sizes: [...currentSizes, sizeInput.toUpperCase()] });
    }
    setSizeInput("");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-sans">
      {/* NAVIGATION */}
      <nav className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tighter italic font-serif text-stone-800">Studio Archives</h1>
        <button 
          onClick={() => setEditingProduct({ 
            title: "", price: 0, oldPrice: 0, category: "Archive", gallery: [], 
            colors: [], sizes: [], description: "", 
            sku: `ART-${Date.now()}`, tags: [], rating: 5, reviewsCount: 0,
            tag: "new", tagColor: "#b45309"
          })}
          className="bg-stone-900 text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-amber-800 transition-all flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" /> Create Masterpiece
        </button>
      </nav>

      <main className="max-w-[1700px] mx-auto p-8 grid grid-cols-12 gap-10">
        
        {/* INVENTORY SIDEBAR */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Current Collection</p>
          <div className="space-y-2 max-h-[85vh] overflow-y-auto pr-2 no-scrollbar">
            {products.map((p) => (
              <div 
                key={p._id} 
                onClick={() => setEditingProduct(p)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${editingProduct?._id === p._id ? 'bg-white border-amber-600 shadow-xl scale-[1.02]' : 'bg-stone-50 border-transparent hover:border-stone-200'}`}
              >
                <img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-stone-200" alt="" />
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{p.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-amber-700 font-medium">₹{p.price?.toLocaleString()}</p>
                    {p.oldPrice > p.price && <p className="text-[8px] text-stone-400 line-through">₹{p.oldPrice}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WORKSPACE */}
        <div className="col-span-12 lg:col-span-9">
          {editingProduct ? (
            <div className="space-y-10 pb-20">
              
              {/* EDITING PANEL */}
              <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-sm p-10 space-y-10">
                
                {/* 1. PRICING & IDENTITY */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="md:col-span-2 space-y-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase text-stone-400 italic">Piece Title</label>
                      <input 
                         value={editingProduct.title} 
                         onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})}
                         className="text-4xl font-serif bg-transparent border-b border-stone-100 focus:border-amber-600 outline-none pb-2 transition-all"
                         placeholder="Artifact Name..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-stone-400">Current Price (₹)</label>
                        <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full p-4 bg-stone-50 rounded-xl border border-stone-100 outline-none focus:ring-1 ring-amber-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-stone-400 italic">Old Price (M.R.P)</label>
                        <input type="number" value={editingProduct.oldPrice} onChange={(e) => setEditingProduct({...editingProduct, oldPrice: Number(e.target.value)})} className="w-full p-4 bg-stone-50 rounded-xl border border-stone-100 outline-none text-stone-400" />
                      </div>
                    </div>
                  </div>

                  {/* GRID PREVIEW MINI-CARD */}
                  <div className="bg-stone-50 rounded-3xl p-6 border border-stone-100 flex flex-col items-center justify-center">
                    <p className="text-[9px] font-bold text-stone-400 uppercase mb-4 tracking-[0.2em] flex items-center gap-2"><EyeIcon className="w-3 h-3"/> Grid Preview</p>
                    <div className="w-36 space-y-2 text-center">
                      <div className="aspect-[4/5] rounded-lg overflow-hidden relative shadow-md">
                        <img src={editingProduct.image} className="w-full h-full object-cover" alt="" />
                        {editingProduct.tag && (
                          <div style={{backgroundColor: editingProduct.tagColor}} className="absolute top-2 left-2 px-2 py-0.5 text-[7px] font-black text-white uppercase rounded-sm">
                            {editingProduct.tag}
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] font-bold truncate">{editingProduct.title || "Untitled"}</p>
                      <div className="flex justify-center items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-800">₹{editingProduct.price}</span>
                        {editingProduct.oldPrice > editingProduct.price && <span className="text-[8px] text-stone-400 line-through font-light">₹{editingProduct.oldPrice}</span>}
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. VARIATIONS (COLORS & SIZES) */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-10 border-y border-stone-100 py-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase text-stone-400 flex items-center gap-2">
                      <PaintBrushIcon className="w-4 h-4" /> Available Colors
                    </label>
                    <div className="flex gap-4 items-center bg-stone-50 p-4 rounded-2xl">
                      <input type="color" value={colorInput} onChange={(e) => setColorInput(e.target.value)} className="w-10 h-10 rounded-full cursor-pointer bg-transparent border-none" />
                      <button onClick={addColor} className="bg-stone-900 text-white text-[9px] px-4 py-2 rounded-full font-bold uppercase">Add Color</button>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {editingProduct.colors?.map(color => (
                        <div key={color} className="group relative">
                          <div style={{ backgroundColor: color }} className="w-8 h-8 rounded-full border border-stone-200 shadow-sm" />
                          <button onClick={() => setEditingProduct({...editingProduct, colors: editingProduct.colors.filter(c => c !== color)})} className="absolute -top-1 -right-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <XMarkIcon className="w-3 h-3 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase text-stone-400 flex items-center gap-2">
                      <ScissorsIcon className="w-4 h-4" /> Size Variations
                    </label>
                    <div className="flex gap-2">
                      <input value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} placeholder="XL, 42, 10-inch..." className="flex-1 bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs outline-none" />
                      <button onClick={addSize} className="bg-stone-900 text-white text-[9px] px-6 rounded-xl font-bold uppercase">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editingProduct.sizes?.map(size => (
                        <span key={size} className="flex items-center gap-2 bg-white border border-stone-200 px-4 py-1.5 rounded-lg text-[10px] font-bold">
                          {size} <XMarkIcon onClick={() => setEditingProduct({...editingProduct, sizes: editingProduct.sizes.filter(s => s !== size)})} className="w-3 h-3 cursor-pointer text-stone-400 hover:text-red-500" />
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 3. THE STORY & BADGES */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-bold uppercase text-stone-400 flex items-center gap-2">
                      <ChatBubbleLeftRightIcon className="w-4 h-4" /> The Story (Description)
                    </label>
                    <textarea 
                      rows={5}
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                      className="w-full p-6 bg-stone-50 rounded-3xl border border-stone-100 outline-none focus:border-amber-600 transition-all font-serif italic text-lg text-stone-600"
                    />
                  </div>
                  <div className="bg-amber-50/30 p-8 rounded-[2rem] border border-amber-100 space-y-6">
                    <label className="text-[10px] font-bold uppercase text-amber-800 flex items-center gap-2">
                      <SparklesIcon className="w-4 h-4" /> Visual Badge
                    </label>
                    <div className="space-y-4">
                      <input 
                        placeholder="Tag Label (e.g. SALE)"
                        value={editingProduct.tag} 
                        onChange={(e) => setEditingProduct({...editingProduct, tag: e.target.value})}
                        className="w-full p-3 rounded-xl border border-amber-200 bg-white text-xs outline-none"
                      />
                      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-200">
                         <span className="text-[10px] font-medium text-stone-500">Accent Color</span>
                         <input type="color" value={editingProduct.tagColor} onChange={(e) => setEditingProduct({...editingProduct, tagColor: e.target.value})} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                      </div>
                      {calculateDiscount(editingProduct.price, editingProduct.oldPrice) && (
                        <div className="pt-2 text-center">
                          <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Auto: {calculateDiscount(editingProduct.price, editingProduct.oldPrice)}% Discount</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* 4. GALLERY COLLECTION */}
                <section className="space-y-4">
                  <label className="text-[10px] font-bold uppercase text-stone-400 italic">Visual Archives</label>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="relative aspect-[4/5] rounded-2xl bg-stone-100 border-2 border-dashed border-stone-200 flex flex-col items-center justify-center overflow-hidden group">
                      {editingProduct.image ? (
                        <>
                          <img src={editingProduct.image} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <p className="text-white text-[8px] font-bold uppercase tracking-widest">Change Cover</p>
                          </div>
                        </>
                      ) : (
                        <PhotoIcon className="w-8 h-8 text-stone-300" />
                      )}
                      <input type="file" onChange={(e) => handleFileUpload(e, "main")} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>

                    {editingProduct.gallery?.map((img, idx) => (
                      <div key={idx} className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm group">
                        <img src={img} className="w-full h-full object-cover" />
                        <button onClick={() => setEditingProduct({...editingProduct, gallery: editingProduct.gallery.filter((_, i) => i !== idx)})} className="absolute top-2 right-2 bg-white/90 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <XMarkIcon className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}

                    <div className="relative aspect-[4/5] rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 flex flex-col items-center justify-center hover:bg-stone-100 transition-all cursor-pointer">
                      {isUploading ? <div className="animate-spin h-5 w-5 border-2 border-amber-600 border-t-transparent rounded-full" /> : <PlusIcon className="w-6 h-6 text-stone-300" />}
                      <input type="file" onChange={(e) => handleFileUpload(e, "gallery")} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </section>

                {/* 5. CRAFTSMANSHIP & REVIEWS */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-stone-100 pt-10">
                   <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-stone-400 flex items-center gap-2"><TagIcon className="w-4 h-4" /> Artisan Tags</label>
                        <div className="flex gap-2 mb-2">
                          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTag()} placeholder="Add tag..." className="flex-1 bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs outline-none" />
                          <button onClick={addTag} className="bg-stone-200 px-6 rounded-xl text-xs font-bold hover:bg-stone-300 transition-colors">+</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {editingProduct.tags?.map(tag => (
                            <span key={tag} className="flex items-center gap-2 bg-stone-900 text-white px-3 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-widest">
                              {tag} <XMarkIcon onClick={() => setEditingProduct({...editingProduct, tags: editingProduct.tags.filter(t => t !== tag)})} className="w-3 h-3 cursor-pointer" />
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-stone-400">Category</label>
                          <input value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-stone-400">SKU</label>
                          <input value={editingProduct.sku} onChange={(e) => setEditingProduct({...editingProduct, sku: e.target.value})} className="w-full p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs font-mono" />
                        </div>
                      </div>
                   </div>

                   <div className="bg-stone-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl">
                      <label className="text-[10px] font-bold uppercase text-stone-500 flex items-center gap-2"><BeakerIcon className="w-4 h-4" /> Artisan Evaluation</label>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <p className="text-[9px] text-stone-400 uppercase font-bold">Star Rating</p>
                            <input type="number" step="0.1" max="5" value={editingProduct.rating} onChange={(e) => setEditingProduct({...editingProduct, rating: Number(e.target.value)})} className="bg-stone-800 w-full p-4 rounded-xl border border-stone-700 text-amber-400 font-bold outline-none" />
                         </div>
                         <div className="space-y-2">
                            <p className="text-[9px] text-stone-400 uppercase font-bold">Total Reviews</p>
                            <input type="number" value={editingProduct.reviewsCount} onChange={(e) => setEditingProduct({...editingProduct, reviewsCount: Number(e.target.value)})} className="bg-stone-800 w-full p-4 rounded-xl border border-stone-700 text-stone-200 outline-none" />
                         </div>
                      </div>
                   </div>
                </section>

                {/* SAVE/DELETE ACTIONS */}
                <div className="flex justify-between items-center pt-8 border-t border-stone-100">
                  <button onClick={() => deleteProduct(editingProduct._id)} className="flex items-center gap-2 text-red-400 hover:text-red-600 text-[10px] font-bold uppercase tracking-widest transition-all"><TrashIcon className="w-4 h-4" /> Delete Artifact</button>
                  <div className="flex gap-4">
                    <button onClick={() => setEditingProduct(null)} className="text-[10px] font-bold uppercase text-stone-400 hover:text-stone-900">Discard</button>
                    <button onClick={saveProduct} className="bg-stone-900 text-amber-500 px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all">Sync to Archive</button>
                  </div>
                </div>
              </div>

              {/* ===== UPGRADED LIVE PREVIEW (MATCHES SINGLE PAGE) ===== */}
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 text-center">Storefront Detail Live Preview</p>
                
                <div className="bg-[#fcfaf7] border border-stone-200 rounded-[3.5rem] p-10 md:p-20 shadow-inner">
                  <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">
                    
                    {/* GALLERY SIDE */}
                    <div className="flex-1">
                      <PreviewGallery 
                        images={editingProduct.gallery?.length > 0 ? editingProduct.gallery : [editingProduct.image]} 
                        title={editingProduct.title} 
                      />
                    </div>

                    {/* DETAILS SIDE */}
                    <div className="flex-1 space-y-8">
                      <header className="space-y-4">
                        <p className="text-[10px] uppercase tracking-[0.5em] text-amber-700 font-bold">
                          Handcrafted Excellence
                        </p>
                        <h2 className="text-5xl md:text-6xl text-stone-900 font-serif leading-tight italic">
                          {editingProduct.title || "Untitled Masterpiece"}
                        </h2>
                        
                        <div className="flex items-center gap-4">
                          <span className="text-3xl text-stone-800 font-light">
                            ₹ {editingProduct.price?.toLocaleString()}
                          </span>
                          {editingProduct.oldPrice > editingProduct.price && (
                            <span className="text-xl text-stone-400 line-through font-light">
                              ₹ {editingProduct.oldPrice?.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Rating Mockup */}
                        <div className="flex items-center gap-4 pt-2">
                          <div className="flex gap-1 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={i + 1 <= Math.floor(editingProduct.rating || 5) ? "currentColor" : "none"}
                                className="stroke-amber-500"
                              />
                            ))}
                          </div>
                          <span className="text-[10px] uppercase tracking-widest text-stone-400">
                            {editingProduct.reviewsCount || 0} verified reviews
                          </span>
                        </div>
                      </header>

                      <p className="text-stone-500 leading-relaxed text-lg italic font-serif border-l-2 border-amber-700/20 pl-6">
                        "{editingProduct.description || "The soul of this artifact is awaiting its story..."}"
                      </p>

                      {/* Selection UI Mockup */}
                      <div className="py-8 border-y border-stone-200 space-y-8">
                        {editingProduct.sizes?.length > 0 && (
                          <div className="space-y-3">
                            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Select Size</span>
                            <div className="flex gap-2">
                              {editingProduct.sizes.map(s => (
                                <div key={s} className="w-10 h-10 flex items-center justify-center border border-stone-200 text-[10px] uppercase hover:bg-stone-900 hover:text-white transition-all cursor-pointer">
                                  {s}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {editingProduct.colors?.length > 0 && (
                          <div className="space-y-3">
                            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Artisan Finish</span>
                            <div className="flex gap-4">
                              {editingProduct.colors.map(c => (
                                <div key={c} style={{backgroundColor: c}} className="w-6 h-6 rounded-full border border-stone-300 ring-offset-2 hover:ring-1 ring-stone-900 transition-all cursor-pointer" />
                              ))}
                            </div>
                          </div>
                        )}

                        <button className="w-full h-[60px] bg-stone-900 text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-amber-800 transition-all shadow-xl">
                          Inquire About This Piece
                        </button>
                      </div>

                      {/* Meta */}
                      <div className="space-y-3">
                        <div className="flex text-[11px] uppercase tracking-widest">
                          <span className="text-stone-400 w-24">Identifier</span>
                          <span className="text-stone-900 font-semibold">: {editingProduct.sku}</span>
                        </div>
                        <div className="flex text-[11px] uppercase tracking-widest">
                          <span className="text-stone-400 w-24">Collection</span>
                          <span className="text-stone-900 font-semibold">: {editingProduct.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-[80vh] flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-[3rem] text-stone-300">
               <ArchiveBoxIcon className="w-20 h-20 mb-6 opacity-10" />
               <p className="font-bold uppercase tracking-[15px] text-xs">Select Artifact to Refine</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}