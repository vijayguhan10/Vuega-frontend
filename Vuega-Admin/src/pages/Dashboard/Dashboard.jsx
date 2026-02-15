

import React, { useState } from 'react'
import {
  Building2,
  CheckCircle,
  Ban,
  Bus,
  MapPin,
  IndianRupee,
  Clock,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA — Will be replaced by API calls via useEffect
// ═══════════════════════════════════════════════════════════════
// TODO: Replace with:
//   useEffect(() => {
//     const fetchSummary = async () => {
//       const res = await fetch('/api/control-plane/dashboard/summary', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await res.json();
//       setDashboardSummary(data);
//     };
//     fetchSummary();
//   }, []);

const dashboardSummary = {
  totalCompanies: 48,
  activeCompanies: 35,
  suspendedCompanies: 5,
  totalBuses: 312,
  activeTrips: 87,
  platformRevenue: 12450000,
  pendingCompanyRequests: 8,
  pendingBusRequests: 14,
}

// TODO: Replace with GET /api/control-plane/dashboard/recent-requests
const recentRequests = [
  {
    id: 1,
    companyName: 'SRS Travels Pvt Ltd',
    requestType: 'Company Registration',
    submittedDate: 'Feb 14, 2026',
    status: 'Pending',
  },
  {
    id: 2,
    companyName: 'KPN Travels',
    requestType: 'Bus Approval',
    submittedDate: 'Feb 13, 2026',
    status: 'Approved',
  },
  {
    id: 3,
    companyName: 'Parveen Travels',
    requestType: 'Bus Approval',
    submittedDate: 'Feb 13, 2026',
    status: 'Pending',
  },
  {
    id: 4,
    companyName: 'Orange Tours',
    requestType: 'Company Registration',
    submittedDate: 'Feb 12, 2026',
    status: 'Rejected',
  },
  {
    id: 5,
    companyName: 'VRL Travels',
    requestType: 'Bus Approval',
    submittedDate: 'Feb 12, 2026',
    status: 'Approved',
  },
  {
    id: 6,
    companyName: 'Neeta Travels',
    requestType: 'Company Registration',
    submittedDate: 'Feb 11, 2026',
    status: 'Pending',
  },
]

// ═══════════════════════════════════════════════════════════════
//  METRIC CARD CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const metricCards = [
  {
    label: 'Total Registered Companies',
    value: dashboardSummary.totalCompanies,
    icon: Building2,
    borderColor: 'border-t-vuega-accent',
    iconBg: 'bg-vuega-accent/30',
    trend: { value: '+6', direction: 'up', label: 'this month' },
  },
  {
    label: 'Active Companies',
    value: dashboardSummary.activeCompanies,
    icon: CheckCircle,
    borderColor: 'border-t-vuega-accent',
    iconBg: 'bg-vuega-accent/30',
    trend: { value: '+3', direction: 'up', label: 'this month' },
  },
  {
    label: 'Suspended Companies',
    value: dashboardSummary.suspendedCompanies,
    icon: Ban,
    borderColor: 'border-t-vuega-alert',
    iconBg: 'bg-vuega-alert/10',
    textColor: 'text-vuega-alert',
    trend: { value: '+1', direction: 'up', label: 'this week' },
    isAlert: true,
  },
  {
    label: 'Total Buses Across Platform',
    value: dashboardSummary.totalBuses,
    icon: Bus,
    borderColor: 'border-t-vuega-accent',
    iconBg: 'bg-vuega-accent/30',
    trend: { value: '+24', direction: 'up', label: 'this month' },
  },
  {
    label: 'Active Trips (Today)',
    value: dashboardSummary.activeTrips,
    icon: MapPin,
    borderColor: 'border-t-vuega-accent',
    iconBg: 'bg-vuega-accent/30',
    trend: { value: '+12', direction: 'up', label: 'vs yesterday' },
  },
  {
    label: 'Platform Revenue',
    value: `₹${(dashboardSummary.platformRevenue / 100000).toFixed(1)}L`,
    icon: IndianRupee,
    borderColor: 'border-t-vuega-secondary',
    iconBg: 'bg-vuega-secondary',
    trend: { value: '+18%', direction: 'up', label: 'this month' },
  },
  {
    label: 'Pending Company Requests',
    value: dashboardSummary.pendingCompanyRequests,
    icon: Clock,
    borderColor: 'border-t-vuega-secondary',
    iconBg: 'bg-vuega-secondary',
    trend: { value: '+2', direction: 'up', label: 'today' },
  },
  {
    label: 'Pending Bus Requests',
    value: dashboardSummary.pendingBusRequests,
    icon: ClipboardList,
    borderColor: 'border-t-vuega-secondary',
    iconBg: 'bg-vuega-secondary',
    trend: { value: '-3', direction: 'down', label: 'this week' },
  },
]

