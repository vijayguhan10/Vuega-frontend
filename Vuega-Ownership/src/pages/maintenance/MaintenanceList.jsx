import { useState, useMemo } from 'react';
import { FaWrench, FaSearch } from 'react-icons/fa';
import Card from '../../components/ui/Card';
import MaintenanceTable from './components/MaintenanceTable';
import dummyMaintenance, { computeStatus } from './data/dummyMaintenance';

/* ══════════════════════════════════════════════════════
   MaintenanceList — lists all buses with computed
   maintenance status and filter tabs.
   ══════════════════════════════════════════════════════ */

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'healthy', label: 'Healthy' },
  { key: 'due-soon', label: 'Due Soon' },
  { key: 'expired', label: 'Expired' },
  { key: 'under-maintenance', label: 'Under Maintenance' },
];

const MaintenanceList = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  /* Compute status for each record */
  const enriched = useMemo(
    () =>
      dummyMaintenance.map((rec) => ({
        ...rec,
        status: computeStatus(rec),
        insuranceExpiry: rec.insurance.expiryDate,
        permitExpiry: rec.permit.expiryDate,
      })),
    []
  );

  /* Apply filter + search */
  const filtered = useMemo(() => {
    let list = enriched;
    if (filter !== 'all') {
      list = list.filter((r) => r.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.busNumber.toLowerCase().includes(q));
    }
    return list;
  }, [enriched, filter, search]);

  /* Counts per status */
  const counts = useMemo(() => {
    const c = { all: enriched.length, healthy: 0, 'due-soon': 0, expired: 0, 'under-maintenance': 0 };
    enriched.forEach((r) => {
      if (c[r.status] !== undefined) c[r.status]++;
    });
    return c;
  }, [enriched]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-v-text flex items-center gap-2">
            <FaWrench size={22} className="text-v-text-muted" /> Maintenance
          </h2>
          <p className="text-v-text-muted mt-1">
            Monitor service schedules, insurance, permits and breakdowns.
          </p>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f.key
                  ? 'bg-v-accent text-v-text border border-v-accent-border shadow-sm'
                  : 'text-v-text-secondary border border-v-border hover:bg-v-secondary'
              }`}
            >
              {f.label}
              <span className="ml-1.5 text-v-text-muted">({counts[f.key]})</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <FaSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-v-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bus number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text placeholder:text-v-text-placeholder focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <Card padding="p-0">
        <MaintenanceTable data={filtered} />
      </Card>
    </div>
  );
};

export default MaintenanceList;
