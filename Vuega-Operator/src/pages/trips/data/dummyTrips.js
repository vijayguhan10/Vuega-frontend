/* ══════════════════════════════════════════════════════
   Dummy Trips Data
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
  {
    id: 'bus-001',
    busNumber: 'KA01 AB 1234',
    status: 'active',
    layoutTemplateId: 'tpl-001',
    layoutName: '2+2 Seater (40 seats)',
    busType: 'Seater',
    totalSeats: 40,
  },
  {
    id: 'bus-002',
    busNumber: 'KA53 MN 8899',
    status: 'active',
    layoutTemplateId: 'tpl-002',
    layoutName: '2+1 Sleeper (24 berths)',
    busType: 'Sleeper',
    totalSeats: 24,
  },
  {
    id: 'bus-004',
    busNumber: 'KA04 CD 7890',
    status: 'active',
    layoutTemplateId: 'tpl-003',
    layoutName: '2+1 Seater (30 seats)',
    busType: 'Seater',
    totalSeats: 30,
  },
  {
    id: 'bus-006',
    busNumber: 'KA41 RS 2211',
    status: 'active',
    layoutTemplateId: 'tpl-004',
    layoutName: '2+1 Sleeper (24 berths)',
    busType: 'Sleeper',
    totalSeats: 24,
  },
  {
    id: 'bus-008',
    busNumber: 'KA22 VW 4455',
    status: 'active',
    layoutTemplateId: 'tpl-005',
    layoutName: '2+2 Seater (40 seats)',
    busType: 'Seater',
    totalSeats: 40,
  },
  {
    id: 'bus-003',
    busNumber: 'KA02 XY 5555',
    status: 'under-maintenance',
    layoutTemplateId: 'tpl-006',
    layoutName: '2+2 Semi-Sleeper (36 seats)',
    busType: 'Semi-Sleeper',
    totalSeats: 36,
  },
];

/* ── Simulated layout template lookup ──
   Returns a flat array of seat objects for a given template. */
const LAYOUT_TEMPLATES = {
  'tpl-001': generateSeats(10, 2, 2, 'seater', 'lower'),
  'tpl-002': generateSeats(8, 2, 1, 'sleeper', 'lower'),
  'tpl-003': generateSeats(10, 2, 1, 'seater', 'lower'),
  'tpl-004': generateSeats(8, 2, 1, 'sleeper', 'lower'),
  'tpl-005': generateSeats(10, 2, 2, 'seater', 'lower'),
  'tpl-006': generateSeats(9, 2, 2, 'semi-sleeper', 'lower'),
};

function generateSeats(rows, left, right, type, deck) {
  const seats = [];
  let counter = 1;
  for (let r = 0; r < rows; r++) {
    const totalCols = left + right;
    for (let c = 0; c < totalCols; c++) {
      seats.push({
        id: `${deck[0].toUpperCase()}-${r}-${c}`,
        seatNumber: String(counter++),
        type,
        deck,
        row: r,
        col: c,
        side: c < left ? 'left' : 'right',
        removed: false,
        merged: false,
      });
    }
  }
  return seats;
}

export function getLayoutSeats(templateId) {
  return LAYOUT_TEMPLATES[templateId] || [];
}

/* ── Convert layout seats → trip seats with pricing ── */
export function buildTripSeats(layoutSeats, pricing) {
  return layoutSeats
    .filter((s) => !s.removed && !s.merged)
    .map((s) => {
      const basePrice = pricing[s.type] || 0;
      return {
        id: s.id,
        seatNumber: s.seatNumber,
        type: s.type,
        deck: s.deck,
        row: s.row,
        col: s.col,
        side: s.side,
        status: 'available',
        basePrice,
        customPrice: null,
        finalPrice: basePrice,
      };
    });
}

/* ── Pre-built trips ── */
let _nextTripId = 8;
export const generateTripId = () => `trip-${String(_nextTripId++).padStart(3, '0')}`;

