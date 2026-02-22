import React from 'react'
import { FaChartBar } from 'react-icons/fa'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// ═══════════════════════════════════════════════════════════════
//  COMPANY PERFORMANCE COMPARISON — BarChart
// ═══════════════════════════════════════════════════════════════
//
// API Placeholder:
// GET /api/control-plane/analytics/company-performance
//     → Returns top operator performance data (trips, revenue, utilization)
//     → Query params: ?dateRange=, ?limit=
// ═══════════════════════════════════════════════════════════════

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-lg border border-border shadow-lg p-3 text-xs">
      <p className="font-semibold text-text mb-1.5">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2 py-0.5">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-text-muted">{entry.name}:</span>
          <span className="font-medium text-text">
            {entry.name === 'Revenue'
              ? `₹${(entry.value / 1000).toFixed(0)}K`
              : entry.name === 'Utilization'
              ? `${entry.value}%`
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

const CompanyPerformanceChart = ({ data }) => {
  return (
    <div className="bg-primary rounded-xl border border-border shadow-sm p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-secondary">
          <FaChartBar size={18} className="text-text" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text">
            Company Performance Comparison
          </h3>
          <p className="text-[10px] text-text-muted mt-0.5">
            Active trips, revenue, and utilization across top operators
          </p>
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6B7280' }}
            />
            <YAxis
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6B7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '12px', fontSize: '11px' }}
              iconType="circle"
              iconSize={8}
            />
            <Bar
              dataKey="activeTrips"
              name="Active Trips"
              fill="#000000"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
            />
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="#C6EDFF"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
              animationBegin={200}
            />
            <Bar
              dataKey="utilization"
              name="Utilization"
              fill="#FFFADF"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
              animationBegin={400}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CompanyPerformanceChart
