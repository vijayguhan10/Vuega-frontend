import { useState } from 'react';
import { FaRupeeSign, FaPencilAlt, FaCheck, FaTimes, FaColumns } from 'react-icons/fa';
import Card from '../../../components/ui/Card';

/* ══════════════════════════════════════════════════════
   SeatPricingPanel — manages base pricing per seat type,
   column-wide pricing, and per-seat custom overrides.
   ══════════════════════════════════════════════════════ */

const SEAT_TYPES = [
  { key: 'seater', label: 'Seater' },
  { key: 'sleeper', label: 'Sleeper' },
  { key: 'semi-sleeper', label: 'Semi-Sleeper' },
];

const SeatPricingPanel = ({
  pricing,
  onPricingChange,
  selectedSeat,
  onCustomPriceSet,
  tripSeats = [],        // flat array for overrides summary
  selectedColumn,         // colIndex number | null
  onColumnPriceSet,       // (colIndex, price) => void
  aisleIndex,             // aisle column index (for label)
}) => {
  const [editingSeatPrice, setEditingSeatPrice] = useState(false);
  const [customPriceInput, setCustomPriceInput] = useState('');
  const [columnPriceInput, setColumnPriceInput] = useState('');
  const [editingColumnPrice, setEditingColumnPrice] = useState(false);

  const overriddenSeats = tripSeats.filter((s) => s.customPrice !== null);

  /* ── Seat price editing ── */
  const handleStartEdit = () => {
    setCustomPriceInput(String(selectedSeat?.customPrice ?? selectedSeat?.basePrice ?? ''));
    setEditingSeatPrice(true);
  };

  const handleConfirmPrice = () => {
    const price = parseFloat(customPriceInput);
    if (!isNaN(price) && price >= 0 && selectedSeat) {
      onCustomPriceSet(selectedSeat.id, price);
    }
    setEditingSeatPrice(false);
  };

  const handleCancelEdit = () => {
    setEditingSeatPrice(false);
  };

  /* ── Column price editing ── */
  const colLabel =
    selectedColumn !== null && aisleIndex !== undefined
      ? `C${selectedColumn < aisleIndex ? selectedColumn + 1 : selectedColumn}`
      : '';

  const handleStartColumnEdit = () => {
    setColumnPriceInput('');
    setEditingColumnPrice(true);
  };

  const handleConfirmColumnPrice = () => {
    const price = parseFloat(columnPriceInput);
    if (!isNaN(price) && price >= 0 && selectedColumn !== null) {
      onColumnPriceSet?.(selectedColumn, price);
    }
    setEditingColumnPrice(false);
  };

  const handleResetColumnPrice = () => {
    if (selectedColumn !== null) {
      onColumnPriceSet?.(selectedColumn, null); // null = reset to base
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Base Pricing ── */}
      <Card>
        <h3 className="font-semibold text-v-text mb-4 flex items-center gap-2">
          <FaRupeeSign size={16} className="text-v-text-secondary" />
          Seat Type Pricing
        </h3>
        <div className="flex flex-col gap-3">
          {SEAT_TYPES.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <label className="w-28 font-medium text-v-text-secondary">{label}</label>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-v-text-muted">₹</span>
                <input
                  type="number"
                  min={0}
                  value={pricing[key] || ''}
                  onChange={(e) =>
                    onPricingChange({ ...pricing, [key]: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2 rounded-lg border border-v-border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Column Pricing ── */}
      {selectedColumn !== null && (
        <Card>
          <h3 className="font-semibold text-v-text mb-3 flex items-center gap-2">
            <FaColumns size={16} className="text-blue-500" />
            Column {colLabel} — Set Price
          </h3>
          <p className="text-v-text-muted mb-3">
            Apply a single price to every seat in column {colLabel}.
          </p>

          {editingColumnPrice ? (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-v-text-muted">₹</span>
                <input
                  type="number"
                  min={0}
                  value={columnPriceInput}
                  onChange={(e) => setColumnPriceInput(e.target.value)}
                  autoFocus
                  placeholder="Enter price"
                  className="w-full pl-7 pr-3 py-2 rounded-lg border border-v-accent-border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent transition-colors"
                />
              </div>
              <button
                onClick={handleConfirmColumnPrice}
                className="p-2 rounded-lg bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors"
              >
                <FaCheck size={14} />
              </button>
              <button
                onClick={() => setEditingColumnPrice(false)}
                className="p-2 rounded-lg bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <FaTimes size={14} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleStartColumnEdit}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <FaRupeeSign size={12} />
                Set Column Price
              </button>
              <button
                onClick={handleResetColumnPrice}
                className="text-v-critical hover:underline font-medium self-start"
              >
                Reset column to base prices
              </button>
            </div>
          )}
        </Card>
      )}

      {/* ── Selected Seat Override ── */}
      {selectedSeat && (
        <Card>
          <h3 className="font-semibold text-v-text mb-3">
            Seat #{selectedSeat.seatNumber} — Price Override
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-v-text-muted">Type</span>
              <span className="font-medium text-v-text capitalize">{selectedSeat.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-v-text-muted">Base Price</span>
              <span className="font-medium text-v-text">₹{selectedSeat.basePrice}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-v-text-muted">Final Price</span>
              <span className="font-semibold text-v-text">₹{selectedSeat.finalPrice}</span>
            </div>

            {editingSeatPrice ? (
              <div className="flex items-center gap-2 mt-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-v-text-muted">₹</span>
                  <input
                    type="number"
                    min={0}
                    value={customPriceInput}
                    onChange={(e) => setCustomPriceInput(e.target.value)}
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
                  onClick={handleCancelEdit}
                  className="p-2 rounded-lg bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartEdit}
                className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-secondary hover:border-v-secondary-border transition-colors"
              >
                <FaPencilAlt size={12} />
                Override Price
              </button>
            )}

            {selectedSeat.customPrice !== null && (
              <button
                onClick={() => onCustomPriceSet(selectedSeat.id, null)}
                className="text-v-critical hover:underline font-medium self-start mt-1"
              >
                Reset to base price
              </button>
            )}
          </div>
        </Card>
      )}

      {/* ── Overrides Summary ── */}
      {overriddenSeats.length > 0 && (
        <Card>
          <h3 className="font-semibold text-v-text mb-3">
            Custom Overrides ({overriddenSeats.length})
          </h3>
          <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
            {overriddenSeats.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-v-secondary/40"
              >
                <span className="font-medium text-v-text">Seat {s.seatNumber}</span>
                <span className="text-v-text-secondary">
                  <span className="line-through text-v-text-muted mr-2">₹{s.basePrice}</span>
                  ₹{s.customPrice}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SeatPricingPanel;
