import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

// Layouts
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AppLayout } from '@/components/layouts/AppLayout';
import { AdminLayout } from '@/components/layouts/AdminLayout';

// Public pages
import { LandingPage } from '@/components/LandingPage';

// Auth pages
import { LoginPage } from '@/components/auth/LoginPage';
import { SignupPage } from '@/components/auth/SignupPage';
import { VerifyEmailPage } from '@/components/auth/VerifyEmailPage';
import { ForgotPasswordPage } from '@/components/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/components/auth/ResetPasswordPage';

// User pages
import { DashboardPage } from '@/components/dashboard/DashboardPage';
import { PhotoLibraryPage } from '@/components/dashboard/PhotoLibraryPage';
import { ProfilePage } from '@/components/dashboard/ProfilePage';
import { GeneratorPage } from '@/components/dashboard/GeneratorPage';

// Admin pages
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { UserManagement } from '@/components/admin/UserManagement';
import { APIKeysManager } from '@/components/admin/APIKeysManager';
import { AuditLogs } from '@/components/admin/AuditLogs';

// Error pages
import { NotFoundPage } from '@/components/errors/NotFoundPage';
import { UnauthorizedPage } from '@/components/errors/UnauthorizedPage';

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <LandingPage />,
  },

  // Auth routes (guest only)
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/verify-email',
        element: <VerifyEmailPage />,
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

  // Protected user routes
  {
    element: <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'SUPER_ADMIN']} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/app',
            element: <Navigate to="/app/generator" replace />,
          },
          {
            path: '/app/generator',
            element: <GeneratorPage />,
          },
          {
            path: '/app/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/app/library',
            element: <PhotoLibraryPage />,
          },
          {
            path: '/app/profile',
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },

  // Admin routes
  {
    element: <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: '/admin',
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: '/admin/dashboard',
            element: <AdminDashboard />,
          },
          {
            path: '/admin/users',
            element: <UserManagement />,
          },
          {
            path: '/admin/api-keys',
            element: <APIKeysManager />,
          },
          {
            path: '/admin/audit-logs',
            element: <AuditLogs />,
          },
        ],
      },
    ],
  },

  // Error routes
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
