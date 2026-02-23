import { generateId } from '../data/dummyRoutes';

/* ──────────────────────────────────────────────
 BoardingPointsManager — dynamic list of
 boarding points with time-offset input.
 ────────────────────────────────────────────── */

export default function BoardingPointsManager({ points, onChange }) {
 const addPoint = () => {
 onChange([...points, { id: generateId(), name: '', timeOffset: '' }]);
 };

 const removePoint = (id) => {
 onChange(points.filter((p) => p.id !== id));
 };

 const updatePoint = (id, key, value) => {
 onChange(points.map((p) => (p.id === id ? { ...p, [key]: value } : p)));
 };

 return (
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <h3 className=" font-semibold text-v-text">Boarding Points</h3>
 <button
 type="button"
 onClick={addPoint}
 className=" font-medium text-v-accent-dark hover:text-v-accent-hover transition-colors"
 >
 + Add Boarding Point
 </button>
 </div>

 {points.length === 0 && (
 <p className=" text-v-text-muted py-4 text-center">
 No boarding points added yet.
 </p>
 )}

 <div className="space-y-2">
 {points.map((pt) => (
 <div
 key={pt.id}
 className="flex items-center gap-3 p-3 rounded-lg bg-v-secondary/40 border border-v-border-light"
 >
 {/* Name */}
 <input
 type="text"
 value={pt.name}
 onChange={(e) => updatePoint(pt.id, 'name', e.target.value)}
 placeholder="Boarding point name"
 className="flex-1 px-3 py-1.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text placeholder:text-v-text-placeholder focus:outline-none focus:ring-1 focus:ring-v-accent-dark transition"
 />

 {/* Time offset */}
 <input
 type="text"
 value={pt.timeOffset}
 onChange={(e) => updatePoint(pt.id, 'timeOffset', e.target.value)}
 placeholder="+0 min"
 className="w-28 shrink-0 px-3 py-1.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text text-center placeholder:text-v-text-placeholder focus:outline-none focus:ring-1 focus:ring-v-accent-dark transition"
 />

 {/* Remove */}
 <button
 type="button"
 onClick={() => removePoint(pt.id)}
 title="Remove boarding point"
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
