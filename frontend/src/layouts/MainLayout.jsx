import { Alert, Snackbar } from "@mui/material";
import { closeSnackbar } from "@store/slices/snackbarSlice";
import React, { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import HeaderUser from "@/components/features/user/HeaderUser";
import FooterUser from "@/components/features/user/FooterUser";

const MainLayout = () => {
  const dispatch = useDispatch();

  const { open, type, message } = useSelector((state) => {
    return state.snackbar;
  });

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeaderUser />
        <div className="mx-auto max-w-6xl px-5">
          <Outlet />
        </div>
        <FooterUser />
      </Suspense>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => dispatch(closeSnackbar())}
      >
        <Alert
          onClose={() => dispatch(closeSnackbar())}
          severity={type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MainLayout;