// ═══════════════════════════════════════════════════════════════
//  ANALYTICS CHART CONTAINERS
// ═══════════════════════════════════════════════════════════════
// TODO: Integrate Recharts or Chart.js for actual visualizations
// Backend endpoints:
//   GET /api/control-plane/analytics/companies
//   GET /api/control-plane/analytics/routes
//   GET /api/control-plane/analytics/trips
//   GET /api/control-plane/analytics/revenue

const analyticsCharts = [
  { title: 'Company Performance Comparison', icon: BarChart3 },
  { title: 'Route Distribution Overview', icon: PieChart },
  { title: 'Trip Statistics', icon: Activity },
  { title: 'Revenue Overview', icon: TrendingUp },
]

// ═══════════════════════════════════════════════════════════════
//  HELPER: Status Badge
// ═══════════════════════════════════════════════════════════════

const getStatusBadge = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-vuega-secondary text-vuega-text'
    case 'Approved':
      return 'bg-vuega-accent text-vuega-text'
    case 'Rejected':
      return 'bg-vuega-alert/10 text-vuega-alert'
    default:
      return 'bg-vuega-surface text-vuega-text'
  }
}

// ═══════════════════════════════════════════════════════════════
//  DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════

const Dashboard = () => {
  // TODO: Replace with API-driven state
  // const [summary, setSummary] = useState(null);
  // const [requests, setRequests] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  const [activeRequestTab, setActiveRequestTab] = useState('all')

  // Filter logic separated from JSX for performance
  const filteredRequests =
    activeRequestTab === 'all'
      ? recentRequests
      : recentRequests.filter(
        (r) => r.status.toLowerCase() === activeRequestTab
      )

  return (
    <div className="flex flex-col gap-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-vuega-text tracking-tight">
          Platform Overview
        </h1>
        <p className="text-sm text-vuega-text-muted">
          Governance dashboard for the centralized control plane. Monitor all
          registered operators, approvals, and platform-wide analytics.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════
           SECTION 1 — Metric Cards
           ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((card) => {
          const IconComponent = card.icon
          return (
            <div
              key={card.label}
              className={`
                bg-vuega-primary rounded-xl border border-vuega-border
                shadow-sm p-6 flex flex-col gap-4
                border-t-[3px] ${card.borderColor}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-vuega-text-muted uppercase tracking-wider">
                    {card.label}
                  </p>
                  <h3
                    className={`text-2xl font-bold ${card.textColor || 'text-vuega-text'
                      }`}
                  >
                    {card.value}
                  </h3>
                </div>
                <div
                  className={`p-2.5 rounded-lg ${card.iconBg} flex items-center justify-center`}
                >
                  <IconComponent
                    size={20}
                    className={card.isAlert ? 'text-vuega-alert' : 'text-vuega-text'}
                  />
                </div>
              </div>
              {card.trend && (
                <div className="flex items-center gap-2">
                  {card.trend.direction === 'up' ? (
                    <TrendingUp size={14} className={card.isAlert ? 'text-vuega-alert' : 'text-vuega-text-muted'} />
                  ) : (
                    <TrendingDown size={14} className="text-vuega-text-muted" />
                  )}
                  <span className={`text-xs font-semibold ${card.isAlert ? 'text-vuega-alert' : 'text-vuega-text'}`}>
                    {card.trend.value}
                  </span>
                  <span className="text-xs text-vuega-text-muted">
                    {card.trend.label}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════
           SECTION 2 — Recent Requests
           ══════════════════════════════════════════════════════════ */}
      {/* TODO: Replace mock data with GET /api/control-plane/dashboard/recent-requests */}
      <div className="bg-vuega-primary rounded-xl border border-vuega-border shadow-sm">
        {/* Section Header */}
        <div className="px-6 py-5 border-b border-vuega-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-vuega-text">
              Recent Requests
            </h2>
            <p className="text-xs text-vuega-text-muted mt-0.5">
              Latest company registrations and bus approval submissions
            </p>
          </div>
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-vuega-surface rounded-lg p-1 border border-vuega-border">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveRequestTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${activeRequestTab === tab
                  ? 'bg-vuega-primary text-vuega-text shadow-sm'
                  : 'text-vuega-text-muted hover:text-vuega-text'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-vuega-surface border-b border-vuega-border">
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-vuega-text-muted">
                  Company Name
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-vuega-text-muted">
                  Request Type
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-vuega-text-muted">
                  Submitted Date
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-vuega-text-muted">
                  Status
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-vuega-text-muted text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vuega-border">
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-vuega-surface transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-vuega-text">
                      {request.companyName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-vuega-text-muted">
                      {request.requestType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-vuega-text-muted">
                      {request.submittedDate}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadge(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-1 text-xs font-medium text-vuega-text-muted hover:text-vuega-text transition-colors">
                      View
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-vuega-border bg-vuega-surface flex justify-between items-center">
          <span className="text-xs text-vuega-text-muted">
            Showing {filteredRequests.length} of {recentRequests.length} requests
          </span>
          <button className="text-xs font-semibold text-vuega-text hover:underline">
            View All Requests
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
           SECTION 3 — Analytics Preview
           ══════════════════════════════════════════════════════════ */}
      {/* TODO: Replace with Recharts or Chart.js integration */}
      {/* Backend: GET /api/control-plane/analytics/overview */}
      <div>
        <h2 className="text-lg font-bold text-vuega-text mb-4">
          Analytics Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {analyticsCharts.map((chart) => {
            const ChartIcon = chart.icon
            return (
              <div
                key={chart.title}
                className="bg-vuega-primary rounded-xl border border-vuega-border shadow-sm p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-vuega-secondary">
                    <ChartIcon size={18} className="text-vuega-text" />
                  </div>
                  <h3 className="text-sm font-bold text-vuega-text">
                    {chart.title}
                  </h3>
                </div>
                {/* Chart Placeholder */}
                <div className="h-52 rounded-lg bg-vuega-surface border border-vuega-border flex items-center justify-center">
                  {/* TODO: Integrate Recharts or Chart.js here */}
                  <div className="flex flex-col items-center gap-2">
                    <ChartIcon size={32} className="text-vuega-border" />
                    <span className="text-xs text-vuega-text-muted">
                      Chart integration pending
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Platform Health Footer ── */}
      {/*
        FUTURE ENHANCEMENTS:
        - WebSocket heartbeat monitoring panel
        - License expiry countdown alerts
        - Role-based access control enforcement status
        - JWT validation middleware integration
        - Session expiry handling with auto-redirect
        - Audit logging viewer for all Super Admin actions
      */}
      <div className="bg-vuega-secondary/50 rounded-xl border border-vuega-border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs font-medium text-vuega-text">
            All Systems Operational
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-xs text-vuega-text-muted">
            Control Plane: <span className="font-medium text-vuega-text">Online</span>
          </span>
          <span className="text-xs text-vuega-text-muted">
            Data Plane: <span className="font-medium text-vuega-text">Connected</span>
          </span>
          <span className="text-xs text-vuega-text-muted">
            Last Sync: <span className="font-medium text-vuega-text">2 min ago</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
