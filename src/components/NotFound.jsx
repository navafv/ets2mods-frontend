import { Link } from "react-router-dom";
import { SearchX, Home } from "lucide-react";

export default function NotFound({ 
  title = "Content Not Found", 
  message = "The page you are looking for does not exist or has been removed.",
  showHomeButton = true 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fadeIn">
      <div className="bg-slate-100 p-6 rounded-full mb-6">
        <SearchX size={48} className="text-slate-400" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md mb-8">{message}</p>
      
      {showHomeButton && (
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-sm hover:shadow-md"
        >
          <Home size={20} />
          Go to Homepage
        </Link>
      )}
    </div>
  );
}