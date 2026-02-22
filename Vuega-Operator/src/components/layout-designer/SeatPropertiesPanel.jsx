import React from 'react';

/* ──────────────────────────────────────────────
   SeatPropertiesPanel — right sidebar to edit
   the currently-selected seat's properties.
   ────────────────────────────────────────────── */

export default function SeatPropertiesPanel({
  seat,             // selected seat object | null
  selectedColumn,   // { colIndex } | null
  columnSeats,      // array of seats in selected column
  updateSeatProperty,
  updateColumnType,
  removeSeat,
  restoreSeat,
  clearSelection,
}) {
  /* ── nothing selected ── */
  if (!seat && !selectedColumn) {
    return (
      <aside className="w-full lg:w-64 xl:w-72 shrink-0 bg-v-primary-bg border border-v-border rounded-xl p-5 self-start">
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-v-secondary border border-v-secondary-border flex items-center justify-center">
            <svg className="w-5 h-5 text-v-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.591" />
            </svg>
          </div>
          <p className="text-xs text-v-text-muted">Click a seat to edit · Click a column header to bulk-edit</p>
        </div>
      </aside>
    );
  }

  /* ── column selected ── */
  if (selectedColumn && !seat) {
    const colIdx = selectedColumn.colIndex;
    // Determine the dominant type in the column
    const typeCounts = {};
    (columnSeats || []).forEach((s) => {
      typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
    });
    const dominantType = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a])[0] || 'seater';

    return (
      <aside className="w-full lg:w-64 xl:w-72 shrink-0 bg-v-primary-bg border border-v-border rounded-xl p-5 space-y-5 self-start">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-v-text tracking-tight">Column Properties</h3>
          <button
            onClick={clearSelection}
            className="text-v-text-muted hover:text-v-text text-xs transition-colors"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Column badge */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-v-text">Column {colIdx < 2 ? colIdx + 1 : colIdx}</p>
            <p className="text-[10px] text-v-text-muted">{(columnSeats || []).length} seat{(columnSeats || []).length !== 1 ? 's' : ''} in column</p>
          </div>
        </div>

        {/* Column seat type */}
        <Field label="Change All Seats to">
          <select
            value={dominantType}
            onChange={(e) => updateColumnType(colIdx, e.target.value)}
            className="input-base"
          >
            <option value="seater">Seater</option>
            <option value="sleeper">Sleeper</option>
            <option value="semi-sleeper">Semi Sleeper</option>
          </select>
        </Field>

        {/* Info */}
        <p className="text-[10px] text-v-text-muted leading-relaxed">
          Changing the type here will update <span className="font-semibold">all non-removed lower-deck seats</span> in this column. Upper deck seats remain as sleeper.
        </p>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-64 xl:w-72 shrink-0 bg-v-primary-bg border border-v-border rounded-xl p-5 space-y-5 self-start">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-v-text tracking-tight">Seat Properties</h3>
        <button
          onClick={clearSelection}
          className="text-v-text-muted hover:text-v-text text-xs transition-colors"
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* Seat badge */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-v-secondary/60 border border-v-secondary-border">
        <div className="w-10 h-10 rounded-lg bg-v-accent flex items-center justify-center">
          <span className="text-sm font-bold text-v-text">{seat.seatNumber}</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-v-text">Seat #{seat.seatNumber}</p>
          <p className="text-[10px] text-v-text-muted capitalize">{seat.deck} deck · {seat.type}</p>
        </div>
      </div>

      {/* Seat number */}
      <Field label="Seat Number">
        <input
          type="text"
          value={seat.seatNumber}
          onChange={(e) => updateSeatProperty(seat.id, 'seatNumber', e.target.value)}
          className="input-base"
        />
      </Field>

      {/* Seat type */}
      <Field label="Seat Type">
        {seat.deck === 'upper' ? (
          <div className="input-base bg-gray-50 text-v-text-muted cursor-not-allowed">Sleeper</div>
        ) : (
          <select
            value={seat.type}
            onChange={(e) => updateSeatProperty(seat.id, 'type', e.target.value)}
            className="input-base"
          >
            <option value="seater">Seater</option>
            <option value="sleeper">Sleeper</option>
            <option value="semi-sleeper">Semi Sleeper</option>
          </select>
        )}
      </Field>
      {seat.deck === 'upper' && (
        <p className="text-[10px] text-v-text-muted">Upper deck seats are always sleeper</p>
      )}

      {/* Toggles */}
      <div className="space-y-3">
        <Toggle
          label="Ladies Seat"
          description="Reserve for female passengers"
          checked={seat.isLadies}
          onChange={(v) => updateSeatProperty(seat.id, 'isLadies', v)}
          accentClass="peer-checked:bg-pink-400"
        />
        <Toggle
          label="Blocked"
          description="Seat unavailable for booking"
          checked={seat.isBlocked}
          onChange={(v) => updateSeatProperty(seat.id, 'isBlocked', v)}
          accentClass="peer-checked:bg-gray-500"
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-v-border" />

      {/* Remove / Restore */}
      {seat.removed ? (
        <button
          onClick={() => restoreSeat(seat.id)}
          className="w-full py-2 rounded-lg text-xs font-medium text-green-700 border border-green-300 hover:bg-green-50 transition-colors"
        >
          Restore Seat
        </button>
      ) : (
        <button
          onClick={() => removeSeat(seat.id)}
          className="w-full py-2 rounded-lg text-xs font-medium text-v-critical border border-v-critical-border hover:bg-v-critical-light transition-colors"
        >
          Remove Seat
        </button>
      )}
    </aside>
  );
}

/* ── helpers ── */

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

function Toggle({ label, description, checked, onChange, accentClass = 'peer-checked:bg-v-accent-dark' }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className={`w-8 h-4.5 bg-gray-200 rounded-full ${accentClass} transition-colors`} />
        <div className="absolute left-0.5 top-px w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-3.5 transition-transform" />
      </div>
      <div>
        <span className="text-xs font-medium text-v-text-secondary group-hover:text-v-text transition-colors block leading-tight">
          {label}
        </span>
        {description && (
          <span className="text-[10px] text-v-text-muted leading-tight">{description}</span>
        )}
      </div>
    </label>
  );
}
