import { useState, useEffect, useCallback, useMemo } from 'react';
import PageHeader from '../../Navs/PageHeader';
import SeatCell from './components/SeatCell';

const MOCK_TRIP = {
  id: 'trip-001',
  busNumber: 'KA-01-F-1234',
  route: 'Bangalore → Chennai',
};

const MOCK_BUS_PROFILE = {
  type: 'AC Sleeper',
};

const MOCK_LAYOUT_CONFIG = {
  leftSideType: 'seater',
};

const MOCK_PASSENGERS = [
  { id: 'p-001', name: 'Arun Sharma', phone: '+919876543210', seatNumber: 1, status: 'pending' },
  { id: 'p-002', name: 'Priya Nair', phone: '+919876543211', seatNumber: 2, status: 'pending' },
  { id: 'p-003', name: 'Vikram Singh', phone: '+919876543212', seatNumber: 3, status: 'boarded' },
  { id: 'p-004', name: 'Meena Kumari', phone: '+919876543213', seatNumber: 4, status: 'pending' },
  { id: 'p-005', name: 'Sanjay Patel', phone: '+919876543214', seatNumber: 5, status: 'no-show' },
  { id: 'p-006', name: 'Deepa Rao', phone: '+919876543215', seatNumber: 6, status: 'boarded' },
  { id: 'p-007', name: 'Rahul Menon', phone: '+919876543216', seatNumber: 7, status: 'pending' },
  { id: 'p-008', name: 'Kavitha S', phone: '+919876543217', seatNumber: 8, status: 'pending' },
  { id: 'p-009', name: 'Manoj V', phone: '+919876543218', seatNumber: 9, status: 'boarded' },
  { id: 'p-010', name: 'Anitha Raj', phone: '+919876543219', seatNumber: 10, status: 'pending' },
  { id: 'p-011', name: 'Sunil Das', phone: '+919876543220', seatNumber: 11, status: 'pending' },
  { id: 'p-012', name: 'Lakshmi B', phone: '+919876543221', seatNumber: 12, status: 'no-show' },
  { id: 'p-013', name: 'Ganesh K', phone: '+919876543222', seatNumber: 14, status: 'pending' },
  { id: 'p-014', name: 'Rekha Iyer', phone: '+919876543223', seatNumber: 15, status: 'boarded' },
  { id: 'p-015', name: 'Amit Joshi', phone: '+919876543224', seatNumber: 16, status: 'pending' },
  { id: 'p-016', name: 'Divya M', phone: '+919876543225', seatNumber: 18, status: 'pending' },
  { id: 'p-017', name: 'Harish R', phone: '+919876543226', seatNumber: 20, status: 'boarded' },
  { id: 'p-018', name: 'Nandini G', phone: '+919876543227', seatNumber: 22, status: 'pending' },
  { id: 'p-019', name: 'Prasad T', phone: '+919876543228', seatNumber: 25, status: 'pending' },
  { id: 'p-020', name: 'Fathima Z', phone: '+919876543229', seatNumber: 28, status: 'pending' },
];

const MOCK_SEAT_MAP = {
  totalRows: 10,
  totalCols: 4,
  seats: Array.from({ length: 10 }, (_, r) =>
    Array.from({ length: 4 }, (_, c) => ({
      seatNumber: r * 4 + c + 1,
      row: r,
      col: c,
      isSeater: MOCK_LAYOUT_CONFIG.leftSideType === 'seater' ? c < 2 : c >= 2,
      type:
        (MOCK_LAYOUT_CONFIG.leftSideType === 'seater' ? c < 2 : c >= 2)
          ? 'seater'
          : 'sleeper',
    }))
  ),
};

function normalizeSeatType(type = '') {
  const normalized = String(type).toLowerCase();
  if (normalized.includes('semi')) return 'semi-sleeper';
  if (normalized.includes('sleeper')) return 'sleeper';
  return 'seater';
}

