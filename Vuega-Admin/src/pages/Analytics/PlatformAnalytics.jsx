import React, { useState, useMemo } from 'react'
import {
  FaBuilding,
  FaCheckCircle,
  FaBan,
  FaBus,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaArrowUp,
  FaArrowDown,
  FaShieldAlt,
} from 'react-icons/fa'
import { ChevronDown, Building2, ShieldCheck } from 'lucide-react'
import CompanyPerformanceChart from './components/CompanyPerformanceChart'
import RouteDistributionChart from './components/RouteDistributionChart'
import TripStatisticsChart from './components/TripStatisticsChart'
import RevenueOverviewChart from './components/RevenueOverviewChart'

// ═══════════════════════════════════════════════════════════════
//  SECURITY AWARENESS
// ═══════════════════════════════════════════════════════════════
// - This page requires SUPER_ADMIN role.
// - Must be wrapped in ProtectedRoute with JWT validation.
// - Analytics data is read-only; no state-change actions.
// - JWT middleware should verify token on every API call.
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
//  CLOUD CONTROL PLANE API ENDPOINTS (placeholders)
// ═══════════════════════════════════════════════════════════════
// GET  /api/control-plane/analytics/platform-summary
//        → Returns aggregated KPI metrics across all tenants
//        → Query params: ?dateRange=today|7d|30d|custom&startDate=&endDate=
// GET  /api/control-plane/analytics/company-performance
//        → Returns top operator performance comparison data
//        → Query params: ?dateRange=, ?limit=, ?companyId=
// GET  /api/control-plane/analytics/route-distribution
//        → Returns route category breakdown across all operators
//        → Query params: ?dateRange=, ?companyId=
// GET  /api/control-plane/analytics/trip-statistics
//        → Returns trip trend data over selected time range
//        → Query params: ?dateRange=, ?companyId=
// GET  /api/control-plane/analytics/revenue-trend
//        → Returns platform revenue trend data
//        → Query params: ?dateRange=, ?companyId=
// ═══════════════════════════════════════════════════════════════

/**
 * @typedef {Object} PlatformAnalytics
 * @property {Object}  kpis                    — Aggregated KPI metrics
 * @property {Array}   companyPerformance      — Top operator comparison data
 * @property {Array}   routeDistribution       — Route category breakdown
 * @property {Array}   tripStats               — Trip trend over time (Stage 2)
 * @property {Array}   revenueTrend            — Revenue trend over time (Stage 2)
 * @property {Array}   approvalTrend           — Approval/rejection trend (Stage 3)
 * @property {Array}   entitlementDistribution — Entitlement utilization (Stage 3)
 * @property {Array}   complianceDistribution  — Compliance status breakdown (Stage 3)
 */

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA — Platform-aggregated analytics
//  Will be replaced by API calls via useEffect
// ═══════════════════════════════════════════════════════════════
// TODO: Replace with:
//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       const res = await fetch('/api/control-plane/analytics/platform-summary', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await res.json();
//       setPlatformKpis(data);
//     };
//     fetchAnalytics();
//   }, [dateRange, companyFilter]);

const platformKpis = {
  totalCompanies: 48,
  activeCompanies: 35,
  suspendedCompanies: 5,
  totalBuses: 312,
  activeTripsToday: 87,
  platformRevenue: 12450000,
}

// TODO: Replace with GET /api/control-plane/analytics/company-performance
const companyPerformanceData = [
  { name: 'SRS Travels', activeTrips: 8, revenue: 285000, utilization: 82 },
  { name: 'KPN Travels', activeTrips: 5, revenue: 195000, utilization: 71 },
  { name: 'VRL Travels', activeTrips: 0, revenue: 0, utilization: 0 },
  { name: 'Orange Tours', activeTrips: 0, revenue: 0, utilization: 0 },
  { name: 'Neeta Travels', activeTrips: 3, revenue: 112000, utilization: 58 },
  { name: 'IntrCity', activeTrips: 12, revenue: 420000, utilization: 91 },
  { name: 'Abhibus', activeTrips: 9, revenue: 310000, utilization: 76 },
]

