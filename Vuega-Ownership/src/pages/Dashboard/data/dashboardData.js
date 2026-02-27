/* ══════════════════════════════════════════════════════
   Executive Dashboard — Mock Data
   Simulated aggregated analytics for company_admin role.
   Replace each section with real API calls when backend
   endpoints are ready.
   ══════════════════════════════════════════════════════ */

/* ── A. Executive Summary KPIs ── */
export const executiveKPIs = [
  {
    key: 'total_revenue',
    label: 'Total Revenue',
    value: '₹18,42,500',
    rawValue: 1842500,
    icon: 'revenue',
    trend: { value: '+12.4%', direction: 'up', label: 'vs last 30 days' },
    drillDownPath: '/analytics/revenue',
  },
  {
    key: 'today_revenue',
    label: "Today's Revenue",
    value: '₹1,24,800',
    rawValue: 124800,
    icon: 'todayRevenue',
    trend: { value: '+8.2%', direction: 'up', label: 'vs yesterday' },
    drillDownPath: '/analytics/revenue?range=today',
  },
  {
    key: 'avg_occupancy',
    label: 'Avg Occupancy',
    value: '74%',
    rawValue: 74,
    icon: 'occupancy',
    trend: { value: '+3.1%', direction: 'up', label: 'vs last month' },
    drillDownPath: '/analytics/occupancy',
  },
  {
    key: 'refund_pct',
    label: 'Refund %',
    value: '2.8%',
    rawValue: 2.8,
    icon: 'refund',
    trend: { value: '-0.4%', direction: 'down', label: 'vs last month' },
    drillDownPath: '/analytics/refunds',
  },
  {
    key: 'total_trips',
    label: 'Total Trips',
    value: '342',
    rawValue: 342,
    icon: 'trips',
    trend: { value: '+18', direction: 'up', label: 'vs last 30 days' },
    drillDownPath: '/trips',
  },
  {
    key: 'active_buses',
    label: 'Active Buses',
    value: '21',
    rawValue: 21,
    icon: 'bus',
    trend: { value: '3 under maintenance', direction: 'neutral', label: '' },
    drillDownPath: '/buses',
  },
  {
    key: 'maintenance_cost',
    label: 'Maintenance Cost',
    value: '₹2,35,000',
    rawValue: 235000,
    icon: 'maintenance',
    trend: { value: '-6.1%', direction: 'down', label: 'vs last month' },
    drillDownPath: '/maintenance',
  },
  {
    key: 'insurance_expiry',
    label: 'Insurance Expiring',
    value: '4',
    rawValue: 4,
    icon: 'insurance',
    trend: { value: 'within 30 days', direction: 'alert', label: '' },
    drillDownPath: '/maintenance?filter=insurance-expiry',
  },
];

/* ── B. Revenue Trend Data (30 days) ── */
export const revenueTrendData = {
  labels: [
    '27 Jan', '28 Jan', '29 Jan', '30 Jan', '31 Jan',
    '01 Feb', '02 Feb', '03 Feb', '04 Feb', '05 Feb',
    '06 Feb', '07 Feb', '08 Feb', '09 Feb', '10 Feb',
    '11 Feb', '12 Feb', '13 Feb', '14 Feb', '15 Feb',
    '16 Feb', '17 Feb', '18 Feb', '19 Feb', '20 Feb',
    '21 Feb', '22 Feb', '23 Feb', '24 Feb', '25 Feb',
  ],
  current: [
    52000, 61000, 58000, 64000, 55000,
    72000, 68000, 59000, 63000, 71000,
    67000, 74000, 69000, 61000, 58000,
    76000, 82000, 79000, 85000, 73000,
    69000, 77000, 84000, 88000, 91000,
    78000, 82000, 95000, 89000, 124800,
  ],
  previous: [
    48000, 53000, 51000, 57000, 49000,
    63000, 61000, 54000, 58000, 65000,
    59000, 67000, 62000, 55000, 52000,
    68000, 73000, 70000, 76000, 66000,
    62000, 70000, 75000, 79000, 83000,
    71000, 74000, 86000, 80000, 112000,
  ],
};

/* ── C. Route Performance ── */
export const routePerformance = [
  {
    id: 'r-001',
    route: 'Bangalore → Chennai',
    totalTrips: 62,
    revenue: 485000,
    avgOccupancy: 82,
    cancellationPct: 1.6,
    refundPct: 2.1,
  },
  {
    id: 'r-002',
    route: 'Bangalore → Hyderabad',
    totalTrips: 48,
    revenue: 412000,
    avgOccupancy: 76,
    cancellationPct: 2.1,
    refundPct: 3.0,
  },
  {
    id: 'r-003',
    route: 'Chennai → Coimbatore',
    totalTrips: 44,
    revenue: 298000,
    avgOccupancy: 71,
    cancellationPct: 3.4,
    refundPct: 4.2,
  },
  {
    id: 'r-004',
    route: 'Bangalore → Mysore',
    totalTrips: 56,
    revenue: 224000,
    avgOccupancy: 68,
    cancellationPct: 1.2,
    refundPct: 1.5,
  },
  {
    id: 'r-005',
    route: 'Hyderabad → Vijayawada',
    totalTrips: 38,
    revenue: 196000,
    avgOccupancy: 63,
    cancellationPct: 4.8,
    refundPct: 5.1,
  },
  {
    id: 'r-006',
    route: 'Bangalore → Goa',
    totalTrips: 32,
    revenue: 312000,
    avgOccupancy: 88,
    cancellationPct: 0.9,
    refundPct: 1.2,
  },
  {
    id: 'r-007',
    route: 'Mumbai → Pune',
    totalTrips: 42,
    revenue: 168000,
    avgOccupancy: 59,
    cancellationPct: 5.2,
    refundPct: 6.0,
  },
];

