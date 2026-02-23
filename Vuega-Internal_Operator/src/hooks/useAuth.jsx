import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';

const STORAGE_TOKEN_KEY = 'auth_token';
const STORAGE_BUS_KEY = 'bus_data';

const MOCK_CREDENTIALS = {
  'KA-01-F-1234': { password: '1234', busId: 'bus-001' },
  'TN-02-G-5678': { password: '5678', busId: 'bus-002' },
};

const MOCK_BUSES = {
  'bus-001': {
    id: 'bus-001',
    busNumber: 'KA-01-F-1234',
    registration: 'KA01F1234',
    type: 'AC Sleeper',
    capacity: 40,
    driverName: 'Rajesh Kumar',
    cleanerName: 'Suresh M',
  },
  'bus-002': {
    id: 'bus-002',
    busNumber: 'TN-02-G-5678',
    registration: 'TN02G5678',
    type: 'Non-AC Seater',
    capacity: 52,
    driverName: 'Karthik Rajan',
    cleanerName: 'Mohan S',
  },
};

const AuthContext = createContext(null);

const AUTO_LOGOUT_MS = 8 * 60 * 60 * 1000; // 8 hours

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_BUS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem(STORAGE_TOKEN_KEY));
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
      await new Promise((resolve) => setTimeout(resolve, 350));
      const credentials = MOCK_CREDENTIALS[busNumber];
      if (!credentials || credentials.password !== password) {
        throw new Error('Invalid bus number or password.');
      }
      const bus = MOCK_BUSES[credentials.busId];
      const token = `mock-token-${credentials.busId}-${Date.now()}`;
      localStorage.setItem(STORAGE_TOKEN_KEY, token);
      localStorage.setItem(STORAGE_BUS_KEY, JSON.stringify(bus));
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
      await new Promise((resolve) => setTimeout(resolve, 150));
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_BUS_KEY);
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
