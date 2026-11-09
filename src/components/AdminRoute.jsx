import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--slate-600, #475569)', fontSize: '1.1rem' }}>Verifying permissions…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

