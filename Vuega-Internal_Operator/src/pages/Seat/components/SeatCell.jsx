import { memo } from 'react';
import sleeperSvg from '../../../assets/sleeper1.png';
import seaterSvg from '../../../assets/seater1.png';

const TYPE_SVG = {
  seater: seaterSvg,
  sleeper: sleeperSvg,
  'semi-sleeper': sleeperSvg,
};

const STATUS_STYLES = {
  boarded: {
    container: 'bg-[#E6F6EC] border-[#7BC89A] text-[#166534]',
    label: 'Boarded',
  },
  pending: {
    container: 'bg-[#FFF7DB] border-yellow-200 text-yellow-900',
    label: 'Booked',
  },
  'no-show': {
    container: 'bg-[#FCE8E8] border-[#E7A8A8] text-[#7F1D1D]',
    label: 'No-show',
  },
  empty: {
    container: 'bg-[#FFFCF0] border-yellow-100 text-gray-600',
    label: 'Available',
  },
};

const SeatCell = memo(function SeatCell({
  seat,
  status,
  seatType = 'seater',
  isSelected,
  onSelect,
  className = '',
}) {
  if (!seat) return <div className="w-full h-full" />;

  const style = STATUS_STYLES[status] || STATUS_STYLES.empty;
  const icon = TYPE_SVG[seatType] || seaterSvg;
  const isSleeper = seatType === 'sleeper' || seatType === 'semi-sleeper';
  const sizeClass = isSleeper
    ? 'w-9 h-[4rem] sm:w-11 sm:h-[4.7rem] md:w-12 md:h-[5.4rem] rounded-lg'
    : 'w-9 h-12 sm:w-11 sm:h-14 md:w-12 md:h-[3.8rem] rounded-xl';

  return (
    <button
      onClick={() => onSelect(seat.seatNumber)}
      title={`Seat ${seat.seatNumber} — ${style.label}`}
      className={`relative ${sizeClass} border shadow-sm transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center ${style.container}
        ${isSelected ? 'ring-2 ring-offset-1 ring-blue-500' : ''} ${className}`}
      aria-label={`Seat ${seat.seatNumber} (${style.label})`}
    >
      <img
        src={icon}
        alt={seatType}
        className={`w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 md:w-7 md:h-7 object-contain pointer-events-none ${status === 'empty' ? 'opacity-35' : 'opacity-70'}`}
        draggable={false}
      />

      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] md:text-[11px] leading-none font-bold tracking-tight">
        {seat.seatNumber}
      </span>
    </button>
  );
});

export default SeatCell;