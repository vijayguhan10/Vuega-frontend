import { useState } from 'react';
import Modal from '../../../components/ui/Modal';

/* ══════════════════════════════════════════════════════
   AddBreakdownModal — form to log a new breakdown.
   Fields: date, description, resolved toggle,
           resolvedDate, notes.
   ══════════════════════════════════════════════════════ */

const INITIAL = {
  date: '',
  description: '',
  resolved: false,
  resolvedDate: '',
  notes: '',
};

const AddBreakdownModal = ({ isOpen, onClose, onConfirm }) => {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.date) errs.date = 'Issue date is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (form.resolved && !form.resolvedDate) errs.resolvedDate = 'Resolution date is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onConfirm({
      date: form.date,
      description: form.description.trim(),
      resolved: form.resolved,
      resolvedDate: form.resolved ? form.resolvedDate : null,
      notes: form.notes.trim() || null,
    });
    setForm(INITIAL);
    setErrors({});
  };

  const handleClose = () => {
    setForm(INITIAL);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Breakdown Record">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Issue Date */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-v-text-secondary">
            Issue Date <span className="text-v-critical">*</span>
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className={`input-base ${errors.date ? 'border-v-critical' : ''}`}
          />
          {errors.date && <span className="text-v-critical font-medium">{errors.date}</span>}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-v-text-secondary">
            Description <span className="text-v-critical">*</span>
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the breakdown issue"
            className={`input-base resize-none ${errors.description ? 'border-v-critical' : ''}`}
          />
          {errors.description && <span className="text-v-critical font-medium">{errors.description}</span>}
        </div>

        {/* Resolved Toggle */}
        <div className="flex items-center gap-3">
          <label className="font-medium text-v-text-secondary">Mark Resolved</label>
          <button
            type="button"
            onClick={() => handleChange('resolved', !form.resolved)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              form.resolved ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                form.resolved ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Resolution Date (conditional) */}
        {form.resolved && (
          <div className="flex flex-col gap-1">
            <label className="font-medium text-v-text-secondary">
              Resolution Date <span className="text-v-critical">*</span>
            </label>
            <input
              type="date"
              value={form.resolvedDate}
              onChange={(e) => handleChange('resolvedDate', e.target.value)}
              className={`input-base ${errors.resolvedDate ? 'border-v-critical' : ''}`}
            />
            {errors.resolvedDate && <span className="text-v-critical font-medium">{errors.resolvedDate}</span>}
          </div>
        )}

        {/* Notes */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-v-text-secondary">Notes</label>
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Additional notes (optional)"
            className="input-base resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-v-border">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white border border-green-700 transition-colors shadow-sm"
          >
            Add Record
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddBreakdownModal;
