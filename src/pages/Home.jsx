import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Home() {
  const [mods, setMods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine URL based on search/category (simplified for now)
    api.get("mods/items/")
      .then((res) => {
        setMods(res.data.results || res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10 text-white">Loading mods...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-3xl font-bold text-white">Latest Mods</h1>
      </div>
      
      {mods.length === 0 ? (
        <p className="text-gray-400 text-center">No mods found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mods.map((mod) => (
            <Link 
              key={mod.id} 
              to={`/mods/${mod.slug}`} // Uses slug from backend
              className="bg-card rounded-lg overflow-hidden border border-slate-800 hover:border-blue-500 transition group"
            >
              <div className="h-48 bg-slate-800 overflow-hidden relative">
                 {mod.cover_image ? (
                   <img 
                     src={mod.cover_image} 
                     alt={mod.title} 
                     className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-600">
                     No Cover
                   </div>
                 )}
              </div>
              
              <div className="p-4">
                <h2 className="text-lg font-semibold text-white truncate">{mod.title}</h2>
                <div className="flex justify-between items-center mt-2 text-sm text-slate-400">
                  <span className="bg-slate-800 px-2 py-0.5 rounded">{mod.category_name}</span>
                  <span>👁 {mod.view_count}</span>
                </div>
                <p className="text-slate-500 text-xs mt-3">Uploaded by {mod.uploader_name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}