/* ══════════════════════════════════════════════════════
   Pending Change Helpers — create and manage approval
   workflow entries.
   Designed to map to a pending_changes table when the
   backend is ready.
   ══════════════════════════════════════════════════════ */

let _counter = 0;

/**
 * Create a new pending change request.
 *
 * @param {Object} params
 * @param {string} params.busId
 * @param {string} params.changeType   - "insurance_update" | "permit_update" | "mark_maintenance" | "mark_available"
 * @param {*}      params.proposedValue
 * @param {string} params.requestedBy
 * @param {string} params.role
 * @returns {Object} pending change entry
 */
export const createPendingChange = ({
  busId,
  changeType,
  proposedValue,
  requestedBy,
  role,
}) => ({
  id: `pnd-${Date.now()}-${++_counter}`,
  busId,
  changeType,
  proposedValue,
  requestedBy,
  role,
  requestedAt: new Date().toISOString(),
  status: 'pending', // "pending" | "approved" | "rejected"
  resolvedAt: null,
  resolvedBy: null,
});

/** Human-readable labels for change types */
export const CHANGE_TYPE_LABELS = {
  insurance_update:  'Insurance Update',
  permit_update:     'Permit Update',
  mark_maintenance:  'Mark Under Maintenance',
  mark_available:    'Mark Available',
};
