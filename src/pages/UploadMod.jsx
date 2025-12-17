import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

export default function UploadMod() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    version: "",
    category: "",
    file_url: "",
  });

  useEffect(() => {
    api.get("categories/").then((res) => setCategories(res.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("mods/", form);
    navigate("/");
  };

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto bg-card p-6 rounded">
      <SEO
        title="ETS2 Mods – Best Euro Truck Simulator 2 Mods"
        description="Download the best ETS2 mods, trucks, maps and trailers"
      />
      <h1 className="text-2xl font-bold mb-4">Upload Mod</h1>

      <input
        placeholder="Title"
        className="w-full mb-3 p-2"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        className="w-full mb-3 p-2"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        placeholder="Version"
        className="w-full mb-3 p-2"
        onChange={(e) => setForm({ ...form, version: e.target.value })}
      />

      <select
        className="w-full mb-3 p-2"
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option>Select Category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        placeholder="Download URL"
        className="w-full mb-4 p-2"
        onChange={(e) => setForm({ ...form, file_url: e.target.value })}
      />

      <button className="bg-primary px-6 py-2 rounded">Upload</button>
    </form>
  );
}
