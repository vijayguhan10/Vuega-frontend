
import React, { useState } from 'react'
import Table from '../../components/Common/Table'
import {
  FaBuilding,
  FaCheckCircle,
  FaBan,
  FaBus,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaClock,
  FaClipboardList,
  FaArrowUp,
  FaArrowDown,
  FaChartBar,
  FaChartPie,
  FaHeartbeat,
  FaArrowRight,
  FaExclamationTriangle,
} from 'react-icons/fa'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts'

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA — Will be replaced by API calls via useEffect
// ═══════════════════════════════════════════════════════════════

const companyPerformanceData = [
  { name: 'SRS', revenue: 4000, trips: 240 },
  { name: 'KPN', revenue: 3000, trips: 139 },
  { name: 'VRL', revenue: 2000, trips: 980 },
  { name: 'Orange', revenue: 2780, trips: 390 },
  { name: 'Neeta', revenue: 1890, trips: 480 },
]

const routeDistributionData = [
  { name: 'Intercity', value: 400 },
  { name: 'Luxury', value: 300 },
  { name: 'Sleeper', value: 300 },
  { name: 'Shuttle', value: 200 },
]

const tripStatsData = [
  { time: '06:00', completed: 40, cancelled: 2 },
  { time: '09:00', completed: 80, cancelled: 5 },
  { time: '12:00', completed: 60, cancelled: 1 },
  { time: '15:00', completed: 90, cancelled: 3 },
  { time: '18:00', completed: 100, cancelled: 4 },
  { time: '21:00', completed: 70, cancelled: 2 },
]

const revenueData = [
  { date: 'Mon', amount: 4000 },
  { date: 'Tue', amount: 3000 },
  { date: 'Wed', amount: 5000 },
  { date: 'Thu', amount: 2780 },
  { date: 'Fri', amount: 6890 },
  { date: 'Sat', amount: 8390 },
  { date: 'Sun', amount: 7490 },
]

const COLORS = ['#000000', '#6B7280', '#C6EDFF', '#FFFADF']


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
    icon: FaBuilding,
    borderColor: 'border-t-accent',
    iconBg: 'bg-accent/30',
    trend: { value: '+6', direction: 'up', label: 'this month' },
  },
  {
    label: 'Active Companies',
    value: dashboardSummary.activeCompanies,
    icon: FaCheckCircle,
    borderColor: 'border-t-accent',
    iconBg: 'bg-accent/30',
    trend: { value: '+3', direction: 'up', label: 'this month' },
  },
  {
    label: 'Suspended Companies',
    value: dashboardSummary.suspendedCompanies,
    icon: FaBan,
    borderColor: 'border-t-alert',
    iconBg: 'bg-alert/10',
    textColor: 'text-alert',
    trend: { value: '+1', direction: 'up', label: 'this week' },
    isAlert: true,
  },
  {
    label: 'Total Buses Across Platform',
    value: dashboardSummary.totalBuses,
    icon: FaBus,
    borderColor: 'border-t-accent',
    iconBg: 'bg-accent/30',
    trend: { value: '+24', direction: 'up', label: 'this month' },
  },
  {
    label: 'Active Trips (Today)',
    value: dashboardSummary.activeTrips,
    icon: FaMapMarkerAlt,
    borderColor: 'border-t-accent',
    iconBg: 'bg-accent/30',
    trend: { value: '+12', direction: 'up', label: 'vs yesterday' },
  },
  {
    label: 'Platform Revenue',
    value: `₹${(dashboardSummary.platformRevenue / 100000).toFixed(1)}L`,
    icon: FaRupeeSign,
    borderColor: 'border-t-secondary',
    iconBg: 'bg-secondary',
    trend: { value: '+18%', direction: 'up', label: 'this month' },
  },
  {
    label: 'Pending Company Requests',
    value: dashboardSummary.pendingCompanyRequests,
    icon: FaClock,
    borderColor: 'border-t-secondary',
    iconBg: 'bg-secondary',
    trend: { value: '+2', direction: 'up', label: 'today' },
  },
  {
    label: 'Pending Bus Requests',
    value: dashboardSummary.pendingBusRequests,
    icon: FaClipboardList,
    borderColor: 'border-t-secondary',
    iconBg: 'bg-secondary',
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
  { title: 'Company Performance Comparison', icon: FaChartBar },
  { title: 'Route Distribution Overview', icon: FaChartPie },
  { title: 'Trip Statistics', icon: FaHeartbeat },
  { title: 'Revenue Overview', icon: FaArrowUp },
]