// TODO: Replace with GET /api/control-plane/analytics/route-distribution
const routeDistributionData = [
  { category: 'Intercity', count: 142 },
  { category: 'Intracity', count: 68 },
  { category: 'Contract', count: 34 },
  { category: 'Seasonal', count: 18 },
]

// TODO: Replace with GET /api/control-plane/analytics/trip-statistics
// Trip data is keyed by date range to simulate backend-driven filtering.
// In production, the selected dateRange is sent as a query param and the
// backend returns the appropriate time-series data.
const tripStatisticsDataByRange = {
  today: [
    { label: '6 AM', completed: 5, scheduled: 12, cancelled: 0 },
    { label: '8 AM', completed: 14, scheduled: 18, cancelled: 1 },
    { label: '10 AM', completed: 22, scheduled: 25, cancelled: 2 },
    { label: '12 PM', completed: 30, scheduled: 32, cancelled: 2 },
    { label: '2 PM', completed: 38, scheduled: 40, cancelled: 3 },
    { label: '4 PM', completed: 45, scheduled: 48, cancelled: 3 },
    { label: '6 PM', completed: 55, scheduled: 58, cancelled: 4 },
    { label: '8 PM', completed: 68, scheduled: 70, cancelled: 4 },
  ],
  '7d': [
    { label: 'Mon', completed: 78, scheduled: 92, cancelled: 6 },
    { label: 'Tue', completed: 65, scheduled: 80, cancelled: 8 },
    { label: 'Wed', completed: 82, scheduled: 95, cancelled: 5 },
    { label: 'Thu', completed: 71, scheduled: 88, cancelled: 7 },
    { label: 'Fri', completed: 90, scheduled: 105, cancelled: 4 },
    { label: 'Sat', completed: 110, scheduled: 120, cancelled: 3 },
    { label: 'Sun', completed: 95, scheduled: 108, cancelled: 5 },
  ],
  '30d': [
    { label: 'Week 1', completed: 480, scheduled: 560, cancelled: 32 },
    { label: 'Week 2', completed: 520, scheduled: 590, cancelled: 28 },
    { label: 'Week 3', completed: 510, scheduled: 575, cancelled: 35 },
    { label: 'Week 4', completed: 550, scheduled: 620, cancelled: 25 },
  ],
  custom: [
    { label: 'Jan', completed: 1820, scheduled: 2100, cancelled: 120 },
    { label: 'Feb', completed: 1950, scheduled: 2250, cancelled: 105 },
  ],
}

// TODO: Replace with GET /api/control-plane/analytics/revenue-trend
const revenueTrendDataByRange = {
  today: [
    { label: '6 AM', totalRevenue: 45000, bookingRevenue: 38000 },
    { label: '8 AM', totalRevenue: 125000, bookingRevenue: 105000 },
    { label: '10 AM', totalRevenue: 210000, bookingRevenue: 178000 },
    { label: '12 PM', totalRevenue: 320000, bookingRevenue: 270000 },
    { label: '2 PM', totalRevenue: 410000, bookingRevenue: 345000 },
    { label: '4 PM', totalRevenue: 485000, bookingRevenue: 408000 },
    { label: '6 PM', totalRevenue: 580000, bookingRevenue: 490000 },
    { label: '8 PM', totalRevenue: 695000, bookingRevenue: 588000 },
  ],
  '7d': [
    { label: 'Mon', totalRevenue: 850000, bookingRevenue: 720000 },
    { label: 'Tue', totalRevenue: 720000, bookingRevenue: 610000 },
    { label: 'Wed', totalRevenue: 920000, bookingRevenue: 780000 },
    { label: 'Thu', totalRevenue: 780000, bookingRevenue: 660000 },
    { label: 'Fri', totalRevenue: 1050000, bookingRevenue: 890000 },
    { label: 'Sat', totalRevenue: 1250000, bookingRevenue: 1060000 },
    { label: 'Sun', totalRevenue: 1100000, bookingRevenue: 935000 },
  ],
  '30d': [
    { label: 'Week 1', totalRevenue: 4800000, bookingRevenue: 4080000 },
    { label: 'Week 2', totalRevenue: 5200000, bookingRevenue: 4420000 },
    { label: 'Week 3', totalRevenue: 5100000, bookingRevenue: 4335000 },
    { label: 'Week 4', totalRevenue: 5500000, bookingRevenue: 4675000 },
  ],
  custom: [
    { label: 'Jan', totalRevenue: 18200000, bookingRevenue: 15470000 },
    { label: 'Feb', totalRevenue: 19500000, bookingRevenue: 16575000 },
  ],
}

