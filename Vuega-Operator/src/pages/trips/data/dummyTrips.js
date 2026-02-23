/* ══════════════════════════════════════════════════════
   Dummy Trips Data — 2D grid format matching
   the layout-designer (aisles, sleeper spanning).
   ══════════════════════════════════════════════════════ */

/* ── Available routes (active only) ── */
export const availableRoutes = [
  { id: '1', fromCity: 'Chennai', toCity: 'Bangalore', distance: 346, duration: '5h 30m' },
  { id: '2', fromCity: 'Bangalore', toCity: 'Hyderabad', distance: 570, duration: '8h 45m' },
  { id: '3', fromCity: 'Mumbai', toCity: 'Pune', distance: 149, duration: '2h 45m' },
  { id: '5', fromCity: 'Chennai', toCity: 'Madurai', distance: 462, duration: '7h 15m' },
  { id: '6', fromCity: 'Hyderabad', toCity: 'Vijayawada', distance: 275, duration: '4h 00m' },
];

/* ── Available buses (active + have layout) ── */
export const availableBuses = [
  { id: 'bus-001', busNumber: 'KA01 AB 1234', status: 'active', layoutTemplateId: 'tpl-001', layoutName: '2+2 Seater (40 seats)', busType: 'Seater', totalSeats: 40 },
  { id: 'bus-002', busNumber: 'KA53 MN 8899', status: 'active', layoutTemplateId: 'tpl-002', layoutName: '2+1 Sleeper (24 berths)', busType: 'Sleeper', totalSeats: 24 },
  { id: 'bus-004', busNumber: 'KA04 CD 7890', status: 'active', layoutTemplateId: 'tpl-003', layoutName: '2+1 Seater (30 seats)', busType: 'Seater', totalSeats: 30 },
  { id: 'bus-006', busNumber: 'KA41 RS 2211', status: 'active', layoutTemplateId: 'tpl-004', layoutName: '2+1 Sleeper (24 berths)', busType: 'Sleeper', totalSeats: 24 },
  { id: 'bus-008', busNumber: 'KA22 VW 4455', status: 'active', layoutTemplateId: 'tpl-005', layoutName: '2+2 Seater (40 seats)', busType: 'Seater', totalSeats: 40 },
  { id: 'bus-003', busNumber: 'KA02 XY 5555', status: 'under-maintenance', layoutTemplateId: 'tpl-006', layoutName: '2+2 Semi-Sleeper (36 seats)', busType: 'Semi-Sleeper', totalSeats: 36 },
];

/* ── Generate 2D layout grid (matching layout-designer format) ──
   null at the aisle column; for sleepers the second physical row
   has merged:true so the sleeper above can span 2 rows. */
function generateGrid(rows, left, right, type, deck) {
  const totalCols = left + 1 + right; // +1 for aisle
  const isSleeper = type === 'sleeper';
  const physicalRows = isSleeper ? rows * 2 : rows;
  const grid = [];
  let counter = 1;

  for (let r = 0; r < physicalRows; r++) {
    const row = [];
    for (let c = 0; c < totalCols; c++) {
      // Aisle column
      if (c === left) { row.push(null); continue; }

      if (isSleeper) {
        if (r % 2 === 0) {
          // Primary sleeper row
          row.push({
            id: `${deck[0].toUpperCase()}-${r}-${c}`,
            seatNumber: String(counter++),
            type, deck, row: r, col: c,
            side: c < left ? 'left' : 'right',
            removed: false, merged: false,
          });
        } else {
          // Merged row (spanned by sleeper above)
          row.push({
            id: `${deck[0].toUpperCase()}-${r}-${c}`,
            seatNumber: '',
            type, deck, row: r, col: c,
            side: c < left ? 'left' : 'right',
            removed: false, merged: true,
          });
        }
      } else {
        row.push({
          id: `${deck[0].toUpperCase()}-${r}-${c}`,
          seatNumber: String(counter++),
          type, deck, row: r, col: c,
          side: c < left ? 'left' : 'right',
          removed: false, merged: false,
        });
      }
    }
    grid.push(row);
  }
  return grid;
}

