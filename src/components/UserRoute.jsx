// src/components/UserRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function UserRoute({ children }) {
  const role = localStorage.getItem('role');
  return role === 'user' ? children : <Navigate to="/" />;
}
