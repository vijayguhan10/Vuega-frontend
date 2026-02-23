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
} from 'react-icons/fa';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import ServiceHistory from './components/ServiceHistory';
import InsuranceSection from './components/InsuranceSection';
import PermitSection from './components/PermitSection';
import BreakdownLogs from './components/BreakdownLogs';
import AddServiceModal from './components/AddServiceModal';
import AddBreakdownModal from './components/AddBreakdownModal';
import dummyMaintenance, {
  computeStatus,
  generateId,
  generateBreakdownId,
  checkTripEligibility,
} from './data/dummyMaintenance';

/* ══════════════════════════════════════════════════════
   BusMaintenanceDetail — full maintenance view for
   a single bus: overview, service history, insurance,
   permit, breakdown logs.
   ══════════════════════════════════════════════════════ */

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

const BusMaintenanceDetail = () => {
  const { busId } = useParams();
  const navigate = useNavigate();

  /* ── State ── */
  const initial = dummyMaintenance.find((r) => r.busId === busId);
  const [record, setRecord] = useState(initial ? { ...initial } : null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);

  /* ── Derived ── */
  const status = useMemo(() => (record ? computeStatus(record) : 'inactive'), [record]);
  const eligibility = useMemo(() => (record ? checkTripEligibility(record) : { eligible: false, reasons: [] }), [record]);

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

  /* ── Handlers ── */
  const toggleMaintenance = () => {
    setRecord((prev) => ({ ...prev, isUnderMaintenance: !prev.isUnderMaintenance }));
  };

  const handleAddService = (svc) => {
    setRecord((prev) => ({
      ...prev,
      lastServiceDate: svc.date,
      nextServiceDue: svc.nextServiceDue,
      serviceHistory: [{ ...svc, id: generateId() }, ...prev.serviceHistory],
    }));
    setShowServiceModal(false);
  };

  const handleDeleteService = (id) => {
    setRecord((prev) => ({
      ...prev,
      serviceHistory: prev.serviceHistory.filter((s) => s.id !== id),
    }));
  };

  const handleAddBreakdown = (brk) => {
    setRecord((prev) => ({
      ...prev,
      breakdownLogs: [{ ...brk, id: generateBreakdownId() }, ...prev.breakdownLogs],
    }));
    setShowBreakdownModal(false);
  };

  const handleUpdateInsurance = (data) => {
    setRecord((prev) => ({ ...prev, insurance: { ...data } }));
  };

  const handleUpdatePermit = (data) => {
    setRecord((prev) => ({ ...prev, permit: { ...data } }));
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ── Back + Header ── */}
      <div className="flex items-center gap-4">
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

      {/* ── Trip Eligibility Warning ── */}
      {!eligibility.eligible && (
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-lg bg-v-critical-light border border-v-critical-border">
          <FaExclamationTriangle size={16} className="text-v-critical flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-v-critical">Not Eligible for Trip Creation</p>
            {/* TODO: Backend validation placeholder — enforce these checks server-side before allowing trip creation */}
            <ul className="text-v-critical mt-1 list-disc list-inside">
              {eligibility.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────
         SECTION A — Overview Card
         ──────────────────────────────────────────────── */}
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
            <span className="text-v-text-muted block flex items-center gap-1.5">
              <FaCalendarAlt size={12} /> Last Service
            </span>
            <span className="font-medium text-v-text">{formatDate(record.lastServiceDate)}</span>
          </div>
          <div>
            <span className="text-v-text-muted block flex items-center gap-1.5">
              <FaCalendarAlt size={12} /> Next Service Due
            </span>
            <span className="font-medium text-v-text">{formatDate(record.nextServiceDue)}</span>
          </div>
          <div>
            <span className="text-v-text-muted block flex items-center gap-1.5">
              <FaShieldAlt size={12} /> Insurance Expiry
            </span>
            <span className="font-medium text-v-text">{formatDate(record.insurance.expiryDate)}</span>
          </div>
          <div>
            <span className="text-v-text-muted block flex items-center gap-1.5">
              <FaIdCard size={12} /> Permit Expiry
            </span>
            <span className="font-medium text-v-text">{formatDate(record.permit.expiryDate)}</span>
          </div>
        </div>

        {/* Maintenance toggle buttons */}
        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-v-border">
          {record.isUnderMaintenance ? (
            <button
              onClick={toggleMaintenance}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 transition-colors"
            >
              <FaCheckCircle size={14} /> Mark Available
            </button>
          ) : (
            <button
              onClick={toggleMaintenance}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-orange-700 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors"
            >
              <FaWrench size={14} /> Mark Under Maintenance
            </button>
          )}
        </div>
      </Card>

      {/* ────────────────────────────────────────────────
         SECTION B — Service History
         ──────────────────────────────────────────────── */}
      <ServiceHistory
        records={record.serviceHistory}
        onAdd={() => setShowServiceModal(true)}
        onDelete={handleDeleteService}
      />

      {/* ────────────────────────────────────────────────
         SECTION C — Insurance
         ──────────────────────────────────────────────── */}
      <InsuranceSection insurance={record.insurance} onUpdate={handleUpdateInsurance} />

      {/* ────────────────────────────────────────────────
         SECTION D — Permit
         ──────────────────────────────────────────────── */}
      <PermitSection permit={record.permit} onUpdate={handleUpdatePermit} />

      {/* ────────────────────────────────────────────────
         SECTION E — Breakdown Logs
         ──────────────────────────────────────────────── */}
      <BreakdownLogs
        records={record.breakdownLogs}
        onAdd={() => setShowBreakdownModal(true)}
      />

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
