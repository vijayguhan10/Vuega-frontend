import { useMemo, useState } from 'react';
import PageHeader from '../../Navs/PageHeader';
import SeatMapToolbar from './components/SeatMapToolbar';
import SeatDeckLayout from './components/SeatDeckLayout';
import SeatInfoCard from './components/SeatInfoCard';

const BUS_LAYOUT_FLAG = 'semiSleeperSleeper'; // Change to 'seater' to test seater layout

const MOCK_DRIVER_TRIP_DATA = {
  semiSleeperSleeper: {
    tripId: 'TRIP-2026-002',
    busNumber: 'TN 09 AB 5678',
    route: 'Chennai → Bangalore',
    departureTime: '2026-03-15T21:00:00',
    totalSeats: 80,
    lowerDeck: [
      [
        { seatNumber: '1', type: 'seater', status: 'booked', passenger: { name: 'Rahul', boardingStatus: 'pending' } },
        { seatNumber: '2', type: 'seater', status: 'available', passenger: null },
        null,
        { seatNumber: '3', type: 'sleeper', status: 'available', passenger: null },
        { seatNumber: '4', type: 'sleeper', status: 'blocked', passenger: null },
      ],
      [
        { seatNumber: '5', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '6', type: 'seater', status: 'booked', passenger: { name: 'Anita', boardingStatus: 'boarded' } },
        null,
        { seatNumber: '7', type: 'sleeper', status: 'booked', passenger: { name: 'Vikram', boardingStatus: 'pending' } },
        { seatNumber: '8', type: 'sleeper', status: 'available', passenger: null },
      ],
      [
        { seatNumber: '9', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '10', type: 'seater', status: 'available', passenger: null },
        null,
        { seatNumber: '11', type: 'sleeper', status: 'available', passenger: null },
        { seatNumber: '12', type: 'sleeper', status: 'available', passenger: null },
      ],
      [
        { seatNumber: '13', type: 'seater', status: 'booked', passenger: { name: 'Meena', boardingStatus: 'pending' } },
        { seatNumber: '14', type: 'seater', status: 'available', passenger: null },
        null,
        { seatNumber: '15', type: 'sleeper', status: 'available', passenger: null },
        { seatNumber: '16', type: 'sleeper', status: 'available', passenger: null },
      ],
      [
        { seatNumber: '17', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '18', type: 'seater', status: 'available', passenger: null },
        null,
        { seatNumber: '19', type: 'sleeper', status: 'booked', passenger: { name: 'Arun', boardingStatus: 'pending' } },
        { seatNumber: '20', type: 'sleeper', status: 'available', passenger: null },
      ],
      [
        { seatNumber: '21', type: 'seater', status: 'booked', passenger: { name: 'Divya', boardingStatus: 'boarded' } },
        { seatNumber: '22', type: 'seater', status: 'available', passenger: null },
        null,
      ],
      [
        { seatNumber: '25', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '26', type: 'seater', status: 'available', passenger: null },
        null,
      ],
      [
        { seatNumber: '29', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '30', type: 'seater', status: 'booked', passenger: { name: 'Nisha', boardingStatus: 'boarded' } },
        null,
      ],
      [
        { seatNumber: '33', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '34', type: 'seater', status: 'available', passenger: null },
        null,
      ],
      [
        { seatNumber: '37', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '38', type: 'seater', status: 'available', passenger: null },
        null,
      ],
    ],
    upperDeck: [
      [
        { seatNumber: 'U1', type: 'sleeper', status: 'booked', passenger: { name: 'Priya', boardingStatus: 'pending' } },
        { seatNumber: 'U2', type: 'sleeper', status: 'available', passenger: null },
        null,
        { seatNumber: 'U3', type: 'sleeper', status: 'available', passenger: null },
        { seatNumber: 'U4', type: 'sleeper', status: 'available', passenger: null },
      ],
      [
        { seatNumber: 'U5', type: 'sleeper', status: 'available', passenger: null },
        { seatNumber: 'U6', type: 'sleeper', status: 'booked', passenger: { name: 'Deepak', boardingStatus: 'boarded' } },
        null,
        { seatNumber: 'U7', type: 'sleeper', status: 'available', passenger: null },
        { seatNumber: 'U8', type: 'sleeper', status: 'available', passenger: null },
      ],
      [
        { seatNumber: 'U9', type: 'sleeper', status: 'available', passenger: null },
        { seatNumber: 'U10', type: 'sleeper', status: 'available', passenger: null },
        null,
        { seatNumber: 'U11', type: 'sleeper', status: 'booked', passenger: { name: 'Sneha', boardingStatus: 'pending' } },
        { seatNumber: 'U12', type: 'sleeper', status: 'available', passenger: null },
      ],
      [
        { seatNumber: 'U13', type: 'sleeper', status: 'available', passenger: null },
        { seatNumber: 'U14', type: 'sleeper', status: 'available', passenger: null },
        null,
        { seatNumber: 'U15', type: 'sleeper', status: 'available', passenger: null },
        { seatNumber: 'U16', type: 'sleeper', status: 'available', passenger: null },
      ],
      [
        { seatNumber: 'U17', type: 'sleeper', status: 'booked', passenger: { name: 'Ravi', boardingStatus: 'pending' } },
        { seatNumber: 'U18', type: 'sleeper', status: 'available', passenger: null },
        null,
        { seatNumber: 'U19', type: 'sleeper', status: 'available', passenger: null },
        { seatNumber: 'U20', type: 'sleeper', status: 'available', passenger: null },
      ],
    ],
  },
  seater: {
    tripId: 'TRIP-2026-003',
    busNumber: 'TN 07 CD 2244',
    route: 'Coimbatore → Chennai',
    departureTime: '2026-03-18T22:15:00',
    totalSeats: 40,
    lowerDeck: [
      [
        { seatNumber: '1', type: 'seater', status: 'booked', passenger: { name: 'Karan', boardingStatus: 'pending' } },
        { seatNumber: '2', type: 'seater', status: 'available', passenger: null },
        null,
        { seatNumber: '3', type: 'seater', status: 'blocked', passenger: null },
        { seatNumber: '4', type: 'seater', status: 'available', passenger: null },
      ],
      [
        { seatNumber: '5', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '6', type: 'seater', status: 'booked', passenger: { name: 'Neha', boardingStatus: 'boarded' } },
        null,
        { seatNumber: '7', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '8', type: 'seater', status: 'available', passenger: null },
      ],
      [
        { seatNumber: '9', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '10', type: 'seater', status: 'booked', passenger: { name: 'Suresh', boardingStatus: 'pending' } },
        null,
        { seatNumber: '11', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '12', type: 'seater', status: 'available', passenger: null },
      ],
      [
        { seatNumber: '13', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '14', type: 'seater', status: 'available', passenger: null },
        null,
        { seatNumber: '15', type: 'seater', status: 'booked', passenger: { name: 'Asha', boardingStatus: 'pending' } },
        { seatNumber: '16', type: 'seater', status: 'available', passenger: null },
      ],
      [
        { seatNumber: '17', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '18', type: 'seater', status: 'available', passenger: null },
        null,
        { seatNumber: '19', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '20', type: 'seater', status: 'booked', passenger: { name: 'Rohit', boardingStatus: 'boarded' } },
      ],
      [
        { seatNumber: '21', type: 'seater', status: 'booked', passenger: { name: 'Isha', boardingStatus: 'pending' } },
        { seatNumber: '22', type: 'seater', status: 'available', passenger: null },
        null,
        { seatNumber: '23', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '24', type: 'seater', status: 'available', passenger: null },
      ],
      [
        { seatNumber: '25', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '26', type: 'seater', status: 'available', passenger: null },
        null,
        { seatNumber: '27', type: 'seater', status: 'booked', passenger: { name: 'Varun', boardingStatus: 'pending' } },
        { seatNumber: '28', type: 'seater', status: 'available', passenger: null },
      ],
      [
        { seatNumber: '29', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '30', type: 'seater', status: 'available', passenger: null },
        null,
        { seatNumber: '31', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '32', type: 'seater', status: 'available', passenger: null },
      ],
      [
        { seatNumber: '33', type: 'seater', status: 'booked', passenger: { name: 'Priyanka', boardingStatus: 'pending' } },
        { seatNumber: '34', type: 'seater', status: 'available', passenger: null },
        null,
        { seatNumber: '35', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '36', type: 'seater', status: 'available', passenger: null },
      ],
      [
        { seatNumber: '37', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '38', type: 'seater', status: 'booked', passenger: { name: 'Gopal', boardingStatus: 'boarded' } },
        null,
        { seatNumber: '39', type: 'seater', status: 'available', passenger: null },
        { seatNumber: '40', type: 'seater', status: 'available', passenger: null },
      ],
    ],
    upperDeck: [
      [
        { seatNumber: 'U1', type: 'sleeper', status: 'booked', passenger: { name: 'Priya', boardingStatus: 'pending' } },
        { seatNumber: 'U2', type: 'sleeper', status: 'available', passenger: null },
        null,
        { seatNumber: 'U3', type: 'sleeper', status: 'available', passenger: null },
        { seatNumber: 'U4', type: 'sleeper', status: 'available', passenger: null },
      ],
      [
        { seatNumber: 'U5', type: 'sleeper', status: 'available', passenger: null },
        { seatNumber: 'U6', type: 'sleeper', status: 'booked', passenger: { name: 'Deepak', boardingStatus: 'boarded' } },
        null,
        { seatNumber: 'U7', type: 'sleeper', status: 'available', passenger: null },
        { seatNumber: 'U8', type: 'sleeper', status: 'available', passenger: null },
      ],
      [
        { seatNumber: 'U9', type: 'sleeper', status: 'available', passenger: null },
        { seatNumber: 'U10', type: 'sleeper', status: 'available', passenger: null },
        null,
        { seatNumber: 'U11', type: 'sleeper', status: 'booked', passenger: { name: 'Sneha', boardingStatus: 'pending' } },
        { seatNumber: 'U12', type: 'sleeper', status: 'available', passenger: null },
      ],
      [
        { seatNumber: 'U13', type: 'sleeper', status: 'available', passenger: null },
        { seatNumber: 'U14', type: 'sleeper', status: 'available', passenger: null },
        null,
        { seatNumber: 'U15', type: 'sleeper', status: 'available', passenger: null },
        { seatNumber: 'U16', type: 'sleeper', status: 'available', passenger: null },
      ],
      [
        { seatNumber: 'U17', type: 'sleeper', status: 'booked', passenger: { name: 'Ravi', boardingStatus: 'pending' } },
        { seatNumber: 'U18', type: 'sleeper', status: 'available', passenger: null },
        null,
        { seatNumber: 'U19', type: 'sleeper', status: 'available', passenger: null },
        { seatNumber: 'U20', type: 'sleeper', status: 'available', passenger: null },
      ],
    ],
  },
};

