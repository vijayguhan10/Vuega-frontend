import { useState, useMemo } from 'react';
import RouteTable from './components/RouteTable';
import RequestRouteModal from './components/RequestRouteModal';
import dummyRoutes from './data/dummyRoutes';

/* ──────────────────────────────────────────────
   RoutesList — lists all routes with tabs to
   separate active routes from operator requests.
   ────────────────────────────────────────────── */

const TABS = [
  { key: 'active', label: 'Active Routes' },
  { key: 'requests', label: 'My Requests' },
];

export default function RoutesList() {
  const [routes, setRoutes] = useState(dummyRoutes);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [showRequestModal, setShowRequestModal] = useState(false);

  /* ── filtering ── */
  const filtered = useMemo(() => {
    let list = routes;

    // Tab-based split
    if (activeTab === 'active') {
      list = list.filter((r) => r.status === 'active' || r.status === 'disabled');
    } else {
      list = list.filter(
        (r) => r.status === 'pending-approval' || r.status === 'approved' || r.status === 'rejected',
      );
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
  }, [routes, search, activeTab]);

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

  /* ── Handle new route request ── */
  const handleRouteRequest = (newRoute) => {
    setRoutes((prev) => [newRoute, ...prev]);
    setActiveTab('requests'); // switch to requests tab to show the new entry
  };

  /* ── Count badges ── */
  const requestCount = routes.filter(
    (r) => r.status === 'pending-approval' || r.status === 'approved' || r.status === 'rejected',
  ).length;
  const approvedCount = routes.filter((r) => r.status === 'approved').length;

  return (
    <div className="p-6 space-y-6">
      {/* ── Top Section ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-bold text-v-text">Routes</h1>

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
              className="pl-9 pr-3 py-2 w-56 rounded-lg border border-v-border bg-v-primary-bg text-v-text placeholder:text-v-text-placeholder focus:outline-none focus:ring-1 focus:ring-v-accent-dark transition"
            />
          </div>

          {/* Request button */}
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2 rounded-lg font-medium text-v-text bg-v-accent hover:bg-v-accent-hover border border-v-accent-border shadow-sm transition-colors"
          >
            + Request Route
          </button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex gap-1 border-b border-v-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium transition-colors -mb-px ${
              activeTab === tab.key
                ? 'text-v-text border-b-2 border-v-accent-dark'
                : 'text-v-text-muted hover:text-v-text-secondary'
            }`}
          >
            {tab.label}
            
            
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="bg-v-primary-bg border border-v-border rounded-xl overflow-hidden">
        <RouteTable routes={filtered} onDisable={handleDisable} />
      </div>

      {/* Request Route Modal */}
      <RequestRouteModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleRouteRequest}
      />
    </div>
  );
}
