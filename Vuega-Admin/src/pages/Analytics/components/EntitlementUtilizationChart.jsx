import React from 'react'
import { FaBus } from 'react-icons/fa'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts'

// ═══════════════════════════════════════════════════════════════
//  ENTITLEMENT UTILIZATION DISTRIBUTION — Stacked BarChart
// ═══════════════════════════════════════════════════════════════
// Shows how operators are consuming their entitlement quotas
// (bus limits, route limits). Categorized as Healthy (<70%),
// Near Limit (70-90%), and Exceeded (>90%).
//
// API Placeholder:
// GET /api/control-plane/analytics/entitlement-distribution
//     → Returns operator entitlement utilization breakdown
//     → Query params: ?dateRange=, ?threshold=
// ═══════════════════════════════════════════════════════════════

const getUtilizationColor = (pct) => {
  if (pct > 90) return '#960000'
  if (pct > 70) return '#FFFADF'
  return '#C6EDFF'
}

const getUtilizationLabel = (pct) => {
  if (pct > 90) return 'Exceeded'
  if (pct > 70) return 'Near Limit'
  return 'Healthy'
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload
  if (!row) return null

  return (
    <div className="bg-white rounded-lg border border-border shadow-lg p-3 text-xs min-w-[180px]">
      <p className="font-semibold text-text mb-2">{label}</p>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between">
          <span className="text-text-muted">Bus Usage</span>
          <span className="font-medium text-text">{row.busUsed}/{row.busLimit}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Route Usage</span>
          <span className="font-medium text-text">{row.routeUsed}/{row.routeLimit}</span>
        </div>
        <div className="mt-1 pt-1.5 border-t border-border flex justify-between">
          <span className="text-text-muted">Utilization</span>
          <span
            className="font-semibold"
            style={{ color: row.utilization > 90 ? '#960000' : '#000000' }}
          >
            {row.utilization}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Status</span>
          <span
            className="font-medium text-xs"
            style={{ color: row.utilization > 90 ? '#960000' : '#000000' }}
          >
            {getUtilizationLabel(row.utilization)}
          </span>
        </div>
      </div>
    </div>
  )
}

const EntitlementUtilizationChart = ({ data }) => {
  return (
    <div className="bg-primary rounded-xl border border-border shadow-sm p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-secondary">
          <FaBus size={18} className="text-text" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text">
            Entitlement Utilization Distribution
          </h3>
          <p className="text-[10px] text-text-muted mt-0.5">
            Operator quota consumption — healthy, near limit, exceeded
          </p>
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
            <XAxis
              type="number"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6B7280' }}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6B7280' }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={70} stroke="#FFFADF" strokeWidth={2} strokeDasharray="4 4" label="" />
            <ReferenceLine x={90} stroke="#960000" strokeWidth={1.5} strokeDasharray="4 4" label="" />
            <Bar
              dataKey="utilization"
              name="Utilization %"
              radius={[0, 6, 6, 0]}
              animationDuration={800}
            >
              {data.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={getUtilizationColor(entry.utilization)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend strip */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-center gap-6">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C6EDFF]" />
          <span className="text-[10px] text-text-muted">Healthy (&lt;70%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFFADF]" />
          <span className="text-[10px] text-text-muted">Near Limit (70–90%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#960000]" />
          <span className="text-[10px] text-text-muted">Exceeded (&gt;90%)</span>
        </div>
      </div>
    </div>
  )
}

export default EntitlementUtilizationChart
