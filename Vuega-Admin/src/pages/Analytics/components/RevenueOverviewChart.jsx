import React from 'react'
import { FaRupeeSign } from 'react-icons/fa'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// ═══════════════════════════════════════════════════════════════
//  REVENUE OVERVIEW — AreaChart
// ═══════════════════════════════════════════════════════════════
// API Placeholder:
// GET /api/control-plane/analytics/revenue-trend
//     → Returns revenue trend data (total revenue, booking revenue, ancillary)
//     → Query params: ?dateRange=today|7d|30d|custom&companyId=
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
            ₹{(entry.value / 1000).toFixed(0)}K
          </span>
        </div>
      ))}
    </div>
  )
}

const RevenueOverviewChart = ({ data, dateRangeLabel }) => {
  return (
    <div className="bg-primary rounded-xl border border-border shadow-sm p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary">
            <FaRupeeSign size={18} className="text-text" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text">
              Revenue Overview
            </h3>
            <p className="text-[10px] text-text-muted mt-0.5">
              Platform revenue trend from all tenant operators
            </p>
          </div>
        </div>
        {dateRangeLabel && (
          <span className="text-[10px] font-medium text-text-muted bg-secondary px-2.5 py-1 rounded-md">
            {dateRangeLabel}
          </span>
        )}
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#000000" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#000000" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C6EDFF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#C6EDFF" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="label"
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
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '12px', fontSize: '11px' }}
              iconType="circle"
              iconSize={8}
            />
            <Area
              type="monotone"
              dataKey="totalRevenue"
              name="Total Revenue"
              stroke="#000000"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              dot={{ fill: '#000000', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 6, stroke: '#000000', strokeWidth: 2, fill: '#FFFFFF' }}
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="bookingRevenue"
              name="Booking Revenue"
              stroke="#C6EDFF"
              strokeWidth={2}
              fill="url(#bookingGradient)"
              dot={{ fill: '#C6EDFF', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 6, stroke: '#C6EDFF', strokeWidth: 2, fill: '#FFFFFF' }}
              animationDuration={800}
              animationBegin={200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RevenueOverviewChart
