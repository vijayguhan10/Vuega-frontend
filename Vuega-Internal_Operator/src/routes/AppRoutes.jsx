import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import Loader from '../components/common/Loader';

// Lazy-loaded pages
const Login = lazy(() => import('../pages/Login'));
const Home = lazy(() => import('../pages/Home'));
const Passengers = lazy(() => import('../pages/Passengers'));
const SeatMap = lazy(() => import('../pages/SeatMap'));
const Profile = lazy(() => import('../pages/Profile'));

function SuspenseWrapper({ children }) {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
}

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <SuspenseWrapper>
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          }
        />

        {/* Protected — inside AppLayout with bottom nav */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/passengers" element={<Passengers />} />
          <Route path="/seat-map" element={<SeatMap />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SuspenseWrapper>
  );
}
