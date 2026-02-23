import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import StatusBadge from '../../components/ui/StatusBadge';
import TripOverview from './components/TripOverview';
import TripSeatMap from './components/TripSeatMap';
import PassengerList from './components/PassengerList';
import Card from '../../components/ui/Card';
import dummyTrips from './data/dummyTrips';

const ALL_TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'seatmap', label: 'Seat Map' },
  { key: 'passengers', label: 'Passenger List' },
  { key: 'logs', label: 'Logs' },
];

const TripDetail = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  /* ── Find trip (simulate API) ── */
  const tripData = dummyTrips.find((t) => t.id === tripId);
  const [tripSeatGrid, setTripSeatGrid] = useState(tripData?.tripSeatGrid || []);

  if (!tripData) {
    return (
      <div className="max-w-[1360px] mx-auto flex flex-col items-center justify-center h-64 text-center">
        <div className="w-12 h-12 rounded-full bg-v-critical-light flex items-center justify-center mb-4">
          <span className="text-v-critical">!</span>
        </div>
        <h2 className="font-semibold text-v-text">Trip Not Found</h2>
        <p className="text-v-text-muted mt-1">The requested trip does not exist.</p>
        <button
          onClick={() => navigate('/trips')}
          className="mt-4 px-4 py-2 rounded-lg font-medium bg-v-accent hover:bg-v-accent-hover text-v-text border border-v-accent-border transition-colors"
        >
          Back to Trips
        </button>
      </div>
    );
  }

  const trip = { ...tripData, tripSeatGrid };

  const isScheduled = trip.status === 'scheduled';
  const isReadOnly = trip.status === 'completed' || trip.status === 'cancelled';

  /* ── Tab content ── */
  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <TripOverview trip={trip} />;
      case 'seatmap':
        return (
          <TripSeatMap
            tripSeatGrid={tripSeatGrid}
            onGridChange={setTripSeatGrid}
            isReadOnly={isReadOnly}
          />
        );
      case 'passengers':
        return <PassengerList />;
      case 'logs':
        return (
          <Card>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-v-secondary flex items-center justify-center mb-4">
                <span className="text-v-text-muted text-2xl">📋</span>
              </div>
              <h3 className="font-semibold text-v-text">Trip Logs</h3>
              <p className="text-v-text-muted mt-1 max-w-sm">
                Activity logs and audit trail will be displayed here once the logging
                system is integrated.
              </p>
              <span className="mt-4 px-3 py-1.5 rounded-lg bg-v-secondary border border-v-secondary-border text-v-text-muted font-medium">
                Coming Soon
              </span>
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/trips')}
            className="p-2 rounded-lg border border-v-border hover:bg-v-secondary transition-colors text-v-text-muted"
          >
            <FaArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-v-text font-bold tracking-tight">{trip.route}</h2>
              <StatusBadge status={trip.status} />
            </div>
            <p className="text-v-text-muted mt-0.5">
              {trip.busNumber} • {trip.departureDate} • {trip.departureTime} → {trip.arrivalTime}
            </p>
          </div>
        </div>
      </div>

      {/* ── Read-only Banner ── */}
      {isReadOnly && (
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-lg bg-v-secondary border border-v-secondary-border">
          <FaShieldAlt size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-v-text">
              This trip is {trip.status}.
            </p>
            <p className="text-v-text-muted mt-0.5">
              {trip.status === 'completed'
                ? 'Completed trips cannot be modified. Seat map is view-only.'
                : 'Cancelled trips cannot be modified. Seat map is view-only.'}
            </p>
          </div>
        </div>
      )}

      {/* ── Seat Operations Info ── */}
      {!isReadOnly && activeTab === 'seatmap' && (
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-lg bg-v-accent/20 border border-v-accent-border">
          <FaShieldAlt size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-v-text">Seat Operations</p>
            <p className="text-v-text-muted mt-0.5">
              You can block/unblock available seats and override individual seat prices.
              Booked seats cannot be modified. Layout structure is fixed.
            </p>
          </div>
        </div>
      )}

      {/* ── Tab Navigation ── */}
      <div className="border-b border-v-border">
        <nav className="flex gap-1 -mb-px">
          {ALL_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 font-medium rounded-t-lg transition-colors relative ${
                activeTab === tab.key
                  ? 'text-v-text bg-v-primary-bg border border-v-border border-b-transparent -mb-px'
                  : 'text-v-text-muted hover:text-v-text-secondary hover:bg-v-secondary/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Tab Content ── */}
      <div>{renderTab()}</div>
    </div>
  );
};

export default TripDetail;
