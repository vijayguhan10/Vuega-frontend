import { memo } from 'react';
import sleeperSvg from '../../../assets/sleeper.svg';
import semiSleeperSvg from '../../../assets/semisleeper.svg';

/* ──────────────────────────────────────────────
   Trip SeatCell — renders one seat in the trip
   seat map. Shows seat state visually and
   supports click-to-select for block/price ops.
   ────────────────────────────────────────────── */

const TYPE_SVG = {
  seater: null,
  sleeper: sleeperSvg,
  'semi-sleeper': semiSleeperSvg,
};

const STATUS_STYLES = {
  available: {
    bg: 'bg-v-secondary border border-v-secondary-border',
    text: 'text-v-text',
    label: 'Available',
  },
  booked: {
    bg: 'bg-green-100 border border-green-300',
    text: 'text-green-700',
    label: 'Booked',
  },
  blocked: {
    bg: 'bg-gray-200 border border-gray-400',
    text: 'text-gray-500 line-through',
    label: 'Blocked',
  },
};

const SeatCell = memo(function SeatCell({ seat, isSelected, isColumnSelected, onSelect }) {
  if (!seat) return <div className="w-full h-full" />;

  const statusStyle = STATUS_STYLES[seat.status] || STATUS_STYLES.available;
  const ringClass = isSelected
    ? 'ring-2 ring-v-accent-dark ring-offset-1'
    : isColumnSelected
    ? 'ring-2 ring-blue-400/60 ring-offset-1'
    : '';

  const svgSrc = TYPE_SVG[seat.type];

  return (
    <button
      onClick={() => onSelect(seat.id)}
      title={`Seat ${seat.seatNumber} (${seat.type}) — ${statusStyle.label}\n₹${seat.finalPrice}`}
      className={`
        relative w-full h-full min-h-12 rounded-lg
        flex items-center justify-center
        ${statusStyle.bg} ${ringClass}
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
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 md:w-8 md:h-8 opacity-50 pointer-events-none"
          fill="currentColor"
        >
          <path d="M7 18v1a1 1 0 0 1-2 0v-1H4a2 2 0 0 1-2-2V8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8a2 2 0 0 1-2 2h-1v1a1 1 0 0 1-2 0v-1H7Zm-3-2h16V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8Zm3-4a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2H7Z" />
        </svg>
      )}

      {/* seat number overlay */}
      <span className={`absolute bottom-0.5 right-1 font-bold leading-none ${statusStyle.text}`}>
        {seat.seatNumber}
      </span>

      {/* price badge */}
      {seat.finalPrice > 0 && (
        <span className="absolute top-0.5 left-1 font-medium leading-none text-v-text-muted" style={{ fontSize: '0.6rem' }}>
          ₹{seat.finalPrice}
        </span>
      )}
    </button>
  );
});

export default SeatCell;