/* ── D. Risk & Alerts ── */
export const riskAlerts = [
  {
    id: 'risk-001',
    type: 'insurance_expiry',
    severity: 'critical',
    title: 'Insurance Expiring — KA01 AB 1234',
    description: 'Policy POL-2026-00123 expires on 28 Feb 2026',
    dueDate: '2026-02-28',
  },
  {
    id: 'risk-002',
    type: 'insurance_expiry',
    severity: 'critical',
    title: 'Insurance Expiring — KA04 CD 7890',
    description: 'Policy POL-2025-01122 expired on 31 Jan 2026',
    dueDate: '2026-01-31',
  },
  {
    id: 'risk-003',
    type: 'permit_expiry',
    severity: 'warning',
    title: 'Permit Expiring — TN09 XY 9876',
    description: 'Permit PRM-TN-44556 expires on 15 Mar 2026',
    dueDate: '2026-03-15',
  },
  {
    id: 'risk-004',
    type: 'high_cancellation',
    severity: 'warning',
    title: 'High Cancellation Rate — Mumbai → Pune',
    description: '5.2% cancellation rate in last 30 days (threshold: 3%)',
    dueDate: null,
  },
  {
    id: 'risk-005',
    type: 'breakdown_frequency',
    severity: 'warning',
    title: 'Frequent Breakdowns — KA41 RS 2211',
    description: '3 breakdowns in last 90 days',
    dueDate: null,
  },
  {
    id: 'risk-006',
    type: 'insurance_expiry',
    severity: 'info',
    title: 'Insurance Due — KA53 MN 8899',
    description: 'Policy POL-2026-00456 expires on 15 Sep 2026',
    dueDate: '2026-09-15',
  },
  {
    id: 'risk-007',
    type: 'permit_expiry',
    severity: 'info',
    title: 'Permit Renewal — KA02 XY 5555',
    description: 'Permit PRM-KA-34567 expires on 01 Dec 2026',
    dueDate: '2026-12-01',
  },
];

/* ── E. Recent Critical Activities (simulated audit log) ── */
export const recentActivities = [
  {
    id: 'act-001',
    action: 'Trip Cancelled — TR-2039 (Bangalore → Mumbai)',
    category: 'trip_cancellation',
    performedBy: 'Ramesh Kumar',
    role: 'operator',
    timestamp: '2026-02-25T16:45:00Z',
  },
  {
    id: 'act-002',
    action: 'Insurance Approved — KA01 AB 1234',
    category: 'insurance_approval',
    performedBy: 'Admin User',
    role: 'company_admin',
    timestamp: '2026-02-25T14:30:00Z',
  },
  {
    id: 'act-003',
    action: 'Bus Blocked — KA02 XY 5555 (Suspension Repair)',
    category: 'bus_blocked',
    performedBy: 'Suresh Reddy',
    role: 'operator',
    timestamp: '2026-02-24T11:15:00Z',
  },
  {
    id: 'act-004',
    action: 'Maintenance Approved — KA53 MN 8899 (Transmission)',
    category: 'maintenance_approval',
    performedBy: 'Admin User',
    role: 'company_admin',
    timestamp: '2026-02-24T09:00:00Z',
  },
  {
    id: 'act-005',
    action: 'Bus Unblocked — KA04 CD 7890',
    category: 'bus_unblocked',
    performedBy: 'Admin User',
    role: 'company_admin',
    timestamp: '2026-02-23T18:20:00Z',
  },
  {
    id: 'act-006',
    action: 'Trip Override — TR-2035 rescheduled by admin',
    category: 'trip_cancellation',
    performedBy: 'Admin User',
    role: 'company_admin',
    timestamp: '2026-02-23T10:45:00Z',
  },
  {
    id: 'act-007',
    action: 'Permit Approved — TN09 XY 9876',
    category: 'insurance_approval',
    performedBy: 'Admin User',
    role: 'company_admin',
    timestamp: '2026-02-22T15:30:00Z',
  },
];

/* ── Backend Endpoints Reference (for future integration) ──
   GET /api/owner/dashboard/kpis?range=30d
   GET /api/owner/dashboard/revenue-trend?range=30d&compare=true
   GET /api/owner/dashboard/route-performance?sort=revenue&range=30d
   GET /api/owner/dashboard/risk-alerts
   GET /api/owner/dashboard/recent-activities?limit=10
   ═══════════════════════════════════════════════════════════ */
