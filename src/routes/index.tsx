import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { HomePage } from '../pages/HomePage';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AccountSettings } from '../pages/AccountSettings';
import { UserBookings } from '../pages/UserBookings';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'account',
        element: <ProtectedRoute />,
        children: [
          { path: 'settings', element: <AccountSettings /> },
          { path: 'bookings', element: <UserBookings /> },
        ],
      },
      {
        path: 'admin',
        element: <AdminRoute />,
        children: [
          { index: true, element: <AdminDashboard /> },
        ],
      },
    ],
  },
]);