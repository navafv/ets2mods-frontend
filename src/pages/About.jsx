import { Info, Users, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">About ETS2 Mods Hub</h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Your premier destination for high-quality Euro Truck Simulator 2 modifications.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Mission</h2>
        <p className="text-slate-600 leading-relaxed mb-6">
          Founded by passionate trucking enthusiasts, ETS2 Mods Hub aims to bring the trucking community closer together. 
          We provide a platform where creators can share their work freely, and drivers can find the best mods to enhance 
          their simulation experience. Whether you're looking for new trucks, maps, or graphical enhancements, we've got you covered.
        </p>
        <p className="text-slate-600 leading-relaxed">
          We believe in open sharing and respect for modders' work. All mods hosted here are attributed to their original 
          authors, and we encourage users to support the creators who make this game amazing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Curated Content</h3>
          <p className="text-sm text-slate-600">We verify submissions to ensure they are safe and high-quality for your game.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition text-center">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Community Driven</h3>
          <p className="text-sm text-slate-600">Built by players, for players. Join discussions and share your feedback.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition text-center">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Safe & Secure</h3>
          <p className="text-sm text-slate-600">We prioritize security so you can download with confidence.</p>
        </div>
      </div>
    </div>
  );
}