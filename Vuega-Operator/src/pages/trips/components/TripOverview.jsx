import Card from '../../../components/ui/Card';
import StatusBadge from '../../../components/ui/StatusBadge';
import { flattenSeats } from '../data/dummyTrips';
import {
  FaRoute,
  FaBus,
  FaCalendarAlt,
  FaClock,
  FaChair,
  FaRupeeSign,
  FaInfoCircle,
} from 'react-icons/fa';

/* ══════════════════════════════════════════════════════
   TripOverview — read-only summary of a trip
   ══════════════════════════════════════════════════════ */

const TripOverview = ({ trip }) => {
  const seats = flattenSeats(trip.tripSeatGrid);
  const availableSeats = seats.filter((s) => s.status === 'available').length;
  const bookedSeats = seats.filter((s) => s.status === 'booked').length;
  const blockedSeats = seats.filter((s) => s.status === 'blocked').length;

  const fields = [
    { icon: <FaRoute size={18} />, label: 'Route', value: trip.route },
    { icon: <FaBus size={18} />, label: 'Bus Number', value: trip.busNumber },
    {
      icon: <FaCalendarAlt size={18} />,
      label: 'Departure Date',
      value: new Date(trip.departureDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    },
    {
      icon: <FaClock size={18} />,
      label: 'Departure → Arrival',
      value: `${trip.departureTime} → ${trip.arrivalTime}`,
    },
    {
      icon: <FaChair size={18} />,
      label: 'Total Seats',
      value: trip.totalSeats,
    },
    {
      icon: <FaRupeeSign size={18} />,
      label: 'Pricing',
      value: Object.entries(trip.pricing)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${k}: ₹${v}`)
        .join(' • ') || '—',
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {fields.map((field) => (
          <Card key={field.label}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-v-accent/30 flex items-center justify-center text-v-text-secondary">
                {field.icon}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-v-text-muted uppercase tracking-wider">
                  {field.label}
                </span>
                <span className="font-semibold text-v-text mt-0.5">{field.value}</span>
              </div>
            </div>
          </Card>
        ))}

        {/* Status card */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-v-accent/30 flex items-center justify-center text-v-text-secondary">
              <FaInfoCircle size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-v-text-muted uppercase tracking-wider">
                Status
              </span>
              <div className="mt-1">
                <StatusBadge status={trip.status} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Occupancy summary */}
      <Card>
        <h3 className="font-semibold text-v-text mb-4">Seat Occupancy</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 rounded-xl bg-v-secondary/40 border border-v-secondary-border">
            <span className="font-bold text-green-600">{availableSeats}</span>
            <span className="text-v-text-muted mt-0.5">Available</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-green-50 border border-green-200">
            <span className="font-bold text-green-700">{bookedSeats}</span>
            <span className="text-v-text-muted mt-0.5">Booked</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-gray-100 border border-gray-200">
            <span className="font-bold text-gray-600">{blockedSeats}</span>
            <span className="text-v-text-muted mt-0.5">Blocked</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-v-text-muted">Occupancy</span>
            <span className="font-semibold text-v-text">{trip.occupancy}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                trip.occupancy >= 80
                  ? 'bg-green-500'
                  : trip.occupancy >= 40
                  ? 'bg-yellow-500'
                  : 'bg-gray-400'
              }`}
              style={{ width: `${trip.occupancy}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TripOverview;
