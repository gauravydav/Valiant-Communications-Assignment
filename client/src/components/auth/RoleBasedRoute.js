import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken.role;
  }
  return null;
};

const RoleBasedRoute = ({ element: Element, allowedRoles }) => {
  const userRole = getUserRole();
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/not-found" replace />;
  }
  return <Element />;
};

export default RoleBasedRoute;
