import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowGuest = false }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="container empty"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (user.isGuest && !allowGuest) {
    return <Navigate to="/login" state={{ from: loc.pathname, msg: 'Please register to access this area.' }} replace />;
  }
  return children;
}
