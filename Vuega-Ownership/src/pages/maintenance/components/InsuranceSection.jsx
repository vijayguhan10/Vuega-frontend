import { useState } from 'react';
import { FaShieldAlt, FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';
import Card from '../../../components/ui/Card';

/* ══════════════════════════════════════════════════════
   InsuranceSection — displays & allows inline update
   of insurance details.
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

const InsuranceSection = ({ insurance, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...insurance });

  const handleSave = () => {
    onUpdate({ ...form });
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ ...insurance });
    setEditing(false);
  };

  const expired = isExpired(insurance.expiryDate);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-v-text flex items-center gap-2">
          <FaShieldAlt size={16} className="text-blue-500" /> Insurance
        </h3>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-secondary transition-colors"
          >
            <FaPencilAlt size={12} /> Update Insurance
          </button>
        )}
      </div>

      {editing ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-v-text-secondary">Provider</label>
              <input
                type="text"
                value={form.provider}
                onChange={(e) => setForm((p) => ({ ...p, provider: e.target.value }))}
                className="input-base"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-v-text-secondary">Policy Number</label>
              <input
                type="text"
                value={form.policyNumber}
                onChange={(e) => setForm((p) => ({ ...p, policyNumber: e.target.value }))}
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
              <FaCheck size={14} className="inline mr-1" /> Save
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-v-text-muted block">Provider</span>
            <span className="font-medium text-v-text">{insurance.provider}</span>
          </div>
          <div>
            <span className="text-v-text-muted block">Policy Number</span>
            <span className="font-medium text-v-text">{insurance.policyNumber}</span>
          </div>
          <div>
            <span className="text-v-text-muted block">Expiry Date</span>
            <span className={`font-medium ${expired ? 'text-red-600' : 'text-v-text'}`}>
              {formatDate(insurance.expiryDate)}
              {expired && <span className="ml-2 text-red-600 font-semibold">(Expired)</span>}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default InsuranceSection;