export default function SeatMap() {
  const trip = MOCK_TRIP;
  const [passengers] = useState(MOCK_PASSENGERS);
  const [seatMap] = useState(MOCK_SEAT_MAP);
  const [busSeatType, setBusSeatType] = useState(normalizeSeatType(MOCK_BUS_PROFILE.type));
  const [selectedSeat, setSelectedSeat] = useState(null);

  useEffect(() => {
    setBusSeatType(normalizeSeatType(MOCK_BUS_PROFILE.type));
  }, []);

  const passengerBySeat = useMemo(() => {
    const map = {};
    passengers.forEach((p) => {
      map[p.seatNumber] = p;
    });
    return map;
  }, [passengers]);

  const seats = useMemo(() => {
    if (seatMap?.seats) return seatMap.seats;
    const rows = seatMap?.totalRows || 10;
    const cols = seatMap?.totalCols || 4;
    const grid = [];
    let seatNum = 1;
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        row.push({ seatNumber: seatNum, row: r, col: c });
        seatNum++;
      }
      grid.push(row);
    }
    return grid;
  }, [seatMap]);

  const getSeatStatus = useCallback(
    (seatNumber) => {
      const p = passengerBySeat[seatNumber];
      if (!p) return 'empty';
      return p.status || 'pending';
    },
    [passengerBySeat]
  );

  const totalSeats = useMemo(() => seats.reduce((acc, row) => acc + row.length, 0), [seats]);

  const seatTypeCounts = useMemo(() => {
    const flatSeats = seats.flat();
    const seater = flatSeats.filter((seat) => seat.isSeater).length;
    const sleeper = flatSeats.length - seater;
    return { sleeper, seater };
  }, [seats]);

  const occupiedSeats = useMemo(
    () => seats.flat().filter((seat) => !!passengerBySeat[seat.seatNumber]).length,
    [seats, passengerBySeat]
  );

  const selectedPassenger = selectedSeat ? passengerBySeat[selectedSeat] : null;
  const selectedSeatMeta = useMemo(
    () => seats.flat().find((seat) => seat.seatNumber === selectedSeat) || null,
    [seats, selectedSeat]
  );
  const resolvedSeatType = normalizeSeatType(seatMap?.seatType || busSeatType);

  return (
    <div>
      <PageHeader
        title="Seat Map"
        subtitle={trip ? `${trip.route} — Bus #${trip.busNumber}` : 'Read-only view'}
      />

      <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 space-y-4">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 p-4 md:p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Bus Layout</p>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  {resolvedSeatType === 'sleeper'
                    ? 'Sleeper'
                    : resolvedSeatType === 'semi-sleeper'
                    ? 'Semi-Sleeper'
                    : 'Seater'}{' '}
                  Coach
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Seat Types: <span className="font-semibold">Seater ({seatTypeCounts.seater})</span> ·{' '}
                  <span className="font-semibold">Sleeper ({seatTypeCounts.sleeper})</span>
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm flex-wrap justify-end">
                <StatPill label="Total" value={totalSeats} />
                <StatPill label="Occupied" value={occupiedSeats} />
                <StatPill label="Available" value={totalSeats - occupiedSeats} />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:gap-4 mb-4">
              <LegendItem color="bg-[#16A34A]" label="Boarded" />
              <LegendItem color="bg-[#FFFADF] border border-yellow-300" label="Booked" />
              <LegendItem color="bg-[#960000]" label="No-show" />
              <LegendItem color="bg-gray-100 border border-gray-300" label="Available" />
            </div>

            <div className="bg-[#F9FAFB] rounded-2xl p-3.5 md:p-4 mx-auto border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <div className="text-[11px] md:text-xs font-semibold text-gray-500 tracking-wide uppercase">Front</div>
                <div className="min-w-14 h-8 px-2 bg-gray-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-gray-600">Driver</div>
              </div>

              <div className="w-fit mx-auto space-y-2 md:space-y-2.5">
                {seats.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex justify-center gap-1.5 md:gap-2">
                    {row.map((seat, colIdx) => {
                      const status = getSeatStatus(seat.seatNumber);
                      return (
                        <div key={seat.seatNumber} className="flex items-center">
                          {colIdx === 2 && <div className="w-5 md:w-7" />}
                          <SeatCell
                            seat={seat}
                            status={status}
                            seatType={seat.type || resolvedSeatType}
                            isSelected={selectedSeat === seat.seatNumber}
                            onSelect={(seatNumber) =>
                              setSelectedSeat(selectedSeat === seatNumber ? null : seatNumber)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="text-center mt-3 text-[11px] md:text-xs text-gray-500 font-medium">Rear</div>
            </div>
          </div>

          {selectedSeat && (
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

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded ${color}`} />
      <span className="text-[11px] md:text-xs font-medium text-gray-600">{label}</span>
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-200 text-gray-700">
      <span className="font-semibold">{label}:</span> {value}
    </div>
  );
}

function formatSeatType(type = '') {
  return type === 'sleeper' ? 'Sleeper' : type === 'semi-sleeper' ? 'Semi-Sleeper' : 'Seater';
}

function SeatInfoCard({ seat, passenger, onClose }) {
  return (
    <div className="mt-1 bg-[#C6EDFF] rounded-2xl p-4 md:p-5 max-w-3xl mx-auto border border-blue-100">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[10px] md:text-xs font-bold text-blue-800 uppercase">
            Seat {seat?.seatNumber}
          </p>
          <h3 className="text-base md:text-lg font-bold text-gray-900">
            {passenger?.name || 'Passenger not assigned'}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-2 text-sm">
        <DetailPill label="Passenger Name" value={passenger?.name || 'Not assigned'} />
        <DetailPill label="Passenger Number" value={passenger?.phone || 'Not available'} />
        <DetailPill label="Seat Type" value={formatSeatType(seat?.type)} />
        <DetailPill
          label="Status"
          value={passenger?.status ? String(passenger.status).replace('-', ' ') : 'Available'}
        />
      </div>
      {passenger?.remark && (
        <p className="text-xs text-gray-600 mt-2 italic">💬 {passenger.remark}</p>
      )}
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
