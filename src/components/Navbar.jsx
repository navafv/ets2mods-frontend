import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Truck, Upload, Home, Info, Mail, Menu, X } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                ETS2<span className="text-blue-600">MODS</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 sm:space-x-4">
            <NavLink to="/" icon={<Home size={18} />} label="Home" active={isActive("/")} />
            <NavLink to="/about" icon={<Info size={18} />} label="About" active={isActive("/about")} />
            <NavLink to="/contact" icon={<Mail size={18} />} label="Contact" active={isActive("/contact")} />
            
            <Link 
              to="/upload" 
              className="ml-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm hover:shadow-md"
            >
              <Upload size={18} />
              <span className="hidden sm:inline">Upload Mod</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
             <Link 
              to="/upload" 
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Upload size={20} />
            </Link>
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white absolute w-full left-0 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <MobileNavLink to="/" icon={<Home size={18} />} label="Home" active={isActive("/")} onClick={toggleMenu} />
            <MobileNavLink to="/about" icon={<Info size={18} />} label="About" active={isActive("/about")} onClick={toggleMenu} />
            <MobileNavLink to="/contact" icon={<Mail size={18} />} label="Contact" active={isActive("/contact")} onClick={toggleMenu} />
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active 
          ? "bg-blue-50 text-blue-700" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MobileNavLink({ to, icon, label, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
        active 
          ? "bg-blue-50 text-blue-700" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}