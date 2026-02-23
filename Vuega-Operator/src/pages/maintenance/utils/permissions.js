/* ══════════════════════════════════════════════════════
   Permissions Utility — role-based action control.
   Simulated on frontend; replace with JWT claims / API
   when backend is ready.
   ══════════════════════════════════════════════════════ */

export const ROLES = {
  OPERATOR: 'operator',
  COMPANY_ADMIN: 'company_admin',
  SUPER_ADMIN: 'super_admin',
};

export const ACTIONS = {
  ADD_SERVICE: 'add_service',
  ADD_BREAKDOWN: 'add_breakdown',
  REQUEST_INSURANCE_UPDATE: 'request_insurance_update',
  REQUEST_PERMIT_UPDATE: 'request_permit_update',
  REQUEST_MARK_MAINTENANCE: 'request_mark_maintenance',
  APPROVE_CHANGE: 'approve_change',
  REJECT_CHANGE: 'reject_change',
  VIEW_AUDIT_LOG: 'view_audit_log',
  VIEW_PENDING_APPROVALS: 'view_pending_approvals',
  DELETE_RECORD: 'delete_record', // intentionally empty — no one can delete
};

/** Map of action → allowed roles */
const PERMISSION_MAP = {
  [ACTIONS.ADD_SERVICE]:                [ROLES.OPERATOR, ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN],
  [ACTIONS.ADD_BREAKDOWN]:              [ROLES.OPERATOR, ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN],
  [ACTIONS.REQUEST_INSURANCE_UPDATE]:   [ROLES.OPERATOR, ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN],
  [ACTIONS.REQUEST_PERMIT_UPDATE]:      [ROLES.OPERATOR, ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN],
  [ACTIONS.REQUEST_MARK_MAINTENANCE]:   [ROLES.OPERATOR, ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN],
  [ACTIONS.APPROVE_CHANGE]:             [ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN],
  [ACTIONS.REJECT_CHANGE]:              [ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN],
  [ACTIONS.VIEW_AUDIT_LOG]:             [ROLES.OPERATOR, ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN],
  [ACTIONS.VIEW_PENDING_APPROVALS]:     [ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN],
  [ACTIONS.DELETE_RECORD]:              [], // No one
};

/**
 * Returns true if the given role is allowed to perform the action.
 * @param {string} action - one of ACTIONS
 * @param {string} role   - one of ROLES
 */
export const canPerform = (action, role) => {
  const allowed = PERMISSION_MAP[action] ?? [];
  return allowed.includes(role);
};

/** Display label for each role */
export const ROLE_LABELS = {
  [ROLES.OPERATOR]:      'Operator',
  [ROLES.COMPANY_ADMIN]: 'Company Admin',
  [ROLES.SUPER_ADMIN]:   'Super Admin',
};
