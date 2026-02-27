/**
 * ═══════════════════════════════════════════════════════════════
 *  SHARED REQUESTS DATA STORE
 *  Single source of truth for bus & route approval requests.
 *  Used by: BusApprovals, RouteApprovals, BusesTab, RoutesTab
 *  
 *  Uses useSyncExternalStore so all consumers re-render when
 *  data changes — actions in any tab/page are reflected everywhere.
 * ═══════════════════════════════════════════════════════════════
 */

// ── BUS APPROVAL REQUESTS ──────────────────────────────────────

const initialBusRequests = [
  {
    id: 'BR-001',
    companyId: 'C-101',
    companyName: 'SRS Travels Pvt Ltd',
    busNumber: 'KA-01-AB-1234',
    layoutType: '2+1 Sleeper',
    type: 'AC Sleeper',
    capacity: 36,
    route: 'Bangalore → Mumbai',
    submittedDate: 'Feb 16, 2026',
    currentBusCount: 10,
    busLimit: 15,
    status: 'Pending',
    riskLevel: 'Low',
    riskScore: 12,
    license: { licenseNumber: 'LIC-KA-2024-0451', validUntil: 'Dec 31, 2026', status: 'valid', daysRemaining: 318 },
    auditHistory: [
      { id: 'A-001', action: 'BUS_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 16, 2026 09:14 AM' },
    ],
  },
  {
    id: 'BR-002',
    companyId: 'C-102',
    companyName: 'KPN Travels',
    busNumber: 'TN-07-CD-5678',
    layoutType: '2+2 Seater',
    type: 'Non-AC Seater',
    capacity: 52,
    route: 'Chennai → Madurai',
    submittedDate: 'Feb 15, 2026',
    currentBusCount: 8,
    busLimit: 10,
    status: 'Pending',
    riskLevel: 'Medium',
    riskScore: 45,
    license: { licenseNumber: 'LIC-TN-2023-0892', validUntil: 'Mar 15, 2026', status: 'expiring', daysRemaining: 28 },
    auditHistory: [
      { id: 'A-002', action: 'BUS_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 15, 2026 02:30 PM' },
    ],
  },
  {
    id: 'BR-003',
    companyId: 'C-103',
    companyName: 'VRL Travels',
    busNumber: 'MH-12-EF-9101',
    layoutType: '2+1 AC Sleeper',
    type: 'Multi-Axle Volvo',
    capacity: 44,
    route: 'Pune → Goa',
    submittedDate: 'Feb 15, 2026',
    currentBusCount: 20,
    busLimit: 20,
    status: 'Pending',
    riskLevel: 'High',
    riskScore: 78,
    license: { licenseNumber: 'LIC-MH-2024-1103', validUntil: 'Jan 10, 2026', status: 'expired', daysRemaining: 0 },
    auditHistory: [
      { id: 'A-003', action: 'BUS_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 15, 2026 11:00 AM' },
      { id: 'A-004', action: 'LIMIT_OVERRIDE', performedBy: 'System', timestamp: 'Feb 15, 2026 11:01 AM', remarks: 'Operator has reached bus entitlement limit (20/20).' },
    ],
  },
  {
    id: 'BR-004',
    companyId: 'C-104',
    companyName: 'Orange Tours',
    busNumber: 'AP-09-GH-1122',
    layoutType: '2+2 Semi-Sleeper',
    type: 'AC Semi-Sleeper',
    capacity: 40,
    route: 'Vijayawada → Hyderabad',
    submittedDate: 'Feb 14, 2026',
    currentBusCount: 5,
    busLimit: 12,
    status: 'Approved',
    riskLevel: 'Low',
    riskScore: 8,
    license: { licenseNumber: 'LIC-AP-2025-0234', validUntil: 'Nov 30, 2026', status: 'valid', daysRemaining: 288 },
    approvalToken: { tokenId: 'TKN-8A3F-C901', issuedAt: 'Feb 14, 2026 03:00 PM', expiresAt: 'Feb 21, 2026 03:00 PM', state: 'consumed' },
    auditHistory: [
      { id: 'A-005', action: 'BUS_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 14, 2026 10:22 AM' },
      { id: 'A-006', action: 'BUS_APPROVED', performedBy: 'Admin (SA-001)', timestamp: 'Feb 14, 2026 03:00 PM' },
      { id: 'A-007', action: 'TOKEN_ISSUED', performedBy: 'System', timestamp: 'Feb 14, 2026 03:00 PM', metadata: { tokenId: 'TKN-8A3F-C901', tokenExpiry: 'Feb 21, 2026' } },
    ],
  },
  {
    id: 'BR-005',
    companyId: 'C-105',
    companyName: 'Neeta Travels',
    busNumber: 'GJ-05-IJ-3344',
    layoutType: '2+1 Seater',
    type: 'AC Sleeper',
    capacity: 36,
    route: 'Ahmedabad → Mumbai',
    submittedDate: 'Feb 13, 2026',
    currentBusCount: 7,
    busLimit: 10,
    status: 'Rejected',
    remarks: 'Incomplete documentation submitted.',
    riskLevel: 'High',
    riskScore: 72,
    license: { licenseNumber: 'LIC-GJ-2024-0567', validUntil: 'Sep 30, 2026', status: 'valid', daysRemaining: 226 },
    auditHistory: [
      { id: 'A-008', action: 'BUS_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 13, 2026 08:45 AM' },
      { id: 'A-009', action: 'BUS_REJECTED', performedBy: 'Admin (SA-001)', timestamp: 'Feb 13, 2026 04:12 PM', remarks: 'Incomplete documentation submitted.' },
    ],
  },
  {
    id: 'BR-006',
    companyId: 'C-101',
    companyName: 'SRS Travels Pvt Ltd',
    busNumber: 'KA-01-KL-5566',
    layoutType: '2+2 AC Seater',
    type: 'AC Seater',
    capacity: 48,
    route: 'Bangalore → Chennai',
    submittedDate: 'Feb 12, 2026',
    currentBusCount: 10,
    busLimit: 15,
    status: 'Approved',
    riskLevel: 'Low',
    riskScore: 12,
    license: { licenseNumber: 'LIC-KA-2024-0451', validUntil: 'Dec 31, 2026', status: 'valid', daysRemaining: 318 },
    approvalToken: { tokenId: 'TKN-4B7D-E205', issuedAt: 'Feb 12, 2026 11:30 AM', expiresAt: 'Feb 19, 2026 11:30 AM', state: 'active' },
    auditHistory: [
      { id: 'A-010', action: 'BUS_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 12, 2026 09:00 AM' },
      { id: 'A-011', action: 'BUS_APPROVED', performedBy: 'Admin (SA-001)', timestamp: 'Feb 12, 2026 11:30 AM' },
      { id: 'A-012', action: 'TOKEN_ISSUED', performedBy: 'System', timestamp: 'Feb 12, 2026 11:30 AM', metadata: { tokenId: 'TKN-4B7D-E205', tokenExpiry: 'Feb 19, 2026' } },
    ],
  },
  {
    id: 'BR-007',
    companyId: 'C-106',
    companyName: 'Parveen Travels',
    busNumber: 'KA-19-MN-7788',
    layoutType: '2+1 Sleeper',
    type: 'AC Sleeper',
    capacity: 36,
    route: 'Bangalore → Coimbatore',
    submittedDate: 'Feb 11, 2026',
    currentBusCount: 12,
    busLimit: 12,
    status: 'Pending',
    riskLevel: 'Critical',
    riskScore: 91,
    license: { licenseNumber: 'LIC-KA-2023-1290', validUntil: 'Apr 01, 2026', status: 'expiring', daysRemaining: 45 },
    auditHistory: [
      { id: 'A-013', action: 'BUS_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 11, 2026 07:15 AM' },
      { id: 'A-014', action: 'LIMIT_OVERRIDE', performedBy: 'System', timestamp: 'Feb 11, 2026 07:16 AM', remarks: 'Operator at 100% bus entitlement (12/12). License expiring in 45 days.' },
    ],
  },
]


