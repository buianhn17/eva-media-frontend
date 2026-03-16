import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Admin imports
import AdminLayout from '../components/layout/AdminLayout';
import LoginPage from '../pages/auth/LoginPage';
import ProgramListPage from '../pages/programs/ProgramListPage';
import ProgramCreatePage from '../pages/programs/ProgramCreatePage';
import ProgramEditPage from '../pages/programs/ProgramEditPage';
import DirectorListPage from '../pages/directors/DirectorListPage';
import LocationListPage from '../pages/locations/LocationListPage';

// Public imports
import PublicLayout from '../components/public/PublicLayout';
import HomePage from '../pages/public/HomePage';
import ProgramsPage from '../pages/public/ProgramsPage';
import ProgramDetailPage from '../pages/public/ProgramDetailPage';
import DirectorProgramsPage from '../pages/public/DirectorProgramsPage';
import LocationProgramsPage from '../pages/public/LocationProgramsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  // ── Public Routes ──
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'programs', element: <ProgramsPage /> },
      { path: 'programs/:slug', element: <ProgramDetailPage /> },
      { path: 'directors/:id', element: <DirectorProgramsPage /> },
      { path: 'locations/:id', element: <LocationProgramsPage /> },
    ],
  },

  // ── Auth ──
  { path: '/login', element: <LoginPage /> },

  // ── Admin Routes ──
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="programs" replace /> },
      { path: 'programs', element: <ProgramListPage /> },
      { path: 'programs/create', element: <ProgramCreatePage /> },
      { path: 'programs/:id/edit', element: <ProgramEditPage /> },
      { path: 'directors', element: <DirectorListPage /> },
      { path: 'locations', element: <LocationListPage /> },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);