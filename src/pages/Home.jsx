// src/pages/Home.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMods, useCategories } from "../hooks/useApi";
import SkeletonCard from "../components/SkeletonCard";
import Pagination from "../components/Pagination";
import SEO from "../components/SEO";

export default function Home() {
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const { 
    data: categoriesData, 
    isLoading: categoriesLoading,
    error: categoriesError 
  } = useCategories();
  
  const { 
    data: modsData, 
    isLoading: modsLoading,
    isPreviousData,
    error: modsError
  } = useMods(
    {
      category: categoryFilter,
      search: searchFilter,
    },
    page,
    20
  );

  // Safely extract categories array
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  
  // Safely extract mods data
  const mods = Array.isArray(modsData?.results) ? modsData.results : [];
  const total = modsData?.count || 0;

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setPage(1);
  };

  // Show error states
  if (categoriesError || modsError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Data</h2>
        <p className="text-gray-400">
          {categoriesError?.message || modsError?.message || "Please try again later"}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="ETS2 Mods – Best Euro Truck Simulator 2 Mods"
        description="Download the best ETS2 mods, trucks, maps and trailers"
      />
      
      <h1 className="text-3xl font-bold mb-4">ETS2 Mods</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search mods..."
            className="w-full p-2 bg-black border border-gray-700 rounded"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
        
        <select
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="bg-black border border-gray-700 p-2 rounded"
          disabled={categoriesLoading}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id || c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Mods Grid */}
      {modsLoading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : mods.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No mods found.</p>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or browse all categories.
          </p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {mods.map((mod) => (
              <Link
                key={mod.id}
                to={`/mods/${mod.id}`}
                className="bg-card p-4 rounded border border-gray-800 hover:border-blue-500 hover:scale-[1.02] transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="font-semibold group-hover:text-blue-400 transition-colors line-clamp-2">
                    {mod.title}
                  </h2>
                  <span className="text-xs bg-gray-800 px-2 py-1 rounded whitespace-nowrap">
                    v{mod.version}
                  </span>
                </div>
                
                <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                  {mod.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span>⭐</span>
                    <span>{mod.average_rating || 'No ratings'}</span>
                  </span>
                  <span>📥 {mod.download_count}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {total > 20 && (
            <Pagination
              page={page}
              total={total}
              pageSize={20}
              onPage={setPage}
              disabled={isPreviousData}
            />
          )}
        </>
      )}

      {/* Stats - Only show if we have data */}
      {mods.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-900 rounded">
              <div className="text-2xl font-bold">{total || 0}</div>
              <div className="text-sm text-gray-400">Total Mods</div>
            </div>
            <div className="text-center p-4 bg-gray-900 rounded">
              <div className="text-2xl font-bold">
                {mods.reduce((sum, mod) => sum + mod.download_count, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total Downloads</div>
            </div>
            <div className="text-center p-4 bg-gray-900 rounded">
              <div className="text-2xl font-bold">{categories.length}</div>
              <div className="text-sm text-gray-400">Categories</div>
            </div>
            <div className="text-center p-4 bg-gray-900 rounded">
              <div className="text-2xl font-bold">
                {new Set(mods.map(m => m.author?.id || m.author)).size}
              </div>
              <div className="text-sm text-gray-400">Active Modders</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}