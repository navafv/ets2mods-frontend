// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { QueryClientProvider } from '@tanstack/react-query';
import AdminRoute from "./routes/AdminRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import QueryErrorBoundary from "./components/QueryErrorBoundary";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ModDetail from "./pages/ModDetail";
import Layout from "./components/Layout";
import Forums from "./pages/Forums";
import UploadMod from "./pages/UploadMod";
import ForumThread from "./pages/ForumThread";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminMods from "./pages/AdminMods";
import AccountSettings from "./pages/AccountSettings";
import { queryClient } from "./config/queryClient";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <QueryErrorBoundary>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/mods/:id" element={<ModDetail />} />
                <Route path="/search" element={<Home />} />
                <Route path="/categories" element={<Home />} />
                <Route path="/forums" element={<Forums />} />
                <Route path="/upload" element={
                  <ProtectedRoute>
                    <UploadMod />
                  </ProtectedRoute>
                } />
                <Route path="/forums/thread/:slug" element={<ForumThread />} />
                <Route path="/account" element={
                  <ProtectedRoute>
                    <AccountSettings />
                  </ProtectedRoute>
                } />
                <Route path="/admin/analytics" element={
                  <AdminRoute>
                    <AdminAnalytics />
                  </AdminRoute>
                } />
                <Route path="/admin/mods" element={
                  <AdminRoute>
                    <AdminMods />
                  </AdminRoute>
                } />
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
      </AuthProvider>
    </QueryClientProvider>
  );
}