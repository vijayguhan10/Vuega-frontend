import { useState, useMemo } from 'react';
import { FaLock, FaUnlock, FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';
import SeatCell from './SeatCell';
import Card from '../../../components/ui/Card';

/* ══════════════════════════════════════════════════════
   TripSeatMap — renders the trip seat grid.
   Allows operator to block/unblock & override price.
   Layout structure cannot be modified.
   ══════════════════════════════════════════════════════ */

const TripSeatMap = ({ tripSeats, onSeatsChange, isReadOnly = false }) => {
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState('');

  const selectedSeat = tripSeats.find((s) => s.id === selectedSeatId) || null;

  /* ── Build grid from flat array ── */
  const seatGrid = useMemo(() => {
    if (tripSeats.length === 0) return { rows: 0, cols: 0, grid: [] };
    const maxRow = Math.max(...tripSeats.map((s) => s.row));
    const maxCol = Math.max(...tripSeats.map((s) => s.col));
    const grid = [];
    for (let r = 0; r <= maxRow; r++) {
      const row = [];
      for (let c = 0; c <= maxCol; c++) {
        row.push(tripSeats.find((s) => s.row === r && s.col === c) || null);
      }
      grid.push(row);
    }
    return { rows: maxRow + 1, cols: maxCol + 1, grid };
  }, [tripSeats]);

  /* ── Block / Unblock ── */
  const handleToggleBlock = () => {
    if (!selectedSeat || isReadOnly) return;
    if (selectedSeat.status === 'booked') return; // can't block booked seats

    const newStatus = selectedSeat.status === 'blocked' ? 'available' : 'blocked';
    onSeatsChange(
      tripSeats.map((s) => (s.id === selectedSeat.id ? { ...s, status: newStatus } : s))
    );
  };

  /* ── Price override ── */
  const handleStartPriceEdit = () => {
    setPriceInput(String(selectedSeat?.customPrice ?? selectedSeat?.finalPrice ?? ''));
    setEditingPrice(true);
  };

  const handleConfirmPrice = () => {
    const price = parseFloat(priceInput);
    if (!isNaN(price) && price >= 0 && selectedSeat) {
      onSeatsChange(
        tripSeats.map((s) =>
          s.id === selectedSeat.id
            ? { ...s, customPrice: price, finalPrice: price }
            : s
        )
      );
    }
    setEditingPrice(false);
  };

  const handleResetPrice = () => {
    if (!selectedSeat) return;
    onSeatsChange(
      tripSeats.map((s) =>
        s.id === selectedSeat.id
          ? { ...s, customPrice: null, finalPrice: s.basePrice }
          : s
      )
    );
  };

  /* ── Stats ── */
  const available = tripSeats.filter((s) => s.status === 'available').length;
  const booked = tripSeats.filter((s) => s.status === 'booked').length;
  const blocked = tripSeats.filter((s) => s.status === 'blocked').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Seat Grid (left 2 cols) ── */}
      <div className="lg:col-span-2">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-v-text">Seat Map</h3>
            <div className="flex items-center gap-3">
              <span className="text-v-text-muted">
                {available} available • {booked} booked • {blocked} blocked
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-v-secondary border border-v-secondary-border" />
              <span className="text-v-text-muted">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
              <span className="text-v-text-muted">Booked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-gray-200 border border-gray-400" />
              <span className="text-v-text-muted">Blocked</span>
            </div>
          </div>

          {/* Grid */}
          <div className="overflow-x-auto">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${seatGrid.cols}, 3.5rem)`,
                gridTemplateRows: `repeat(${seatGrid.rows}, 3.5rem)`,
                gap: '6px',
              }}
            >
              {seatGrid.grid.flatMap((row, rowIdx) =>
                row.map((seat, colIdx) => (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    style={{
                      gridRow: rowIdx + 1,
                      gridColumn: colIdx + 1,
                    }}
                  >
                    {seat ? (
                      <SeatCell
                        seat={seat}
                        isSelected={seat.id === selectedSeatId}
                        onSelect={setSelectedSeatId}
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Seat Actions Panel (right) ── */}
      <div className="lg:col-span-1">
        {selectedSeat ? (
          <Card>
            <h3 className="font-semibold text-v-text mb-4">
              Seat #{selectedSeat.seatNumber}
            </h3>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-v-text-muted">Type</span>
                <span className="font-medium text-v-text capitalize">{selectedSeat.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-v-text-muted">Status</span>
                <span
                  className={`font-medium capitalize ${
                    selectedSeat.status === 'booked'
                      ? 'text-green-600'
                      : selectedSeat.status === 'blocked'
                      ? 'text-gray-500'
                      : 'text-v-text'
                  }`}
                >
                  {selectedSeat.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-v-text-muted">Base Price</span>
                <span className="font-medium text-v-text">₹{selectedSeat.basePrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-v-text-muted">Final Price</span>
                <span className="font-semibold text-v-text">₹{selectedSeat.finalPrice}</span>
              </div>
              {selectedSeat.customPrice !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-v-text-muted">Custom Override</span>
                  <span className="font-medium text-blue-600">₹{selectedSeat.customPrice}</span>
                </div>
              )}
            </div>

            {!isReadOnly && (
              <div className="flex flex-col gap-2.5 mt-5 pt-4 border-t border-v-border">
                {/* Block / Unblock (not for booked) */}
                {selectedSeat.status !== 'booked' && (
                  <button
                    onClick={handleToggleBlock}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium border transition-colors ${
                      selectedSeat.status === 'blocked'
                        ? 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
                        : 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {selectedSeat.status === 'blocked' ? (
                      <>
                        <FaUnlock size={14} /> Unblock Seat
                      </>
                    ) : (
                      <>
                        <FaLock size={14} /> Block Seat
                      </>
                    )}
                  </button>
                )}

                {/* Price Override */}
                {editingPrice ? (
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-v-text-muted">
                        ₹
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        autoFocus
                        className="w-full pl-7 pr-3 py-2 rounded-lg border border-v-accent-border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent transition-colors"
                      />
                    </div>
                    <button
                      onClick={handleConfirmPrice}
                      className="p-2 rounded-lg bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors"
                    >
                      <FaCheck size={14} />
                    </button>
                    <button
                      onClick={() => setEditingPrice(false)}
                      className="p-2 rounded-lg bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleStartPriceEdit}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-secondary hover:border-v-secondary-border transition-colors"
                  >
                    <FaPencilAlt size={12} />
                    Override Price
                  </button>
                )}

                {selectedSeat.customPrice !== null && (
                  <button
                    onClick={handleResetPrice}
                    className="text-v-critical hover:underline font-medium self-start"
                  >
                    Reset to base price
                  </button>
                )}
              </div>
            )}

            {selectedSeat.status === 'booked' && (
              <p className="mt-4 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 font-medium">
                This seat is booked and cannot be modified.
              </p>
            )}
          </Card>
        ) : (
          <Card>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-v-secondary flex items-center justify-center mb-3">
                <FaPencilAlt size={18} className="text-v-text-muted" />
              </div>
              <p className="font-medium text-v-text">Select a Seat</p>
              <p className="text-v-text-muted mt-1">
                Click on a seat to view details, block/unblock, or override pricing.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TripSeatMap;
