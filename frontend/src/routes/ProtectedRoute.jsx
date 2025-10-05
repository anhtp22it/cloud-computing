import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import { useGetAuthUserQuery } from "@api/authApi";
import Loading from "@/components/ui/Loading";

const ProtectedRoute = () => {
  const { accessToken } = useSelector((state) => state.auth);

  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
  } = useGetAuthUserQuery(undefined);

  if (isLoading) {
    return <Loading message="Đang xác thực..." />;
  }

  if (isError || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (isSuccess && user) {
    return <Outlet />;
  }

  return <Loading message="Đang xác thực..." />;
};

export default React.memo(ProtectedRoute);
