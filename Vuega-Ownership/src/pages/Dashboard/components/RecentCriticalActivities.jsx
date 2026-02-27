import {
  FaHistory,
  FaBan,
  FaCheckCircle,
  FaWrench,
  FaUnlock,
  FaLock,
} from 'react-icons/fa';
import Card from '../../../components/ui/Card';
import { recentActivities } from '../data/dashboardData';

/* ══════════════════════════════════════════════════════
   RecentCriticalActivities — a timeline of high-impact
   actions across fleets (cancellations, blocks,
   approvals, maintenance).
   ══════════════════════════════════════════════════════ */

const TYPE_META = {
  trip_cancellation:    { icon: FaBan,         color: 'text-red-500',    bg: 'bg-red-100' },
  insurance_approval:   { icon: FaCheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100' },
  bus_blocked:          { icon: FaLock,         color: 'text-red-500',    bg: 'bg-red-100' },
  bus_unblocked:        { icon: FaUnlock,       color: 'text-emerald-500', bg: 'bg-emerald-100' },
  maintenance_approval: { icon: FaWrench,      color: 'text-blue-500',   bg: 'bg-blue-100' },
};

const formatTimeAgo = (ts) => {
  const diff = Date.now() - new Date(ts).getTime();
  const mins  = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const RecentCriticalActivities = () => (
  <Card padding="p-0">
    {/* Header */}
    <div className="px-6 py-5 border-b border-v-border flex items-center gap-2">
      <FaHistory size={16} className="text-v-accent" />
      <div>
        <h3 className="text-v-text font-bold">Recent Critical Activities</h3>
        <p className="text-v-text-muted mt-0.5">High-impact actions across your fleet</p>
      </div>
    </div>

    {/* Timeline */}
    <ul className="divide-y divide-v-border-light">
      {recentActivities.map((act, idx) => {
        const meta = TYPE_META[act.type] ?? TYPE_META.trip_cancellation;
        const Icon = meta.icon;

        return (
          <li key={idx} className="flex items-start gap-4 px-6 py-4 hover:bg-v-secondary/30 transition-colors">
            {/* Icon Dot */}
            <div className={`p-2 rounded-lg ${meta.bg} ${meta.color} shrink-0 mt-0.5`}>
              <Icon size={14} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-v-text font-medium leading-snug">{act.action}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-v-text-muted">
                <span className="font-semibold">{act.performedBy}</span>
                <span>•</span>
                <time dateTime={act.timestamp}>{formatTimeAgo(act.timestamp)}</time>
              </div>
            </div>
          </li>
        );
      })}
    </ul>

    {/* Footer */}
    <div className="px-6 py-3 border-t border-v-border bg-v-secondary/30 flex justify-center">
      <button className="font-semibold text-v-text-secondary hover:text-v-text transition-colors">
        View Full Activity Log
      </button>
    </div>
  </Card>
);

export default RecentCriticalActivities;
