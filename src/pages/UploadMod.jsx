import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function UploadMod() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    uploader_name: "",
    version: "1.0",
    youtube_url: "",
  });

  // Dynamic Links
  const [links, setLinks] = useState([{ name: "ShareMods", url: "", file_size: "" }]);

  // Files
  const [coverImage, setCoverImage] = useState(null);
  const [screenshots, setScreenshots] = useState([]);

  useEffect(() => {
    api.get("categories/").then(res => setCategories(res.data.results || res.data));
  }, []);

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const addLink = () => setLinks([...links, { name: "", url: "", file_size: "" }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // 1. Create the Mod object with links
      const payload = {
        ...formData,
        download_links: links.filter(l => l.url) // Only send valid links
      };
      
      const res = await api.post("mods/items/", payload);
      const modId = res.data.id;

      // 2. Upload Cover Image
      if (coverImage) {
        const coverData = new FormData();
        coverData.append("mod", modId);
        coverData.append("image", coverImage);
        coverData.append("is_cover", "true");
        await api.post("mods/images/", coverData, { headers: { "Content-Type": "multipart/form-data" } });
      }

      // 3. Upload Screenshots
      for (let file of screenshots) {
        const screenData = new FormData();
        screenData.append("mod", modId);
        screenData.append("image", file);
        screenData.append("is_cover", "false");
        await api.post("mods/images/", screenData, { headers: { "Content-Type": "multipart/form-data" } });
      }

      alert("Mod uploaded successfully! It is now pending approval.");
      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Upload failed. Please check your inputs.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-card p-8 rounded border border-slate-800">
      <h1 className="text-2xl font-bold text-white mb-6">Upload a New Mod</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <input 
            placeholder="Mod Title" 
            className="input-field col-span-2"
            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required 
          />
          <input 
            placeholder="Your Name (or Anonymous)" 
            className="input-field"
            value={formData.uploader_name} onChange={e => setFormData({...formData, uploader_name: e.target.value})} 
          />
           <input 
            placeholder="Version (e.g. 1.0)" 
            className="input-field"
            value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} 
          />
          <select 
            className="input-field col-span-2"
            value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required
          >
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <textarea 
          placeholder="Description" 
          className="input-field h-32"
          value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required 
        />

        <input 
            placeholder="YouTube Video URL (Optional)" 
            className="input-field"
            value={formData.youtube_url} onChange={e => setFormData({...formData, youtube_url: e.target.value})} 
        />

        {/* Download Links */}
        <div className="border-t border-slate-700 pt-4">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Download Links</label>
          {links.map((link, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input 
                placeholder="Site Name (e.g. Drive)" 
                className="input-field w-1/3"
                value={link.name} onChange={e => handleLinkChange(index, "name", e.target.value)} required 
              />
              <input 
                placeholder="URL" 
                className="input-field w-1/3"
                value={link.url} onChange={e => handleLinkChange(index, "url", e.target.value)} required 
              />
              <input 
                placeholder="Size (e.g. 50MB)" 
                className="input-field w-1/3"
                value={link.file_size} onChange={e => handleLinkChange(index, "file_size", e.target.value)} required 
              />
            </div>
          ))}
          <button type="button" onClick={addLink} className="text-sm text-blue-400 hover:text-blue-300">+ Add another link</button>
        </div>

        {/* Images */}
        <div className="border-t border-slate-700 pt-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Cover Image</label>
            <input type="file" accept="image/*" className="text-slate-400" onChange={e => setCoverImage(e.target.files[0])} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Screenshots (Optional)</label>
            <input type="file" accept="image/*" multiple className="text-slate-400" onChange={e => setScreenshots([...e.target.files])} />
          </div>
        </div>

        <button 
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition"
        >
          {uploading ? "Uploading..." : "Submit Mod"}
        </button>

      </form>
    </div>
  );
}