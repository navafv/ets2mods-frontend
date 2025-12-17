import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Tutorials() {
  const [tutorials, setTutorials] = useState([]);

  useEffect(() => {
    api.get("tutorials/").then(res => setTutorials(res.data.results || res.data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Tutorials</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tutorials.map((t) => (
          <div key={t.id} className="bg-card rounded-lg overflow-hidden border border-slate-800">
            <div className="aspect-video">
              <iframe 
                src={t.video_url.replace("watch?v=", "embed/")} 
                className="w-full h-full"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-white mb-2">{t.title}</h2>
              <p className="text-slate-400 text-sm">{t.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}