import { useMemo } from 'react';
import { useTrip } from '../hooks/useTrip';
import PageHeader from '../Navs/PageHeader';
import Loader from '../components/common/Loader';
import ErrorBanner from '../components/common/ErrorBanner';
import EmptyState from '../components/common/EmptyState';
import StatCard from '../components/common/StatCard';
import {
  FaUsers,
  FaUserCheck,
  FaClock,
  FaUserTimes,
  FaBus,
} from 'react-icons/fa';

export default function Home() {
  const { trip, passengers, loading, error, fetchTrip, clearError } = useTrip();

  const counts = useMemo(() => {
    const total = passengers.length;
    const boarded = passengers.filter((p) => p.status === 'boarded').length;
    const noShow = passengers.filter((p) => p.status === 'no-show').length;
    const pending = total - boarded - noShow;
    return { total, boarded, noShow, pending };
  }, [passengers]);

  const [boardingPlace, droppingPlace] = useMemo(() => {
    if (!trip?.route) return ['--', '--'];
    const [from, to] = trip.route.split('→').map((part) => part?.trim());
    return [from || '--', to || '--'];
  }, [trip?.route]);

  if (loading && !trip) {
    return <Loader message="Loading trip data..." />;
  }

  return (
    <div className="min-h-full">
      <PageHeader
        title="Dashboard"
        subtitle="Bus Personnel Panel"
      />

      <ErrorBanner message={error} onRetry={fetchTrip} onDismiss={clearError} />

      {!trip ? (
        <EmptyState
          icon="🚌"
          title="No Active Trip Scheduled."
          description="There is no trip assigned to this bus right now."
        />
      ) : (
        <div className="px-4 py-4 md:px-5 md:py-4 lg:px-6 space-y-4 md:space-y-4">
          {/* Section: Trip Overview */}
          <div>
            <h2 className="text-sm md:text-base font-bold md:text-xl md:text-gray-900 mb-1">Trip Overview</h2>
            <p className="text-[11px] md:text-xs text-gray-400 mb-3">
              Current active trip details and passenger summary.
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 bg-[#C6EDFF] rounded-lg flex items-center justify-center">
                <FaBus className="text-sm text-gray-700" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-900">Trip Details</p>
                <p className="text-[11px] text-gray-400">Current assigned bus information</p>
              </div>
            </div>

            <div className="mt-2.5 space-y-2">
              <DetailRow label="Bus Name" value={trip.busName || trip.busNumber || '--'} />
              <DetailRow label="Boarding Place" value={boardingPlace} />
              <DetailRow label="Dropping Place" value={droppingPlace} />
              <DetailRow label="Boarding Time" value={trip.arrivalTime || '--:--'} />
              <DetailRow label="Dropping Time" value={trip.departureTime || '--:--'} />
            </div>
          </div>

          {/* Row 1: Trip stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-3">
            <StatCard
              label="Total Passengers"
              value={counts.total}
              trend={`${counts.total}`}
              trendNote="booked"
              trendDir="up"
              icon={FaUsers}
              iconBg="bg-gray-100"
              iconColor="text-gray-600"
            />
            <StatCard
              label="Boarded"
              value={counts.boarded}
              trend={`+${counts.boarded}`}
              trendNote="checked in"
              trendDir="up"
              icon={FaUserCheck}
              iconBg="bg-[#C6EDFF]/50"
              iconColor="text-blue-600"
              bg="bg-[#C6EDFF]/15"
            />
            <StatCard
              label="No-Show"
              value={counts.noShow}
              trend={`${counts.noShow}`}
              trendNote="missed"
              trendDir="down"
              icon={FaUserTimes}
              iconBg="bg-[#960000]/10"
              iconColor="text-[#960000]"
              borderColor="border-l-[#960000]"
              valueColor="text-[#960000]"
            />
            <StatCard
              label="Pending"
              value={counts.pending}
              trend={`${counts.pending}`}
              trendNote="remaining"
              trendDir="up"
              icon={FaClock}
              iconBg="bg-[#FFFADF]"
              iconColor="text-yellow-700"
              bg="bg-[#FFFADF]/30"
            />
          </div>


        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 px-3 py-2.5">
      <span className="text-[12px] font-medium text-gray-500">{label}</span>
      <span className="text-[13px] font-semibold text-gray-900 text-right">{value}</span>
    </div>
  );
}