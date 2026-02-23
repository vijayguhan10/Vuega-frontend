import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaSlidersH, FaPlus, FaCalendarAlt } from 'react-icons/fa';
import TripTable from './components/TripTable';
import dummyTrips from './data/dummyTrips';

const STATUS_FILTERS = ['All', 'Scheduled', 'Ongoing', 'Completed', 'Cancelled'];

const TripsList = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState(dummyTrips);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  /* ── Filtering ── */
  const filtered = trips.filter((trip) => {
    const matchesSearch =
      !search ||
      trip.route.toLowerCase().includes(search.toLowerCase()) ||
      trip.busNumber.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || trip.status === statusFilter.toLowerCase();

    const matchesDate = !dateFilter || trip.departureDate === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  /* ── Cancel handler ── */
  const handleCancel = (tripId) => {
    if (!window.confirm('Are you sure you want to cancel this trip?')) return;
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status: 'cancelled' } : t))
    );
  };

  return (
    <div className="max-w-[1360px] mx-auto flex flex-col gap-6">
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-v-text font-bold tracking-tight">Trips</h2>
          <p className="text-v-text-muted mt-0.5">
            Schedule, monitor, and manage all your trips.
          </p>
        </div>
        <button
          onClick={() => navigate('/trips/create')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold bg-v-accent hover:bg-v-accent-hover text-v-text border border-v-accent-border transition-colors shadow-sm"
        >
          <FaPlus size={18} />
          Create Trip
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <FaSearch
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-v-text-placeholder"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by route or bus number…"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text placeholder:text-v-text-placeholder focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <FaSlidersH
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-v-text-placeholder pointer-events-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text-secondary focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors appearance-none cursor-pointer"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Date filter */}
        <div className="relative">
          <FaCalendarAlt
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-v-text-placeholder pointer-events-none"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="pl-9 pr-4 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text-secondary focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors cursor-pointer"
          />
        </div>
      </div>

      {/* ── Trip Table ── */}
      <div className="bg-v-primary-bg border border-v-border rounded-xl shadow-sm overflow-hidden">
        <TripTable trips={filtered} onCancel={handleCancel} />

        {/* Footer */}
        <div className="px-5 py-3 border-t border-v-border bg-v-secondary/20 text-v-text-muted">
          Showing {filtered.length} of {trips.length} trips
        </div>
      </div>
    </div>
  );
};

export default TripsList;
