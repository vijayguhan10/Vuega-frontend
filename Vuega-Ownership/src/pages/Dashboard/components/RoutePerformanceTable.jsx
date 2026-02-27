import { useState, useMemo } from 'react';
import { FaRoute, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import Card from '../../../components/ui/Card';
import { routePerformance } from '../data/dashboardData';

/* ══════════════════════════════════════════════════════
   RoutePerformanceTable — sortable analytics table
   showing revenue, occupancy, cancellation, refund %
   per route for the company_admin dashboard.
   ══════════════════════════════════════════════════════ */

const formatCurrency = (v) => `₹${v.toLocaleString('en-IN')}`;

const COLUMNS = [
  { key: 'route',           label: 'Route',            sortable: false },
  { key: 'totalTrips',      label: 'Trips',            sortable: true  },
  { key: 'revenue',         label: 'Revenue',          sortable: true  },
  { key: 'avgOccupancy',    label: 'Avg Occupancy',    sortable: true  },
  { key: 'cancellationPct', label: 'Cancellation %',   sortable: true  },
  { key: 'refundPct',       label: 'Refund %',         sortable: true  },
];

const OccupancyBar = ({ value }) => {
  const color =
    value >= 75 ? 'bg-emerald-400' : value >= 50 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-v-secondary max-w-[80px]">
        <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className="font-semibold">{value}%</span>
    </div>
  );
};

const RoutePerformanceTable = () => {
  const [sortKey, setSortKey] = useState('revenue');
  const [sortDir, setSortDir] = useState('desc');

  const sorted = useMemo(() => {
    const list = [...routePerformance];
    list.sort((a, b) => (sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]));
    return list;
  }, [sortKey, sortDir]);

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  return (
    <Card padding="p-0">
      {/* Header */}
      <div className="px-6 py-5 border-b border-v-border flex items-center gap-2">
        <FaRoute size={16} className="text-violet-500" />
        <div>
          <h3 className="text-v-text font-bold">Route Performance</h3>
          <p className="text-v-text-muted mt-0.5">
            Last 30 days — sorted by {COLUMNS.find((c) => c.key === sortKey)?.label}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-v-secondary/50 border-b border-v-border">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-v-text-muted font-semibold uppercase tracking-wider ${
                    col.sortable ? 'cursor-pointer select-none hover:text-v-text transition-colors' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'desc'
                        ? <FaSortAmountDown size={11} className="text-v-accent-dark" />
                        : <FaSortAmountUp size={11} className="text-v-accent-dark" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-v-border-light">
            {sorted.map((row) => (
              <tr key={row.id} className="hover:bg-v-secondary/30 transition-colors">
                <td className="px-6 py-4 font-semibold text-v-text whitespace-nowrap">{row.route}</td>
                <td className="px-6 py-4 text-v-text-secondary">{row.totalTrips}</td>
                <td className="px-6 py-4 font-semibold text-v-text">{formatCurrency(row.revenue)}</td>
                <td className="px-6 py-4">
                  <OccupancyBar value={row.avgOccupancy} />
                </td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${row.cancellationPct > 3 ? 'text-red-500' : 'text-v-text-secondary'}`}>
                    {row.cancellationPct}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${row.refundPct > 3 ? 'text-red-500' : 'text-v-text-secondary'}`}>
                    {row.refundPct}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RoutePerformanceTable;
