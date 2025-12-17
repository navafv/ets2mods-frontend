import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, User, Calendar, Tag, ChevronLeft, MessageSquare, Layers } from "lucide-react";
import { useMod, usePostComment } from "../hooks/useApi";

export default function ModDetail() {
  const { slug } = useParams();
  const { data: mod, isLoading, isError } = useMod(slug);
  const postComment = usePostComment();
  
  const [activeImage, setActiveImage] = useState(null);
  
  // Form State
  const [commentName, setCommentName] = useState("");
  const [commentBody, setCommentBody] = useState("");

  // Sync active image when mod data loads
  useEffect(() => {
    if (mod?.images?.length > 0 && !activeImage) {
      // Find cover or default to first
      const cover = mod.images.find(i => i.is_cover) || mod.images[0];
      setActiveImage(cover.image);
    }
  }, [mod, activeImage]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentName.trim() || !commentBody.trim()) return;
    
    postComment.mutate({
      modId: mod.id,
      user_name: commentName,
      content: commentBody
    }, {
      onSuccess: () => {
        setCommentBody("");
        // Optional: Show toast notification
      }
    });
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    // Handle both youtube.com/watch?v= and youtu.be/ formats
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1];
    }
    
    // Remove any additional query params like &t=
    if (videoId.includes("&")) {
      videoId = videoId.split("&")[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  if (isLoading) return <div className="text-center py-20">Loading mod details...</div>;
  if (isError || !mod) return <div className="text-center py-20 text-red-500">Mod not found.</div>;

  const embedUrl = getEmbedUrl(mod.youtube_url);

  return (
    <div className="animate-fadeIn pb-10">
      {/* Breadcrumb */}
      <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 transition text-sm sm:text-base">
        <ChevronLeft size={16} className="mr-1" /> Back to Mods
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Media & Content */}
        <div className="lg:col-span-2 space-y-8 min-w-0"> {/* min-w-0 fixes flex/grid child overflow issues */}
          
          {/* Main Image Gallery */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="aspect-video bg-slate-100 relative flex items-center justify-center">
              {activeImage ? (
                <img 
                  src={activeImage} 
                  alt={mod.title} 
                  className="w-full h-full object-contain" 
                />
              ) : (
                <span className="text-slate-400">No images available</span>
              )}
            </div>
            
            {/* Thumbnails */}
            {mod.images?.length > 1 && (
              <div className="p-4 flex gap-3 overflow-x-auto border-t border-slate-100 no-scrollbar">
                {mod.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img.image)}
                    className={`shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition ${
                      activeImage === img.image ? "border-blue-600 ring-1 ring-blue-600" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <img src={img.image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">About this Mod</h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap wrap-break-word text-sm sm:text-base">
              {mod.description}
            </div>
          </div>

           {/* Video */}
           {embedUrl && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Video Preview</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <iframe 
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title="Mod Preview"
                />
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MessageSquare size={20} /> Comments
            </h2>
            
            <div className="space-y-6 mb-8">
              {mod.comments?.length === 0 ? (
                <p className="text-slate-400 italic">No comments yet. Be the first!</p>
              ) : (
                mod.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                      {comment.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-x-2 mb-1">
                        <span className="font-semibold text-slate-900">{comment.user_name}</span>
                        <span className="text-xs text-slate-400">• {new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-600 text-sm wrap-break-word">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSubmitComment} className="mt-6 border-t border-slate-100 pt-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Leave a Reply</h3>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="input-field"
                  value={commentName}
                  onChange={e => setCommentName(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Write a comment..."
                  className="input-field h-24 resize-none"
                  value={commentBody}
                  onChange={e => setCommentBody(e.target.value)}
                  required
                />
                <button 
                  type="submit" 
                  disabled={postComment.isPending}
                  className="btn-primary w-full sm:w-auto"
                >
                  {postComment.isPending ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Info & Download */}
        <div className="space-y-6 min-w-0">
          
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 lg:sticky lg:top-24">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 leading-tight wrap-break-word">{mod.title}</h1>
            
            <div className="flex flex-col gap-3 mb-6 text-sm text-slate-600">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="flex items-center gap-2"><User size={16}/> Uploader</span>
                <span className="font-medium text-slate-900 truncate ml-2">{mod.uploader_name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="flex items-center gap-2"><Tag size={16}/> Category</span>
                <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded truncate ml-2">{mod.category_name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="flex items-center gap-2"><Layers size={16}/> Version</span>
                <span className="font-medium text-slate-900 truncate ml-2">{mod.version || "1.0"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="flex items-center gap-2"><Calendar size={16}/> Date</span>
                <span className="truncate ml-2">{new Date(mod.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900">Download Links</h3>
              {mod.download_links?.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-green-100 text-green-600 p-2 rounded-lg shrink-0">
                      <Download size={20} />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="font-semibold text-slate-900 text-sm truncate">{link.name}</div>
                      <div className="text-xs text-slate-500 truncate">{link.file_size}</div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}