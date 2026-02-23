import { useState, useMemo } from 'react';
import { FaLock, FaUnlock, FaPencilAlt, FaCheck, FaTimes, FaColumns, FaTicketAlt, FaUser, FaPhone, FaEnvelope, FaVenusMars, FaCalendarAlt, FaTimesCircle } from 'react-icons/fa';
import TripSeatGrid from './TripSeatGrid';
import BookSeatModal from './BookSeatModal';
import Card from '../../../components/ui/Card';
import { flattenSeats } from '../data/dummyTrips';

/* ══════════════════════════════════════════════════════
   TripSeatMap — renders the trip seat grid using
   TripSeatGrid (2D layout with aisles, row labels,
   column headers, sleeper spanning).
   Allows: block/unblock, price override, column pricing.
   ══════════════════════════════════════════════════════ */

const TripSeatMap = ({ tripSeatGrid, onGridChange, isReadOnly = false }) => {
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [editingColPrice, setEditingColPrice] = useState(false);
  const [colPriceInput, setColPriceInput] = useState('');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const flatSeats = useMemo(() => flattenSeats(tripSeatGrid), [tripSeatGrid]);
  const selectedSeat = flatSeats.find((s) => s.id === selectedSeatId) || null;

  const aisleIndex = tripSeatGrid?.[0]?.indexOf(null) ?? -1;
  const colLabel =
    selectedColumn !== null && aisleIndex >= 0
      ? `C${selectedColumn < aisleIndex ? selectedColumn + 1 : selectedColumn}`
      : '';

  /* ── Helper: update a cell in the 2D grid ── */
  const updateGrid = (updater) => {
    onGridChange(
      tripSeatGrid.map((row) =>
        row.map((cell) => {
          if (!cell || cell.merged || cell.removed) return cell;
          return updater(cell);
        })
      )
    );
  };

  /* ── Block / Unblock ── */
  const handleToggleBlock = () => {
    if (!selectedSeat || isReadOnly) return;
    if (selectedSeat.status === 'booked') return;
    const newStatus = selectedSeat.status === 'blocked' ? 'available' : 'blocked';
    onGridChange(
      tripSeatGrid.map((row) =>
        row.map((cell) =>
          cell && cell.id === selectedSeat.id ? { ...cell, status: newStatus } : cell
        )
      )
    );
  };

  /* ── Individual Price override ── */
  const handleStartPriceEdit = () => {
    setPriceInput(String(selectedSeat?.customPrice ?? selectedSeat?.finalPrice ?? ''));
    setEditingPrice(true);
  };

  const handleConfirmPrice = () => {
    const price = parseFloat(priceInput);
    if (!isNaN(price) && price >= 0 && selectedSeat) {
      onGridChange(
        tripSeatGrid.map((row) =>
          row.map((cell) =>
            cell && cell.id === selectedSeat.id
              ? { ...cell, customPrice: price, finalPrice: price }
              : cell
          )
        )
      );
    }
    setEditingPrice(false);
  };

  const handleResetPrice = () => {
    if (!selectedSeat) return;
    onGridChange(
      tripSeatGrid.map((row) =>
        row.map((cell) =>
          cell && cell.id === selectedSeat.id
            ? { ...cell, customPrice: null, finalPrice: cell.basePrice }
            : cell
        )
      )
    );
  };

  /* ── Column pricing ── */
  const handleStartColPriceEdit = () => {
    setColPriceInput('');
    setEditingColPrice(true);
  };

  const handleConfirmColPrice = () => {
    const price = parseFloat(colPriceInput);
    if (!isNaN(price) && price >= 0 && selectedColumn !== null) {
      onGridChange(
        tripSeatGrid.map((row) =>
          row.map((cell, colIdx) => {
            if (!cell || cell.merged || cell.removed) return cell;
            if (colIdx !== selectedColumn) return cell;
            return { ...cell, customPrice: price, finalPrice: price };
          })
        )
      );
    }
    setEditingColPrice(false);
  };

  const handleResetColPrice = () => {
    if (selectedColumn === null) return;
    onGridChange(
      tripSeatGrid.map((row) =>
        row.map((cell, colIdx) => {
          if (!cell || cell.merged || cell.removed) return cell;
          if (colIdx !== selectedColumn) return cell;
          return { ...cell, customPrice: null, finalPrice: cell.basePrice };
        })
      )
    );
  };

  /* ── Book / Unbook seat ── */
  const handleBookSeat = (passenger) => {
    if (!selectedSeat) return;
    onGridChange(
      tripSeatGrid.map((row) =>
        row.map((cell) =>
          cell && cell.id === selectedSeat.id
            ? { ...cell, status: 'booked', passenger }
            : cell
        )
      )
    );
    setBookingModalOpen(false);
  };

  const handleUnbookSeat = () => {
    if (!selectedSeat) return;
    onGridChange(
      tripSeatGrid.map((row) =>
        row.map((cell) =>
          cell && cell.id === selectedSeat.id
            ? { ...cell, status: 'available', passenger: null }
            : cell
        )
      )
    );
  };

  /* ── Stats ── */
  const available = flatSeats.filter((s) => s.status === 'available').length;
  const booked = flatSeats.filter((s) => s.status === 'booked').length;
  const blocked = flatSeats.filter((s) => s.status === 'blocked').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Seat Grid (left 2 cols) ── */}
      <div className="lg:col-span-2">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-v-text">Seat Map</h3>
            <span className="text-v-text-muted">
              {available} available • {booked} booked • {blocked} blocked
            </span>
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
            <TripSeatGrid
              grid={tripSeatGrid}
              selectedSeatId={selectedSeatId}
              selectedColumn={selectedColumn}
              onSelectSeat={setSelectedSeatId}
              onSelectColumn={setSelectedColumn}
            />
          </div>
        </Card>
      </div>

      {/* ── Actions Panel (right) ── */}
      <div className="lg:col-span-1 flex flex-col gap-5">
        {/* Column pricing card */}
        {selectedColumn !== null && !isReadOnly && (
          <Card>
            <h3 className="font-semibold text-v-text mb-3 flex items-center gap-2">
              <FaColumns size={16} className="text-blue-500" />
              Column {colLabel} — Price
            </h3>
            <p className="text-v-text-muted mb-3">
              Set a custom price for every seat in column {colLabel}.
            </p>

            {editingColPrice ? (
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-v-text-muted">₹</span>
                  <input
                    type="number"
                    min={0}
                    value={colPriceInput}
                    onChange={(e) => setColPriceInput(e.target.value)}
                    autoFocus
                    placeholder="Enter price"
                    className="w-full pl-7 pr-3 py-2 rounded-lg border border-v-accent-border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent transition-colors"
                  />
                </div>
                <button onClick={handleConfirmColPrice} className="p-2 rounded-lg bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors">
                  <FaCheck size={14} />
                </button>
                <button onClick={() => setEditingColPrice(false)} className="p-2 rounded-lg bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors">
                  <FaTimes size={14} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleStartColPriceEdit}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  Set Column Price
                </button>
                <button
                  onClick={handleResetColPrice}
                  className="text-v-critical hover:underline font-medium self-start"
                >
                  Reset column to base prices
                </button>
              </div>
            )}
          </Card>
        )}

        {/* Seat detail card */}
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
                <span className={`font-medium capitalize ${
                  selectedSeat.status === 'booked' ? 'text-green-600'
                  : selectedSeat.status === 'blocked' ? 'text-gray-500'
                  : 'text-v-text'
                }`}>
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
                {selectedSeat.status === 'available' && (
                  <button
                    onClick={() => setBookingModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-white bg-green-600 border border-green-700 hover:bg-green-700 transition-colors shadow-sm"
                  >
                    <FaTicketAlt size={14} /> Book Seat
                  </button>
                )}

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
                      <><FaUnlock size={14} /> Unblock Seat</>
                    ) : (
                      <><FaLock size={14} /> Block Seat</>
                    )}
                  </button>
                )}

                {editingPrice ? (
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-v-text-muted">₹</span>
                      <input
                        type="number"
                        min={0}
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        autoFocus
                        className="w-full pl-7 pr-3 py-2 rounded-lg border border-v-accent-border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent transition-colors"
                      />
                    </div>
                    <button onClick={handleConfirmPrice} className="p-2 rounded-lg bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors">
                      <FaCheck size={14} />
                    </button>
                    <button onClick={() => setEditingPrice(false)} className="p-2 rounded-lg bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors">
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

            {selectedSeat.status === 'booked' && selectedSeat.passenger && (
              <div className="mt-5 pt-4 border-t border-v-border">
                <h4 className="font-semibold text-v-text mb-3 flex items-center gap-2">
                  <FaUser size={14} className="text-green-600" />
                  Passenger Details
                </h4>
                <div className="flex flex-col gap-2.5 px-3 py-3 rounded-lg bg-green-50/50 border border-green-200">
                  <div className="flex items-center gap-2">
                    <FaUser size={12} className="text-v-text-muted" />
                    <span className="text-v-text-muted">Name:</span>
                    <span className="font-medium text-v-text">{selectedSeat.passenger.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone size={12} className="text-v-text-muted" />
                    <span className="text-v-text-muted">Phone:</span>
                    <span className="font-medium text-v-text">{selectedSeat.passenger.phone}</span>
                  </div>
                  {selectedSeat.passenger.email && (
                    <div className="flex items-center gap-2">
                      <FaEnvelope size={12} className="text-v-text-muted" />
                      <span className="text-v-text-muted">Email:</span>
                      <span className="font-medium text-v-text">{selectedSeat.passenger.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FaVenusMars size={12} className="text-v-text-muted" />
                    <span className="text-v-text-muted">Gender:</span>
                    <span className="font-medium text-v-text capitalize">{selectedSeat.passenger.gender}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt size={12} className="text-v-text-muted" />
                    <span className="text-v-text-muted">Age:</span>
                    <span className="font-medium text-v-text">{selectedSeat.passenger.age}</span>
                  </div>
                </div>

                {!isReadOnly && (
                  <button
                    onClick={handleUnbookSeat}
                    className="inline-flex items-center justify-center gap-2 mt-3 px-4 py-2.5 rounded-lg font-medium text-v-critical bg-red-50 border border-red-200 hover:bg-red-100 transition-colors w-full"
                  >
                    <FaTimesCircle size={14} /> Cancel Booking
                  </button>
                )}
              </div>
            )}

            {selectedSeat.status === 'booked' && !selectedSeat.passenger && (
              <p className="mt-4 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 font-medium">
                This seat is booked (no passenger details available).
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
              <p className="text-v-text-muted mt-1">
                Click a column header (C1, C2…) to set price for the entire column.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* ── Booking Modal ── */}
      <BookSeatModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        seat={selectedSeat}
        onConfirm={handleBookSeat}
      />
    </div>
  );
};

export default TripSeatMap;
