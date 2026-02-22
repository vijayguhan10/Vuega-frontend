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
