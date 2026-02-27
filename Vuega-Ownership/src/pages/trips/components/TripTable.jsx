import { useNavigate } from 'react-router-dom';
import { FaEye, FaBan } from 'react-icons/fa';
import StatusBadge from '../../../components/ui/StatusBadge';
import Table from '../../../components/ui/Table';

const columns = [
  { key: 'departureDate', label: 'Date' },
  { key: 'route', label: 'Route' },
  { key: 'busNumber', label: 'Bus Number' },
  { key: 'departureTime', label: 'Departure' },
  { key: 'arrivalTime', label: 'Arrival' },
  { key: 'status', label: 'Status' },
  { key: 'occupancy', label: 'Occupancy' },
  { key: 'actions', label: 'Actions', className: 'text-right' },
];

const TripTable = ({ trips = [], onCancel }) => {
  const navigate = useNavigate();

  const renderCell = (row, col) => {
    switch (col.key) {
      case 'departureDate':
        return (
          <span className="font-medium text-v-text">
            {new Date(row.departureDate).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        );
      case 'route':
        return <span className="font-semibold text-v-text">{row.route}</span>;
      case 'busNumber':
        return <span className="text-v-text-secondary font-medium">{row.busNumber}</span>;
      case 'departureTime':
        return <span className="text-v-text-secondary">{row.departureTime}</span>;
      case 'arrivalTime':
        return <span className="text-v-text-secondary">{row.arrivalTime}</span>;
      case 'status':
        return <StatusBadge status={row.status} />;
      case 'occupancy':
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  row.occupancy >= 80
                    ? 'bg-green-500'
                    : row.occupancy >= 40
                    ? 'bg-yellow-500'
                    : 'bg-gray-400'
                }`}
                style={{ width: `${row.occupancy}%` }}
              />
            </div>
            <span className="text-v-text-secondary font-medium">{row.occupancy}%</span>
          </div>
        );
      case 'actions':
        return renderActions(row);
      default:
        return <span className="text-v-text-secondary">{row[col.key]}</span>;
    }
  };

  const renderActions = (row) => {
    const canCancel = row.status === 'scheduled';

    return (
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => navigate(`/trips/${row.id}`)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-accent/20 hover:border-v-accent-border transition-colors"
        >
          <FaEye size={14} />
          View
        </button>
        {canCancel && (
          <button
            onClick={() => onCancel?.(row.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-v-critical border border-v-critical-border hover:bg-v-critical-light transition-colors"
          >
            <FaBan size={14} />
            Cancel
          </button>
        )}
      </div>
    );
  };

  return (
    <Table
      columns={columns}
      data={trips}
      renderCell={renderCell}
      emptyMessage="No trips match your filters."
    />
  );
};

export default TripTable;
