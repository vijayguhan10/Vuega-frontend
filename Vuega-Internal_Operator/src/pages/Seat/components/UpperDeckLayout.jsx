import SeatCell from './SeatCell';

function getPlaceholderClass(type = 'seater') {
  if (type === 'sleeper') return 'w-9 h-[4rem] sm:w-11 sm:h-[4.7rem] md:w-12 md:h-[5.4rem]';
  return 'w-9 h-12 sm:w-11 sm:h-14 md:w-12 md:h-[3.8rem]';
}

function getRowLabel(rowIndex) {
  const first = rowIndex * 2 + 1;
  return [String(first), String(first + 1)];
}

export default function UpperDeckLayout({
  rows,
  selectedSeat,
  getSeatStatus,
  onSeatToggle,
}) {
  return (
    <div className="w-fit min-w-[18.5rem] sm:min-w-0 mx-auto space-y-1 sm:space-y-1.5">
      <div className="flex items-center gap-1.5 sm:gap-2 pl-6 sm:pl-7 text-xs sm:text-sm font-semibold text-gray-500">
        <div className="w-9 sm:w-11 md:w-12 text-center">C1</div>
        <div className="w-9 sm:w-11 md:w-12 text-center">C2</div>
        <div className="w-4 sm:w-8" />
        <div className="w-9 sm:w-11 md:w-12 text-center">C3</div>
        <div className="w-9 sm:w-11 md:w-12 text-center">C4</div>
      </div>

      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-6 sm:w-8 text-right text-xs sm:text-sm text-gray-500 pr-1 h-[4rem] sm:h-[4.7rem] md:h-[5.4rem] flex flex-col justify-between leading-none">
            {getRowLabel(rowIndex).map((label) => (
              <span key={`${rowIndex}-${label}`}>{label}</span>
            ))}
          </div>

          {row.map((seat, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className="flex items-center">
              {colIndex === 2 && <div className="w-4 sm:w-8" />}
              {seat ? (
                <SeatCell
                  seat={seat}
                  seatType={seat.type}
                  status={getSeatStatus(seat.seatNumber)}
                  isSelected={selectedSeat === seat.seatNumber}
                  onSelect={onSeatToggle}
                />
              ) : (
                <div className={`${getPlaceholderClass('sleeper')} rounded-lg`} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
