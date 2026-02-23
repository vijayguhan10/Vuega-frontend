import React, { memo } from 'react';
import sleeperSvg from '../../assets/sleeper.svg';
import semiSleeperSvg from '../../assets/semisleeper.svg';

/* ──────────────────────────────────────────────
 SeatCell — renders one seat (or aisle gap)
 in the grid.
 ────────────────────────────────────────────── */

const TYPE_SVG = {
 seater: null, // simple colored rectangle
 sleeper: sleeperSvg,
 'semi-sleeper': semiSleeperSvg,
};

const SeatCell = memo(function SeatCell({
 seat, // seat object | null (aisle)
 isSelected,
 isColumnSelected,
 onSelect,
 onRemove,
 onRestore,
}) {
 /* ── aisle column ── */
 if (!seat) {
 return <div className="w-full h-full" />;
 }

 /* ── removed seat ── */
 if (seat.removed) {
 return (
 <button
 onClick={() => onRestore(seat.id)}
 title="Restore seat"
 className="w-full h-full min-h-12 rounded-lg border-2 border-dashed border-gray-300
 flex items-center justify-center text-gray-400 
 hover:border-v-accent-dark hover:text-v-accent-dark transition-colors cursor-pointer"
 >
 ＋
 </button>
 );
 }

 /* ── colour logic ── */
 let ringClass = '';
 let bgClass = 'bg-v-secondary border border-v-secondary-border';
 let numberColor = 'text-v-text';

 if (seat.isBlocked) {
 bgClass = 'bg-gray-200 border border-gray-300';
 numberColor = 'text-gray-500 line-through';
 } else if (seat.isLadies) {
 bgClass = 'bg-pink-100 border border-pink-300';
 numberColor = 'text-pink-700';
 }

 if (isSelected) {
 ringClass = 'ring-2 ring-v-accent-dark ring-offset-1';
 } else if (isColumnSelected) {
 ringClass = 'ring-2 ring-blue-400/60 ring-offset-1';
 }

 /* ── SVG or colored box ── */
 const svgSrc = TYPE_SVG[seat.type];

 return (
 <button
 onClick={() => onSelect(seat.id)}
 onContextMenu={(e) => {
 e.preventDefault();
 onRemove(seat.id);
 }}
 title={`Seat ${seat.seatNumber} (${seat.type})${seat.isLadies ? ' — Ladies' : ''}${seat.isBlocked ? ' — Blocked' : ''}\nRight-click to remove`}
 className={`
 relative w-full h-full min-h-12 rounded-lg
 flex items-center justify-center
 ${bgClass} ${ringClass}
 hover:shadow-md transition-all cursor-pointer select-none
 `}
 >
 {svgSrc ? (
 <img
 src={svgSrc}
 alt={seat.type}
 className="w-8 h-8 md:w-10 md:h-10 object-contain pointer-events-none opacity-60"
 draggable={false}
 />
 ) : (
 /* seater — simple icon */
 <svg
 viewBox="0 0 24 24"
 className="w-7 h-7 md:w-8 md:h-8 opacity-50 pointer-events-none"
 fill="currentColor"
 >
 <path d="M7 18v1a1 1 0 0 1-2 0v-1H4a2 2 0 0 1-2-2V8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8a2 2 0 0 1-2 2h-1v1a1 1 0 0 1-2 0v-1H7Zm-3-2h16V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8Zm3-4a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2H7Z" />
 </svg>
 )}

 {/* seat number overlay */}
 <span
 className={`absolute bottom-0.5 right-1 font-bold leading-none ${numberColor}`}
 >
 {seat.seatNumber}
 </span>
 </button>
 );
});

/* ── Driver placeholder ── */
export const DriverCell = memo(function DriverCell() {
 return (
 <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="24"
 height="24"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth={2}
 strokeLinecap="round"
 strokeLinejoin="round"
 className="w-7 h-7 text-gray-500 opacity-70"
 >
 <circle cx="12" cy="12" r="10" />
 <path d="m3.3 7 7 4" />
 <path d="m13.7 11 7-4" />
 <path d="M12 14v8" />
 <circle cx="12" cy="12" r="2" />
 </svg>
 </div>
 );
});

export default SeatCell;
