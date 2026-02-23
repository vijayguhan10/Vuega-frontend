import { FaClock, FaCheckCircle, FaTimesCircle, FaUserShield } from 'react-icons/fa';
import Card from '../../../components/ui/Card';
import { CHANGE_TYPE_LABELS } from '../utils/pendingHelpers';
import { ROLE_LABELS, canPerform, ACTIONS } from '../utils/permissions';

/* ══════════════════════════════════════════════════════
   PendingApprovals — lists all pending change requests
   awaiting company admin / super admin approval.
   Only visible to company_admin and super_admin roles.
   ══════════════════════════════════════════════════════ */

const formatTs = (ts) =>
  new Date(ts).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const renderProposedValue = (changeType, val) => {
  if (!val) return <span className="text-v-text-muted">—</span>;

  if (changeType === 'insurance_update') {
    return (
      <div className="flex flex-col gap-0.5">
        <span><strong>Provider:</strong> {val.provider}</span>
        <span><strong>Policy #:</strong> {val.policyNumber}</span>
        <span><strong>Expiry:</strong> {val.expiryDate}</span>
      </div>
    );
  }
  if (changeType === 'permit_update') {
    return (
      <div className="flex flex-col gap-0.5">
        <span><strong>Permit #:</strong> {val.permitNumber}</span>
        <span><strong>Expiry:</strong> {val.expiryDate}</span>
      </div>
    );
  }
  if (changeType === 'mark_maintenance' || changeType === 'mark_available') {
    return <span className="font-medium">{val}</span>;
  }
  return <pre className="text-xs">{JSON.stringify(val, null, 2)}</pre>;
};

const StatusChip = ({ status }) => {
  const map = {
    pending:  { cls: 'bg-yellow-50 border-yellow-200 text-yellow-700',  label: 'Pending' },
    approved: { cls: 'bg-green-50 border-green-200 text-green-700',    label: 'Approved' },
    rejected: { cls: 'bg-red-50 border-red-200 text-red-700',          label: 'Rejected' },
  };
  const { cls, label } = map[status] ?? map.pending;
  return (
    <span className={`px-2 py-0.5 rounded-full border font-medium text-xs ${cls}`}>
      {label}
    </span>
  );
};

const PendingApprovals = ({ changes = [], currentRole, onApprove, onReject }) => {
  const canAct = canPerform(ACTIONS.APPROVE_CHANGE, currentRole);
  const pendingOnly = changes.filter((c) => c.status === 'pending');
  const resolved = changes.filter((c) => c.status !== 'pending');

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-v-text flex items-center gap-2">
          <FaClock size={16} className="text-yellow-500" /> Pending Approvals
          {pendingOnly.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-yellow-100 border border-yellow-200 text-yellow-700 font-bold text-xs">
              {pendingOnly.length}
            </span>
          )}
        </h3>
      </div>

      {changes.length === 0 ? (
        <p className="text-v-text-muted text-center py-8">No pending change requests.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Pending first */}
          {pendingOnly.map((c) => (
            <div
              key={c.id}
              className="px-4 py-3 rounded-lg border border-yellow-200 bg-yellow-50 flex flex-col gap-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FaUserShield size={14} className="text-yellow-600" />
                  <span className="font-semibold text-v-text">
                    {CHANGE_TYPE_LABELS[c.changeType] ?? c.changeType}
                  </span>
                  <StatusChip status={c.status} />
                </div>
                <span className="text-v-text-muted">{formatTs(c.requestedAt)}</span>
              </div>

              <div className="text-v-text-muted">
                Requested by{' '}
                <span className="font-medium text-v-text">{c.requestedBy}</span>{' '}
                <span className="text-xs">({ROLE_LABELS[c.role] ?? c.role})</span>
              </div>

              <div className="bg-white border border-yellow-200 rounded-lg px-3 py-2 text-v-text">
                <p className="font-medium text-v-text-muted mb-1">Proposed Value</p>
                {renderProposedValue(c.changeType, c.proposedValue)}
              </div>

              {canAct && (
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => onReject(c.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
                  >
                    <FaTimesCircle size={14} /> Reject
                  </button>
                  <button
                    onClick={() => onApprove(c.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 transition-colors"
                  >
                    <FaCheckCircle size={14} /> Approve
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Resolved history */}
          {resolved.map((c) => (
            <div
              key={c.id}
              className="px-4 py-3 rounded-lg border border-v-border bg-v-primary-bg flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 opacity-70"
            >
              <div className="flex items-center gap-2 flex-1">
                <span className="font-medium text-v-text">
                  {CHANGE_TYPE_LABELS[c.changeType] ?? c.changeType}
                </span>
                <StatusChip status={c.status} />
              </div>
              <div className="text-v-text-muted text-sm">
                by {c.requestedBy} · {formatTs(c.requestedAt)}
              </div>
              {c.resolvedAt && (
                <div className="text-v-text-muted text-sm">
                  Resolved by {c.resolvedBy} · {formatTs(c.resolvedAt)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default PendingApprovals;
