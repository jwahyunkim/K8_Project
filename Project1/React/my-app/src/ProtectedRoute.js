import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


export function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  let decoded;
  try {
    decoded = jwtDecode(token);
  } catch (error) {
    console.error("토큰 디코딩 에러:", error);
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(decoded.role)) {
    return <Navigate to="/error" replace />;
  }

  return children;
}
