import React from 'react'
import { FaRoute } from 'react-icons/fa'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// ═══════════════════════════════════════════════════════════════
//  TRIP STATISTICS — LineChart
// ═══════════════════════════════════════════════════════════════
//
// API Placeholder:
// GET /api/control-plane/analytics/trip-statistics
//     → Returns trip trend data (completed, cancelled, scheduled)
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
          <span className="font-medium text-text">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

const TripStatisticsChart = ({ data, dateRangeLabel }) => {
  return (
    <div className="bg-primary rounded-xl border border-border shadow-sm p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary">
            <FaRoute size={18} className="text-text" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text">
              Trip Statistics
            </h3>
            <p className="text-[10px] text-text-muted mt-0.5">
              Trip volume trend across all tenant operators
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
          <LineChart data={data}>
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
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '12px', fontSize: '11px' }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="completed"
              name="Completed"
              stroke="#000000"
              strokeWidth={2.5}
              dot={{ fill: '#000000', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 6, stroke: '#000000', strokeWidth: 2, fill: '#FFFFFF' }}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="scheduled"
              name="Scheduled"
              stroke="#C6EDFF"
              strokeWidth={2.5}
              dot={{ fill: '#C6EDFF', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 6, stroke: '#C6EDFF', strokeWidth: 2, fill: '#FFFFFF' }}
              animationDuration={800}
              animationBegin={200}
            />
            <Line
              type="monotone"
              dataKey="cancelled"
              name="Cancelled"
              stroke="#960000"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#960000', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 6, stroke: '#960000', strokeWidth: 2, fill: '#FFFFFF' }}
              animationDuration={800}
              animationBegin={400}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TripStatisticsChart
