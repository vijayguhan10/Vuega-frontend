import { FaExclamationTriangle } from 'react-icons/fa';
import Card from '../../../components/ui/Card';
import { availableRoutes, availableBuses } from '../data/dummyTrips';

/* ══════════════════════════════════════════════════════
   TripForm — Section A of Create Trip.
   Route, Bus, Departure Date/Time, Arrival Time.
   ══════════════════════════════════════════════════════ */

const TripForm = ({ form, onChange, selectedBus }) => {
  const handleChange = (key, value) => {
    onChange({ ...form, [key]: value });
  };

  const activeBuses = availableBuses.filter((b) => b.status === 'active');
  const busHasLayout = selectedBus?.layoutTemplateId;

  return (
    <Card>
      <h3 className="font-semibold text-v-text mb-5">Basic Trip Info</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Route */}
        <div className="flex flex-col gap-1.5">
          <label className="font-medium text-v-text-secondary">Route</label>
          <select
            value={form.routeId}
            onChange={(e) => handleChange('routeId', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
          >
            <option value="">Select a route</option>
            {availableRoutes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.fromCity} → {r.toCity} ({r.distance} km, {r.duration})
              </option>
            ))}
          </select>
        </div>

        {/* Bus */}
        <div className="flex flex-col gap-1.5">
          <label className="font-medium text-v-text-secondary">Bus</label>
          <select
            value={form.busId}
            onChange={(e) => handleChange('busId', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
          >
            <option value="">Select a bus</option>
            {activeBuses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.busNumber} — {b.layoutName}
              </option>
            ))}
          </select>

          {/* Warnings */}
          {selectedBus && !busHasLayout && (
            <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-lg bg-v-critical-light border border-v-critical-border">
              <FaExclamationTriangle size={14} className="text-v-critical flex-shrink-0" />
              <span className="text-v-critical font-medium">
                This bus has no layout template assigned. Cannot create trip.
              </span>
            </div>
          )}

          {selectedBus && selectedBus.status !== 'active' && (
            <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-lg bg-v-secondary border border-v-secondary-border">
              <FaExclamationTriangle size={14} className="text-yellow-600 flex-shrink-0" />
              <span className="text-yellow-700 font-medium">
                Bus is not active ({selectedBus.status}). Only active buses can be used.
              </span>
            </div>
          )}
        </div>

        {/* Departure Date */}
        <div className="flex flex-col gap-1.5">
          <label className="font-medium text-v-text-secondary">Departure Date</label>
          <input
            type="date"
            value={form.departureDate}
            onChange={(e) => handleChange('departureDate', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
          />
        </div>

        {/* Departure Time */}
        <div className="flex flex-col gap-1.5">
          <label className="font-medium text-v-text-secondary">Departure Time</label>
          <input
            type="time"
            value={form.departureTime}
            onChange={(e) => handleChange('departureTime', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
          />
        </div>

        {/* Arrival Time */}
        <div className="flex flex-col gap-1.5">
          <label className="font-medium text-v-text-secondary">Arrival Time</label>
          <input
            type="time"
            value={form.arrivalTime}
            onChange={(e) => handleChange('arrivalTime', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
          />
        </div>

        {/* Status (read only — default Scheduled) */}
        <div className="flex flex-col gap-1.5">
          <label className="font-medium text-v-text-secondary">Status</label>
          <input
            type="text"
            value="Scheduled"
            readOnly
            className="w-full px-3 py-2.5 rounded-lg border border-v-border bg-gray-50 text-v-text-muted cursor-not-allowed"
          />
        </div>
      </div>

      {/* Selected bus info summary */}
      {selectedBus && busHasLayout && (
        <div className="mt-5 px-4 py-3 rounded-lg bg-v-accent/20 border border-v-accent-border">
          <p className="text-v-text font-medium">
            {selectedBus.busNumber} — {selectedBus.layoutName}
          </p>
          <p className="text-v-text-muted mt-0.5">
            {selectedBus.totalSeats} seats • {selectedBus.busType} • Layout:{' '}
            {selectedBus.layoutTemplateId}
          </p>
        </div>
      )}
    </Card>
  );
};

export default TripForm;
