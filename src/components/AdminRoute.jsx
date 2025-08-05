// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const role = localStorage.getItem('role');
  return role === 'admin' ? children : <Navigate to="/Login" />;
}