function normalizeDeckRows(rows = [], fallbackColumnTypes = []) {
  return rows.map((row, rowIndex) => {
    const compactRow = row.filter((_, colIndex) => colIndex !== 2);

    return compactRow.map((seat, colIndex) => {
      if (!seat) return null;

      return {
        ...seat,
        seatNumber: String(seat.seatNumber),
        type: seat.type || fallbackColumnTypes[colIndex] || 'seater',
        row: rowIndex,
        col: colIndex,
      };
    });
  });
}

function buildBusLayout(tripData, busType) {
  const upperDeckRows = normalizeDeckRows(tripData.upperDeck, ['sleeper', 'sleeper', 'sleeper', 'sleeper']);
  const hasUpperDeck = upperDeckRows.some((row) => row.some(Boolean));

  if (busType === 'seater') {
    const decks = [
      {
        id: 'lower',
        title: 'LOWER DECK',
        columnTypes: ['seater', 'seater', 'seater', 'seater'],
        rows: normalizeDeckRows(tripData.lowerDeck, ['seater', 'seater', 'seater', 'seater']),
      },
    ];

    if (hasUpperDeck) {
      decks.push({
        id: 'upper',
        title: 'UPPER DECK',
        columnTypes: ['sleeper', 'sleeper', 'sleeper', 'sleeper'],
        rows: upperDeckRows,
      });
    }

    return {
      label: 'Seater',
      showDeckTabs: hasUpperDeck,
      decks,
    };
  }

  const decks = [
    {
      id: 'lower',
      title: 'LOWER DECK',
      columnTypes: ['seater', 'seater', 'sleeper', 'sleeper'],
      rows: normalizeDeckRows(tripData.lowerDeck, ['seater', 'seater', 'sleeper', 'sleeper']),
    },
  ];

  if (hasUpperDeck) {
    decks.push({
      id: 'upper',
      title: 'UPPER DECK',
      columnTypes: ['sleeper', 'sleeper', 'sleeper', 'sleeper'],
      rows: upperDeckRows,
    });
  }

  return {
    label: 'Semi Sleeper + Sleeper',
    showDeckTabs: hasUpperDeck,
    decks,
  };
}

