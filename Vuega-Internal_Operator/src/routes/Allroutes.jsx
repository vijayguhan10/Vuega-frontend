import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AppLayout from '../components/layout/AppLayout';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Passengers from '../pages/Passengers';
import SeatMap from '../pages/SeatMap';
import Profile from '../pages/Profile';

export default function Allroutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}
      >
        <Route path="/" element={<Home />} />
        <Route path="/passengers" element={<Passengers />} />
        <Route path="/seat-map" element={<SeatMap />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
      />
    </Routes>
  );
}
