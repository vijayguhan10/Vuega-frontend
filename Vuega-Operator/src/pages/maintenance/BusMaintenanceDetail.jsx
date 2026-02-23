import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaBus,
  FaCalendarAlt,
  FaShieldAlt,
  FaIdCard,
  FaWrench,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaUserShield,
} from 'react-icons/fa';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import ServiceHistory from './components/ServiceHistory';
import InsuranceSection from './components/InsuranceSection';
import PermitSection from './components/PermitSection';
import BreakdownLogs from './components/BreakdownLogs';
import AddServiceModal from './components/AddServiceModal';
import AddBreakdownModal from './components/AddBreakdownModal';
import MaintenanceAuditLog from './components/MaintenanceAuditLog';
import PendingApprovals from './components/PendingApprovals';
import dummyMaintenance, {
  computeStatus,
  generateId,
  generateBreakdownId,
  checkTripEligibility,
} from './data/dummyMaintenance';
import { createAuditEntry } from './utils/auditHelpers';
import { createPendingChange } from './utils/pendingHelpers';
import { ROLES, ROLE_LABELS, canPerform, ACTIONS } from './utils/permissions';

/* ══════════════════════════════════════════════════════
   BusMaintenanceDetail — full maintenance view for
   a single bus with:
   • Append-only service history & breakdown logs
   • Approval workflow for critical changes
   • Full audit logging
   • Role-based permission control
   • Tab-based navigation
   ══════════════════════════════════════════════════════ */

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

/* ── Tab definitions ── */
const TABS = [
  { key: 'overview',          label: 'Overview' },
  { key: 'service-history',   label: 'Service History' },
  { key: 'insurance',         label: 'Insurance' },
  { key: 'permit',            label: 'Permit' },
  { key: 'breakdown-logs',    label: 'Breakdown Logs' },
  { key: 'audit-log',         label: 'Audit Log' },
  { key: 'pending-approvals', label: 'Pending Approvals', adminOnly: true },
];

/* ── Simulated current user (replace with auth context) ── */
const SIMULATED_USER = 'operator_demo@vuega.in';

