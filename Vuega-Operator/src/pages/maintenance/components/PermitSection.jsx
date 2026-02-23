import { useState } from 'react';
import { FaIdCard, FaPencilAlt, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import Card from '../../../components/ui/Card';
import { canPerform, ACTIONS } from '../utils/permissions';

/* ══════════════════════════════════════════════════════
   PermitSection — displays permit details.
   Updates require approval — submits a pending change
   request instead of applying directly.
   ══════════════════════════════════════════════════════ */

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

const isExpired = (d) => {
  if (!d) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(d) < today;
};

const PermitSection = ({ permit, onRequestUpdate, currentRole, hasPendingChange }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...permit });

  const canRequest = canPerform(ACTIONS.REQUEST_PERMIT_UPDATE, currentRole);

  const handleSave = () => {
    onRequestUpdate({ ...form });
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ ...permit });
    setEditing(false);
  };

  const expired = isExpired(permit.expiryDate);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-v-text flex items-center gap-2">
          <FaIdCard size={16} className="text-purple-500" /> Permit
        </h3>
        {!editing && canRequest && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-secondary transition-colors"
          >
            <FaPencilAlt size={12} /> Request Update
          </button>
        )}
      </div>

      {editing ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-v-text-secondary">Permit Number</label>
              <input
                type="text"
                value={form.permitNumber}
                onChange={(e) => setForm((p) => ({ ...p, permitNumber: e.target.value }))}
                className="input-base"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-v-text-secondary">Expiry Date</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))}
                className="input-base"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-secondary transition-colors"
            >
              <FaTimes size={14} className="inline mr-1" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg font-medium text-white bg-green-600 border border-green-700 hover:bg-green-700 transition-colors"
            >
              <FaCheck size={14} className="inline mr-1" /> Submit for Approval
            </button>
          </div>
        </div>
      ) : (
        <>
          {hasPendingChange && (
            <div className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 font-medium">
              <FaClock size={14} />
              Pending Approval from Company Admin
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-v-text-muted block">Permit Number</span>
              <span className="font-medium text-v-text">{permit.permitNumber}</span>
            </div>
            <div>
              <span className="text-v-text-muted block">Expiry Date</span>
              <span className={`font-medium ${expired ? 'text-red-600' : 'text-v-text'}`}>
                {formatDate(permit.expiryDate)}
                {expired && <span className="ml-2 text-red-600 font-semibold">(Expired)</span>}
              </span>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default PermitSection;