// ── ROUTE APPROVAL REQUESTS ────────────────────────────────────

const initialRouteRequests = [
  {
    id: 'RR-001',
    companyId: 'C-101',
    companyName: 'SRS Travels Pvt Ltd',
    origin: 'Bangalore',
    destination: 'Mumbai',
    distance: '980 km',
    duration: '~14h',
    submittedDate: 'Feb 20, 2026',
    currentRouteCount: 22,
    routeLimit: 30,
    status: 'Pending',
    auditHistory: [
      { id: 'A-001', action: 'ROUTE_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 20, 2026 10:30 AM' },
    ],
  },
  {
    id: 'RR-002',
    companyId: 'C-102',
    companyName: 'KPN Travels',
    origin: 'Chennai',
    destination: 'Madurai',
    distance: '460 km',
    duration: '~7h',
    submittedDate: 'Feb 19, 2026',
    currentRouteCount: 12,
    routeLimit: 18,
    status: 'Pending',
    auditHistory: [
      { id: 'A-002', action: 'ROUTE_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 19, 2026 02:15 PM' },
    ],
  },
  {
    id: 'RR-003',
    companyId: 'C-103',
    companyName: 'VRL Travels',
    origin: 'Pune',
    destination: 'Goa',
    distance: '450 km',
    duration: '~8h',
    submittedDate: 'Feb 18, 2026',
    currentRouteCount: 30,
    routeLimit: 30,
    status: 'Pending',
    auditHistory: [
      { id: 'A-003', action: 'ROUTE_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 18, 2026 09:00 AM' },
      { id: 'A-004', action: 'LIMIT_FLAGGED', performedBy: 'System', timestamp: 'Feb 18, 2026 09:01 AM', remarks: 'Operator at route entitlement limit (30/30).' },
    ],
  },
  {
    id: 'RR-004',
    companyId: 'C-105',
    companyName: 'Neeta Travels',
    origin: 'Ahmedabad',
    destination: 'Mumbai',
    distance: '530 km',
    duration: '~8h',
    submittedDate: 'Feb 17, 2026',
    currentRouteCount: 14,
    routeLimit: 15,
    status: 'Approved',
    auditHistory: [
      { id: 'A-005', action: 'ROUTE_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 17, 2026 11:00 AM' },
      { id: 'A-006', action: 'ROUTE_APPROVED', performedBy: 'Admin (SA-001)', timestamp: 'Feb 17, 2026 03:45 PM' },
    ],
  },
  {
    id: 'RR-005',
    companyId: 'C-107',
    companyName: 'IntrCity SmartBus',
    origin: 'Delhi',
    destination: 'Jaipur',
    distance: '280 km',
    duration: '~5h',
    submittedDate: 'Feb 16, 2026',
    currentRouteCount: 38,
    routeLimit: 45,
    status: 'Approved',
    auditHistory: [
      { id: 'A-007', action: 'ROUTE_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 16, 2026 08:30 AM' },
      { id: 'A-008', action: 'ROUTE_APPROVED', performedBy: 'Admin (SA-001)', timestamp: 'Feb 16, 2026 12:00 PM' },
    ],
  },
  {
    id: 'RR-006',
    companyId: 'C-110',
    companyName: 'Abhibus Express',
    origin: 'Hyderabad',
    destination: 'Vijayawada',
    distance: '275 km',
    duration: '~4h 30m',
    submittedDate: 'Feb 15, 2026',
    currentRouteCount: 19,
    routeLimit: 25,
    status: 'Rejected',
    remarks: 'Route already served by multiple operators. Market saturation.',
    auditHistory: [
      { id: 'A-009', action: 'ROUTE_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 15, 2026 10:00 AM' },
      { id: 'A-010', action: 'ROUTE_REJECTED', performedBy: 'Admin (SA-001)', timestamp: 'Feb 15, 2026 04:30 PM', remarks: 'Route already served by multiple operators. Market saturation.' },
    ],
  },
  {
    id: 'RR-007',
    companyId: 'C-101',
    companyName: 'SRS Travels Pvt Ltd',
    origin: 'Bangalore',
    destination: 'Hyderabad',
    distance: '570 km',
    duration: '~9h',
    submittedDate: 'Feb 14, 2026',
    currentRouteCount: 22,
    routeLimit: 30,
    status: 'Approved',
    auditHistory: [
      { id: 'A-011', action: 'ROUTE_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 14, 2026 07:45 AM' },
      { id: 'A-012', action: 'ROUTE_APPROVED', performedBy: 'Admin (SA-001)', timestamp: 'Feb 14, 2026 02:00 PM' },
    ],
  },
  {
    id: 'RR-008',
    companyId: 'C-106',
    companyName: 'Parveen Travels',
    origin: 'Bangalore',
    destination: 'Coimbatore',
    distance: '365 km',
    duration: '~6h',
    submittedDate: 'Feb 13, 2026',
    currentRouteCount: 15,
    routeLimit: 15,
    status: 'Pending',
    auditHistory: [
      { id: 'A-013', action: 'ROUTE_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 13, 2026 09:30 AM' },
      { id: 'A-014', action: 'LIMIT_FLAGGED', performedBy: 'System', timestamp: 'Feb 13, 2026 09:31 AM', remarks: 'Operator at 100% route entitlement (15/15).' },
    ],
  },
  {
    id: 'RR-009',
    companyId: 'C-102',
    companyName: 'KPN Travels',
    origin: 'Trichy',
    destination: 'Chennai',
    distance: '330 km',
    duration: '~5h 30m',
    submittedDate: 'Feb 12, 2026',
    currentRouteCount: 12,
    routeLimit: 18,
    status: 'Rejected',
    remarks: 'Insufficient fleet size to support additional routes.',
    auditHistory: [
      { id: 'A-015', action: 'ROUTE_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 12, 2026 11:00 AM' },
      { id: 'A-016', action: 'ROUTE_REJECTED', performedBy: 'Admin (SA-001)', timestamp: 'Feb 12, 2026 05:00 PM', remarks: 'Insufficient fleet size to support additional routes.' },
    ],
  },
]


// ═══════════════════════════════════════════════════════════════
//  EXTERNAL STORE — Module-level reactive store
// ═══════════════════════════════════════════════════════════════

let busRequests = [...initialBusRequests]
let routeRequests = [...initialRouteRequests]
let listeners = new Set()

function emitChange() {
  listeners.forEach((l) => l())
}

// ── Public API ─────────────────────────────────────────────────

export const requestsStore = {
  // Subscribe / snapshot (for useSyncExternalStore)
  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getBusSnapshot() {
    return busRequests
  },
  getRouteSnapshot() {
    return routeRequests
  },

  // ── Bus mutations ──
  updateBusRequest(id, updater) {
    busRequests = busRequests.map((r) => (r.id === id ? updater(r) : r))
    emitChange()
  },

  // ── Route mutations ──
  updateRouteRequest(id, updater) {
    routeRequests = routeRequests.map((r) => (r.id === id ? updater(r) : r))
    emitChange()
  },
}
