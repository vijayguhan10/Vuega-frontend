import { useMemo, useState } from 'react';
import PageHeader from '../../Navs/PageHeader';
import SeatCell from './components/SeatCell';

const BUS_LAYOUT_FLAG = 'semiSleeperSleeper';

const MOCK_TRIP = {
  id: 'trip-001',
  busNumber: 'KA-01-F-1234',
  route: 'Bangalore → Chennai',
};

const MOCK_PASSENGERS = [
  { id: 'p-001', name: 'Arun Sharma', phone: '+919876543210', seatNumber: 1, status: 'pending' },
  { id: 'p-002', name: 'Priya Nair', phone: '+919876543211', seatNumber: 2, status: 'pending' },
  { id: 'p-003', name: 'Vikram Singh', phone: '+919876543212', seatNumber: 6, status: 'boarded' },
  { id: 'p-004', name: 'Meena Kumari', phone: '+919876543213', seatNumber: 10, status: 'pending' },
  { id: 'p-005', name: 'Sanjay Patel', phone: '+919876543214', seatNumber: 14, status: 'no-show' },
  { id: 'p-006', name: 'Deepa Rao', phone: '+919876543215', seatNumber: 17, status: 'pending' },
  { id: 'p-007', name: 'Rahul Menon', phone: '+919876543216', seatNumber: 28, status: 'pending' },
  { id: 'p-008', name: 'Kavitha S', phone: '+919876543217', seatNumber: 36, status: 'boarded' },
  { id: 'p-009', name: 'Manoj V', phone: '+919876543218', seatNumber: 42, status: 'pending' },
  { id: 'p-010', name: 'Anitha Raj', phone: '+919876543219', seatNumber: 52, status: 'pending' },
  { id: 'p-011', name: 'Sunil Das', phone: '+919876543220', seatNumber: 60, status: 'boarded' },
  { id: 'p-012', name: 'Lakshmi B', phone: '+919876543221', seatNumber: 67, status: 'pending' },
];

function buildSeaterDeck(startSeat = 1, rows = 10) {
  return Array.from({ length: rows }, (_, rowIndex) => {
    const base = startSeat + rowIndex * 4;
    return [
      { seatNumber: base, row: rowIndex, col: 0, type: 'seater' },
      { seatNumber: base + 1, row: rowIndex, col: 1, type: 'seater' },
      { seatNumber: base + 2, row: rowIndex, col: 2, type: 'seater' },
      { seatNumber: base + 3, row: rowIndex, col: 3, type: 'seater' },
    ];
  });
}

function buildSemiSleeperLowerDeck() {
  return Array.from({ length: 10 }, (_, rowIndex) => {
    const leftBase = 1 + rowIndex * 4;
    const sleeperBlockIndex = Math.floor(rowIndex / 2);
    const hasSleeperInRow = rowIndex % 2 === 0;
    const rightBase = 3 + sleeperBlockIndex * 8;

    return [
      { seatNumber: leftBase, row: rowIndex, col: 0, type: 'seater' },
      { seatNumber: leftBase + 1, row: rowIndex, col: 1, type: 'seater' },
      hasSleeperInRow ? { seatNumber: rightBase, row: rowIndex, col: 2, type: 'sleeper' } : null,
      hasSleeperInRow
        ? { seatNumber: rightBase + 1, row: rowIndex, col: 3, type: 'sleeper' }
        : null,
    ];
  });
}

function buildSleeperUpperDeck() {
  return Array.from({ length: 5 }, (_, rowIndex) => {
    const base = 41 + rowIndex * 8;

    return [
      { seatNumber: base, row: rowIndex, col: 0, type: 'sleeper' },
      { seatNumber: base + 1, row: rowIndex, col: 1, type: 'sleeper' },
      { seatNumber: base + 2, row: rowIndex, col: 2, type: 'sleeper' },
      { seatNumber: base + 3, row: rowIndex, col: 3, type: 'sleeper' },
    ];
  });
}

const BUS_LAYOUTS = {
  seater: {
    label: 'Seater',
    showDeckTabs: false,
    decks: [
      {
        id: 'lower',
        title: 'LOWER DECK',
        columnTypes: ['seater', 'seater', 'seater', 'seater'],
        rows: buildSeaterDeck(1, 10),
      },
    ],
  },
  semiSleeperSleeper: {
    label: 'Semi Sleeper + Sleeper',
    showDeckTabs: true,
    decks: [
      {
        id: 'lower',
        title: 'LOWER DECK',
        columnTypes: ['seater', 'seater', 'sleeper', 'sleeper'],
        rows: buildSemiSleeperLowerDeck(),
      },
      {
        id: 'upper',
        title: 'UPPER DECK',
        columnTypes: ['sleeper', 'sleeper', 'sleeper', 'sleeper'],
        rows: buildSleeperUpperDeck(),
      },
    ],
  },
};

