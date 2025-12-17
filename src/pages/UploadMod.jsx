import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUploadMod, useUploadModImage, useCategories } from "../hooks/useApi";
import { UploadCloud, Link as LinkIcon, Plus, X, Image as ImageIcon, AlertTriangle } from "lucide-react";

export default function UploadMod() {
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const uploadMod = useUploadMod();
  const uploadImage = useUploadModImage();

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    uploader_name: "",
    uploader_email: "",
    version: "1.0",
    youtube_url: "",
  });

  const [links, setLinks] = useState([{ name: "", url: "", file_size: "" }]);
  const [images, setImages] = useState([]); // Array of File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Array of URL strings

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const addLink = () => setLinks([...links, { name: "", url: "", file_size: "" }]);
  const removeLink = (index) => setLinks(links.filter((_, i) => i !== index));

  const handleImageSelect = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      alert("Please select a category");
      return;
    }

    try {
      // 1. Create Mod
      const modPayload = {
        ...formData,
        download_links: links.filter(l => l.url && l.name)
      };
      
      const mod = await uploadMod.mutateAsync(modPayload);
      
      // 2. Upload Images
      if (images.length > 0) {
        // Upload images sequentially or parallel
        await Promise.all(images.map((file, index) => {
          const imgData = new FormData();
          imgData.append("mod", mod.id);
          imgData.append("image", file);
          // First image is cover
          if (index === 0) imgData.append("is_cover", "true");
          return uploadImage.mutateAsync(imgData);
        }));
      }

      navigate(`/mods/${mod.slug}`);
    } catch (error) {
      console.error(error);
      alert("Failed to upload mod. Please check the form.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn px-0 sm:px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Upload a Mod</h1>
        <p className="text-slate-500 mt-2 text-sm sm:text-base">Share your creation with the community</p>
      </div>

      {/* Warning Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-md shadow-sm mx-4 sm:mx-0">
        <div className="flex">
          <div className="shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Before you upload</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Strictly <strong>NO LEAKING</strong> of paid mods. Uploading someone else's work without permission is prohibited.
              </p>
              <p className="mt-1">
                We collect your <strong>IP address</strong> and <strong>Email</strong> to prevent abuse and track unauthorized uploads. Violators will be banned.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-5 sm:p-8 sm:rounded-2xl shadow-sm border-y sm:border border-slate-200">
        
        {/* Basic Info */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Mod Title</label>
              <input name="title" className="input-field" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div>
              <label className="label">Version</label>
              <input name="version" className="input-field" value={formData.version} onChange={handleInputChange} placeholder="e.g. 1.2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select name="category" className="input-field" value={formData.category} onChange={handleInputChange} required>
                <option value="">Select Category...</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Uploader Name</label>
              <input name="uploader_name" className="input-field" value={formData.uploader_name} onChange={handleInputChange} placeholder="Your name or alias" />
            </div>
          </div>

          <div>
            <label className="label">Your Email (Private)</label>
            <input name="uploader_email" type="email" className="input-field" value={formData.uploader_email} onChange={handleInputChange} placeholder="Required for verification" required />
            <p className="text-xs text-slate-400 mt-1">We will only use this to contact you regarding your mod.</p>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea name="description" className="input-field h-32" value={formData.description} onChange={handleInputChange} required />
          </div>

          <div>
            <label className="label">YouTube Video (Optional)</label>
            <input name="youtube_url" type="url" className="input-field" value={formData.youtube_url} onChange={handleInputChange} placeholder="https://youtube.com/watch?v=..." />
          </div>
        </section>

        {/* Download Links */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Download Links</h2>
          {links.map((link, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-3 items-start bg-slate-50 p-3 rounded-lg sm:bg-transparent sm:p-0">
              <input placeholder="Host Name (e.g. ShareMods)" className="input-field flex-1" value={link.name} onChange={e => handleLinkChange(index, "name", e.target.value)} required />
              <input placeholder="URL" type="url" className="input-field flex-1" value={link.url} onChange={e => handleLinkChange(index, "url", e.target.value)} required />
              <input placeholder="Size (e.g. 50MB)" className="input-field w-full sm:w-24" value={link.file_size} onChange={e => handleLinkChange(index, "file_size", e.target.value)} required />
              {index > 0 && (
                <button type="button" onClick={() => removeLink(index)} className="p-2 text-red-500 hover:bg-red-50 rounded self-end sm:self-auto">
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addLink} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            <Plus size={16} /> Add another link
          </button>
        </section>

        {/* Images */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Screenshots</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden group border border-slate-200">
                <img src={src} className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                >
                  <X size={12} />
                </button>
                {index === 0 && <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 rounded">Cover</span>}
              </div>
            ))}
            
            <label className="aspect-video border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition text-slate-500 hover:text-blue-600">
              <ImageIcon size={24} className="mb-1" />
              <span className="text-xs font-medium">Add Images</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageSelect} />
            </label>
          </div>
        </section>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={uploadMod.isPending || uploadImage.isPending}
            className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2"
          >
            {uploadMod.isPending ? "Uploading..." : <><UploadCloud size={20} /> Publish Mod</>}
          </button>
        </div>

      </form>
    </div>
  );
}