import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import RouteTable from './components/RouteTable';
import dummyRoutes from './data/dummyRoutes';

/* ──────────────────────────────────────────────
   RoutesList — lists all routes with search,
   status filter, and action buttons.
   ────────────────────────────────────────────── */

export default function RoutesList() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState(dummyRoutes);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  /* ── filtering ── */
  const filtered = useMemo(() => {
    let list = routes;

    if (statusFilter !== 'all') {
      list = list.filter((r) => r.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.fromCity.toLowerCase().includes(q) ||
          r.toCity.toLowerCase().includes(q),
      );
    }

    return list;
  }, [routes, search, statusFilter]);

  /* ── toggle enable / disable ── */
  const handleDisable = (id) => {
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === 'active' ? 'disabled' : 'active' }
          : r,
      ),
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* ── Top Section ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-bold text-v-text">Routes</h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-v-text-muted pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search routes…"
              className="pl-9 pr-3 py-2 w-56 rounded-lg border border-v-border bg-v-primary-bg text-sm text-v-text placeholder:text-v-text-placeholder focus:outline-none focus:ring-1 focus:ring-v-accent-dark transition"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-v-border bg-v-primary-bg text-sm text-v-text focus:outline-none focus:ring-1 focus:ring-v-accent-dark transition"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>

          {/* Create button */}
          <button
            onClick={() => navigate('/routes/create')}
            className="px-4 py-2 rounded-lg text-sm font-medium text-v-text bg-v-accent hover:bg-v-accent-hover border border-v-accent-border shadow-sm transition-colors"
          >
            + Create Route
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-v-primary-bg border border-v-border rounded-xl overflow-hidden">
        <RouteTable routes={filtered} onDisable={handleDisable} />
      </div>
    </div>
  );
}
