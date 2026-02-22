import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import { FaPaperPlane } from 'react-icons/fa';

/**
 * Modal for submitting a route creation request.
 * The route is added with status "pending-approval".
 * Super Admin must approve before the route becomes active.
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {(newRoute: Object) => void} onSubmit – callback to add route to parent state
 */
export default function RequestRouteModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    fromCity: '',
    toCity: '',
    distance: '',
    duration: '',
    notes: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRoute = {
      id: `route-${Date.now()}`,
      fromCity: form.fromCity,
      toCity: form.toCity,
      distance: Number(form.distance) || 0,
      duration: form.duration,
      stops: [],
      boardingPoints: [],
      dropPoints: [],
      status: 'pending-approval',
      notes: form.notes,
    };

    // TODO: POST to /api/routes/request when backend is ready
    console.log('Route Creation Request payload:', newRoute);

    if (onSubmit) onSubmit(newRoute);
    onClose();
    setForm({ fromCity: '', toCity: '', distance: '', duration: '', notes: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request New Route">
      <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-v-secondary border border-v-secondary-border">
        <p className="text-v-text-secondary">
          This request will be sent to the Super Admin for approval. Once
          approved, the route will become active and available for trip scheduling.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* From City */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-v-text-secondary uppercase tracking-wider">
            From City
          </label>
          <input
            type="text"
            name="fromCity"
            value={form.fromCity}
            onChange={handleChange}
            placeholder="e.g. Chennai"
            required
            className="w-full px-3.5 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text placeholder:text-v-text-placeholder focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
          />
        </div>

        {/* To City */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-v-text-secondary uppercase tracking-wider">
            To City
          </label>
          <input
            type="text"
            name="toCity"
            value={form.toCity}
            onChange={handleChange}
            placeholder="e.g. Bangalore"
            required
            className="w-full px-3.5 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text placeholder:text-v-text-placeholder focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
          />
        </div>

        {/* Distance */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-v-text-secondary uppercase tracking-wider">
            Approx. Distance (km)
          </label>
          <input
            type="number"
            name="distance"
            min="0"
            value={form.distance}
            onChange={handleChange}
            placeholder="e.g. 346"
            required
            className="w-full px-3.5 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text placeholder:text-v-text-placeholder focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
          />
        </div>

        {/* Estimated Duration */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-v-text-secondary uppercase tracking-wider">
            Estimated Duration
          </label>
          <input
            type="text"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="e.g. 5h 30m"
            required
            className="w-full px-3.5 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text placeholder:text-v-text-placeholder focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
          />
        </div>

        {/* Notes (optional) */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-v-text-secondary uppercase tracking-wider">
            Notes <span className="text-v-text-placeholder font-normal normal-case">(optional)</span>
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Any additional details for the admin…"
            className="w-full px-3.5 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text placeholder:text-v-text-placeholder focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-v-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold bg-v-accent hover:bg-v-accent-hover text-v-text border border-v-accent-border transition-colors"
          >
            <FaPaperPlane size={14} />
            Submit Request
          </button>
        </div>
      </form>
    </Modal>
  );
}
