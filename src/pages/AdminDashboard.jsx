import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import api from "../api/axios";
import { Check, X, Clock, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. All hooks must be called unconditionally at the top level
  const { data: mods, isLoading } = useQuery({
    queryKey: ['admin-mods'],
    queryFn: async () => {
      // Fetch ONLY pending mods
      const { data } = await api.get('mods/items/?status=pending');
      return data.results || data; 
    },
    // Only run this query if the user is logged in
    enabled: !!user,
  });

  const approveMod = useMutation({
    mutationFn: (slug) => api.post(`mods/items/${slug}/approve/`),
    onSuccess: () => {
      toast.success("Mod Approved!");
      queryClient.invalidateQueries(['admin-mods']);
    },
    onError: () => toast.error("Failed to approve mod")
  });

  const rejectMod = useMutation({
    mutationFn: (slug) => api.post(`mods/items/${slug}/reject/`),
    onSuccess: () => {
      toast.success("Mod Rejected");
      queryClient.invalidateQueries(['admin-mods']);
    },
    onError: () => toast.error("Failed to reject mod")
  });

  // 2. Conditional returns come AFTER all hooks
  if (!user) return <Navigate to="/login" />;

  if (isLoading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="text-orange-500" size={20} />
            Pending Approval ({mods?.length || 0})
          </h2>
        </div>

        {mods?.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No pending mods found. Good job!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {mods.map((mod) => (
              <div key={mod.id} className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                
                {/* Image */}
                <div className="w-full md:w-32 aspect-video bg-slate-100 rounded-lg overflow-hidden shrink-0">
                  {mod.cover_image ? (
                    <img src={mod.cover_image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Image</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg">{mod.title}</h3>
                  <div className="text-sm text-slate-500 mt-1 space-y-1">
                    <p>By: <span className="text-slate-700">{mod.uploader_name}</span> ({mod.uploader_ip})</p>
                    <p>Email: {mod.uploader_email || 'N/A'}</p>
                    <p>Category: {mod.category_name}</p>
                  </div>
                  <Link to={`/mods/${mod.slug}`} target="_blank" className="text-blue-600 text-sm mt-2 inline-flex items-center gap-1 hover:underline">
                    View Full Page <ExternalLink size={14} />
                  </Link>
                </div>

                {/* Actions */}
                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => approveMod.mutate(mod.slug)}
                    className="flex-1 md:flex-none bg-green-50 text-green-600 hover:bg-green-100 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                  >
                    <Check size={18} /> Approve
                  </button>
                  <button 
                    onClick={() => rejectMod.mutate(mod.slug)}
                    className="flex-1 md:flex-none bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                  >
                    <X size={18} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}