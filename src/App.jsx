import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import HomePage from './pages/HomePage';
import CampsPage from './pages/CampsPage';
import CampDetailsPage from './pages/CampDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterDonorPage from './pages/RegisterDonorPage';
import DonorsPage from './pages/DonorsPage';
import RequestBloodPage from './pages/RequestBloodPage';
import RequestsPage from './pages/RequestsPage';
import AdminPage from './pages/AdminPage';

function ScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <ScrollHandler />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/camps" element={<CampsPage />} />
        <Route path="/camp-details" element={<CampDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Authenticated Routes */}
        <Route
          path="/register-donor"
          element={
            <ProtectedRoute>
              <RegisterDonorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donors"
          element={
            <ProtectedRoute>
              <DonorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/request-blood"
          element={
            <ProtectedRoute>
              <RequestBloodPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <RequestsPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        {/* Redirects from old .html paths */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/camps.html" element={<Navigate to="/camps" replace />} />
        <Route path="/camp-details.html" element={<Navigate to="/camp-details" replace />} />
        <Route path="/login.html" element={<Navigate to="/login" replace />} />
        <Route path="/register.html" element={<Navigate to="/register" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