/* ── Layout template configs ── */
const LAYOUT_CONFIGS = {
  'tpl-001': { rows: 10, leftSeats: 2, rightSeats: 2, seatType: 'seater' },
  'tpl-002': { rows: 8,  leftSeats: 2, rightSeats: 1, seatType: 'sleeper' },
  'tpl-003': { rows: 10, leftSeats: 2, rightSeats: 1, seatType: 'seater' },
  'tpl-004': { rows: 8,  leftSeats: 2, rightSeats: 1, seatType: 'sleeper' },
  'tpl-005': { rows: 10, leftSeats: 2, rightSeats: 2, seatType: 'seater' },
  'tpl-006': { rows: 9,  leftSeats: 2, rightSeats: 2, seatType: 'semi-sleeper' },
};

const LAYOUT_GRIDS = {};
Object.entries(LAYOUT_CONFIGS).forEach(([id, cfg]) => {
  LAYOUT_GRIDS[id] = generateGrid(cfg.rows, cfg.leftSeats, cfg.rightSeats, cfg.seatType, 'lower');
});

/* ── Public: get layout grid + config for a template ── */
export function getLayoutTemplate(templateId) {
  const config = LAYOUT_CONFIGS[templateId];
  const grid = LAYOUT_GRIDS[templateId];
  if (!config || !grid) return null;
  return { config, grid: grid.map((row) => row.map((cell) => (cell ? { ...cell } : null))) };
}

/* ── Flatten 2D trip-seat grid → flat array of real seats ── */
export function flattenSeats(grid) {
  if (!grid || grid.length === 0) return [];
  return grid.flat().filter((cell) => cell && !cell.merged && !cell.removed);
}

/* ── Convert layout 2D grid → trip 2D grid with pricing/status fields ── */
export function buildTripSeatGrid(layoutGrid, pricing) {
  return layoutGrid.map((row) =>
    row.map((cell) => {
      if (!cell) return null; // aisle
      if (cell.merged) return { ...cell, status: 'available', basePrice: 0, customPrice: null, finalPrice: 0, passenger: null };
      const basePrice = pricing[cell.type] || 0;
      return {
        ...cell,
        status: 'available',
        basePrice,
        customPrice: null,
        finalPrice: basePrice,
        passenger: null,
      };
    })
  );
}

