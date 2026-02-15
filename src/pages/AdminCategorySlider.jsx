import { useEffect, useState } from "react";
import { API } from "../api";

/* ================= PREVIEW ================= */

function CategoryPreview({ data }) {
  if (!data) return null;

  return (
    <section className="w-full bg-white p-10 rounded-3xl shadow-2xl scale-[0.85]">
      <h2 className="text-4xl font-serif text-center mb-4">
        {data.heading}
      </h2>

      <p className="text-center text-stone-500 mb-10 max-w-xl mx-auto">
        {data.description}
      </p>

      <div className="flex gap-6 justify-center">
        {data.items
          .sort((a, b) => a.order - b.order)
          .map((item, i) => (
            <div key={i} className="w-56">
              <div className="h-72 rounded-xl overflow-hidden shadow">
                {item.image && (
                  <img
                    src={item.image}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <p className="text-center mt-4 font-semibold">
                {item.title}
              </p>
            </div>
          ))}
      </div>
    </section>
  );
}

/* ================= ADMIN CMS ================= */

export default function AdminCategorySlider() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* -------- FETCH -------- */
  useEffect(() => {
    API.get("http://localhost:5000/api/category-slider")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-10">Loading…</p>;
  if (!data) return <p className="p-10">No Data</p>;

  /* -------- HELPERS -------- */

  const updateItem = (index, field, value) => {
    const items = [...data.items];
    items[index] = { ...items[index], [field]: value };
    setData({ ...data, items });
  };

  const addItem = () => {
    setData({
      ...data,
      items: [
        ...data.items,
        {
          title: "New Category",
          slug: "new-category",      // 🔥 ADDED
          tag: "NEW",
          image: "",
          order: data.items.length + 1,
        },
      ],
    });
  };

  const deleteItem = (index) => {
    setData({
      ...data,
      items: data.items.filter((_, i) => i !== index),
    });
  };

  /* -------- IMAGE UPLOAD -------- */
  const uploadImage = async (file, index) => {
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);

    const res = await API.post(
      "http://localhost:5000/api/category-slider/upload",
      fd
    );

    updateItem(index, "image", res.data.url);
  };

  /* -------- SAVE -------- */
  const save = async () => {
    await API.put("http://localhost:5000/api/category-slider", data);
    alert("Category Slider Saved");
  };

  /* -------- RESET TO DEFAULT -------- */
  const resetToDefault = async () => {
    if (!confirm("Reset category slider to default data?")) return;

    const res = await API.post(
      "http://localhost:5000/api/category-slider/reset"
    );

    setData(res.data);
  };

  return (
    <div className="grid grid-cols-12 min-h-screen bg-slate-100">

      {/* ================= LEFT : CMS ================= */}
      <div className="col-span-5 bg-white p-10 space-y-8 overflow-y-auto">
        <h1 className="text-3xl font-serif italic">
          Category Slider CMS
        </h1>

        {/* -------- SECTION CONTENT -------- */}
        <div>
          <label className="text-xs uppercase">Heading</label>
          <input
            value={data.heading}
            onChange={e =>
              setData({ ...data, heading: e.target.value })
            }
            className="w-full border p-2"
          />
        </div>

        <div>
          <label className="text-xs uppercase">Description</label>
          <textarea
            rows={3}
            value={data.description}
            onChange={e =>
              setData({ ...data, description: e.target.value })
            }
            className="w-full border p-2"
          />
        </div>

        {/* -------- CATEGORY CARDS -------- */}
        {data.items.map((item, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 space-y-3"
          >
            <input
              value={item.title}
              onChange={e =>
                updateItem(i, "title", e.target.value)
              }
              className="w-full border p-2"
              placeholder="Title"
            />

            <input
              value={item.slug}
              onChange={e =>
                updateItem(i, "slug", e.target.value)
              }
              className="w-full border p-2"
              placeholder="Slug (e.g. bowls)"   // 🔥 ADDED
            />

            <input
              value={item.tag}
              onChange={e =>
                updateItem(i, "tag", e.target.value)
              }
              className="w-full border p-2"
              placeholder="Tag"
            />

            <input
              type="number"
              value={item.order}
              onChange={e =>
                updateItem(i, "order", Number(e.target.value))
              }
              className="w-full border p-2"
              placeholder="Order"
            />

            {item.image && (
              <img
                src={item.image}
                className="h-24 rounded object-cover"
              />
            )}

            <input
              type="file"
              onChange={e =>
                uploadImage(e.target.files[0], i)
              }
            />

            <button
              onClick={() => deleteItem(i)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        ))}

        <button
          onClick={addItem}
          className="border px-4 py-2"
        >
          + Add Category
        </button>

        <div className="flex gap-4">
          <button
            onClick={save}
            className="bg-black text-white px-6 py-2"
          >
            Save Changes
          </button>

          <button
            onClick={resetToDefault}
            className="border border-red-500 text-red-600 px-6 py-2"
          >
            Reset to Default
          </button>
        </div>
      </div>

      {/* ================= RIGHT : LIVE PREVIEW ================= */}
      <div className="col-span-7 flex items-center justify-center p-10">
        <CategoryPreview data={data} />
      </div>
    </div>
  );
}
