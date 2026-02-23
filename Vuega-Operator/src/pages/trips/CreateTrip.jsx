import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRocket, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import TripForm from './components/TripForm';
import SeatPricingPanel from './components/SeatPricingPanel';
import TripSeatGrid from './components/TripSeatGrid';
import {
  availableRoutes,
  availableBuses,
  getLayoutTemplate,
  buildTripSeatGrid,
  flattenSeats,
  generateTripId,
} from './data/dummyTrips';

const CreateTrip = () => {
  const navigate = useNavigate();

  /* ── Form state ── */
  const [form, setForm] = useState({
    routeId: '',
    busId: '',
    departureDate: '',
    departureTime: '',
    arrivalTime: '',
  });

  const [pricing, setPricing] = useState({
    seater: 0,
    sleeper: 0,
    'semi-sleeper': 0,
  });

  const [tripSeatGrid, setTripSeatGrid] = useState([]);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [showSeatMap, setShowSeatMap] = useState(false);

  /* ── Derived data ── */
  const selectedRoute = availableRoutes.find((r) => r.id === form.routeId);
  const selectedBus = availableBuses.find((b) => b.id === form.busId);
  const flatSeats = useMemo(() => flattenSeats(tripSeatGrid), [tripSeatGrid]);

  const aisleIndex = tripSeatGrid?.[0]?.indexOf(null) ?? -1;

  const isValid =
    form.routeId &&
    form.busId &&
    form.departureDate &&
    form.departureTime &&
    form.arrivalTime &&
    selectedBus?.layoutTemplateId &&
    selectedBus?.status === 'active';

  /* ── When bus changes, load layout grid ── */
  const handleFormChange = (newForm) => {
    setForm(newForm);

    if (newForm.busId !== form.busId) {
      const bus = availableBuses.find((b) => b.id === newForm.busId);
      if (bus?.layoutTemplateId) {
        const tpl = getLayoutTemplate(bus.layoutTemplateId);
        if (tpl) {
          const grid = buildTripSeatGrid(tpl.grid, pricing);
          setTripSeatGrid(grid);
          setSelectedSeatId(null);
          setSelectedColumn(null);
          setShowSeatMap(true);
        }
      } else {
        setTripSeatGrid([]);
        setShowSeatMap(false);
      }
    }
  };

  /* ── Pricing change → recalculate all non-overridden seats ── */
  const handlePricingChange = (newPricing) => {
    setPricing(newPricing);
    setTripSeatGrid((prev) =>
      prev.map((row) =>
        row.map((cell) => {
          if (!cell || cell.merged || cell.removed) return cell;
          const newBase = newPricing[cell.type] || 0;
          return {
            ...cell,
            basePrice: newBase,
            finalPrice: cell.customPrice !== null ? cell.customPrice : newBase,
          };
        })
      )
    );
  };

  /* ── Individual seat custom price override ── */
  const handleCustomPriceSet = (seatId, price) => {
    setTripSeatGrid((prev) =>
      prev.map((row) =>
        row.map((cell) => {
          if (!cell || cell.id !== seatId) return cell;
          if (price === null) {
            return { ...cell, customPrice: null, finalPrice: cell.basePrice };
          }
          return { ...cell, customPrice: price, finalPrice: price };
        })
      )
    );
  };

  /* ── Column price set/reset ── */
  const handleColumnPriceSet = (colIndex, price) => {
    setTripSeatGrid((prev) =>
      prev.map((row) =>
        row.map((cell, ci) => {
          if (!cell || cell.merged || cell.removed || ci !== colIndex) return cell;
          if (price === null) {
            return { ...cell, customPrice: null, finalPrice: cell.basePrice };
          }
          return { ...cell, customPrice: price, finalPrice: price };
        })
      )
    );
  };

  const selectedSeat = flatSeats.find((s) => s.id === selectedSeatId) || null;

  /* ── Create Trip ── */
  const handleCreate = () => {
    const route = selectedRoute;
    const tripObject = {
      id: generateTripId(),
      routeId: form.routeId,
      route: `${route.fromCity} → ${route.toCity}`,
      busId: form.busId,
      busNumber: selectedBus.busNumber,
      layoutTemplateId: selectedBus.layoutTemplateId,
      departureDate: form.departureDate,
      departureTime: form.departureTime,
      arrivalTime: form.arrivalTime,
      status: 'scheduled',
      occupancy: 0,
      totalSeats: flatSeats.length,
      bookedSeats: 0,
      pricing: { ...pricing },
      tripSeatGrid: tripSeatGrid.map((row) =>
        row.map((cell) => (cell ? { ...cell } : null))
      ),
    };

    console.log('═══════════════════════════════════════');
    console.log('TRIP CREATED (Frontend Simulation)');
    console.log('═══════════════════════════════════════');
    console.log(JSON.stringify(tripObject, null, 2));
    console.log('═══════════════════════════════════════');

    alert('Trip created successfully! Check console for the full trip object.');
    navigate('/trips');
  };

  return (
    <div className="max-w-[1360px] mx-auto flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/trips')}
          className="p-2 rounded-lg border border-v-border hover:bg-v-secondary transition-colors text-v-text-muted"
        >
          <FaArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-v-text font-bold tracking-tight">Create Trip</h2>
          <p className="text-v-text-muted mt-0.5">
            Assign a route, bus, and set pricing for a new trip.
          </p>
        </div>
      </div>

      {/* ── Section A: Basic Info ── */}
      <TripForm form={form} onChange={handleFormChange} selectedBus={selectedBus} />

      {/* ── Section B: Pricing + Seat Map ── */}
      {flatSeats.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pricing Panel (left) */}
            <div className="lg:col-span-1">
              <SeatPricingPanel
                pricing={pricing}
                onPricingChange={handlePricingChange}
                selectedSeat={selectedSeat}
                onCustomPriceSet={handleCustomPriceSet}
                tripSeats={flatSeats}
                selectedColumn={selectedColumn}
                onColumnPriceSet={handleColumnPriceSet}
                aisleIndex={aisleIndex}
              />
            </div>

            {/* Seat Map Preview (right) */}
            <div className="lg:col-span-2">
              <div className="bg-v-primary-bg border border-v-border rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setShowSeatMap(!showSeatMap)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-v-secondary/20 transition-colors"
                >
                  <h3 className="font-semibold text-v-text">
                    Seat Map Preview ({flatSeats.length} seats)
                  </h3>
                  {showSeatMap ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </button>

                {showSeatMap && (
                  <div className="px-5 pb-5">
                    <p className="text-v-text-muted mb-4">
                      Click a seat to override its price. Click a column header to set price for the entire column.
                    </p>

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
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Create Button ── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={() => navigate('/trips')}
          className="px-5 py-2.5 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-secondary transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={!isValid}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold border transition-colors shadow-sm ${
            isValid
              ? 'bg-v-accent hover:bg-v-accent-hover text-v-text border-v-accent-border'
              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          }`}
        >
          <FaRocket size={16} />
          Create Trip
        </button>
      </div>
    </div>
  );
};

export default CreateTrip;
