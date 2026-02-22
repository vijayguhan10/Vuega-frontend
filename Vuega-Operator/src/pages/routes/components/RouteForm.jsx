import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StopsManager from './StopsManager';
import BoardingPointsManager from './BoardingPointsManager';
import DropPointsManager from './DropPointsManager';

/* ──────────────────────────────────────────────
   RouteForm — form for creating / editing a
   route (used inside CreateRoute page).
   ────────────────────────────────────────────── */

const INITIAL_STATE = {
  fromCity: '',
  toCity: '',
  distance: '',
  duration: '',
  status: 'active',
  stops: [],
  boardingPoints: [],
  dropPoints: [],
};

export default function RouteForm({ initial = null }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial ?? { ...INITIAL_STATE });

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = (e) => {
    e.preventDefault();
    console.log('── Route Saved ──');
    console.log(JSON.stringify(form, null, 2));
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* ── Basic Route Info ── */}
      <section className="bg-v-primary-bg border border-v-border rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-bold text-v-text uppercase tracking-wider">
          Basic Route Info
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* From City */}
          <Field label="From City">
            <input
              type="text"
              value={form.fromCity}
              onChange={(e) => set('fromCity', e.target.value)}
              placeholder="e.g. Chennai"
              className="input-base"
              required
            />
          </Field>

          {/* To City */}
          <Field label="To City">
            <input
              type="text"
              value={form.toCity}
              onChange={(e) => set('toCity', e.target.value)}
              placeholder="e.g. Bangalore"
              className="input-base"
              required
            />
          </Field>

          {/* Distance */}
          <Field label="Distance (km)">
            <input
              type="number"
              min="0"
              value={form.distance}
              onChange={(e) => set('distance', e.target.value)}
              placeholder="346"
              className="input-base"
              required
            />
          </Field>

          {/* Duration */}
          <Field label="Estimated Duration">
            <input
              type="text"
              value={form.duration}
              onChange={(e) => set('duration', e.target.value)}
              placeholder="5h 30m"
              className="input-base"
              required
            />
          </Field>

          {/* Status */}
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className="input-base"
            >
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </Field>
        </div>
      </section>

      {/* ── Stops ── */}
      <section className="bg-v-primary-bg border border-v-border rounded-xl p-6">
        <StopsManager stops={form.stops} onChange={(v) => set('stops', v)} />
      </section>

      {/* ── Boarding Points ── */}
      <section className="bg-v-primary-bg border border-v-border rounded-xl p-6">
        <BoardingPointsManager points={form.boardingPoints} onChange={(v) => set('boardingPoints', v)} />
      </section>

      {/* ── Drop Points ── */}
      <section className="bg-v-primary-bg border border-v-border rounded-xl p-6">
        <DropPointsManager points={form.dropPoints} onChange={(v) => set('dropPoints', v)} />
      </section>

      {/* ── Actions ── */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate('/routes')}
          className="px-5 py-2 rounded-lg text-sm font-medium text-v-text-secondary border border-v-border hover:bg-v-secondary transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-lg text-sm font-medium text-v-text bg-v-accent hover:bg-v-accent-hover border border-v-accent-border shadow-sm transition-colors"
        >
          Save Route
        </button>
      </div>
    </form>
  );
}

/* ── tiny helper ── */
function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-semibold text-v-text-muted uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}
