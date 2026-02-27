import React, { useState, useMemo, useEffect, useRef } from 'react'

import { FaShieldAlt } from 'react-icons/fa'
import { ChevronDown, Building2 } from 'lucide-react'



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
  const [customRange, setCustomRange] = useState({ start: '', end: '' })
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
    if (value !== 'custom') {
      setCustomRange({ start: '', end: '' })
    }
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
          <p className="text-text-muted">
            Infrastructure/server-level and route-based analytics across the platform
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
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-text bg-primary border border-border rounded-lg hover:bg-secondary transition-colors"
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
                        : 'text-text-muted hover:bg-secondary hover:text-text'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
            {/* Custom Range Picker */}
            {dateRange === 'custom' && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="date"
                  value={customRange.start}
                  onChange={e => setCustomRange(r => ({ ...r, start: e.target.value }))}
                  className="border border-border rounded px-2 py-1 text-xs"
                  placeholder="Start date"
                  max={customRange.end || undefined}
                />
                <span className="text-xs">to</span>
                <input
                  type="date"
                  value={customRange.end}
                  onChange={e => setCustomRange(r => ({ ...r, end: e.target.value }))}
                  className="border border-border rounded px-2 py-1 text-xs"
                  placeholder="End date"
                  min={customRange.start || undefined}
                />
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
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-text bg-primary border border-border rounded-lg hover:bg-secondary transition-colors"
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
                        : 'text-text-muted hover:bg-secondary hover:text-text'
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
