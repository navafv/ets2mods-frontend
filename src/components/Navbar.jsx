import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-blue-500">
            ETS2 MODS
          </Link>

          <div className="flex space-x-6">
            <Link to="/" className="hover:text-blue-400 transition">Home</Link>
            <Link to="/tutorials" className="hover:text-blue-400 transition">Tutorials</Link>
          </div>

          <div>
            <Link 
              to="/upload" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition"
            >
              Upload Mod
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}