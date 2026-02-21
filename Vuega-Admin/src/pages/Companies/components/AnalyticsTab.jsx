import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { FaShieldAlt } from 'react-icons/fa'
import { TrendingUp, Users, Bus, MapPin, IndianRupee } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
//  Data source:
//    GET /api/companies/:id/details → analyticsData object
//    GET /api/companies/:id/analytics?range=30d
// ═══════════════════════════════════════════════════════════════

// Mock analytics data per company
// TODO: Replace with real data from GET /api/companies/:id/analytics
const companyAnalyticsMap = {
  'C-101': {
    revenue: { current: 485000, previous: 420000, currency: '₹' },
    bookings: { current: 3240, previous: 2890 },
    avgOccupancy: 78,
    tripCompletion: 96,
    monthlyBookings: [
      { month: 'Sep', count: 420 },
      { month: 'Oct', count: 510 },
      { month: 'Nov', count: 480 },
      { month: 'Dec', count: 620 },
      { month: 'Jan', count: 580 },
      { month: 'Feb', count: 630 },
    ],
    busUtilization: [
      { name: 'Active', value: 10 },
      { name: 'Idle', value: 2 },
      { name: 'Maintenance', value: 2 },
    ],
  },
  'C-102': {
    revenue: { current: 285000, previous: 250000, currency: '₹' },
    bookings: { current: 1920, previous: 1750 },
    avgOccupancy: 72,
    tripCompletion: 94,
    monthlyBookings: [
      { month: 'Sep', count: 280 },
      { month: 'Oct', count: 310 },
      { month: 'Nov', count: 290 },
      { month: 'Dec', count: 380 },
      { month: 'Jan', count: 340 },
      { month: 'Feb', count: 320 },
    ],
    busUtilization: [
      { name: 'Active', value: 6 },
      { name: 'Idle', value: 1 },
      { name: 'Maintenance', value: 1 },
    ],
  },
  'C-107': {
    revenue: { current: 720000, previous: 650000, currency: '₹' },
    bookings: { current: 4850, previous: 4200 },
    avgOccupancy: 82,
    tripCompletion: 98,
    monthlyBookings: [
      { month: 'Sep', count: 680 },
      { month: 'Oct', count: 750 },
      { month: 'Nov', count: 720 },
      { month: 'Dec', count: 890 },
      { month: 'Jan', count: 860 },
      { month: 'Feb', count: 950 },
    ],
    busUtilization: [
      { name: 'Active', value: 18 },
      { name: 'Idle', value: 2 },
      { name: 'Maintenance', value: 2 },
    ],
  },
  'C-110': {
    revenue: { current: 395000, previous: 340000, currency: '₹' },
    bookings: { current: 2680, previous: 2350 },
    avgOccupancy: 75,
    tripCompletion: 95,
    monthlyBookings: [
      { month: 'Sep', count: 380 },
      { month: 'Oct', count: 420 },
      { month: 'Nov', count: 400 },
      { month: 'Dec', count: 510 },
      { month: 'Jan', count: 480 },
      { month: 'Feb', count: 490 },
    ],
    busUtilization: [
      { name: 'Active', value: 12 },
      { name: 'Idle', value: 3 },
      { name: 'Maintenance', value: 1 },
    ],
  },
  'C-105': {
    revenue: { current: 180000, previous: 165000, currency: '₹' },
    bookings: { current: 1200, previous: 1080 },
    avgOccupancy: 68,
    tripCompletion: 92,
    monthlyBookings: [
      { month: 'Sep', count: 160 },
      { month: 'Oct', count: 190 },
      { month: 'Nov', count: 180 },
      { month: 'Dec', count: 240 },
      { month: 'Jan', count: 210 },
      { month: 'Feb', count: 220 },
    ],
    busUtilization: [
      { name: 'Active', value: 5 },
      { name: 'Idle', value: 1 },
      { name: 'Maintenance', value: 1 },
    ],
  },
}

