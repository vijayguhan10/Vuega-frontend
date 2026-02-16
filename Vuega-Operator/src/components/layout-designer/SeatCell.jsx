import React, { memo } from 'react';
import driverSvg from '../../assets/driver.svg';
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
  seat,       // seat object | null (aisle)
  isSelected,
  isColumnSelected,
  onSelect,
  onRemove,
  onRestore,
}) {
  /* ── aisle column ── */
  if (!seat) {
    return <div className="w-12 h-12 md:w-14 md:h-14" />;
  }

  /* ── removed seat ── */
  if (seat.removed) {
    return (
      <button
        onClick={() => onRestore(seat.id)}
        title="Restore seat"
        className="w-12 h-12 md:w-14 md:h-14 rounded-lg border-2 border-dashed border-gray-300
                   flex items-center justify-center text-gray-400 text-xs
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
        relative w-12 h-12 md:w-14 md:h-14 rounded-lg
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
        className={`absolute bottom-0.5 right-1 text-[10px] font-bold leading-none ${numberColor}`}
      >
        {seat.seatNumber}
      </span>
    </button>
  );
});

/* ── Driver placeholder ── */
export const DriverCell = memo(function DriverCell() {
  return (
    <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
      <img
        src={driverSvg}
        alt="Driver"
        className="w-8 h-8 md:w-10 md:h-10 object-contain opacity-50"
        draggable={false}
      />
    </div>
  );
});

export default SeatCell;
