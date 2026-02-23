/* ══════════════════════════════════════════════════════
   Audit Log Helpers — create immutable audit entries.
   Every state-mutating action must push one entry.
   Structure is designed to map directly to a backend
   audit_logs table when the API is ready.
   ══════════════════════════════════════════════════════ */

let _counter = 0;

/**
 * Create a new immutable audit log entry.
 *
 * @param {Object} params
 * @param {string} params.busId
 * @param {string} params.actionType  - e.g. "add_service", "update_insurance"
 * @param {*}      params.previousValue
 * @param {*}      params.newValue
 * @param {string} params.performedBy - operator id / name
 * @param {string} params.role
 * @returns {Object} audit entry
 */
export const createAuditEntry = ({
  busId,
  actionType,
  previousValue = null,
  newValue = null,
  performedBy,
  role,
}) => ({
  id: `aud-${Date.now()}-${++_counter}`,
  busId,
  actionType,
  previousValue,
  newValue,
  performedBy,
  role,
  timestamp: new Date().toISOString(),
});

/** Human-readable labels for action types */
export const ACTION_TYPE_LABELS = {
  add_service:              'Service Record Added',
  add_breakdown:            'Breakdown Logged',
  update_insurance:         'Insurance Updated (Approved)',
  update_permit:            'Permit Updated (Approved)',
  mark_maintenance:         'Marked Under Maintenance (Approved)',
  mark_available:           'Marked Available (Approved)',
  request_insurance_update: 'Insurance Update Requested',
  request_permit_update:    'Permit Update Requested',
  request_mark_maintenance: 'Maintenance Mark Requested',
  request_mark_available:   'Available Mark Requested',
  approve_change:           'Change Approved',
  reject_change:            'Change Rejected',
};
