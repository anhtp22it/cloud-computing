import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.roles?.some((role) => role.role_name === 'ROLE_ADMIN');

  if (isAdmin) return <Outlet />;
  return <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