const dummyTrips = [
  {
    id: 'trip-001',
    routeId: '1',
    route: 'Chennai → Bangalore',
    busId: 'bus-001',
    busNumber: 'KA01 AB 1234',
    layoutTemplateId: 'tpl-001',
    departureDate: '2026-02-23',
    departureTime: '21:00',
    arrivalTime: '02:30',
    status: 'scheduled',
    occupancy: 0,
    totalSeats: 40,
    bookedSeats: 0,
    pricing: { seater: 850, sleeper: 0, 'semi-sleeper': 0 },
    tripSeats: buildTripSeats(getLayoutSeats('tpl-001'), { seater: 850 }),
  },
  {
    id: 'trip-002',
    routeId: '2',
    route: 'Bangalore → Hyderabad',
    busId: 'bus-002',
    busNumber: 'KA53 MN 8899',
    layoutTemplateId: 'tpl-002',
    departureDate: '2026-02-22',
    departureTime: '20:00',
    arrivalTime: '04:45',
    status: 'ongoing',
    occupancy: 75,
    totalSeats: 24,
    bookedSeats: 18,
    pricing: { seater: 0, sleeper: 1500, 'semi-sleeper': 0 },
    tripSeats: buildTripSeats(getLayoutSeats('tpl-002'), { sleeper: 1500 }).map((s, i) =>
      i < 18 ? { ...s, status: 'booked' } : s
    ),
  },
  {
    id: 'trip-003',
    routeId: '3',
    route: 'Mumbai → Pune',
    busId: 'bus-004',
    busNumber: 'KA04 CD 7890',
    layoutTemplateId: 'tpl-003',
    departureDate: '2026-02-22',
    departureTime: '06:00',
    arrivalTime: '08:45',
    status: 'completed',
    occupancy: 93,
    totalSeats: 30,
    bookedSeats: 28,
    pricing: { seater: 450, sleeper: 0, 'semi-sleeper': 0 },
    tripSeats: buildTripSeats(getLayoutSeats('tpl-003'), { seater: 450 }).map((s, i) =>
      i < 28 ? { ...s, status: 'booked' } : s
    ),
  },
  {
    id: 'trip-004',
    routeId: '1',
    route: 'Chennai → Bangalore',
    busId: 'bus-008',
    busNumber: 'KA22 VW 4455',
    layoutTemplateId: 'tpl-005',
    departureDate: '2026-02-24',
    departureTime: '22:00',
    arrivalTime: '03:30',
    status: 'scheduled',
    occupancy: 15,
    totalSeats: 40,
    bookedSeats: 6,
    pricing: { seater: 900, sleeper: 0, 'semi-sleeper': 0 },
    tripSeats: buildTripSeats(getLayoutSeats('tpl-005'), { seater: 900 }).map((s, i) =>
      i < 6 ? { ...s, status: 'booked' } : i === 38 || i === 39 ? { ...s, status: 'blocked' } : s
    ),
  },
  {
    id: 'trip-005',
    routeId: '5',
    route: 'Chennai → Madurai',
    busId: 'bus-006',
    busNumber: 'KA41 RS 2211',
    layoutTemplateId: 'tpl-004',
    departureDate: '2026-02-25',
    departureTime: '19:30',
    arrivalTime: '02:45',
    status: 'scheduled',
    occupancy: 0,
    totalSeats: 24,
    bookedSeats: 0,
    pricing: { seater: 0, sleeper: 1200, 'semi-sleeper': 0 },
    tripSeats: buildTripSeats(getLayoutSeats('tpl-004'), { sleeper: 1200 }),
  },
  {
    id: 'trip-006',
    routeId: '6',
    route: 'Hyderabad → Vijayawada',
    busId: 'bus-004',
    busNumber: 'KA04 CD 7890',
    layoutTemplateId: 'tpl-003',
    departureDate: '2026-02-21',
    departureTime: '07:00',
    arrivalTime: '11:00',
    status: 'cancelled',
    occupancy: 0,
    totalSeats: 30,
    bookedSeats: 0,
    pricing: { seater: 500, sleeper: 0, 'semi-sleeper': 0 },
    tripSeats: buildTripSeats(getLayoutSeats('tpl-003'), { seater: 500 }),
  },
  {
    id: 'trip-007',
    routeId: '2',
    route: 'Bangalore → Hyderabad',
    busId: 'bus-006',
    busNumber: 'KA41 RS 2211',
    layoutTemplateId: 'tpl-004',
    departureDate: '2026-02-26',
    departureTime: '20:30',
    arrivalTime: '05:15',
    status: 'scheduled',
    occupancy: 33,
    totalSeats: 24,
    bookedSeats: 8,
    pricing: { seater: 0, sleeper: 1400, 'semi-sleeper': 0 },
    tripSeats: buildTripSeats(getLayoutSeats('tpl-004'), { sleeper: 1400 }).map((s, i) =>
      i < 8 ? { ...s, status: 'booked' } : s
    ),
  },
];

export default dummyTrips;
