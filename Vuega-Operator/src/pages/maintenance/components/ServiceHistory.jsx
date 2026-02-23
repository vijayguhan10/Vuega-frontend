import { FaPlus, FaLock } from 'react-icons/fa';
import Table from '../../../components/ui/Table';
import Card from '../../../components/ui/Card';
import { canPerform, ACTIONS } from '../utils/permissions';

/* ══════════════════════════════════════════════════════
   ServiceHistory — append-only table of service records.
   No delete. No edit. Records are immutable once created.
   A correction must be submitted as a new record that
   references the original via correctionOf.
   ══════════════════════════════════════════════════════ */

const COLUMNS = [
  { key: 'date',        label: 'Service Date' },
  { key: 'description', label: 'Description' },
  { key: 'cost',        label: 'Cost' },
  { key: 'performedBy', label: 'Performed By' },
  { key: 'immutable',   label: '',             className: 'text-right' },
];

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

const ServiceHistory = ({ records = [], onAdd, currentRole }) => {
  const canAdd = canPerform(ACTIONS.ADD_SERVICE, currentRole);

  const renderCell = (row, col) => {
    switch (col.key) {
      case 'date':
        return (
          <div className="flex flex-col gap-0.5">
            {formatDate(row.date)}
            {row.correctionOf && (
              <span className="text-xs text-blue-600">Correction of #{row.correctionOf}</span>
            )}
          </div>
        );
      case 'description':
        return <span className="max-w-xs truncate block">{row.description}</span>;
      case 'cost':
        return <span className="font-semibold">₹{row.cost?.toLocaleString('en-IN')}</span>;
      case 'performedBy':
        return row.performedBy;
      case 'immutable':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-v-border bg-v-secondary text-v-text-muted font-medium whitespace-nowrap">
            <FaLock size={9} /> Immutable Record
          </span>
        );
      default:
        return row[col.key];
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-v-text">Service History</h3>
        {canAdd && (
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-v-accent text-v-text border border-v-accent-border hover:bg-v-accent-hover transition-colors shadow-sm"
          >
            <FaPlus size={12} /> Add Service Record
          </button>
        )}
      </div>
      <Table
        columns={COLUMNS}
        data={records}
        renderCell={renderCell}
        emptyMessage="No service records yet."
      />
    </Card>
  );
};

export default ServiceHistory;
