import { useState } from 'react';
import Modal from '../../../components/ui/Modal';

/* ══════════════════════════════════════════════════════
   AddServiceModal — form to add a new service record.
   Fields: date, description, cost, performedBy,
           nextServiceDue.
   ══════════════════════════════════════════════════════ */

const INITIAL = {
  date: '',
  description: '',
  cost: '',
  performedBy: '',
  nextServiceDue: '',
  correctionOf: '', // optional: reference to previous record id being corrected
};

const AddServiceModal = ({ isOpen, onClose, onConfirm }) => {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.date) errs.date = 'Service date is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.cost || Number(form.cost) <= 0) errs.cost = 'Enter a valid cost';
    if (!form.performedBy.trim()) errs.performedBy = 'Performed by is required';
    if (!form.nextServiceDue) errs.nextServiceDue = 'Next service due is required';
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
      cost: Number(form.cost),
      performedBy: form.performedBy.trim(),
      nextServiceDue: form.nextServiceDue,
      correctionOf: form.correctionOf.trim() || null,
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Service Record">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Date */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-v-text-secondary">
            Service Date <span className="text-v-critical">*</span>
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
            placeholder="Describe the service performed"
            className={`input-base resize-none ${errors.description ? 'border-v-critical' : ''}`}
          />
          {errors.description && <span className="text-v-critical font-medium">{errors.description}</span>}
        </div>

        {/* Cost + Performed By */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-medium text-v-text-secondary">
              Cost (₹) <span className="text-v-critical">*</span>
            </label>
            <input
              type="number"
              min={0}
              value={form.cost}
              onChange={(e) => handleChange('cost', e.target.value)}
              placeholder="0"
              className={`input-base ${errors.cost ? 'border-v-critical' : ''}`}
            />
            {errors.cost && <span className="text-v-critical font-medium">{errors.cost}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium text-v-text-secondary">
              Performed By <span className="text-v-critical">*</span>
            </label>
            <input
              type="text"
              value={form.performedBy}
              onChange={(e) => handleChange('performedBy', e.target.value)}
              placeholder="Garage / technician name"
              className={`input-base ${errors.performedBy ? 'border-v-critical' : ''}`}
            />
            {errors.performedBy && <span className="text-v-critical font-medium">{errors.performedBy}</span>}
          </div>
        </div>

        {/* Next Service Due */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-v-text-secondary">
            Next Service Due Date <span className="text-v-critical">*</span>
          </label>
          <input
            type="date"
            value={form.nextServiceDue}
            onChange={(e) => handleChange('nextServiceDue', e.target.value)}
            className={`input-base ${errors.nextServiceDue ? 'border-v-critical' : ''}`}
          />
          {errors.nextServiceDue && <span className="text-v-critical font-medium">{errors.nextServiceDue}</span>}
        </div>

        {/* Correction Reference (optional) */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-v-text-secondary">
            Correction Of Record ID{' '}
            <span className="text-v-text-muted font-normal">(optional — if this corrects a previous entry)</span>
          </label>
          <input
            type="text"
            value={form.correctionOf}
            onChange={(e) => handleChange('correctionOf', e.target.value)}
            placeholder="e.g. svc-001"
            className="input-base"
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

export default AddServiceModal;
