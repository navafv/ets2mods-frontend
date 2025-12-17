import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from "./config/queryClient";
import Layout from "./components/Layout";
import QueryErrorBoundary from "./components/QueryErrorBoundary";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import ModDetail from "./pages/ModDetail";
import UploadMod from "./pages/UploadMod";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <QueryErrorBoundary>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mods/:slug" element={<ModDetail />} />
                <Route path="/upload" element={<UploadMod />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminDashboard />} />
                
                {/* 404 */}
                <Route path="*" element={
                  <div className="text-center py-20">
                    <h1 className="text-4xl font-bold mb-4 text-slate-900">404</h1>
                    <p className="text-slate-500">Page not found</p>
                  </div>
                } />
              </Routes>
            </Layout>
            <Toaster position="bottom-right" />
          </QueryErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}