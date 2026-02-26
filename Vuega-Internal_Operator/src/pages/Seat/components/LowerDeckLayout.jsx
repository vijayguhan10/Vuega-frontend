import SeatCell from './SeatCell';

export default function LowerDeckLayout({
  lowerDeckSeaterRows,
  lowerDeckSleeperRows,
  selectedSeat,
  getSeatStatus,
  onSeatToggle,
}) {
  return (
    <div className="w-fit min-w-[18.5rem] sm:min-w-0 mx-auto flex items-start gap-1.5 sm:gap-2">
      <div className="space-y-0">
        <div className="flex items-center gap-1.5 sm:gap-2 pl-6 sm:pl-7 text-xs sm:text-sm font-semibold text-gray-500">
          <div className="w-9 sm:w-11 md:w-12 text-center">C1</div>
          <div className="w-9 sm:w-11 md:w-12 text-center">C2</div>
        </div>
        {lowerDeckSeaterRows.map((row, rowIndex) => (
          <div key={`left-${rowIndex}`} className="flex items-center gap-1.5 sm:gap-2 h-12 sm:h-14 md:h-[3.8rem]">
            <div className="w-6 sm:w-8 text-right text-xs sm:text-sm text-gray-500 pr-1">{rowIndex + 1}</div>
            {row.map((seat, seatIdx) =>
              seat ? (
                <SeatCell
                  key={seat.seatNumber}
                  seat={seat}
                  seatType={seat.type}
                  status={getSeatStatus(seat.seatNumber)}
                  isSelected={selectedSeat === seat.seatNumber}
                  onSelect={onSeatToggle}
                />
              ) : (
                <div key={`left-empty-${rowIndex}-${seatIdx}`} className="w-9 h-12 sm:w-11 sm:h-14 md:w-12 md:h-[3.8rem]" />
              )
            )}
          </div>
        ))}
      </div>

      <div className="w-4 sm:w-8" />

      <div className="space-y-0">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-500">
          <div className="w-9 sm:w-11 md:w-12 text-center">C3</div>
          <div className="w-9 sm:w-11 md:w-12 text-center">C4</div>
        </div>
        {lowerDeckSleeperRows.map((row, rowIndex) => (
          <div
            key={`right-${rowIndex}`}
            className={`flex items-center gap-1.5 sm:gap-2 ${row.some((seat) => seat?.type === 'sleeper') ? 'h-[6rem] sm:h-[7rem] md:h-[7.6rem]' : 'h-12 sm:h-14 md:h-[3.8rem]'}`}
          >
            {row.map((seat, seatIdx) => (
              <SeatCell
                key={seat?.seatNumber || `empty-${rowIndex}-${seatIdx}`}
                seat={seat}
                seatType={seat?.type || 'sleeper'}
                status={seat ? getSeatStatus(seat.seatNumber) : 'empty'}
                isSelected={seat ? selectedSeat === seat.seatNumber : false}
                onSelect={onSeatToggle}
                className={seat?.type === 'sleeper' ? 'h-[6rem] sm:h-[7rem] md:h-[7.6rem]' : ''}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