const BusMaintenanceDetail = () => {
  const { busId } = useParams();
  const navigate = useNavigate();

  /* ── Core state ── */
  const initial = dummyMaintenance.find((r) => r.busId === busId);
  const [record, setRecord] = useState(initial ? { ...initial } : null);

  /* ── Enterprise state ── */
  const [currentRole, setCurrentRole] = useState(ROLES.OPERATOR);
  const [auditLogs, setAuditLogs] = useState([]);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  /* ── Modal state ── */
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);

  /* ── Derived (status must use APPROVED data only — pending changes never mutate record directly) ── */
  const status = useMemo(() => (record ? computeStatus(record) : 'inactive'), [record]);
  const eligibility = useMemo(
    () => (record ? checkTripEligibility(record) : { eligible: false, reasons: [] }),
    [record]
  );
  const pendingInsurance = pendingChanges.some(
    (c) => c.changeType === 'insurance_update' && c.status === 'pending'
  );
  const pendingPermit = pendingChanges.some(
    (c) => c.changeType === 'permit_update' && c.status === 'pending'
  );
  const pendingMaintenanceToggle = pendingChanges.some(
    (c) => (c.changeType === 'mark_maintenance' || c.changeType === 'mark_available') && c.status === 'pending'
  );
  const pendingCount = pendingChanges.filter((c) => c.status === 'pending').length;

  /* ── Audit helper (always call before/after mutations) ── */
  const pushAudit = (params) =>
    setAuditLogs((prev) => [
      createAuditEntry({ ...params, performedBy: SIMULATED_USER, role: currentRole }),
      ...prev,
    ]);

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-v-text-muted">Bus not found.</p>
        <button
          onClick={() => navigate('/maintenance')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium border border-v-border hover:bg-v-secondary transition-colors"
        >
          <FaArrowLeft size={14} /> Back to Maintenance
        </button>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════
     HANDLERS
     ════════════════════════════════════════════════════ */

  /* ── Service history (append-only) ── */
  const handleAddService = (svc) => {
    const newEntry = { ...svc, id: generateId() };
    setRecord((prev) => ({
      ...prev,
      lastServiceDate: svc.date,
      nextServiceDue: svc.nextServiceDue,
      serviceHistory: [newEntry, ...prev.serviceHistory],
    }));
    pushAudit({
      busId: record.busId,
      actionType: 'add_service',
      previousValue: null,
      newValue: { id: newEntry.id, date: svc.date, description: svc.description, cost: svc.cost },
    });
    setShowServiceModal(false);
  };

  /* ── Breakdown logs (append-only) ── */
  const handleAddBreakdown = (brk) => {
    const newEntry = { ...brk, id: generateBreakdownId() };
    setRecord((prev) => ({
      ...prev,
      breakdownLogs: [newEntry, ...prev.breakdownLogs],
    }));
    pushAudit({
      busId: record.busId,
      actionType: 'add_breakdown',
      previousValue: null,
      newValue: { id: newEntry.id, date: brk.date, description: brk.description },
    });
    setShowBreakdownModal(false);
  };

  /* ── Insurance update → pending change ── */
  const handleRequestInsuranceUpdate = (data) => {
    const change = createPendingChange({
      busId: record.busId,
      changeType: 'insurance_update',
      proposedValue: data,
      requestedBy: SIMULATED_USER,
      role: currentRole,
    });
    setPendingChanges((prev) => [change, ...prev]);
    pushAudit({
      busId: record.busId,
      actionType: 'request_insurance_update',
      previousValue: record.insurance,
      newValue: data,
    });
  };

  /* ── Permit update → pending change ── */
  const handleRequestPermitUpdate = (data) => {
    const change = createPendingChange({
      busId: record.busId,
      changeType: 'permit_update',
      proposedValue: data,
      requestedBy: SIMULATED_USER,
      role: currentRole,
    });
    setPendingChanges((prev) => [change, ...prev]);
    pushAudit({
      busId: record.busId,
      actionType: 'request_permit_update',
      previousValue: record.permit,
      newValue: data,
    });
  };

  /* ── Maintenance toggle → pending change (operators) or direct (admins) ── */
  const handleToggleMaintenance = () => {
    const nextState = !record.isUnderMaintenance;
    const changeType = nextState ? 'mark_maintenance' : 'mark_available';
    const actionType = nextState ? 'request_mark_maintenance' : 'request_mark_available';

    if (canPerform(ACTIONS.APPROVE_CHANGE, currentRole)) {
      // Admins apply directly
      setRecord((prev) => ({ ...prev, isUnderMaintenance: nextState }));
      pushAudit({
        busId: record.busId,
        actionType: nextState ? 'mark_maintenance' : 'mark_available',
        previousValue: record.isUnderMaintenance,
        newValue: nextState,
      });
    } else {
      // Operators create a pending change
      const change = createPendingChange({
        busId: record.busId,
        changeType,
        proposedValue: nextState ? 'Under Maintenance' : 'Available',
        requestedBy: SIMULATED_USER,
        role: currentRole,
      });
      setPendingChanges((prev) => [change, ...prev]);
      pushAudit({
        busId: record.busId,
        actionType,
        previousValue: record.isUnderMaintenance,
        newValue: nextState,
      });
    }
  };

  /* ── Approve pending change ── */
  const handleApprove = (changeId) => {
    const change = pendingChanges.find((c) => c.id === changeId);
    if (!change) return;

    // Apply the change to the record
    setRecord((prev) => {
      let updated = { ...prev };
      if (change.changeType === 'insurance_update') {
        updated.insurance = { ...change.proposedValue };
      } else if (change.changeType === 'permit_update') {
        updated.permit = { ...change.proposedValue };
      } else if (change.changeType === 'mark_maintenance') {
        updated.isUnderMaintenance = true;
      } else if (change.changeType === 'mark_available') {
        updated.isUnderMaintenance = false;
      }
      return updated;
    });

    // Mark the pending change as approved
    setPendingChanges((prev) =>
      prev.map((c) =>
        c.id === changeId
          ? { ...c, status: 'approved', resolvedAt: new Date().toISOString(), resolvedBy: SIMULATED_USER }
          : c
      )
    );

    pushAudit({
      busId: record.busId,
      actionType: 'approve_change',
      previousValue: change.changeType,
      newValue: change.proposedValue,
    });
  };

  /* ── Reject pending change ── */
  const handleReject = (changeId) => {
    const change = pendingChanges.find((c) => c.id === changeId);
    if (!change) return;

    setPendingChanges((prev) =>
      prev.map((c) =>
        c.id === changeId
          ? { ...c, status: 'rejected', resolvedAt: new Date().toISOString(), resolvedBy: SIMULATED_USER }
          : c
      )
    );

    pushAudit({
      busId: record.busId,
      actionType: 'reject_change',
      previousValue: change.changeType,
      newValue: null,
    });
  };

  /* ════════════════════════════════════════════════════
     VISIBLE TABS (hide Pending Approvals for operators)
     ════════════════════════════════════════════════════ */
  const visibleTabs = TABS.filter(
    (t) => !t.adminOnly || canPerform(ACTIONS.VIEW_PENDING_APPROVALS, currentRole)
  );

  /* ════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-6 p-6">

      {/* ── Back + Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => navigate('/maintenance')}
            className="p-2 rounded-lg border border-v-border hover:bg-v-secondary transition-colors"
          >
            <FaArrowLeft size={16} className="text-v-text-muted" />
          </button>
          <div>
            <h2 className="font-bold text-v-text flex items-center gap-2">
              <FaBus size={20} /> {record.busNumber}
            </h2>
            <p className="text-v-text-muted mt-0.5">Maintenance Details</p>
          </div>
        </div>

        {/* Role Switcher — simulated, remove when auth is wired */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-v-border bg-v-secondary">
          <FaUserShield size={14} className="text-v-text-muted" />
          <span className="font-medium text-v-text-muted">Simulated Role:</span>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            className="bg-transparent font-semibold text-v-text focus:outline-none cursor-pointer"
          >
            {Object.values(ROLES).map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Trip Eligibility Warning ── */}
      {!eligibility.eligible && (
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-lg bg-v-critical-light border border-v-critical-border">
              <FaExclamationTriangle size={16} className="text-v-critical shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-v-critical">Not Eligible for Trip Creation</p>
            {/* TODO: Enforce these checks server-side before allowing trip creation */}
            <ul className="text-v-critical mt-1 list-disc list-inside">
              {eligibility.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── Pending changes global banner ── */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 font-medium">
          <FaClock size={15} />
          {pendingCount} change{pendingCount > 1 ? 's' : ''} pending approval from Company Admin
          {canPerform(ACTIONS.VIEW_PENDING_APPROVALS, currentRole) && (
            <button
              onClick={() => setActiveTab('pending-approvals')}
              className="ml-auto underline font-semibold"
            >
              Review
            </button>
          )}
        </div>
      )}

      {/* ── Tab Bar ── */}
      <div className="flex flex-wrap gap-1 border-b border-v-border">
        {visibleTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`relative px-4 py-2.5 font-medium transition-colors rounded-t-lg ${
              activeTab === t.key
                ? 'text-v-text border-b-2 border-v-accent -mb-px bg-v-primary-bg'
                : 'text-v-text-secondary hover:text-v-text hover:bg-v-secondary'
            }`}
          >
            {t.label}
            {t.key === 'pending-approvals' && pendingCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-yellow-400 text-yellow-900 font-bold text-xs">
                {pendingCount}
              </span>
            )}
            {t.key === 'audit-log' && auditLogs.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-v-secondary border border-v-border text-v-text-muted font-bold text-xs">
                {auditLogs.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════
         TAB PANELS
         ════════════════════════════════════════════════ */}

      {/* ── Overview ── */}
      {activeTab === 'overview' && (
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-v-text">Overview</h3>
            <StatusBadge status={status} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <span className="text-v-text-muted block">Bus Number</span>
              <span className="font-semibold text-v-text">{record.busNumber}</span>
            </div>
            <div>
              <span className="text-v-text-muted flex items-center gap-1.5">
                <FaCalendarAlt size={12} /> Last Service
              </span>
              <span className="font-medium text-v-text">{formatDate(record.lastServiceDate)}</span>
            </div>
            <div>
              <span className="text-v-text-muted flex items-center gap-1.5">
                <FaCalendarAlt size={12} /> Next Service Due
              </span>
              <span className="font-medium text-v-text">{formatDate(record.nextServiceDue)}</span>
            </div>
            <div>
              <span className="text-v-text-muted flex items-center gap-1.5">
                <FaShieldAlt size={12} /> Insurance Expiry
              </span>
              <span className="font-medium text-v-text">{formatDate(record.insurance.expiryDate)}</span>
            </div>
            <div>
              <span className="text-v-text-muted flex items-center gap-1.5">
                <FaIdCard size={12} /> Permit Expiry
              </span>
              <span className="font-medium text-v-text">{formatDate(record.permit.expiryDate)}</span>
            </div>
          </div>

          {/* Maintenance toggle */}
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-v-border">
            {record.isUnderMaintenance ? (
              <button
                onClick={handleToggleMaintenance}
                disabled={pendingMaintenanceToggle}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaCheckCircle size={14} /> Mark Available
              </button>
            ) : (
              <button
                onClick={handleToggleMaintenance}
                disabled={pendingMaintenanceToggle}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-orange-700 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaWrench size={14} /> Mark Under Maintenance
              </button>
            )}
            {pendingMaintenanceToggle && (
              <span className="inline-flex items-center gap-1.5 text-yellow-700 font-medium">
                <FaClock size={13} /> Approval Required
              </span>
            )}
          </div>
        </Card>
      )}

      {/* ── Service History ── */}
      {activeTab === 'service-history' && (
        <ServiceHistory
          records={record.serviceHistory}
          onAdd={() => setShowServiceModal(true)}
          currentRole={currentRole}
        />
      )}

      {/* ── Insurance ── */}
      {activeTab === 'insurance' && (
        <InsuranceSection
          insurance={record.insurance}
          onRequestUpdate={handleRequestInsuranceUpdate}
          currentRole={currentRole}
          hasPendingChange={pendingInsurance}
        />
      )}

      {/* ── Permit ── */}
      {activeTab === 'permit' && (
        <PermitSection
          permit={record.permit}
          onRequestUpdate={handleRequestPermitUpdate}
          currentRole={currentRole}
          hasPendingChange={pendingPermit}
        />
      )}

      {/* ── Breakdown Logs ── */}
      {activeTab === 'breakdown-logs' && (
        <BreakdownLogs
          records={record.breakdownLogs}
          onAdd={() => setShowBreakdownModal(true)}
          currentRole={currentRole}
        />
      )}

      {/* ── Audit Log ── */}
      {activeTab === 'audit-log' && (
        <MaintenanceAuditLog logs={auditLogs} />
      )}

      {/* ── Pending Approvals (admin only) ── */}
      {activeTab === 'pending-approvals' && canPerform(ACTIONS.VIEW_PENDING_APPROVALS, currentRole) && (
        <PendingApprovals
          changes={pendingChanges}
          currentRole={currentRole}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* ── Modals ── */}
      <AddServiceModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onConfirm={handleAddService}
      />
      <AddBreakdownModal
        isOpen={showBreakdownModal}
        onClose={() => setShowBreakdownModal(false)}
        onConfirm={handleAddBreakdown}
      />
    </div>
  );
};

export default BusMaintenanceDetail;
