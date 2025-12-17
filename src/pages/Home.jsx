import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, Filter, Calendar, Eye, Layers, 
  Truck, Container, Map, Armchair, Speaker, 
  Image as ImageIcon, Palette, Wrench, Car, 
  Layout, Activity, Terminal, MoreHorizontal,
  ChevronDown, ChevronUp 
} from "lucide-react";
import { useMods, useCategories } from "../hooks/useApi";
import useDebounce from "../hooks/useDebounce";
import SkeletonCard from "../components/SkeletonCard";
import Pagination from "../components/Pagination";

// Icon mapping: Backend string -> Lucide Component
const iconMap = {
  truck: Truck,
  trucks: Truck,
  container: Container,
  trailers: Container,
  map: Map,
  maps: Map,
  armchair: Armchair,
  interiors: Armchair,
  speaker: Speaker,
  sounds: Speaker,
  image: ImageIcon,
  graphics: ImageIcon,
  palette: Palette,
  skins: Palette,
  wrench: Wrench,
  "parts-tuning": Wrench,
  car: Car,
  traffic: Car,
  layout: Layout,
  "ui-hud": Layout,
  activity: Activity,
  physics: Activity,
  terminal: Terminal,
  "cheats-others": Terminal,
  "more-horizontal": MoreHorizontal,
  other: MoreHorizontal
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  // Data Fetching
  const { data: categories } = useCategories();
  const { data: modsData, isLoading, isError } = useMods({
    search: debouncedSearch,
    category: selectedCategory,
    ordering: sortBy,
  }, page);

  const mods = modsData?.results || [];
  const totalCount = modsData?.count || 0;

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug === selectedCategory ? "" : slug);
    setPage(1);
    setShowMobileFilters(false); // Close mobile filters on selection
  };

  const getCategoryIcon = (iconName) => {
    const IconComponent = iconMap[iconName?.toLowerCase()] || Layers;
    return <IconComponent size={18} />;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button 
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-slate-700 font-medium"
        >
          <span className="flex items-center gap-2"><Filter size={18}/> Filters & Categories</span>
          {showMobileFilters ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
        </button>
      </div>

      {/* Sidebar Filters */}
      <aside className={`w-full lg:w-64 shrink-0 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
        
        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search mods..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Layers size={18} /> Categories
          </h3>
          <div className="space-y-1 max-h-100 lg:max-h-none overflow-y-auto lg:overflow-visible">
            <button
              onClick={() => handleCategoryChange("")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-3 ${
                selectedCategory === "" 
                  ? "bg-blue-50 text-blue-700 font-medium" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Layers size={18} />
              All Categories
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-3 ${
                  selectedCategory === cat.slug 
                    ? "bg-blue-50 text-blue-700 font-medium" 
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {getCategoryIcon(cat.icon || cat.slug)} 
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header & Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 truncate max-w-full">
            {selectedCategory ? (
               <span className="flex items-center gap-2 truncate">
                 <span className="shrink-0">{getCategoryIcon(categories?.find(c => c.slug === selectedCategory)?.icon || selectedCategory)}</span>
                 <span className="truncate">{categories?.find(c => c.slug === selectedCategory)?.name || 'Category'} Mods</span>
               </span>
            ) : "Latest Mods"}
          </h1>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-slate-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none bg-white border border-slate-200 text-sm rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
            >
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
              <option value="-view_count">Most Viewed</option>
              <option value="title">A-Z</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : isError ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <p className="text-red-500">Error loading mods. Please try again later.</p>
          </div>
        ) : mods.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-slate-900">No mods found</h3>
            <p className="text-slate-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {mods.map((mod) => (
                <Link 
                  key={mod.id} 
                  to={`/mods/${mod.slug}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-slate-200 hover:border-blue-300 overflow-hidden transition duration-300 flex flex-col h-full"
                >
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    {mod.cover_image ? (
                      <img 
                        src={mod.cover_image} 
                        alt={mod.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <TruckIcon size={48} className="opacity-20" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                      {mod.category_name}
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition mb-1 line-clamp-1">
                      {mod.title}
                    </h2>
                    <p className="text-sm text-slate-500 mb-4">
                      by <span className="font-medium text-slate-700">{mod.uploader_name}</span>
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(mod.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        {mod.view_count}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <Pagination 
              page={page} 
              total={totalCount} 
              pageSize={12} 
              onPageChange={setPage} 
            />
          </>
        )}
      </div>
    </div>
  );
}

function TruckIcon({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M10 17h4V5H2v12h3" />
      <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
      <path d="M14 17h1" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}