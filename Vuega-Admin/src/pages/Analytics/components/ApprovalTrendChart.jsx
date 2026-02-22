import React from 'react'
import { FaClipboardCheck } from 'react-icons/fa'
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
//  APPROVAL VS REJECTION TREND — BarChart
// ═══════════════════════════════════════════════════════════════
// Reflects governance-level bus/company approval and rejection
// trends over time, aggregated across all tenant operators from
// the Control Plane analytics service.
//
// API Placeholder:
// GET /api/control-plane/analytics/approval-trend
//     → Returns monthly approval/rejection counts
//     → Query params: ?dateRange=, ?type=company|bus
// ═══════════════════════════════════════════════════════════════

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const approved = payload.find((p) => p.dataKey === 'approved')
  const rejected = payload.find((p) => p.dataKey === 'rejected')
  const total = (approved?.value || 0) + (rejected?.value || 0)
  const approvalRate = total > 0 ? Math.round(((approved?.value || 0) / total) * 100) : 0

  return (
    <div className="bg-white rounded-lg border border-border shadow-lg p-3 text-xs min-w-[160px]">
      <p className="font-semibold text-text mb-2">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-text-muted">{entry.name}</span>
          </div>
          <span className="font-medium text-text">{entry.value}</span>
        </div>
      ))}
      <div className="mt-1.5 pt-1.5 border-t border-border flex justify-between">
        <span className="text-text-muted">Approval Rate</span>
        <span className="font-semibold text-text">{approvalRate}%</span>
      </div>
    </div>
  )
}

const ApprovalTrendChart = ({ data }) => {
  return (
    <div className="bg-primary rounded-xl border border-border shadow-sm p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-secondary">
          <FaClipboardCheck size={18} className="text-text" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text">
            Approval vs Rejection Trend
          </h3>
          <p className="text-[10px] text-text-muted mt-0.5">
            Bus &amp; company approval governance across all tenants
          </p>
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
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
              dataKey="approved"
              name="Approved"
              fill="#000000"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
            />
            <Bar
              dataKey="rejected"
              name="Rejected"
              fill="#960000"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
              animationBegin={200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ApprovalTrendChart
