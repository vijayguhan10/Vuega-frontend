import LowerDeckLayout from './LowerDeckLayout';
import UpperDeckLayout from './UpperDeckLayout';

function SteeringIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" stroke="#5A7393" strokeWidth="2" />
      <circle cx="12" cy="12" r="2.2" fill="#5A7393" />
      <path d="M12 9.8L16.8 10.9" stroke="#5A7393" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 9.8L7.2 10.9" stroke="#5A7393" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 14.2V18" stroke="#5A7393" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function SeatDeckLayout({
  activeDeck,
  lowerDeckSeaterRows,
  lowerDeckSleeperRows,
  selectedSeat,
  getSeatStatus,
  onSeatToggle,
}) {
  return (
    <div className="bg-[#F9FAFB] rounded-2xl p-2.5 sm:p-4 border border-gray-200 overflow-x-auto">
      <div className="flex items-center justify-center gap-10 sm:gap-16 mb-3 min-w-[18.5rem] sm:min-w-0">
        <div className="text-xs sm:text-sm font-semibold text-gray-500 tracking-wider">FRONT</div>
        {activeDeck.id === 'lower' ? (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-gray-200 bg-gray-100 flex items-center justify-center">
            <SteeringIcon />
          </div>
        ) : (
          <div className="w-10 h-10 sm:w-12 sm:h-12" aria-hidden="true" />
        )}
      </div>

      {activeDeck.id === 'lower' ? (
        <LowerDeckLayout
          lowerDeckSeaterRows={lowerDeckSeaterRows}
          lowerDeckSleeperRows={lowerDeckSleeperRows}
          selectedSeat={selectedSeat}
          getSeatStatus={getSeatStatus}
          onSeatToggle={onSeatToggle}
        />
      ) : (
        <UpperDeckLayout
          rows={activeDeck.rows}
          selectedSeat={selectedSeat}
          getSeatStatus={getSeatStatus}
          onSeatToggle={onSeatToggle}
        />
      )}

      <div className="text-right mt-3 sm:mt-4 text-base sm:text-lg font-semibold tracking-wider text-gray-500">REAR</div>
    </div>
  );
}
