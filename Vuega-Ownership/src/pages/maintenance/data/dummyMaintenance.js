/* ══════════════════════════════════════════════════════
   Dummy Maintenance Data
   ══════════════════════════════════════════════════════ */

/**
 * Compute maintenance status from dates & flags.
 *
 * Priority:
 *  1. Under Maintenance (explicit flag)
 *  2. Expired (insurance OR permit past due)
 *  3. Due Soon (nextServiceDue within 7 days)
 *  4. Healthy
 */
export const computeStatus = (record) => {
  if (record.isUnderMaintenance) return 'under-maintenance';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const insExpiry = new Date(record.insurance.expiryDate);
  const permitExpiry = new Date(record.permit.expiryDate);

  if (insExpiry < today || permitExpiry < today) return 'expired';

  const nextService = new Date(record.nextServiceDue);
  const diffDays = Math.ceil((nextService - today) / (1000 * 60 * 60 * 24));
  if (diffDays <= 7) return 'due-soon';

  return 'healthy';
};

/**
 * Check if a bus is eligible for trip creation.
 * Returns { eligible: boolean, reasons: string[] }
 *
 * // TODO: Replace with backend validation when API is ready
 */
export const checkTripEligibility = (record) => {
  const reasons = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (record.isUnderMaintenance) {
    reasons.push('Bus is currently under maintenance');
  }
  if (new Date(record.insurance.expiryDate) < today) {
    reasons.push('Insurance has expired');
  }
  if (new Date(record.permit.expiryDate) < today) {
    reasons.push('Permit has expired');
  }

  return { eligible: reasons.length === 0, reasons };
};

/** Generate unique id */
let _counter = 100;
export const generateId = () => `svc-${++_counter}`;
export const generateBreakdownId = () => `brk-${++_counter}`;