const STATUS_LEGEND_ITEMS = [
  {
    label: 'Boarded',
    swatch: 'bg-[#E6F6EC] border-[#7BC89A]',
    text: 'text-[#166534]',
  },
  {
    label: 'Booked',
    swatch: 'bg-[#FFF7DB] border-yellow-200',
    text: 'text-yellow-900',
  },
  {
    label: 'No-show',
    swatch: 'bg-[#FCE8E8] border-[#E7A8A8]',
    text: 'text-[#7F1D1D]',
  },
  {
    label: 'Available',
    swatch: 'bg-[#FFFCF0] border-yellow-100',
    text: 'text-gray-700',
  },
];

export default function SeatMap() {
  const selectedTrip = MOCK_DRIVER_TRIP_DATA[BUS_LAYOUT_FLAG] || MOCK_DRIVER_TRIP_DATA.seater;
  const [selectedSeat, setSelectedSeat] = useState(null);

  const selectedLayout = useMemo(
    () => buildBusLayout(selectedTrip, BUS_LAYOUT_FLAG),
    [selectedTrip]
  );
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
    allSeats.forEach((seat) => {
      if (!seat?.passenger) return;

      map[seat.seatNumber] = {
        ...seat.passenger,
        seatNumber: seat.seatNumber,
        status:
          seat.passenger.boardingStatus === 'boarded'
            ? 'boarded'
            : seat.status === 'blocked'
              ? 'no-show'
              : 'pending',
      };
    });
    return map;
  }, [allSeats]);

  const occupiedSeats = useMemo(
    () => allSeats.filter((seat) => Boolean(passengerBySeat[seat.seatNumber])).length,
    [allSeats, passengerBySeat]
  );

  const totalSeats = allSeats.length;

  const seatMetaByNumber = useMemo(() => {
    const map = {};
    allSeats.forEach((seat) => {
      map[seat.seatNumber] = seat;
    });
    return map;
  }, [allSeats]);

  const getSeatStatus = (seatNumber) => {
    const seat = seatMetaByNumber[seatNumber];
    if (!seat || seat.status === 'available') return 'empty';
    if (seat.status === 'blocked') return 'no-show';

    if (seat.status === 'booked') {
      return seat.passenger?.boardingStatus === 'boarded' ? 'boarded' : 'pending';
    }

    return 'pending';
  };

  const selectedPassenger = selectedSeat ? passengerBySeat[selectedSeat] : null;
  const selectedSeatMeta = selectedSeat
    ? seatMetaByNumber[selectedSeat] || null
    : null;

  const lowerDeckSeaterRows = useMemo(() => {
    if (activeDeck.id !== 'lower') return [];
    return activeDeck.rows.map((row) => [row[0], row[1]]);
  }, [activeDeck]);

  const lowerDeckSleeperRows = useMemo(() => {
    if (activeDeck.id !== 'lower') return [];
    return activeDeck.rows
      .map((row) => [row[2], row[3]])
      .filter((row) => row.some(Boolean));
  }, [activeDeck]);

  return (
    <div>
      <PageHeader
        title="Seat Map"
        subtitle={`${selectedTrip.route} — Bus #${selectedTrip.busNumber}`}
      />

      <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-3 md:py-6 space-y-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 md:p-5 shadow-sm">
          <SeatMapToolbar
            totalSeats={totalSeats}
            selectedLayout={selectedLayout}
            activeDeckId={activeDeckId}
            setActiveDeckId={setActiveDeckId}
          />

          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-bold text-gray-700 tracking-wide">{activeDeck.title}</h3>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <SeatDeckLayout
            activeDeck={activeDeck}
            lowerDeckSeaterRows={lowerDeckSeaterRows}
            lowerDeckSleeperRows={lowerDeckSleeperRows}
            selectedSeat={selectedSeat}
            getSeatStatus={getSeatStatus}
            onSeatToggle={(seatNumber) =>
              setSelectedSeat(selectedSeat === seatNumber ? null : seatNumber)
            }
          />

          <div className="mt-4 text-sm text-gray-500">
            Occupied: <span className="font-semibold text-gray-700">{occupiedSeats}</span> · Available:{' '}
            <span className="font-semibold text-gray-700">{totalSeats - occupiedSeats}</span>
          </div>

          <div className="mt-3 border border-gray-200 rounded-xl bg-gray-50 px-3 py-2.5">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Legend</p>
            <div className="flex flex-wrap items-center gap-3">
              {STATUS_LEGEND_ITEMS.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded-sm border ${item.swatch}`} aria-hidden="true" />
                  <span className={`text-xs font-semibold ${item.text}`}>{item.label}</span>
                </div>
              ))}
            </div>
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
