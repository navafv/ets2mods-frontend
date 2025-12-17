import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from "./config/queryClient";
import Layout from "./components/Layout";
import QueryErrorBoundary from "./components/QueryErrorBoundary";

// Pages
import Home from "./pages/Home";
import ModDetail from "./pages/ModDetail";
import UploadMod from "./pages/UploadMod";
import About from "./pages/About";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <QueryErrorBoundary>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mods/:slug" element={<ModDetail />} />
              <Route path="/upload" element={<UploadMod />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* 404 */}
              <Route path="*" element={
                <div className="text-center py-20">
                  <h1 className="text-4xl font-bold mb-4 text-slate-900">404</h1>
                  <p className="text-slate-500">Page not found</p>
                </div>
              } />
            </Routes>
          </Layout>
        </QueryErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}