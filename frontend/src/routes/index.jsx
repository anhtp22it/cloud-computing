import AuthLayout from '@layouts/AuthLayout';
import MainLayout from '@layouts/MainLayout';

import Login from '@pages/auth/Login';
import Register from '@pages/auth/Register';
import PollPageUser from '@pages/user/PollPageUser';
import DashboardUser from '@pages/user/DashboardUser';
import { createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '@layouts/AdminLayout';
import EventManagement from '@pages/admin/EventManagement';
import EventCreate from '@pages/admin/EventCreate';
import EventDetail from '@pages/admin/EventDetail';
import UserManagement from '@pages/admin/UserManagement';
import UnitManagement from '@/pages/admin/UnitManagement';
import NotFound from '@pages/NotFound';

import EventDetailUser from '@pages/user/EventDetailUser';
import EventManagementManage from '@pages/user/EventManagementManage';
import CheckinResultPage from '@pages/user/CheckinResultPage';
import HomePageUser from '@pages/user/HomePageUser';
import CreatePoll from '@/components/features/poll/CreatePoll';
import PollAnalystic from '@pages/poll/PollAnalystic';
import AdminRoute from './AdminRoute';
import RoleLanding from './RoleLanding';
import ChangePassword from '@/pages/auth/ChangePassword';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <RoleLanding />,
      },
      {
        element: <MainLayout />,
        children: [
          {
            path: '/home',
            element: <HomePageUser />,
          },
          {
            path: '/dashboard',
            element: <DashboardUser />,
          },
          {
            path: '/events/:eventId',
            element: <EventDetailUser />,
          },
          {
            path: '/events/:eventId/manage',
            element: <EventManagementManage />,
          },
          {
            path: '/poll-analytics/:eventId',
            element: <PollAnalystic />,
          },
          {
            path: '/poll/:pollId',
            element: <PollPageUser />,
          },
          {
            path: '/create-poll/:id',
            element: <CreatePoll />,
          },
          {
            path: '/events/check-in/:eventToken',
            element: <CheckinResultPage />,
          },
          {
            path: '/change-password',
            element: <ChangePassword />,
          },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: '/admin/events',
                element: <EventManagement />,
              },
              {
                path: '/admin/events/create',
                element: <EventCreate />,
              },
              {
                path: '/admin/events/:id',
                element: <EventDetail />,
              },
              {
                path: '/admin/users',
                element: <UserManagement />,
              },
              {
                path: '/admin/donvi',
                element: <UnitManagement />,
              },
              {
                path: '/manage-event',
                element: <EventManagement />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