const PIE_COLORS = ['#2E86AB', '#E5E7EB', '#D4A800']

/**
 * Metric card
 */
const MetricCard = ({ icon: Icon, label, value, change, changeType }) => (
  <div className="bg-primary rounded-xl border border-border p-3 flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-[#F5F5F4] flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-text-muted" />
      </div>
      <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted">
        {label}
      </span>
    </div>
    <span className="text-lg font-bold text-text">{value}</span>
    {change !== undefined && (
      <span className={`text-[10px] font-semibold ${
        changeType === 'up' ? 'text-[#2E86AB]' : 'text-alert'
      }`}>
        {changeType === 'up' ? '↑' : '↓'} {change}% vs prev period
      </span>
    )}
  </div>
)

/**
 * Custom tooltip for charts
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-border rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-text">{label}</p>
      <p className="text-text-muted">{payload[0].value} bookings</p>
    </div>
  )
}

const AnalyticsTab = ({ company }) => {
  const analytics = companyAnalyticsMap[company?.id]

  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#F5F5F4] flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-text-muted/40" />
        </div>
        <span className="text-sm text-text-muted">No analytics data available.</span>
        <span className="text-[10px] text-text-muted">
          Analytics are generated once the company has active operations.
        </span>
      </div>
    )
  }

  // Compute changes
  const revenueChange = analytics.revenue.previous > 0
    ? Math.round(((analytics.revenue.current - analytics.revenue.previous) / analytics.revenue.previous) * 100)
    : 0
  const bookingChange = analytics.bookings.previous > 0
    ? Math.round(((analytics.bookings.current - analytics.bookings.previous) / analytics.bookings.previous) * 100)
    : 0

  const formatCurrency = (val) => {
    if (val >= 100000) return `${analytics.revenue.currency}${(val / 100000).toFixed(1)}L`
    if (val >= 1000) return `${analytics.revenue.currency}${(val / 1000).toFixed(1)}K`
    return `${analytics.revenue.currency}${val}`
  }

  return (
    <div className="flex flex-col gap-4 py-1">
      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={IndianRupee}
          label="Revenue"
          value={formatCurrency(analytics.revenue.current)}
          change={Math.abs(revenueChange)}
          changeType={revenueChange >= 0 ? 'up' : 'down'}
        />
        <MetricCard
          icon={Users}
          label="Bookings"
          value={analytics.bookings.current.toLocaleString()}
          change={Math.abs(bookingChange)}
          changeType={bookingChange >= 0 ? 'up' : 'down'}
        />
        <MetricCard
          icon={MapPin}
          label="Avg Occupancy"
          value={`${analytics.avgOccupancy}%`}
        />
        <MetricCard
          icon={Bus}
          label="Trip Completion"
          value={`${analytics.tripCompletion}%`}
        />
      </div>

      {/* ── Monthly Bookings Chart ── */}
      <div className="bg-primary rounded-xl border border-border p-4 flex flex-col gap-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Monthly Bookings (6 months)
        </h4>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.monthlyBookings} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#C6EDFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bus Utilization Pie ── */}
      <div className="bg-primary rounded-xl border border-border p-4 flex flex-col gap-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Bus Utilization
        </h4>
        <div className="flex items-center gap-4">
          <div className="h-32 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.busUtilization}
                  cx="50%"
                  cy="50%"
                  innerRadius={28}
                  outerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {analytics.busUtilization.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2">
            {analytics.busUtilization.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                />
                <span className="text-xs text-text">{item.name}</span>
                <span className="text-xs font-bold text-text-muted">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Governance footer */}
      <div className="flex items-center gap-1.5 px-1 text-[10px] text-text-muted">
        <FaShieldAlt className="w-2.5 h-2.5" />
        <span>Analytics are read-only and derived from audited transaction logs</span>
      </div>
    </div>
  )
}

export default AnalyticsTab
