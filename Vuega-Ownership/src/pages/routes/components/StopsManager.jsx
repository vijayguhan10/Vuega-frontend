import { useState } from 'react';
import { generateId } from '../data/dummyRoutes';

/* ──────────────────────────────────────────────
 StopsManager — dynamic list of intermediate
 stops with automatic ordering.
 ────────────────────────────────────────────── */

export default function StopsManager({ stops, onChange }) {
 const addStop = () => {
 onChange([
 ...stops,
 { id: generateId(), name: '', order: stops.length + 1 },
 ]);
 };

 const removeStop = (id) => {
 const updated = stops
 .filter((s) => s.id !== id)
 .map((s, idx) => ({ ...s, order: idx + 1 }));
 onChange(updated);
 };

 const updateStop = (id, key, value) => {
 onChange(stops.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
 };

 return (
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <h3 className=" font-semibold text-v-text">Intermediate Stops</h3>
 <button
 type="button"
 onClick={addStop}
 className=" font-medium text-v-accent-dark hover:text-v-accent-hover transition-colors"
 >
 + Add Stop
 </button>
 </div>

 {stops.length === 0 && (
 <p className=" text-v-text-muted py-4 text-center">
 No stops added yet. Click "Add Stop" to begin.
 </p>
 )}

 <div className="space-y-2">
 {stops.map((stop) => (
 <div
 key={stop.id}
 className="flex items-center gap-3 p-3 rounded-lg bg-v-secondary/40 border border-v-border-light"
 >
 {/* Order badge */}
 <span className="w-7 h-7 shrink-0 rounded-full bg-v-accent flex items-center justify-center font-bold text-v-text">
 {stop.order}
 </span>

 {/* Stop name */}
 <input
 type="text"
 value={stop.name}
 onChange={(e) => updateStop(stop.id, 'name', e.target.value)}
 placeholder="Stop name"
 className="flex-1 px-3 py-1.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text placeholder:text-v-text-placeholder focus:outline-none focus:ring-1 focus:ring-v-accent-dark transition"
 />

 {/* Remove */}
 <button
 type="button"
 onClick={() => removeStop(stop.id)}
 title="Remove stop"
 className="p-1 rounded-md text-v-text-muted hover:text-v-critical hover:bg-v-critical-light transition-colors"
 >
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>
 ))}
 </div>
 </div>
 );
}
