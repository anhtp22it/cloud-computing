import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleLanding = () => {
  const { user } = useSelector((s) => s.auth);
  const isAdmin = user?.roles?.some((r) => r.role_name === "ROLE_ADMIN");
  if (isAdmin) return <Navigate to="/admin/events" replace />;
  return <Navigate to="/dashboard" replace />;
};

export default RoleLanding;