/* ── Dummy Records ── */
const dummyMaintenance = [
  {
    busId: 'bus-001',
    busNumber: 'KA01 AB 1234',
    isUnderMaintenance: false,
    lastServiceDate: '2026-01-15',
    nextServiceDue: '2026-04-15',
    insurance: {
      provider: 'ICICI Lombard',
      policyNumber: 'POL-2026-00123',
      expiryDate: '2026-12-31',
    },
    permit: {
      permitNumber: 'PRM-KA-78901',
      expiryDate: '2027-03-15',
    },
    serviceHistory: [
      { id: 'svc-001', date: '2026-01-15', description: 'Full engine service & oil change', cost: 12500, performedBy: 'QuickFit Garage' },
      { id: 'svc-002', date: '2025-10-10', description: 'Brake pad replacement', cost: 4800, performedBy: 'Rahul Auto Works' },
      { id: 'svc-003', date: '2025-07-20', description: 'AC compressor repair', cost: 8500, performedBy: 'CoolAir Services' },
    ],
    breakdownLogs: [
      { id: 'brk-001', date: '2025-11-05', description: 'Engine overheating on highway', resolved: true, resolvedDate: '2025-11-06', notes: 'Coolant leak fixed, radiator flushed' },
    ],
  },
  {
    busId: 'bus-002',
    busNumber: 'KA53 MN 8899',
    isUnderMaintenance: false,
    lastServiceDate: '2026-02-01',
    nextServiceDue: '2026-02-27',
    insurance: {
      provider: 'Bajaj Allianz',
      policyNumber: 'POL-2026-00456',
      expiryDate: '2026-09-15',
    },
    permit: {
      permitNumber: 'PRM-KA-56789',
      expiryDate: '2026-11-30',
    },
    serviceHistory: [
      { id: 'svc-004', date: '2026-02-01', description: 'Tyre rotation & alignment', cost: 3200, performedBy: 'MRF Service Center' },
      { id: 'svc-005', date: '2025-11-20', description: 'Transmission fluid change', cost: 6000, performedBy: 'QuickFit Garage' },
    ],
    breakdownLogs: [],
  },
  {
    busId: 'bus-003',
    busNumber: 'KA02 XY 5555',
    isUnderMaintenance: true,
    lastServiceDate: '2026-02-10',
    nextServiceDue: '2026-05-10',
    insurance: {
      provider: 'HDFC Ergo',
      policyNumber: 'POL-2026-00789',
      expiryDate: '2026-08-20',
    },
    permit: {
      permitNumber: 'PRM-KA-34567',
      expiryDate: '2026-12-01',
    },
    serviceHistory: [
      { id: 'svc-006', date: '2026-02-10', description: 'Suspension overhaul — ongoing', cost: 18000, performedBy: 'Ashok Leyland Service' },
    ],
    breakdownLogs: [
      { id: 'brk-002', date: '2026-02-08', description: 'Leaf spring snapped while loading', resolved: false, resolvedDate: null, notes: 'Awaiting spare parts' },
    ],
  },
  {
    busId: 'bus-004',
    busNumber: 'KA04 CD 7890',
    isUnderMaintenance: false,
    lastServiceDate: '2025-12-20',
    nextServiceDue: '2026-03-20',
    insurance: {
      provider: 'New India Assurance',
      policyNumber: 'POL-2025-01122',
      expiryDate: '2026-01-31',
    },
    permit: {
      permitNumber: 'PRM-KA-22334',
      expiryDate: '2026-06-15',
    },
    serviceHistory: [
      { id: 'svc-007', date: '2025-12-20', description: 'Annual comprehensive service', cost: 15000, performedBy: 'OEM Service Center' },
    ],
    breakdownLogs: [
      { id: 'brk-003', date: '2025-09-18', description: 'Flat tyre on route', resolved: true, resolvedDate: '2025-09-18', notes: 'Spare tyre mounted roadside, replaced later' },
    ],
  },
  {
    busId: 'bus-005',
    busNumber: 'KA19 PQ 3456',
    isUnderMaintenance: false,
    lastServiceDate: '2026-01-28',
    nextServiceDue: '2026-04-28',
    insurance: {
      provider: 'Tata AIG',
      policyNumber: 'POL-2026-03344',
      expiryDate: '2027-01-28',
    },
    permit: {
      permitNumber: 'PRM-KA-99887',
      expiryDate: '2027-01-01',
    },
    serviceHistory: [
      { id: 'svc-008', date: '2026-01-28', description: 'Oil change & filter replacement', cost: 3500, performedBy: 'QuickFit Garage' },
    ],
    breakdownLogs: [],
  },
  {
    busId: 'bus-006',
    busNumber: 'KA41 RS 2211',
    isUnderMaintenance: false,
    lastServiceDate: '2025-11-01',
    nextServiceDue: '2026-02-25',
    insurance: {
      provider: 'ICICI Lombard',
      policyNumber: 'POL-2025-05566',
      expiryDate: '2026-05-01',
    },
    permit: {
      permitNumber: 'PRM-KA-44556',
      expiryDate: '2026-10-31',
    },
    serviceHistory: [
      { id: 'svc-009', date: '2025-11-01', description: 'Brake drum resurfacing', cost: 5500, performedBy: 'Rahul Auto Works' },
      { id: 'svc-010', date: '2025-08-15', description: 'Clutch plate replacement', cost: 9200, performedBy: 'Ashok Leyland Service' },
    ],
    breakdownLogs: [
      { id: 'brk-004', date: '2025-12-25', description: 'Battery dead — could not start', resolved: true, resolvedDate: '2025-12-25', notes: 'Battery replaced on-site' },
      { id: 'brk-005', date: '2025-10-14', description: 'Fuel line leak', resolved: true, resolvedDate: '2025-10-15', notes: 'Fuel line resealed, tested OK' },
    ],
  },
  {
    busId: 'bus-007',
    busNumber: 'KA22 EF 6677',
    isUnderMaintenance: false,
    lastServiceDate: '2026-02-05',
    nextServiceDue: '2026-05-05',
    insurance: {
      provider: 'Bajaj Allianz',
      policyNumber: 'POL-2026-07788',
      expiryDate: '2027-02-05',
    },
    permit: {
      permitNumber: 'PRM-KA-66778',
      expiryDate: '2027-02-28',
    },
    serviceHistory: [
      { id: 'svc-011', date: '2026-02-05', description: 'Steering rack replacement', cost: 14000, performedBy: 'OEM Service Center' },
    ],
    breakdownLogs: [],
  },
  {
    busId: 'bus-008',
    busNumber: 'KA33 GH 4455',
    isUnderMaintenance: false,
    lastServiceDate: '2025-10-15',
    nextServiceDue: '2026-01-15',
    insurance: {
      provider: 'HDFC Ergo',
      policyNumber: 'POL-2025-09900',
      expiryDate: '2026-02-10',
    },
    permit: {
      permitNumber: 'PRM-KA-11223',
      expiryDate: '2026-02-15',
    },
    serviceHistory: [
      { id: 'svc-012', date: '2025-10-15', description: 'Electrical wiring check', cost: 2800, performedBy: 'QuickFit Garage' },
    ],
    breakdownLogs: [
      { id: 'brk-006', date: '2026-01-20', description: 'Alternator failure', resolved: true, resolvedDate: '2026-01-22', notes: 'Alternator replaced with new unit' },
    ],
  },
];

export default dummyMaintenance;
