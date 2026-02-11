import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import axios from "axios";

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);

  /* ---------------- FETCH ---------------- */
  const fetchData = () => {
    axios
      .get("http://localhost:5000/api/testimonials")
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
      "http://localhost:5000/api/testimonials/upload",
      formData
    );

    updateItem(index, { src: res.data.url });
  };

  /* ---------------- SAVE ---------------- */
  const save = async () => {
    await axios.put("http://localhost:5000/api/testimonials", { items });
    alert("Saved Layout Successfully");
  };

  /* ---------------- RESET ---------------- */
  const reset = async () => {
    if (!confirm("Reset testimonials to default layout?")) return;
    await axios.post("http://localhost:5000/api/testimonials/reset");
    fetchData();
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-10 space-y-12 bg-[#fafafa] min-h-screen">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Testimonials Layout CMS</h1>
        <div className="flex gap-4">
          <button onClick={reset} className="text-sm uppercase text-red-500">
            Reset
          </button>
          <button onClick={save} className="px-6 py-2 bg-black text-white">
            Save
          </button>
        </div>
      </div>

      {/* ================= CANVAS ================= */}
      <div className="overflow-auto border bg-white shadow mx-auto">
        <div className="relative w-[1843px] h-[771px]">
          {items.map((item, i) => (
            <Rnd
              key={item.id}
              size={{ width: item.w, height: item.h }}
              position={{ x: item.x, y: item.y }}
              bounds="parent"
              onDragStop={(e, d) =>
                updateItem(i, { x: d.x, y: d.y })
              }
              onResizeStop={(e, dir, ref, delta, pos) =>
                updateItem(i, {
                  w: parseInt(ref.style.width),
                  h: parseInt(ref.style.height),
                  ...pos,
                })
              }
              className="border-2 border-amber-600 group"
            >
              <div className="relative w-full h-full">
                <img
                  src={item.src}
                  className="w-full h-full object-cover"
                />

                {/* Hover Upload */}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs cursor-pointer transition">
                  Change Image
                  <input
                    hidden
                    type="file"
                    onChange={(e) => uploadImage(e, i)}
                  />
                </label>
              </div>
            </Rnd>
          ))}
        </div>
      </div>

      {/* ================= TEXT EDITOR ================= */}
      <div className="grid grid-cols-2 gap-8">
        {items.map((item, i) => (
          <div key={i} className="bg-white p-6 border rounded-xl space-y-3">
            
            {/* Image Upload */}
            <label className="text-xs font-bold">Image</label>
            <label className="relative w-full h-40 border-2 border-dashed flex items-center justify-center cursor-pointer">
              <img
                src={item.src}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <input
                hidden
                type="file"
                onChange={(e) => uploadImage(e, i)}
              />
            </label>

            {/* Name */}
            <input
              value={item.name}
              onChange={(e) =>
                updateItem(i, { name: e.target.value })
              }
              placeholder="Customer Name"
              className="w-full border p-2"
            />

            {/* Rating */}
            <input
              type="number"
              min={1}
              max={5}
              value={item.rating}
              onChange={(e) =>
                updateItem(i, { rating: Number(e.target.value) })
              }
              className="w-full border p-2"
            />

            {/* Review */}
            <textarea
              value={item.review}
              onChange={(e) =>
                updateItem(i, { review: e.target.value })
              }
              placeholder="Customer Review"
              className="w-full border p-2"
              rows={3}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
