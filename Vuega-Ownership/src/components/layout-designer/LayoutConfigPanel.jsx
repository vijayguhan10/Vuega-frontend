import React from 'react';

/* ──────────────────────────────────────────────
 LayoutConfigPanel — left sidebar with layout
 configuration inputs and action buttons.
 ────────────────────────────────────────────── */

export default function LayoutConfigPanel({
 config,
 updateConfig,
 isGenerated,
 generateLayout,
 resetLayout,
 undo,
 redo,
 canUndo,
 canRedo,
 autoRenumber,
 saveLayout,
}) {
 return (
 <aside className="w-full lg:w-72 xl:w-80 shrink-0 bg-v-primary-bg border border-v-border rounded-xl p-5 space-y-6 self-start">
 {/* Header */}
 <div>
 <h3 className=" font-bold text-v-text tracking-tight">Layout Configuration</h3>
 <p className=" text-v-text-muted mt-0.5">Define the template grid</p>
 </div>

 {/* Layout name */}
 <Field label="Layout Name">
 <input
 type="text"
 placeholder="e.g. Volvo Multi-Axle 52"
 value={config.layoutName}
 onChange={(e) => updateConfig('layoutName', e.target.value)}
 className="input-base"
 />
 </Field>

 {/* Numeric inputs */}
 <div className="grid grid-cols-2 gap-3">
 <Field label="Rows">
 <input
 type="number"
 min={1}
 max={30}
 value={config.rows}
 onChange={(e) => updateConfig('rows', Math.max(1, Number(e.target.value)))}
 className="input-base"
 />
 </Field>

 <Field label="Left Seats">
 <input
 type="number"
 min={1}
 max={4}
 value={config.leftSeats}
 onChange={(e) => updateConfig('leftSeats', Math.max(1, Number(e.target.value)))}
 className="input-base"
 />
 </Field>

 <Field label="Right Seats">
 <input
 type="number"
 min={1}
 max={4}
 value={config.rightSeats}
 onChange={(e) => updateConfig('rightSeats', Math.max(1, Number(e.target.value)))}
 className="input-base"
 />
 </Field>

 <Field label="Default Type">
 <select
 value={config.defaultSeatType}
 onChange={(e) => updateConfig('defaultSeatType', e.target.value)}
 className="input-base"
 >
 <option value="seater">Seater</option>
 <option value="sleeper">Sleeper</option>
 <option value="semi-sleeper">Semi Sleeper</option>
 </select>
 </Field>
 </div>

 {/* Upper deck toggle */}
 <label className="flex items-center gap-3 cursor-pointer group">
 <div className="relative">
 <input
 type="checkbox"
 checked={config.hasUpperDeck}
 onChange={(e) => updateConfig('hasUpperDeck', e.target.checked)}
 className="sr-only peer"
 />
 <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-v-accent-dark transition-colors" />
 <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
 </div>
 <span className=" font-medium text-v-text-secondary group-hover:text-v-text transition-colors">
 Upper Deck
 </span>
 </label>

 {/* Divider */}
 <div className="h-px bg-v-border" />

 {/* Primary actions */}
 <div className="space-y-2">
 <button
 onClick={generateLayout}
 className="w-full py-2.5 rounded-lg font-semibold bg-v-accent hover:bg-v-accent-hover text-v-text border border-v-accent-border transition-colors shadow-sm"
 >
 {isGenerated ? 'Regenerate Layout' : 'Generate Layout'}
 </button>

 {isGenerated && (
 <>
 <button
 onClick={autoRenumber}
 className="w-full py-2 rounded-lg font-medium bg-v-secondary hover:bg-v-secondary-hover text-v-text-secondary border border-v-secondary-border transition-colors"
 >
 Auto Renumber
 </button>

 <div className="flex gap-2">
 <button
 onClick={undo}
 disabled={!canUndo}
 className="flex-1 py-2 rounded-lg font-medium bg-v-primary-bg border border-v-border text-v-text-secondary hover:bg-v-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
 >
 ↩ Undo
 </button>
 <button
 onClick={redo}
 disabled={!canRedo}
 className="flex-1 py-2 rounded-lg font-medium bg-v-primary-bg border border-v-border text-v-text-secondary hover:bg-v-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
 >
 ↪ Redo
 </button>
 </div>
 </>
 )}
 </div>

 {/* Divider */}
 {isGenerated && <div className="h-px bg-v-border" />}

 {/* Secondary actions */}
 {isGenerated && (
 <div className="space-y-2">
 <button
 onClick={saveLayout}
 className="w-full py-2.5 rounded-lg font-semibold bg-v-text text-white hover:bg-v-text-secondary transition-colors shadow-sm"
 >
 Save Template
 </button>

 <button
 onClick={resetLayout}
 className="w-full py-2 rounded-lg font-medium text-v-critical border border-v-critical-border hover:bg-v-critical-light transition-colors"
 >
 Reset All
 </button>
 </div>
 )}
 </aside>
 );
}

/* ── tiny field wrapper ── */
function Field({ label, children }) {
 return (
 <div className="space-y-1">
 <label className=" font-semibold text-v-text-muted uppercase tracking-wider">
 {label}
 </label>
 {children}
 </div>
 );
}
