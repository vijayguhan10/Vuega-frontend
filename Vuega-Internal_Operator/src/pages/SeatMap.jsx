import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTrip } from '../hooks/useTrip';
import realTripService from '../services/tripService';
import mockTripService from '../services/mockTripService';
import PageHeader from '../Navs/PageHeader';
import Loader from '../components/common/Loader';
import ErrorBanner from '../components/common/ErrorBanner';
import EmptyState from '../components/common/EmptyState';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const tripService = USE_MOCK ? mockTripService : realTripService;

const SEAT_STATUS_COLORS = {
  boarded: 'bg-[#16A34A] text-white',
  pending: 'bg-[#FFFADF] text-yellow-800 border border-yellow-300',
  'no-show': 'bg-[#960000] text-white',
  empty: 'bg-gray-100 text-gray-400',
};

export default function SeatMap() {
  const { trip, passengers } = useTrip();
  const [seatMap, setSeatMap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const fetchSeatMap = useCallback(async () => {
    if (!trip?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await tripService.getSeatMap(trip.id);
      setSeatMap(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load seat map.');
    } finally {
      setLoading(false);
    }
  }, [trip?.id]);

  useEffect(() => {
    fetchSeatMap();
  }, [fetchSeatMap]);

  // Build passenger lookup by seatNumber
  const passengerBySeat = useMemo(() => {
    const map = {};
    passengers.forEach((p) => {
      map[p.seatNumber] = p;
    });
    return map;
  }, [passengers]);

  // Fallback seat grid if API doesn't return seat map
  const seats = useMemo(() => {
    if (seatMap?.seats) return seatMap.seats;
    // Generate default 2+2 layout, 10 rows
    const rows = seatMap?.totalRows || 10;
    const cols = seatMap?.totalCols || 4;
    const grid = [];
    let seatNum = 1;
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        // Aisle between col 1 and 2
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

  if (loading && !seatMap) {
    return <Loader message="Loading seat map..." />;
  }

  return (
    <div>
      <PageHeader
        title="Seat Map"
        subtitle={trip ? `${trip.route} — Bus #${trip.busNumber}` : 'Read-only view'}
      />

      <ErrorBanner message={error} onRetry={fetchSeatMap} onDismiss={() => setError(null)} />

      {!trip ? (
        <EmptyState
          icon="💺"
          title="No Active Trip"
          description="Seat map will be available once a trip is active."
        />
      ) : (
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
          {/* Legend */}
          <div className="flex flex-wrap gap-3 md:gap-4 mb-5">
            <LegendItem color="bg-[#16A34A]" label="Boarded" />
            <LegendItem color="bg-[#FFFADF] border border-yellow-300" label="Booked" />
            <LegendItem color="bg-[#960000]" label="No-show" />
            <LegendItem color="bg-gray-100" label="Available" />
          </div>

          {/* Seat Grid */}
          <div className="bg-gray-50 rounded-2xl p-4 md:p-6 lg:p-8 max-w-md md:max-w-lg mx-auto">
            {/* Driver indicator */}
            <div className="flex justify-end mb-3">
              <div className="w-10 h-8 bg-gray-300 rounded-lg flex items-center justify-center text-[10px] font-bold text-gray-600">
                🚗
              </div>
            </div>

            <div className="space-y-2">
              {seats.map((row, rowIdx) => (
                <div key={rowIdx} className="flex justify-center gap-1.5">
                  {row.map((seat, colIdx) => {
                    const status = getSeatStatus(seat.seatNumber);
                    const colorClass = SEAT_STATUS_COLORS[status];
                    return (
                      <div key={seat.seatNumber} className="flex items-center">
                        {/* Aisle gap after col 1 (0-indexed) */}
                        {colIdx === 2 && <div className="w-6" />}
                        <button
                          onClick={() =>
                            setSelectedSeat(
                              selectedSeat === seat.seatNumber ? null : seat.seatNumber
                            )
                          }
                          className={`w-11 h-11 md:w-12 md:h-12 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center ${colorClass} hover:opacity-90 active:scale-95 transition-transform`}
                          aria-label={`Seat ${seat.seatNumber}`}
                        >
                          {seat.seatNumber}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Selected seat info */}
          {selectedSeat && passengerBySeat[selectedSeat] && (
            <SeatInfoCard
              passenger={passengerBySeat[selectedSeat]}
              onClose={() => setSelectedSeat(null)}
            />
          )}

          {selectedSeat && !passengerBySeat[selectedSeat] && (
            <div className="mt-4 bg-gray-100 rounded-2xl p-4 md:p-5 text-center max-w-md md:max-w-lg mx-auto">
              <p className="text-sm md:text-base text-gray-500">Seat {selectedSeat} — Empty</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-4 h-4 md:w-5 md:h-5 rounded ${color}`} />
      <span className="text-[11px] md:text-xs font-medium text-gray-600">{label}</span>
    </div>
  );
}

function SeatInfoCard({ passenger, onClose }) {
  return (
    <div className="mt-4 bg-[#C6EDFF] rounded-2xl p-4 md:p-5 max-w-md md:max-w-lg mx-auto">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[10px] md:text-xs font-bold text-blue-800 uppercase">
            Seat {passenger.seatNumber}
          </p>
          <h3 className="text-base md:text-lg font-bold text-gray-900">{passenger.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            passenger.status === 'boarded'
              ? 'bg-[#16A34A]/10 text-[#16A34A]'
              : passenger.status === 'no-show'
              ? 'bg-[#960000]/10 text-[#960000]'
              : 'bg-[#FFFADF] text-yellow-800'
          }`}
        >
          {passenger.status}
        </span>
        {passenger.phone && (
          <a
            href={`tel:${passenger.phone}`}
            className="text-blue-700 font-medium underline text-xs"
          >
            📞 {passenger.phone}
          </a>
        )}
      </div>
      {passenger.remark && (
        <p className="text-xs text-gray-600 mt-2 italic">💬 {passenger.remark}</p>
      )}
    </div>
  );
}