import React, { useState, useMemo, useEffect, useRef } from 'react'
import { FaShieldAlt } from 'react-icons/fa'
import { ChevronDown, Building2, TrendingUp, Route, Bus, IndianRupee } from 'lucide-react'
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
 * @property {Array}   companyPerformance      — Top operator comparison data
 * @property {Array}   routeDistribution       — Route category breakdown
 * @property {Array}   tripStats               — Trip trend over time
 * @property {Array}   revenueTrend            — Revenue trend over time
 */

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA — Platform analytics
//  Will be replaced by API calls via useEffect
// ═══════════════════════════════════════════════════════════════

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
//  PLATFORM ANALYTICS COMPONENT
// ═══════════════════════════════════════════════════════════════

const PlatformAnalytics = () => {
  // --- Filter State (backend-ready, state-only) ---
  const [dateRange, setDateRange] = useState('30d')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false)
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false)

  // Refs for closing dropdowns on outside click
  const dateRef = useRef(null)
  const companyRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) setDateDropdownOpen(false)
      if (companyRef.current && !companyRef.current.contains(e.target)) setCompanyDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
  const tripStatsData = useMemo(
    () => tripStatisticsDataByRange[dateRange] || tripStatisticsDataByRange['30d'],
    [dateRange]
  )
  const revenueTrendData = useMemo(
    () => revenueTrendDataByRange[dateRange] || revenueTrendDataByRange['30d'],
    [dateRange]
  )

  // --- Computed Insights for Summary Strip ---
  const insights = useMemo(() => {
    const totalTrips = tripStatsData.reduce((sum, d) => sum + d.completed, 0)
    const totalScheduled = tripStatsData.reduce((sum, d) => sum + d.scheduled, 0)
    const completionRate = totalScheduled > 0 ? ((totalTrips / totalScheduled) * 100).toFixed(1) : 0
    const totalRevenue = revenueTrendData.reduce((sum, d) => sum + d.totalRevenue, 0)
    const avgRevenuePerDay = revenueTrendData.length > 0 ? totalRevenue / revenueTrendData.length : 0
    const totalRoutes = routeDistributionData.reduce((sum, d) => sum + d.count, 0)
    const topOperator = [...companyPerformanceData].sort((a, b) => b.revenue - a.revenue)[0]
    return { totalTrips, completionRate, totalRevenue, avgRevenuePerDay, totalRoutes, topOperator }
  }, [tripStatsData, revenueTrendData])

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header with Filters ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-text tracking-tight">
            Platform Analytics
          </h1>
          <p className="text-sm text-text-muted">
            Company performance, route distribution, trip statistics, and revenue insights
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Date Range Filter */}
          <div className="relative" ref={dateRef}>
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
          <div className="relative" ref={companyRef}>
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
           ANALYTICS SUMMARY STRIP — Computed Insights
           ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-primary rounded-xl border border-border shadow-sm px-5 py-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/20">
            <TrendingUp className="w-4 h-4 text-text" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Trips Completed</span>
            <span className="text-lg font-bold text-text">{insights.totalTrips.toLocaleString()}</span>
            <span className="text-[10px] text-text-muted">{insights.completionRate}% completion rate</span>
          </div>
        </div>
        <div className="bg-primary rounded-xl border border-border shadow-sm px-5 py-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary">
            <IndianRupee className="w-4 h-4 text-text" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Avg Revenue / Period</span>
            <span className="text-lg font-bold text-text">₹{(insights.avgRevenuePerDay / 100000).toFixed(1)}L</span>
            <span className="text-[10px] text-text-muted">per {dateRange === 'today' ? 'hour' : dateRange === '7d' ? 'day' : 'week'}</span>
          </div>
        </div>
        <div className="bg-primary rounded-xl border border-border shadow-sm px-5 py-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/20">
            <Route className="w-4 h-4 text-text" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Total Routes</span>
            <span className="text-lg font-bold text-text">{insights.totalRoutes}</span>
            <span className="text-[10px] text-text-muted">across all categories</span>
          </div>
        </div>
        <div className="bg-primary rounded-xl border border-border shadow-sm px-5 py-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary">
            <Bus className="w-4 h-4 text-text" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Top Operator</span>
            <span className="text-lg font-bold text-text">{insights.topOperator?.name || '—'}</span>
            <span className="text-[10px] text-text-muted">{insights.topOperator ? `${insights.topOperator.utilization}% utilization` : ''}</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
           SECTION 1 — Company Performance & Route Distribution
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
          <div className="w-full">
            <CompanyPerformanceChart data={companyPerformanceData} />
          </div>

          {/* Chart 2: Route Distribution Overview (PieChart / Donut) */}
          <div className="w-full">
            <RouteDistributionChart data={routeDistributionData} />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
           SECTION 2 — Trip Statistics & Revenue Overview
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
          <div className="w-full">
            <TripStatisticsChart data={tripStatsData} dateRangeLabel={activeDateLabel} />
          </div>

          {/* Chart 4: Revenue Overview (AreaChart) */}
          <div className="w-full">
            <RevenueOverviewChart data={revenueTrendData} dateRangeLabel={activeDateLabel} />
          </div>
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
