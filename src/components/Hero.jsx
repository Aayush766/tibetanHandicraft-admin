import { useEffect, useState } from "react";
import { API } from "../api";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from "@dnd-kit/core";
import { 
  SortableContext, 
  verticalListSortingStrategy, 
  useSortable, 
  arrayMove, 
  sortableKeyboardCoordinates 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  PlusIcon, 
  TrashIcon, 
  ArrowsUpDownIcon, 
  SwatchIcon, 
  ArrowPathIcon,
  CheckIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";

// ---------- 1. FACTORY DEFAULTS ----------
const DEFAULT_SLIDES = [
  {
    order: 1,
    image: "/heroImage.jpg",
    tag: "New Arrival",
    title: "Discover Our\nNew Collection",
    description: "Handcrafted Tibetan pieces designed to elevate your lifestyle with tradition and elegance.",
    buttonText: "Buy Now",
    buttonLink: "/products",
    align: "right"
  },
  {
    order: 2,
    image: "/heroImage2.jpg",
    tag: "Limited Edition",
    title: "Authentic\nTibetan Art",
    description: "Each item tells a story of culture, craftsmanship, and timeless beauty.",
    buttonText: "Explore",
    buttonLink: "/products",
    align: "right"
  },
  {
    order: 3,
    image: "/heroImage3.jpg",
    tag: "Exclusive",
    title: "Spiritual\nHandicrafts",
    description: "Bring peace, positivity, and heritage into your space with our curated collection.",
    buttonText: "View Collection",
    buttonLink: "/products",
    align: "right"
  }
];



const DEFAULT_STYLE = {
  primaryColor: "#8A6B2F", // Next.js tag text color
  cardOpacity: "0.7",      // Next.js bg-white/70
  blurAmount: "24px",      // Next.js backdrop-blur-xl
  progressBar: "#C9A24D"   // Next.js gold gradient primary
};


// ---------- 2. REUSABLE COMPONENTS ----------
const FormInput = ({ label, ...props }) => (
  <div className="flex-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{label}</label>
    <input {...props} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-amber-500 transition-all" />
  </div>
);

const AlignToggle = ({ label, value, onChange }) => (
    <div className="flex-1">
        <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">{label}</label>
        <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
            {['left', 'center', 'right'].map(pos => (
                <button 
                    key={pos} 
                    onClick={() => onChange(pos)} 
                    className={`flex-1 py-1 text-[9px] font-bold uppercase rounded md transition-all ${value === pos ? 'bg-white shadow-sm text-amber-600' : 'text-slate-400'}`}
                >
                    {pos[0]}
                </button>
            ))}
        </div>
    </div>
);

// ---------- 3. SORTABLE ITEM ----------
function SortableSlide({ slide, index, handleSlideChange, uploadImage, deleteSlide, setFocusedIndex, isActive }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.order });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 0 }}
      onClick={() => setFocusedIndex(index)}
      className={`group bg-white rounded-2xl border-2 transition-all mb-6 overflow-hidden ${isActive ? "border-amber-500 shadow-xl" : "border-slate-100"}`}
    >
      <div className="flex items-center justify-between p-3 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab p-1.5 hover:bg-white rounded-lg transition-colors"><ArrowsUpDownIcon className="w-4 h-4 text-slate-400" /></div>
          <span className="text-[10px] font-black text-slate-500 uppercase">Slide {index + 1}</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); deleteSlide(index); }} className="text-slate-300 hover:text-red-500 transition-colors"><TrashIcon className="w-4 h-4" /></button>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex gap-4">
          <label className="relative shrink-0 w-20 h-20 rounded-xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden hover:border-amber-400 cursor-pointer">
            {slide.image ? <img src={slide.image} className="absolute inset-0 w-full h-full object-cover" alt="" /> : <PhotoIcon className="w-6 h-6 text-slate-300" />}
            <input hidden type="file" onChange={(e) => uploadImage(e, index)} />
          </label>
          <div className="flex-1 space-y-3">
            <FormInput label="Tagline" value={slide.tag} onChange={(e) => handleSlideChange(index, "tag", e.target.value)} />
            <FormInput label="Headline" value={slide.title} onChange={(e) => handleSlideChange(index, "title", e.target.value)} />
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-50">
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Description</label>
                <textarea 
                    value={slide.description} 
                    onChange={(e) => handleSlideChange(index, "description", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-amber-500 h-20 resize-none"
                />
            </div>
            <FormInput label="Button Text" value={slide.buttonText} onChange={(e) => handleSlideChange(index, "buttonText", e.target.value)} />
        </div>

        {/* ALIGNMENT CONTROLS */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
            <AlignToggle label="Card Position" value={slide.align} onChange={(v) => handleSlideChange(index, "align", v)} />
            <AlignToggle label="Tag Align" value={slide.tagAlign} onChange={(v) => handleSlideChange(index, "tagAlign", v)} />
            <AlignToggle label="Title Align" value={slide.titleAlign} onChange={(v) => handleSlideChange(index, "titleAlign", v)} />
            <AlignToggle label="Desc Align" value={slide.descAlign} onChange={(v) => handleSlideChange(index, "descAlign", v)} />
            <AlignToggle label="Button Align" value={slide.btnAlign} onChange={(v) => handleSlideChange(index, "btnAlign", v)} />
        </div>
      </div>
    </div>
  );
}

// ---------- 4. MAIN ADMIN ----------
export default function AdvancedHeroAdmin() {
  const [slides, setSlides] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [globalStyle, setGlobalStyle] = useState(DEFAULT_STYLE);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    API.get("/").then(res => {
      setSlides(res.data?.slides?.length > 0 ? res.data.slides : DEFAULT_SLIDES);
      setGlobalStyle(res.data?.style || DEFAULT_STYLE);
    });
  }, []);

 const handleSlideChange = (idx, field, val) => {
  setSlides(prev => {
    const next = [...prev];
    next[idx] = { ...next[idx], [field]: val };
    return next;
  });
};

  const current = slides[activeIdx] || DEFAULT_SLIDES[0];

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b px-8 py-4 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <SwatchIcon className="w-6 h-6 text-amber-600" />
          <h1 className="font-black text-lg tracking-tight">LUXURY ADMIN</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => { setSlides(DEFAULT_SLIDES); setGlobalStyle(DEFAULT_STYLE); }} className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><ArrowPathIcon className="w-4 h-4" /> Reset</button>
          <button onClick={() => { setIsSaving(true); API.post("/update", { slides, style: globalStyle }).then(() => setIsSaving(false)); }} className="bg-slate-900 text-amber-400 px-6 py-2 rounded-lg font-black text-xs uppercase shadow-lg">
            {isSaving ? "Saving..." : "Publish"}
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-10 grid grid-cols-12 gap-10">
        
        {/* EDITING SIDEBAR */}
        <div className="col-span-5 h-[calc(100vh-160px)] overflow-y-auto pr-4 custom-scrollbar">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
            if (e.active.id !== e.over.id) {
              setSlides(items => {
                const oldIdx = items.findIndex(i => i.order === e.active.id);
                const newIdx = items.findIndex(i => i.order === e.over.id);
                return arrayMove(items, oldIdx, newIdx);
              });
            }
          }}>
            <SortableContext items={slides.map(s => s.order)} strategy={verticalListSortingStrategy}>
              {slides.map((s, i) => (
                <SortableSlide key={s.order} slide={s} index={i} isActive={activeIdx === i} handleSlideChange={handleSlideChange} setFocusedIndex={setActiveIdx} deleteSlide={(idx) => setSlides(slides.filter((_, si) => si !== idx))} uploadImage={async (e, idx) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await API.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const imageUrl = res.data.imageUrl;

    handleSlideChange(idx, "image", imageUrl);
  } catch (err) {
    console.error("Upload failed", err);
  }
}} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {/* PREVIEW AREA */}
        <div className="col-span-7">
          <div className="sticky top-28 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100">
            <div className="relative h-[580px] w-full rounded-[1.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
                {/* Image Section */}
                <div className="absolute left-[5%] top-[5%] w-[90%] h-[90%] overflow-hidden rounded-[10px]">
                  {current.image && <img src={current.image} className="absolute inset-0 w-full h-full object-cover" alt="" />}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/30" />
                </div>

                {/* Glass Card */}
                <div className={`absolute inset-0 flex p-10 items-center transition-all duration-700 ${
                  current.align === 'center' ? 'justify-center' : current.align === 'left' ? 'justify-start' : 'justify-end'
                }`}>
                  <div 
                    style={{ backdropFilter: `blur(${globalStyle.blurAmount})`, backgroundColor: `rgba(255,255,255,${globalStyle.cardOpacity})` }}
                    className={`max-w-[460px] p-10 rounded-[15px] border border-white/40 shadow-2xl relative flex flex-col`}
                  >
                    <div className="absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r from-[#C9A24D] via-[#F5D98B] to-[#C9A24D]" />
                    
                    <p style={{ color: globalStyle.primaryColor, textAlign: current.tagAlign }} className="text-[12px] font-semibold tracking-[3px] uppercase mb-4">
                      {current.tag}
                    </p>
                    <h1 style={{ textAlign: current.titleAlign }} className="text-[#2E2E2E] text-[40px] font-bold leading-[1.1] mb-5 whitespace-pre-line">
                      {current.title}
                    </h1>
                    <p style={{ textAlign: current.descAlign }} className="text-[#444] text-[15px] leading-[24px] mb-8">
                      {current.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: current.btnAlign === 'left' ? 'flex-start' : current.btnAlign === 'center' ? 'center' : 'flex-end' }}>
                        <button className="bg-[#2E2E2E] text-white px-10 py-4 text-[12px] font-bold uppercase tracking-[2px]">
                        {current.buttonText}
                        </button>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}