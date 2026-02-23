import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import Table from '../../../components/ui/Table';
import StatusBadge from '../../../components/ui/StatusBadge';

/* ══════════════════════════════════════════════════════
   MaintenanceTable — table showing all buses with
   maintenance status summaries.
   ══════════════════════════════════════════════════════ */

const COLUMNS = [
  { key: 'busNumber', label: 'Bus Number' },
  { key: 'lastServiceDate', label: 'Last Service' },
  { key: 'nextServiceDue', label: 'Next Service Due' },
  { key: 'insuranceExpiry', label: 'Insurance Expiry' },
  { key: 'permitExpiry', label: 'Permit Expiry' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions', className: 'text-center' },
];

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const MaintenanceTable = ({ data }) => {
  const navigate = useNavigate();

  const renderCell = (row, col) => {
    switch (col.key) {
      case 'busNumber':
        return <span className="font-semibold text-v-text">{row.busNumber}</span>;
      case 'lastServiceDate':
        return formatDate(row.lastServiceDate);
      case 'nextServiceDue':
        return formatDate(row.nextServiceDue);
      case 'insuranceExpiry':
        return formatDate(row.insuranceExpiry);
      case 'permitExpiry':
        return formatDate(row.permitExpiry);
      case 'status':
        return <StatusBadge status={row.status} />;
      case 'actions':
        return (
          <div className="flex items-center justify-center">
            <button
              onClick={() => navigate(`/maintenance/${row.busId}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-secondary hover:border-v-secondary-border transition-colors"
            >
              <FaEye size={14} /> View
            </button>
          </div>
        );
      default:
        return row[col.key];
    }
  };

  return (
    <Table
      columns={COLUMNS}
      data={data}
      renderCell={renderCell}
      emptyMessage="No buses match the selected filter."
    />
  );
};

export default MaintenanceTable;
