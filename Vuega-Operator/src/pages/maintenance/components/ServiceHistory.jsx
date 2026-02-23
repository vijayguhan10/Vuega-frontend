import { FaPlus, FaTrash } from 'react-icons/fa';
import Table from '../../../components/ui/Table';
import Card from '../../../components/ui/Card';

/* ══════════════════════════════════════════════════════
   ServiceHistory — table of past service records with
   add & delete actions.
   ══════════════════════════════════════════════════════ */

const COLUMNS = [
  { key: 'date', label: 'Service Date' },
  { key: 'description', label: 'Description' },
  { key: 'cost', label: 'Cost' },
  { key: 'performedBy', label: 'Performed By' },
  { key: 'actions', label: 'Actions', className: 'text-center' },
];

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

const ServiceHistory = ({ records = [], onAdd, onDelete }) => {
  const renderCell = (row, col) => {
    switch (col.key) {
      case 'date':
        return formatDate(row.date);
      case 'description':
        return <span className="max-w-xs truncate block">{row.description}</span>;
      case 'cost':
        return <span className="font-semibold">₹{row.cost?.toLocaleString('en-IN')}</span>;
      case 'performedBy':
        return row.performedBy;
      case 'actions':
        return (
          <div className="flex items-center justify-center">
            <button
              onClick={() => onDelete(row.id)}
              className="p-2 rounded-lg text-v-critical hover:bg-v-critical-light transition-colors"
              title="Delete record"
            >
              <FaTrash size={14} />
            </button>
          </div>
        );
      default:
        return row[col.key];
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-v-text">Service History</h3>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-v-accent text-v-text border border-v-accent-border hover:bg-v-accent-hover transition-colors shadow-sm"
        >
          <FaPlus size={12} /> Add Service Record
        </button>
      </div>
      <Table columns={COLUMNS} data={records} renderCell={renderCell} emptyMessage="No service records yet." />
    </Card>
  );
};

export default ServiceHistory;