/* ── Dummy passenger names for pre-booked seats ── */
const DUMMY_PASSENGERS = [
  { name: 'Arjun Kumar', phone: '9876543210', email: 'arjun@email.com', gender: 'male', age: 28 },
  { name: 'Priya Sharma', phone: '9876543211', email: 'priya@email.com', gender: 'female', age: 25 },
  { name: 'Rahul Verma', phone: '9876543212', email: 'rahul@email.com', gender: 'male', age: 34 },
  { name: 'Sneha Reddy', phone: '9876543213', email: 'sneha@email.com', gender: 'female', age: 22 },
  { name: 'Vikram Singh', phone: '9876543214', email: 'vikram@email.com', gender: 'male', age: 41 },
  { name: 'Ananya Iyer', phone: '9876543215', email: 'ananya@email.com', gender: 'female', age: 30 },
  { name: 'Karthik Nair', phone: '9876543216', email: 'karthik@email.com', gender: 'male', age: 27 },
  { name: 'Deepa Menon', phone: '9876543217', email: 'deepa@email.com', gender: 'female', age: 35 },
  { name: 'Suresh Pillai', phone: '9876543218', email: 'suresh@email.com', gender: 'male', age: 45 },
  { name: 'Lakshmi Bhat', phone: '9876543219', email: 'lakshmi@email.com', gender: 'female', age: 29 },
  { name: 'Aditya Rao', phone: '9876543220', email: 'aditya@email.com', gender: 'male', age: 33 },
  { name: 'Meera Joshi', phone: '9876543221', email: 'meera@email.com', gender: 'female', age: 26 },
  { name: 'Naveen Das', phone: '9876543222', email: 'naveen@email.com', gender: 'male', age: 38 },
  { name: 'Revathi Sundaram', phone: '9876543223', email: 'revathi@email.com', gender: 'female', age: 31 },
  { name: 'Ganesh Prasad', phone: '9876543224', email: 'ganesh@email.com', gender: 'male', age: 50 },
  { name: 'Kavitha Rajan', phone: '9876543225', email: 'kavitha@email.com', gender: 'female', age: 24 },
  { name: 'Mohan Lal', phone: '9876543226', email: 'mohan@email.com', gender: 'male', age: 55 },
  { name: 'Divya Krishnan', phone: '9876543227', email: 'divya@email.com', gender: 'female', age: 23 },
  { name: 'Ravi Shankar', phone: '9876543228', email: 'ravi@email.com', gender: 'male', age: 36 },
  { name: 'Shalini Gupta', phone: '9876543229', email: 'shalini@email.com', gender: 'female', age: 32 },
  { name: 'Harish Babu', phone: '9876543230', email: 'harish@email.com', gender: 'male', age: 29 },
  { name: 'Pooja Hegde', phone: '9876543231', email: 'pooja@email.com', gender: 'female', age: 27 },
  { name: 'Manoj Tiwari', phone: '9876543232', email: 'manoj@email.com', gender: 'male', age: 42 },
  { name: 'Nandini Rao', phone: '9876543233', email: 'nandini@email.com', gender: 'female', age: 28 },
  { name: 'Prashanth Kaul', phone: '9876543234', email: 'prashanth@email.com', gender: 'male', age: 39 },
  { name: 'Isha Patel', phone: '9876543235', email: 'isha@email.com', gender: 'female', age: 21 },
  { name: 'Venkat Subbu', phone: '9876543236', email: 'venkat@email.com', gender: 'male', age: 47 },
  { name: 'Sanya Malhotra', phone: '9876543237', email: 'sanya@email.com', gender: 'female', age: 26 },
];

/* ── Helper: mark first N real seats as booked in 2D grid ── */
function markBookedInGrid(grid, count) {
  let marked = 0;
  return grid.map((row) =>
    row.map((cell) => {
      if (!cell || cell.merged || cell.removed) return cell;
      if (marked < count) {
        const passenger = { ...DUMMY_PASSENGERS[marked % DUMMY_PASSENGERS.length] };
        marked++;
        return { ...cell, status: 'booked', passenger };
      }
      return cell;
    })
  );
}

/* ── Helper: mark specific flat-indices as blocked ── */
function markBlockedInGrid(grid, flatIndices) {
  let idx = 0;
  return grid.map((row) =>
    row.map((cell) => {
      if (!cell || cell.merged || cell.removed) return cell;
      const cur = idx++;
      if (flatIndices.includes(cur)) return { ...cell, status: 'blocked' };
      return cell;
    })
  );
}

/* ── Pre-built trips ── */
let _nextTripId = 8;
export const generateTripId = () => `trip-${String(_nextTripId++).padStart(3, '0')}`;

function makeTripGrid(tplId, pricing, bookedCount = 0, blockedIndices = []) {
  const tpl = getLayoutTemplate(tplId);
  if (!tpl) return [];
  let grid = buildTripSeatGrid(tpl.grid, pricing);
  if (bookedCount > 0) grid = markBookedInGrid(grid, bookedCount);
  if (blockedIndices.length > 0) grid = markBlockedInGrid(grid, blockedIndices);
  return grid;
}

