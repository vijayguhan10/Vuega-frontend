import { useNavigate } from 'react-router-dom';
import { FaClock, FaBan, FaEye, FaPencilAlt } from 'react-icons/fa';
import StatusBadge from '../../../components/ui/StatusBadge';
import Table from '../../../components/ui/Table';

/* ──────────────────────────────────────────────
   RouteTable — displays all routes in the
   reusable Table component.
   ────────────────────────────────────────────── */

const columns = [
  { key: 'routeName', label: 'Route Name' },
  { key: 'fromCity', label: 'From City' },
  { key: 'toCity', label: 'To City' },
  { key: 'distance', label: 'Distance (km)', className: 'text-right' },
  { key: 'stops', label: 'Stops', className: 'text-center' },
  { key: 'duration', label: 'Est. Duration' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
];

export default function RouteTable({ routes, onDisable }) {
  const navigate = useNavigate();

  const renderCell = (row, col) => {
    switch (col.key) {
      case 'routeName':
        return (
          <span className="font-medium text-v-text">
            {row.fromCity} → {row.toCity}
          </span>
        );
      case 'distance':
        return <span className="tabular-nums">{row.distance}</span>;
      case 'stops':
        return <span className="tabular-nums">{row.stops.length}</span>;
      case 'status':
        return <StatusBadge status={row.status === 'disabled' ? 'inactive' : row.status} />;
      case 'actions':
        return renderActions(row);
      default:
        return row[col.key];
    }
  };

  /* ── Action buttons based on status ── */
  const renderActions = (row) => {
    if (row.status === 'pending-approval') {
      return (
        <div className="flex items-center justify-end gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-yellow-600 bg-v-secondary border border-v-secondary-border">
            <FaClock size={14} />
            Waiting for Approval
          </span>
        </div>
      );
    }

    if (row.status === 'rejected') {
      return (
        <div className="flex items-center justify-end gap-2" title="This route request was rejected by the Super Admin">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-v-critical bg-v-critical-light border border-v-critical-border cursor-not-allowed">
            <FaBan size={14} />
            Request Rejected
          </span>
        </div>
      );
    }

    if (row.status === 'approved') {
      return (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => navigate(`/routes/${row.id}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-accent/20 hover:border-v-accent-border transition-colors"
          >
            <FaEye size={14} />
            View
          </button>
          <button
            onClick={() => navigate(`/routes/${row.id}?edit=true`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-secondary hover:border-v-secondary-border transition-colors"
          >
            <FaPencilAlt size={14} />
            Edit
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => navigate(`/routes/${row.id}`)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-accent/20 hover:border-v-accent-border transition-colors"
        >
          <FaEye size={14} />
          View
        </button>
        <button
          onClick={() => navigate(`/routes/${row.id}?edit=true`)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-secondary hover:border-v-secondary-border transition-colors"
        >
          <FaPencilAlt size={14} />
          Edit
        </button>
      </div>
    );
  };

  return (
    <Table
      columns={columns}
      data={routes}
      renderCell={renderCell}
      emptyMessage="No routes found."
    />
  );
}
