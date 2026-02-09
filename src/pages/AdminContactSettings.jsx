import { useEffect, useState } from "react";
import { API } from "../api";

export default function AdminContactSettings() {
  const [form, setForm] = useState({
    phone: "",
    email: "",
    locationText: "",
    mapEmbedUrl: ""
  });

  useEffect(() => {
    API.get("/contact/settings").then(res => {
      if (res.data) setForm(res.data);
    });
  }, []);

  const save = async () => {
    await API.post("/contact/settings", form, { withCredentials: true });
    alert("Saved");
  };

  return (
    <div className="p-10 space-y-6 max-w-3xl">
      <h1 className="text-3xl font-serif italic">Contact Settings</h1>

      {["phone", "email", "locationText", "mapEmbedUrl"].map(field => (
        <input
          key={field}
          value={form[field] || ""}
          onChange={e => setForm({ ...form, [field]: e.target.value })}
          placeholder={field}
          className="w-full border p-4 rounded-lg"
        />
      ))}

      <button
        onClick={save}
        className="bg-stone-900 text-white px-8 py-3 rounded-xl"
      >
        Save Settings
      </button>
    </div>
  );
}