const dummyTrips = [
  {
    id: 'trip-001', routeId: '1', route: 'Chennai → Bangalore',
    busId: 'bus-001', busNumber: 'KA01 AB 1234', layoutTemplateId: 'tpl-001',
    departureDate: '2026-02-23', departureTime: '21:00', arrivalTime: '02:30',
    status: 'scheduled', occupancy: 0, totalSeats: 40, bookedSeats: 0,
    pricing: { seater: 850, sleeper: 0, 'semi-sleeper': 0 },
    tripSeatGrid: makeTripGrid('tpl-001', { seater: 850 }),
  },
  {
    id: 'trip-002', routeId: '2', route: 'Bangalore → Hyderabad',
    busId: 'bus-002', busNumber: 'KA53 MN 8899', layoutTemplateId: 'tpl-002',
    departureDate: '2026-02-22', departureTime: '20:00', arrivalTime: '04:45',
    status: 'ongoing', occupancy: 75, totalSeats: 24, bookedSeats: 18,
    pricing: { seater: 0, sleeper: 1500, 'semi-sleeper': 0 },
    tripSeatGrid: makeTripGrid('tpl-002', { sleeper: 1500 }, 18),
  },
  {
    id: 'trip-003', routeId: '3', route: 'Mumbai → Pune',
    busId: 'bus-004', busNumber: 'KA04 CD 7890', layoutTemplateId: 'tpl-003',
    departureDate: '2026-02-22', departureTime: '06:00', arrivalTime: '08:45',
    status: 'completed', occupancy: 93, totalSeats: 30, bookedSeats: 28,
    pricing: { seater: 450, sleeper: 0, 'semi-sleeper': 0 },
    tripSeatGrid: makeTripGrid('tpl-003', { seater: 450 }, 28),
  },
  {
    id: 'trip-004', routeId: '1', route: 'Chennai → Bangalore',
    busId: 'bus-008', busNumber: 'KA22 VW 4455', layoutTemplateId: 'tpl-005',
    departureDate: '2026-02-24', departureTime: '22:00', arrivalTime: '03:30',
    status: 'scheduled', occupancy: 15, totalSeats: 40, bookedSeats: 6,
    pricing: { seater: 900, sleeper: 0, 'semi-sleeper': 0 },
    tripSeatGrid: makeTripGrid('tpl-005', { seater: 900 }, 6, [38, 39]),
  },
  {
    id: 'trip-005', routeId: '5', route: 'Chennai → Madurai',
    busId: 'bus-006', busNumber: 'KA41 RS 2211', layoutTemplateId: 'tpl-004',
    departureDate: '2026-02-25', departureTime: '19:30', arrivalTime: '02:45',
    status: 'scheduled', occupancy: 0, totalSeats: 24, bookedSeats: 0,
    pricing: { seater: 0, sleeper: 1200, 'semi-sleeper': 0 },
    tripSeatGrid: makeTripGrid('tpl-004', { sleeper: 1200 }),
  },
  {
    id: 'trip-006', routeId: '6', route: 'Hyderabad → Vijayawada',
    busId: 'bus-004', busNumber: 'KA04 CD 7890', layoutTemplateId: 'tpl-003',
    departureDate: '2026-02-21', departureTime: '07:00', arrivalTime: '11:00',
    status: 'cancelled', occupancy: 0, totalSeats: 30, bookedSeats: 0,
    pricing: { seater: 500, sleeper: 0, 'semi-sleeper': 0 },
    tripSeatGrid: makeTripGrid('tpl-003', { seater: 500 }),
  },
  {
    id: 'trip-007', routeId: '2', route: 'Bangalore → Hyderabad',
    busId: 'bus-006', busNumber: 'KA41 RS 2211', layoutTemplateId: 'tpl-004',
    departureDate: '2026-02-26', departureTime: '20:30', arrivalTime: '05:15',
    status: 'scheduled', occupancy: 33, totalSeats: 24, bookedSeats: 8,
    pricing: { seater: 0, sleeper: 1400, 'semi-sleeper': 0 },
    tripSeatGrid: makeTripGrid('tpl-004', { sleeper: 1400 }, 8),
  },
];

export default dummyTrips;
