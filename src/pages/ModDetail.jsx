import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ModDetail() {
  const { slug } = useParams();
  const [mod, setMod] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Comment Form State
  const [commentUser, setCommentUser] = useState("");
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    api.get(`mods/items/${slug}/`).then((res) => {
      setMod(res.data);
      if (res.data.images?.length) setSelectedImage(res.data.images[0].image);
    });
  }, [slug]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentUser || !commentContent) return;
    
    try {
      await api.post("mods/comments/", {
        mod_id: mod.id,
        user_name: commentUser,
        content: commentContent
      });
      // Refresh mod data to see new comment
      const res = await api.get(`mods/items/${slug}/`);
      setMod(res.data);
      setCommentContent("");
    } catch {
      alert("Failed to post comment");
    }
  };

  if (!mod) return <div className="text-white text-center p-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{mod.title}</h1>
        <p className="text-slate-400 mt-1">
          Uploaded by <span className="text-blue-400">{mod.uploader_name}</span> • {mod.created_at.split('T')[0]}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Media & Description */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Gallery */}
          {selectedImage && (
             <div className="rounded-lg overflow-hidden border border-slate-700 bg-black">
               <img src={selectedImage} alt="Preview" className="w-full max-h-125 object-contain" />
             </div>
          )}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {mod.images?.map((img) => (
              <button 
                key={img.id} 
                onClick={() => setSelectedImage(img.image)}
                className={`shrink-0 w-24 h-16 rounded overflow-hidden border ${selectedImage === img.image ? 'border-blue-500' : 'border-transparent'}`}
              >
                <img src={img.image} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Description */}
          <div className="bg-card p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-slate-300">
              {mod.description}
            </div>
          </div>

          {/* YouTube Embed */}
          {mod.youtube_url && (
            <div className="bg-card p-6 rounded-lg border border-slate-800">
               <h2 className="text-xl font-bold mb-4">Video Preview</h2>
               <div className="aspect-video">
                 <iframe 
                   src={mod.youtube_url.replace("watch?v=", "embed/")} 
                   className="w-full h-full rounded"
                   allowFullScreen
                 />
               </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="bg-card p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-bold mb-6">Comments ({mod.comments?.length || 0})</h2>
            
            {/* List */}
            <div className="space-y-4 mb-8">
              {mod.comments?.map((c) => (
                <div key={c.id} className="border-b border-slate-800 pb-4 last:border-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-blue-400">{c.user_name}</span>
                    <span className="text-slate-500">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-300">{c.content}</p>
                </div>
              ))}
              {mod.comments?.length === 0 && <p className="text-slate-500">No comments yet.</p>}
            </div>

            {/* Form */}
            <form onSubmit={submitComment} className="bg-slate-900 p-4 rounded border border-slate-800">
              <h3 className="font-semibold mb-3">Leave a Reply</h3>
              <input 
                placeholder="Name (Guest)" 
                className="w-full bg-black border border-slate-700 rounded p-2 mb-3 text-white"
                value={commentUser}
                onChange={e => setCommentUser(e.target.value)}
                required
              />
              <textarea 
                placeholder="Write your comment..." 
                className="w-full bg-black border border-slate-700 rounded p-2 mb-3 text-white h-24"
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
                required
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Post Comment
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Downloads & Info */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg border border-slate-800 sticky top-4">
            <h2 className="text-xl font-bold mb-4 text-center">Download</h2>
            
            <div className="space-y-3">
              {mod.download_links?.map((link) => (
                <a 
                  key={link.id}
                  href={link.url}
                  target="_blank" 
                  rel="noreferrer"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded font-bold transition flex-col"
                >
                  <span>Download via {link.name}</span>
                  <span className="text-xs font-normal opacity-80">Size: {link.file_size}</span>
                </a>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700 space-y-2 text-sm text-slate-400">
              <div className="flex justify-between">
                <span>Version</span>
                <span className="text-white">{mod.version || "1.0"}</span>
              </div>
              <div className="flex justify-between">
                <span>Category</span>
                <span className="text-white">{mod.category_name}</span>
              </div>
              <div className="flex justify-between">
                <span>Views</span>
                <span className="text-white">{mod.view_count}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}