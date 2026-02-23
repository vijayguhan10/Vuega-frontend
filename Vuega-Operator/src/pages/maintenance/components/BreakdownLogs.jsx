import { FaPlus, FaExclamationTriangle, FaCheckCircle, FaLock } from 'react-icons/fa';
import Table from '../../../components/ui/Table';
import Card from '../../../components/ui/Card';
import { canPerform, ACTIONS } from '../utils/permissions';

/* ══════════════════════════════════════════════════════
   BreakdownLogs — append-only table of breakdown
   incidents. Records are immutable once created.
   ══════════════════════════════════════════════════════ */

const COLUMNS = [
  { key: 'date',         label: 'Date' },
  { key: 'description',  label: 'Issue Description' },
  { key: 'resolved',     label: 'Resolved' },
  { key: 'resolvedDate', label: 'Resolved Date' },
  { key: 'notes',        label: 'Notes' },
  { key: 'immutable',    label: '',             className: 'text-right' },
];

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

const BreakdownLogs = ({ records = [], onAdd, currentRole }) => {
  const canAdd = canPerform(ACTIONS.ADD_BREAKDOWN, currentRole);

  const renderCell = (row, col) => {
    switch (col.key) {
      case 'date':
        return formatDate(row.date);
      case 'description':
        return <span className="max-w-xs truncate block">{row.description}</span>;
      case 'resolved':
        return row.resolved ? (
          <span className="inline-flex items-center gap-1.5 text-green-700 font-medium">
            <FaCheckCircle size={14} /> Yes
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-orange-600 font-medium">
            <FaExclamationTriangle size={14} /> No
          </span>
        );
      case 'resolvedDate':
        return formatDate(row.resolvedDate);
      case 'notes':
        return (
          <span className="max-w-xs truncate block text-v-text-muted">{row.notes || '—'}</span>
        );
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
        <h3 className="font-semibold text-v-text flex items-center gap-2">
          <FaExclamationTriangle size={16} className="text-orange-500" /> Breakdown Logs
        </h3>
        {canAdd && (
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-v-accent text-v-text border border-v-accent-border hover:bg-v-accent-hover transition-colors shadow-sm"
          >
            <FaPlus size={12} /> Add Breakdown Record
          </button>
        )}
      </div>
      <Table
        columns={COLUMNS}
        data={records}
        renderCell={renderCell}
        emptyMessage="No breakdown incidents recorded."
      />
    </Card>
  );
};

export default BreakdownLogs;