// ═══════════════════════════════════════════════════════════════
//  FILTER OPTIONS
// ═══════════════════════════════════════════════════════════════

const dateRangeOptions = [
  { label: 'Today', value: 'today' },
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: 'Custom', value: 'custom' },
]

const companyFilterOptions = [
  { label: 'All Companies', value: 'all' },
  { label: 'SRS Travels', value: 'C-101' },
  { label: 'KPN Travels', value: 'C-102' },
  { label: 'VRL Travels', value: 'C-103' },
  { label: 'IntrCity SmartBus', value: 'C-107' },
  { label: 'Abhibus Express', value: 'C-110' },
]

// ═══════════════════════════════════════════════════════════════
//  KPI CARD CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const kpiCards = [
  {
    label: 'Total Registered Companies',
    value: platformKpis.totalCompanies,
    icon: FaBuilding,
    borderColor: 'border-t-accent',
    iconBg: 'bg-accent/30',
    trend: { value: '+6', direction: 'up', label: 'this month' },
  },
  {
    label: 'Active Companies',
    value: platformKpis.activeCompanies,
    icon: FaCheckCircle,
    borderColor: 'border-t-accent',
    iconBg: 'bg-accent/30',
    trend: { value: '+3', direction: 'up', label: 'this month' },
  },
  {
    label: 'Suspended Companies',
    value: platformKpis.suspendedCompanies,
    icon: FaBan,
    borderColor: 'border-t-alert',
    iconBg: 'bg-alert/10',
    textColor: 'text-alert',
    trend: { value: '+1', direction: 'up', label: 'this week' },
    isAlert: true,
  },
  {
    label: 'Total Buses Across Platform',
    value: platformKpis.totalBuses,
    icon: FaBus,
    borderColor: 'border-t-accent',
    iconBg: 'bg-accent/30',
    trend: { value: '+24', direction: 'up', label: 'this month' },
  },
  {
    label: 'Active Trips (Today)',
    value: platformKpis.activeTripsToday,
    icon: FaMapMarkerAlt,
    borderColor: 'border-t-accent',
    iconBg: 'bg-accent/30',
    trend: { value: '+12', direction: 'up', label: 'vs yesterday' },
  },
  {
    label: 'Platform Revenue',
    value: `₹${(platformKpis.platformRevenue / 100000).toFixed(1)}L`,
    icon: FaRupeeSign,
    borderColor: 'border-t-secondary',
    iconBg: 'bg-secondary',
    trend: { value: '+18%', direction: 'up', label: 'this month' },
  },
]

// ═══════════════════════════════════════════════════════════════
//  PLATFORM ANALYTICS COMPONENT
// ═══════════════════════════════════════════════════════════════

