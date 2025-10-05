import EventCarousel from '@/components/features/auth/EventCarousel';
import Loading from '@/components/ui/Loading';
import { Alert, Snackbar } from '@mui/material';
import { closeSnackbar } from '@store/slices/snackbarSlice';
import React, { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  const dispatch = useDispatch();
  const { open, type, message } = useSelector((state) => state.snackbar);

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <div className="flex min-h-screen bg-white">
          <div className="relative hidden overflow-hidden bg-[#F7F9FB] p-8 lg:flex lg:w-1/2">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-blue-300"></div>
              <div className="absolute right-16 bottom-32 h-24 w-24 rounded-full bg-purple-300"></div>
            </div>
            <EventCarousel />
          </div>
          <Outlet />
        </div>
        <Snackbar open={open} autoHideDuration={4000} onClose={() => dispatch(closeSnackbar())}>
          <Alert
            onClose={() => dispatch(closeSnackbar())}
            severity={type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Suspense>
    </div>
  );
};

export default AuthLayout;