// ═══════════════════════════════════════════════════════════════
//  HELPER: Status Badge
// ═══════════════════════════════════════════════════════════════

const getStatusBadge = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-secondary text-text'
    case 'Approved':
      return 'bg-accent text-text'
    case 'Rejected':
      return 'bg-alert/10 text-alert'
    default:
      return 'bg-surface text-text'
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
        <h1 className="text-2xl font-bold text-text tracking-tight">
          Platform Overview
        </h1>
        <p className="text-sm text-text-muted">
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
                    className={`text-2xl font-bold ${card.textColor || 'text-text'
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
           SECTION 2 — Recent Requests
           ══════════════════════════════════════════════════════════ */}
      {/* TODO: Replace mock data with GET /api/control-plane/dashboard/recent-requests */}
      <div className="bg-primary rounded-xl border border-border shadow-sm">
        {/* Section Header */}
        <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-text">
              Recent Requests
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Latest company registrations and bus approval submissions
            </p>
          </div>
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-border">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveRequestTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${activeRequestTab === tab
                  ? 'bg-primary text-text shadow-sm'
                  : 'text-text-muted hover:text-text'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Table
          data={filteredRequests}
          columns={[
            {
              header: 'Company Name',
              accessorKey: 'companyName',
              cell: (info) => (
                <span className="font-semibold text-text">
                  {info.getValue()}
                </span>
              ),
            },
            {
              header: 'Request Type',
              accessorKey: 'requestType',
              cell: (info) => (
                <span className="text-text-muted">
                  {info.getValue()}
                </span>
              ),
            },
            {
              header: 'Submitted Date',
              accessorKey: 'submittedDate',
              cell: (info) => (
                <span className="text-text-muted">
                  {info.getValue()}
                </span>
              ),
            },
            {
              header: 'Status',
              accessorKey: 'status',
              cell: (info) => (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadge(
                    info.getValue()
                  )}`}
                >
                  {info.getValue()}
                </span>
              ),
            },
            {
              header: 'Action',
              id: 'actions',
              cell: () => (
                <div className="text-right">
                  <button className="inline-flex items-center gap-1 text-xs font-medium text-text-muted hover:text-text transition-colors">
                    View
                    <FaArrowRight size={12} />
                  </button>
                </div>
              ),
            },
          ]}
        />

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-white flex justify-between items-center">
          <span className="text-xs text-text-muted">
            Showing {filteredRequests.length} of {recentRequests.length} requests
          </span>
          <button className="text-xs font-semibold text-text hover:underline">
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
        <h2 className="text-lg font-bold text-text mb-4">
          Analytics Overview
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Chart 1: Company Performance (Bar Chart) */}
          <div className="bg-primary rounded-xl border border-border shadow-sm p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-secondary">
                <FaChartBar size={18} className="text-text" />
              </div>
              <h3 className="text-sm font-bold text-text">
                Company Performance Comparison
              </h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                    itemStyle={{ color: '#000000' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="revenue" name="Revenue" fill="#000000" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="trips" name="Trips" fill="#C6EDFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Route Distribution (Pie Chart) */}
          <div className="bg-primary rounded-xl border border-border shadow-sm p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-secondary">
                <FaChartPie size={18} className="text-text" />
              </div>
              <h3 className="text-sm font-bold text-text">
                Route Distribution Overview
              </h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={routeDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {routeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                    itemStyle={{ color: '#000000' }}
                  />
                  <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Trip Stats (Area Chart) */}
          <div className="bg-primary rounded-xl border border-border shadow-sm p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-secondary">
                <FaHeartbeat size={18} className="text-text" />
              </div>
              <h3 className="text-sm font-bold text-text">
                Trip Statistics (Real-time)
              </h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tripStatsData}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C6EDFF" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#C6EDFF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCancelled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#960000" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#960000" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#000000"
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                  />
                  <Area
                    type="monotone"
                    dataKey="cancelled"
                    stroke="#960000"
                    fillOpacity={1}
                    fill="url(#colorCancelled)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Revenue Overview (Line Chart) */}
          <div className="bg-primary rounded-xl border border-border shadow-sm p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-secondary">
                <FaArrowUp size={18} className="text-text" />
              </div>
              <h3 className="text-sm font-bold text-text">
                Revenue Overview (Weekly)
              </h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    name="Revenue"
                    stroke="#000000"
                    strokeWidth={3}
                    dot={{ fill: '#000000', r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
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
    </div>
  )
}

export default Dashboard
