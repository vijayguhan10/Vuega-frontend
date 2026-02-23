import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import realTripService from '../services/tripService';
import mockTripService from '../services/mockTripService';
import { useAuth } from './useAuth';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const tripService = USE_MOCK ? mockTripService : realTripService;

const TripContext = createContext(null);

const POLL_INTERVAL_MS = 30000; // 30 seconds

export function TripProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [trip, setTrip] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const pollRef = useRef(null);

  const fetchTrip = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await tripService.getActiveTrip();
      setTrip(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load trip data.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchPassengers = useCallback(async (tripId) => {
    if (!tripId) return;
    setError(null);
    try {
      const data = await tripService.getPassengers(tripId);
      setPassengers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load passengers.');
    }
  }, []);

  const updatePassengerStatus = useCallback(async (passengerId, status) => {
    if (!trip?.id) return;
    if (updatingIds.has(passengerId)) return; // prevent duplicate

    setUpdatingIds((prev) => new Set(prev).add(passengerId));
    try {
      const updated = await tripService.updatePassengerStatus(trip.id, passengerId, status);
      setPassengers((prev) =>
        prev.map((p) => (p.id === passengerId ? { ...p, ...updated } : p))
      );
      // Refresh trip summary counts
      await fetchTrip();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(passengerId);
        return next;
      });
    }
  }, [trip?.id, updatingIds, fetchTrip]);

  const addRemark = useCallback(async (passengerId, remark) => {
    if (!trip?.id) return;
    try {
      const updated = await tripService.addPassengerRemark(trip.id, passengerId, remark);
      setPassengers((prev) =>
        prev.map((p) => (p.id === passengerId ? { ...p, ...updated } : p))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add remark.');
    }
  }, [trip?.id]);

  // Fetch trip on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchTrip();
    } else {
      setTrip(null);
      setPassengers([]);
    }
  }, [isAuthenticated, fetchTrip]);

  // Fetch passengers when trip changes
  useEffect(() => {
    if (trip?.id) {
      fetchPassengers(trip.id);
    }
  }, [trip?.id, fetchPassengers]);

  // Polling for live updates
  useEffect(() => {
    if (!isAuthenticated || !trip?.id) return;
    pollRef.current = setInterval(() => {
      fetchTrip();
      fetchPassengers(trip.id);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(pollRef.current);
  }, [isAuthenticated, trip?.id, fetchTrip, fetchPassengers]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(() => ({
    trip,
    passengers,
    loading,
    error,
    updatingIds,
    fetchTrip,
    fetchPassengers,
    updatePassengerStatus,
    addRemark,
    clearError,
  }), [trip, passengers, loading, error, updatingIds, fetchTrip, fetchPassengers, updatePassengerStatus, addRemark, clearError]);

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}
