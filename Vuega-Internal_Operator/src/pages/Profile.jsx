import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTrip } from '../hooks/useTrip';
import realTripService from '../services/tripService';
import mockTripService from '../services/mockTripService';
import PageHeader from '../Navs/PageHeader';
import Loader from '../components/common/Loader';
import ErrorBanner from '../components/common/ErrorBanner';
import { FaBus, FaRoute, FaSignOutAlt } from 'react-icons/fa';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const tripService = USE_MOCK ? mockTripService : realTripService;

export default function Profile() {
  const { user, logout } = useAuth();
  const { trip } = useTrip();
  const navigate = useNavigate();

  const [busProfile, setBusProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripService.getBusProfile();
      setBusProfile(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  if (loading && !busProfile) {
    return <Loader message="Loading profile..." />;
  }

  const profile = busProfile || user;

  return (
    <div>
      <PageHeader title="Profile" />

      <ErrorBanner message={error} onRetry={fetchProfile} onDismiss={() => setError(null)} />

      <div className="px-4 md:px-5 lg:px-6 py-4 md:py-4 space-y-3 md:space-y-2.5">
        <div className="space-y-3 md:space-y-3">
          {/* Bus Details Card */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 bg-[#C6EDFF] rounded-lg flex items-center justify-center">
                <FaBus className="text-sm text-gray-700" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-900">Bus #{profile?.busNumber || 'N/A'}</p>
                <p className="text-[11px] text-gray-400">{profile?.type || 'AC Sleeper'}</p>
              </div>
            </div>

            <div className="mt-2.5 space-y-2">
              <DetailRow label="Registration" value={profile?.registration || 'N/A'} />
              <DetailRow label="Capacity" value={profile?.capacity ? `${profile.capacity} seats` : 'N/A'} />
              <DetailRow label="Driver" value={profile?.driverName || 'N/A'} />
              <DetailRow label="Cleaner" value={profile?.cleanerName || 'N/A'} />
            </div>
          </div>

          {/* Assigned Trip Card */}
          {trip && (
            <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-9 h-9 bg-[#C6EDFF] rounded-lg flex items-center justify-center">
                  <FaRoute className="text-sm text-gray-700" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">Assigned Trip</p>
                  <p className="text-[11px] text-gray-400">Current route information</p>
                </div>
              </div>

              <div className="mt-2.5 space-y-2">
                <DetailRow label="Route" value={trip.route || 'N/A'} />
                <DetailRow label="Departure" value={trip.departureTime || 'N/A'} />
                <DetailRow label="Arrival" value={trip.arrivalTime || 'N/A'} />
                <DetailRow label="Status" value={trip.status || 'N/A'} />
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="md:hidden w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#960000] text-white text-sm font-semibold py-3 active:opacity-90"
        >
          <FaSignOutAlt className="text-sm" />
          Sign Out
        </button>

        <p className="text-center text-[11px] text-gray-400 pt-1">
          Session will auto-expire after 8 hours
        </p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 px-3 py-2 md:py-1.5">
      <span className="text-[12px] font-medium text-gray-500">{label}</span>
      <span className="text-[13px] font-semibold text-gray-900 text-right">{value}</span>
    </div>
  );
}