function getPlaceholderClass(type = 'seater') {
  if (type === 'sleeper') return 'w-9 h-[4rem] sm:w-11 sm:h-[4.7rem] md:w-12 md:h-[5.4rem]';
  return 'w-9 h-12 sm:w-11 sm:h-14 md:w-12 md:h-[3.8rem]';
}

function getRowLabel(deckId, rowIndex) {
  if (deckId === 'upper') {
    const first = rowIndex * 2 + 1;
    return [String(first), String(first + 1)];
  }
  return [String(rowIndex + 1)];
}

export default function SeatMap() {
  const [passengers] = useState(MOCK_PASSENGERS);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const selectedLayout = BUS_LAYOUTS[BUS_LAYOUT_FLAG] || BUS_LAYOUTS.seater;
  const [activeDeckId, setActiveDeckId] = useState(selectedLayout.decks[0]?.id || 'lower');

  const activeDeck = useMemo(
    () => selectedLayout.decks.find((deck) => deck.id === activeDeckId) || selectedLayout.decks[0],
    [activeDeckId, selectedLayout]
  );

  const allSeats = useMemo(
    () => selectedLayout.decks.flatMap((deck) => deck.rows.flat().filter(Boolean)),
    [selectedLayout]
  );

  const passengerBySeat = useMemo(() => {
    const map = {};
    passengers.forEach((passenger) => {
      map[passenger.seatNumber] = passenger;
    });
    return map;
  }, [passengers]);

  const occupiedSeats = useMemo(
    () => allSeats.filter((seat) => Boolean(passengerBySeat[seat.seatNumber])).length,
    [allSeats, passengerBySeat]
  );

  const totalSeats = allSeats.length;

  const getSeatStatus = (seatNumber) => {
    const passenger = passengerBySeat[seatNumber];
    if (!passenger) return 'empty';
    return passenger.status || 'pending';
  };

  const selectedPassenger = selectedSeat ? passengerBySeat[selectedSeat] : null;
  const selectedSeatMeta = selectedSeat
    ? allSeats.find((seat) => seat.seatNumber === selectedSeat) || null
    : null;

  const lowerDeckSeaterRows = useMemo(() => {
    if (activeDeck.id !== 'lower') return [];
    return activeDeck.rows.map((row) => [row[0], row[1]]);
  }, [activeDeck]);

  const lowerDeckSleeperRows = useMemo(() => {
    if (activeDeck.id !== 'lower') return [];
    return activeDeck.rows
      .filter((_, rowIndex) => rowIndex % 2 === 0)
      .map((row) => [row[2], row[3]]);
  }, [activeDeck]);

  return (
    <div>
      <PageHeader
        title="Seat Map"
        subtitle={`${MOCK_TRIP.route} — Bus #${MOCK_TRIP.busNumber}`}
      />

      <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-3 md:py-6 space-y-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 md:p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <StatPill label="Total seats" value={totalSeats} />
            {selectedLayout.showDeckTabs && (
              <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
                {selectedLayout.decks.map((deck) => (
                  <button
                    key={deck.id}
                    onClick={() => setActiveDeckId(deck.id)}
                    className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                      activeDeckId === deck.id
                        ? 'bg-[#A5E1FF] text-gray-900'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {deck.id === 'lower' ? 'Lower Deck' : 'Upper Deck'}
                  </button>
                ))}
              </div>
            )}
            <span className="text-sm text-gray-500">Type: {selectedLayout.label}</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-bold text-gray-700 tracking-wide">{activeDeck.title}</h3>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

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
              <div className="w-fit min-w-[18.5rem] sm:min-w-0 mx-auto flex items-start gap-1.5 sm:gap-2">
                <div className="space-y-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 pl-6 sm:pl-7 text-xs sm:text-sm font-semibold text-gray-500">
                    <div className="w-9 sm:w-11 md:w-12 text-center">C1</div>
                    <div className="w-9 sm:w-11 md:w-12 text-center">C2</div>
                  </div>
                  {lowerDeckSeaterRows.map((row, rowIndex) => (
                    <div key={`left-${rowIndex}`} className="flex items-center gap-1.5 sm:gap-2 h-12 sm:h-14 md:h-[3.8rem]">
                      <div className="w-6 sm:w-8 text-right text-xs sm:text-sm text-gray-500 pr-1">{rowIndex + 1}</div>
                      {row.map((seat) => (
                        <SeatCell
                          key={seat.seatNumber}
                          seat={seat}
                          seatType={seat.type}
                          status={getSeatStatus(seat.seatNumber)}
                          isSelected={selectedSeat === seat.seatNumber}
                          onSelect={(seatNumber) =>
                            setSelectedSeat(selectedSeat === seatNumber ? null : seatNumber)
                          }
                        />
                      ))}
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
                    <div key={`right-${rowIndex}`} className="flex items-center gap-1.5 sm:gap-2 h-[6rem] sm:h-[7rem] md:h-[7.6rem]">
                      {row.map((seat, seatIdx) => (
                        <SeatCell
                          key={seat?.seatNumber || `empty-${rowIndex}-${seatIdx}`}
                          seat={seat}
                          seatType="sleeper"
                          status={seat ? getSeatStatus(seat.seatNumber) : 'empty'}
                          isSelected={seat ? selectedSeat === seat.seatNumber : false}
                          onSelect={(seatNumber) =>
                            setSelectedSeat(selectedSeat === seatNumber ? null : seatNumber)
                          }
                          className="h-[6rem] sm:h-[7rem] md:h-[7.6rem]"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-fit min-w-[18.5rem] sm:min-w-0 mx-auto space-y-1 sm:space-y-1.5">
                <div className="flex items-center gap-1.5 sm:gap-2 pl-6 sm:pl-7 text-xs sm:text-sm font-semibold text-gray-500">
                  <div className="w-9 sm:w-11 md:w-12 text-center">C1</div>
                  <div className="w-9 sm:w-11 md:w-12 text-center">C2</div>
                  <div className="w-4 sm:w-8" />
                  <div className="w-9 sm:w-11 md:w-12 text-center">C3</div>
                  <div className="w-9 sm:w-11 md:w-12 text-center">C4</div>
                </div>

                {activeDeck.rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-6 sm:w-8 text-right text-xs sm:text-sm text-gray-500 pr-1 h-[4rem] sm:h-[4.7rem] md:h-[5.4rem] flex flex-col justify-between leading-none">
                      {getRowLabel(activeDeck.id, rowIndex).map((label) => (
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
                            onSelect={(seatNumber) =>
                              setSelectedSeat(selectedSeat === seatNumber ? null : seatNumber)
                            }
                          />
                        ) : (
                          <div className={`${getPlaceholderClass('sleeper')} rounded-lg`} />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            <div className="text-right mt-3 sm:mt-4 text-base sm:text-lg font-semibold tracking-wider text-gray-500">REAR</div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Occupied: <span className="font-semibold text-gray-700">{occupiedSeats}</span> · Available:{' '}
            <span className="font-semibold text-gray-700">{totalSeats - occupiedSeats}</span>
          </div>
        </div>

        {selectedSeatMeta && (
          <SeatInfoCard
            seat={selectedSeatMeta}
            passenger={selectedPassenger}
            onClose={() => setSelectedSeat(null)}
          />
        )}
      </div>
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="px-3 py-1.5 rounded-lg bg-[#FFFBEA] border border-yellow-200 text-gray-700 font-semibold text-sm">
      {label}: {value}
    </div>
  );
}

function SeatInfoCard({ seat, passenger, onClose }) {
  return (
    <div className="mt-1 bg-[#C6EDFF] rounded-2xl p-4 md:p-5 max-w-4xl mx-auto border border-blue-100">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[10px] md:text-xs font-bold text-blue-800 uppercase">Seat {seat?.seatNumber}</p>
          <h3 className="text-base md:text-lg font-bold text-gray-900">
            {passenger?.name || 'Passenger not assigned'}
          </h3>
        </div>
        <button onClick={onClose} className="text-gray-500 text-xl leading-none" aria-label="Close">
          ×
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-2 text-sm">
        <DetailPill label="Passenger Name" value={passenger?.name || 'Not assigned'} />
        <DetailPill label="Passenger Number" value={passenger?.phone || 'Not available'} />
        <DetailPill label="Seat Type" value={seat?.type || 'seater'} />
        <DetailPill
          label="Status"
          value={passenger?.status ? String(passenger.status).replace('-', ' ') : 'available'}
        />
      </div>
    </div>
  );
}

function DetailPill({ label, value }) {
  return (
    <div className="bg-white/70 rounded-lg border border-white/80 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{label}</p>
      <p className="text-[13px] font-semibold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

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