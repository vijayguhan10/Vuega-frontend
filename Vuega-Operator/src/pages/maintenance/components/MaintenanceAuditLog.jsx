import { FaClipboardList, FaUserShield } from 'react-icons/fa';
import Card from '../../../components/ui/Card';
import { ACTION_TYPE_LABELS } from '../utils/auditHelpers';
import { ROLE_LABELS } from '../utils/permissions';

/* ══════════════════════════════════════════════════════
   MaintenanceAuditLog — immutable chronological log of
   every change performed on a bus maintenance record.
   ══════════════════════════════════════════════════════ */

const formatTs = (ts) =>
  new Date(ts).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const renderValue = (val) => {
  if (val === null || val === undefined) return <span className="text-v-text-muted">—</span>;
  if (typeof val === 'object') {
    return (
      <pre className="text-xs bg-v-secondary rounded p-2 overflow-auto max-w-xs">
        {JSON.stringify(val, null, 2)}
      </pre>
    );
  }
  return <span>{String(val)}</span>;
};

const MaintenanceAuditLog = ({ logs = [] }) => {
  if (logs.length === 0) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <FaClipboardList size={16} className="text-v-text-muted" />
          <h3 className="font-semibold text-v-text">Audit Log</h3>
        </div>
        <p className="text-v-text-muted text-center py-8">No audit entries yet.</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-v-text flex items-center gap-2">
          <FaClipboardList size={16} className="text-v-text-muted" /> Audit Log
        </h3>
        <span className="text-v-text-muted font-medium">{logs.length} entries</span>
      </div>

      <div className="flex flex-col gap-3">
        {logs.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col sm:flex-row sm:items-start gap-3 px-4 py-3 rounded-lg border border-v-border bg-v-primary-bg"
          >
            {/* Action icon */}
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 rounded-full bg-v-secondary border border-v-border flex items-center justify-center">
                <FaUserShield size={13} className="text-v-text-muted" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-semibold text-v-text">
                  {ACTION_TYPE_LABELS[entry.actionType] ?? entry.actionType}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-v-secondary border border-v-border font-medium text-v-text-muted">
                  {ROLE_LABELS[entry.role] ?? entry.role}
                </span>
              </div>

              <p className="text-v-text-muted mb-2">
                by <span className="font-medium text-v-text">{entry.performedBy}</span>
              </p>

              {/* Delta */}
              {(entry.previousValue !== null || entry.newValue !== null) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {entry.previousValue !== null && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                      <p className="font-medium text-red-600 mb-1">Before</p>
                      <div className="text-red-700">{renderValue(entry.previousValue)}</div>
                    </div>
                  )}
                  {entry.newValue !== null && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                      <p className="font-medium text-green-600 mb-1">After</p>
                      <div className="text-green-700">{renderValue(entry.newValue)}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Timestamp */}
            <div className="flex-shrink-0 text-v-text-muted text-right whitespace-nowrap">
              {formatTs(entry.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MaintenanceAuditLog;
