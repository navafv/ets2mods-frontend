import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from "./config/queryClient";
import Layout from "./components/Layout";
import QueryErrorBoundary from "./components/QueryErrorBoundary";

// Pages
import Home from "./pages/Home";
import ModDetail from "./pages/ModDetail";
import UploadMod from "./pages/UploadMod";
import Tutorials from "./pages/Tutorials";

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
              <Route path="/tutorials" element={<Tutorials />} />
              
              {/* 404 */}
              <Route path="*" element={
                <div className="text-center py-20">
                  <h1 className="text-4xl font-bold mb-4">404</h1>
                  <p className="text-gray-400">Page not found</p>
                </div>
              } />
            </Routes>
          </Layout>
        </QueryErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}