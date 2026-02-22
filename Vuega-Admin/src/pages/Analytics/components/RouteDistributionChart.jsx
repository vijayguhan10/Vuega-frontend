import React from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// ═══════════════════════════════════════════════════════════════
//  ROUTE DISTRIBUTION OVERVIEW — Donut Chart
// ═══════════════════════════════════════════════════════════════
// API Placeholder:
// GET /api/control-plane/analytics/route-distribution
//     → Returns route category breakdown (Intercity, Intracity, Contract, Seasonal)
//     → Query params: ?dateRange=, ?companyId=
// ═══════════════════════════════════════════════════════════════

const ROUTE_COLORS = ['#000000', '#C6EDFF', '#FFFADF', '#960000']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  return (
    <div className="bg-white rounded-lg border border-border shadow-lg p-3 text-xs">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full inline-block"
          style={{ backgroundColor: entry.payload.fill }}
        />
        <span className="font-semibold text-text">{entry.name}</span>
      </div>
      <p className="text-text-muted mt-1">
        {entry.value} routes ({entry.payload.percentage}%)
      </p>
    </div>
  )
}

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percentage < 8) return null

  return (
    <text
      x={x}
      y={y}
      fill="#FFFFFF"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {percentage}%
    </text>
  )
}

const RouteDistributionChart = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0)
  const enrichedData = data.map((d) => ({
    ...d,
    percentage: Math.round((d.count / total) * 100),
  }))

  return (
    <div className="bg-primary rounded-xl border border-border shadow-sm p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-secondary">
          <FaMapMarkerAlt size={18} className="text-text" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text">
            Route Distribution Overview
          </h3>
          <p className="text-[10px] text-text-muted mt-0.5">
            Route category breakdown across all tenant operators
          </p>
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={enrichedData}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              strokeWidth={0}
              animationDuration={800}
              label={renderCustomLabel}
              labelLine={false}
            >
              {enrichedData.map((entry, idx) => (
                <Cell
                  key={entry.category}
                  fill={ROUTE_COLORS[idx % ROUTE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '12px', fontSize: '11px' }}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-text-muted text-xs">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary row */}
      <div className="mt-4 pt-4 border-t border-border grid grid-cols-4 gap-3">
        {enrichedData.map((d, idx) => (
          <div key={d.category} className="flex flex-col items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: ROUTE_COLORS[idx % ROUTE_COLORS.length] }}
            />
            <span className="text-xs font-semibold text-text">{d.count}</span>
            <span className="text-[10px] text-text-muted">{d.category}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RouteDistributionChart