const PlatformAnalytics = () => {
  // --- Filter State (backend-ready, state-only) ---
  const [dateRange, setDateRange] = useState('30d')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false)
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false)

  // Close dropdowns on outside click
  const handleDateSelect = (value) => {
    setDateRange(value)
    setDateDropdownOpen(false)
  }

  const handleCompanySelect = (value) => {
    setCompanyFilter(value)
    setCompanyDropdownOpen(false)
  }

  const activeDateLabel = dateRangeOptions.find((o) => o.value === dateRange)?.label || 'Select'
  const activeCompanyLabel = companyFilterOptions.find((o) => o.value === companyFilter)?.label || 'All Companies'

  // --- Date-range-driven data selection ---
  // In production, dateRange and companyFilter are sent as query params
  // to the Control Plane analytics API. Here we simulate by selecting
  // the appropriate mock dataset keyed by dateRange.
  const tripStatsData = useMemo(
    () => tripStatisticsDataByRange[dateRange] || tripStatisticsDataByRange['30d'],
    [dateRange]
  )
  const revenueTrendData = useMemo(
    () => revenueTrendDataByRange[dateRange] || revenueTrendDataByRange['30d'],
    [dateRange]
  )

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header with Filters ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-text tracking-tight">
            Platform Analytics
          </h1>
          <p className="text-sm text-text-muted">
            System-wide performance, compliance, and utilization intelligence
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Date Range Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setDateDropdownOpen(!dateDropdownOpen)
                setCompanyDropdownOpen(false)
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-text bg-white border border-border rounded-lg hover:bg-[#FAFAFA] transition-colors"
            >
              <span>Range: {activeDateLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${dateDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dateDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-primary rounded-lg border border-border shadow-lg z-30 py-1">
                {dateRangeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleDateSelect(opt.value)}
                    className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                      dateRange === opt.value
                        ? 'bg-accent/20 text-text'
                        : 'text-text-muted hover:bg-[#F5F5F4] hover:text-text'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Company Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setCompanyDropdownOpen(!companyDropdownOpen)
                setDateDropdownOpen(false)
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-text bg-white border border-border rounded-lg hover:bg-[#FAFAFA] transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-text-muted" />
              <span>{activeCompanyLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${companyDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {companyDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-primary rounded-lg border border-border shadow-lg z-30 py-1">
                {companyFilterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleCompanySelect(opt.value)}
                    className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                      companyFilter === opt.value
                        ? 'bg-accent/20 text-text'
                        : 'text-text-muted hover:bg-[#F5F5F4] hover:text-text'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
           SECTION 1 — KPI Summary Strip
           ══════════════════════════════════════════════════════════ */}
      {/* Data source: GET /api/control-plane/analytics/platform-summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpiCards.map((card) => {
          const IconComponent = card.icon
          return (
            <div
              key={card.label}
              className={`
                bg-primary rounded-xl border border-border
                shadow-sm p-6 flex flex-col gap-4
                border-t-[3px] ${card.borderColor}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    {card.label}
                  </p>
                  <h3
                    className={`text-2xl font-bold ${card.textColor || 'text-text'}`}
                  >
                    {card.value}
                  </h3>
                </div>
                <div
                  className={`p-2.5 rounded-lg ${card.iconBg} flex items-center justify-center`}
                >
                  <IconComponent
                    size={20}
                    className={card.isAlert ? 'text-alert' : 'text-text'}
                  />
                </div>
              </div>
              {card.trend && (
                <div className="flex items-center gap-2">
                  {card.trend.direction === 'up' ? (
                    <FaArrowUp size={14} className={card.isAlert ? 'text-alert' : 'text-text-muted'} />
                  ) : (
                    <FaArrowDown size={14} className="text-text-muted" />
                  )}
                  <span className={`text-xs font-semibold ${card.isAlert ? 'text-alert' : 'text-text'}`}>
                    {card.trend.value}
                  </span>
                  <span className="text-xs text-text-muted">
                    {card.trend.label}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════
           SECTION 2 — Analytics Charts (Stage 1)
           ══════════════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-text">
            Performance & Distribution
          </h2>
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
            <FaShieldAlt className="w-3 h-3" />
            <span>Platform-aggregated from Control Plane analytics</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Chart 1: Company Performance Comparison (BarChart) */}
          <CompanyPerformanceChart data={companyPerformanceData} />

          {/* Chart 2: Route Distribution Overview (PieChart / Donut) */}
          <RouteDistributionChart data={routeDistributionData} />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
           SECTION 3 — Trip Statistics & Revenue Overview (Stage 2)
           ══════════════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-text">
            Trend Analysis
          </h2>
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
            <FaShieldAlt className="w-3 h-3" />
            <span>Filtered by: {activeDateLabel}{companyFilter !== 'all' ? ` · ${activeCompanyLabel}` : ''}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Chart 3: Trip Statistics (LineChart) */}
          <TripStatisticsChart data={tripStatsData} dateRangeLabel={activeDateLabel} />

          {/* Chart 4: Revenue Overview (AreaChart) */}
          <RevenueOverviewChart data={revenueTrendData} dateRangeLabel={activeDateLabel} />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
           FOOTER — Governance notice
           ══════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-center gap-2 py-2 text-[10px] text-text-muted">
        <FaShieldAlt className="w-3 h-3" />
        <span>All analytics data is read-only and aggregated from distributed tenant services</span>
      </div>
    </div>
  )
}

export default PlatformAnalytics
