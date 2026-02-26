import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../Navs/PageHeader';
import { FaBus, FaRoute, FaSignOutAlt } from 'react-icons/fa';
import { clearAuthSession, getStoredUser } from '../utils/authStorage';

const MOCK_TRIP = {
  route: 'Bangalore → Chennai',
  departureTime: '06:30 AM',
  arrivalTime: '12:45 PM',
  status: 'Active',
};

const MOCK_BUS_PROFILE = {
  id: 'bus-001',
  busNumber: 'KA-01-F-1234',
  registration: 'KA01F1234',
  type: 'AC Sleeper',
  capacity: 40,
  driverName: 'Rajesh Kumar',
  cleanerName: 'Suresh M',
};

export default function Profile() {
  const user = getStoredUser();
  const trip = MOCK_TRIP;
  const navigate = useNavigate();

  const [busProfile, setBusProfile] = useState(MOCK_BUS_PROFILE);

  useEffect(() => {
    setBusProfile((prev) => prev || MOCK_BUS_PROFILE);
  }, []);

  const handleLogout = useCallback(() => {
    clearAuthSession();
    navigate('/login', { replace: true });
  }, [navigate]);

  const profile = user || busProfile;
  const hasNumeric = (value) => /\d/.test(String(value || ''));
  const displayBusNumber = hasNumeric(user?.busNumber)
    ? user.busNumber
    : busProfile?.busNumber || 'N/A';

  return (
    <div>
      <PageHeader title="Profile" subtitle={profile?.driverName || 'Driver Information'} />

      <div className="px-4 md:px-5 lg:px-6 py-4 md:py-4 space-y-3 md:space-y-2.5">
        <div className="space-y-3 md:space-y-3">
          {/* Bus Details Card */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 bg-[#C6EDFF] rounded-lg flex items-center justify-center">
                <FaBus className="text-sm text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-v-text">Bus #{displayBusNumber}</p>
                <p className="text-xs font-normal text-v-text-muted">{profile?.type || 'AC Sleeper'}</p>
              </div>
            </div>

            <div className="mt-2.5 space-y-2">
              <DetailRow label="Registration" value={displayBusNumber || 'N/A'} />
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
                  <p className="text-sm font-semibold text-v-text">Assigned Trip</p>
                  <p className="text-xs font-normal text-v-text-muted">Current route information</p>
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

      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 px-3 py-2 md:py-1.5">
      <span className="text-sm font-medium text-v-text-secondary">{label}</span>
      <span className="text-sm font-normal text-v-text text-right">{value}</span>
    </div>
  );
}