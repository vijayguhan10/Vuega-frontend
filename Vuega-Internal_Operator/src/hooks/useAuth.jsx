import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import realAuthService from '../services/authService';
import mockAuthService from '../services/mockAuthService';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const authService = USE_MOCK ? mockAuthService : realAuthService;

const AuthContext = createContext(null);

const AUTO_LOGOUT_MS = 8 * 60 * 60 * 1000; // 8 hours

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getBusData());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-logout timer
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setTimeout(() => {
      logout();
    }, AUTO_LOGOUT_MS);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  const login = useCallback(async (busNumber, password) => {
    setLoading(true);
    setError(null);
    try {
      const { bus } = await authService.login(busNumber, password);
      setUser(bus);
      setIsAuthenticated(true);
      return bus;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearError,
  }), [user, isAuthenticated, loading, error, login, logout, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
