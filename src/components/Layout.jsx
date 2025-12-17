import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} ETS2 Mods Hub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}