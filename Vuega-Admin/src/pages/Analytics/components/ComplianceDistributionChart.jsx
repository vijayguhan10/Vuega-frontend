import React from 'react'
import { FaShieldAlt } from 'react-icons/fa'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// ═══════════════════════════════════════════════════════════════
//  COMPLIANCE STATUS DISTRIBUTION — Donut Chart
// ═══════════════════════════════════════════════════════════════
// API Placeholder:
// GET /api/control-plane/analytics/compliance-distribution
//     → Returns compliance status breakdown across operators
//     → Query params: ?dateRange=
// ═══════════════════════════════════════════════════════════════

const COMPLIANCE_COLORS = {
  Verified: '#000000',
  'Expiring Soon': '#FFFADF',
  Expired: '#960000',
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  const data = entry.payload
  return (
    <div className="bg-white rounded-lg border border-border shadow-lg p-3 text-xs min-w-[150px]">
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="w-2.5 h-2.5 rounded-full inline-block"
          style={{ backgroundColor: COMPLIANCE_COLORS[data.status] }}
        />
        <span className="font-semibold text-text">{data.status}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-text-muted">Operators</span>
        <span className="font-medium text-text">{data.count}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-text-muted">Share</span>
        <span className="font-medium text-text">{data.percentage}%</span>
      </div>
    </div>
  )
}

const renderCenterLabel = ({ viewBox }, total) => {
  if (!viewBox || typeof viewBox.cx === 'undefined' || typeof viewBox.cy === 'undefined') {
    return null;
  }
  const { cx, cy } = viewBox;
  return (
    <g>
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={24}
        fontWeight={700}
        fill="#000000"
      >
        {total}
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fill="#6B7280"
      >
        Total Operators
      </text>
    </g>
  );
};

const ComplianceDistributionChart = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0)
  const enrichedData = data.map((d) => ({
    ...d,
    percentage: total > 0 ? Math.round((d.count / total) * 100) : 0,
  }))

  return (
    <div className="bg-primary rounded-xl border border-border shadow-sm p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-secondary">
          <FaShieldAlt size={18} className="text-text" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text">
            Compliance Status Distribution
          </h3>
          <p className="text-[10px] text-text-muted mt-0.5">
            KYC &amp; document verification status across tenants
          </p>
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={enrichedData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={3}
              strokeWidth={0}
              animationDuration={800}
              label={false}
            >
              {enrichedData.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={COMPLIANCE_COLORS[entry.status]}
                />
              ))}
            </Pie>
            <Pie
              data={[{ value: 1 }]}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={0}
              label={(props) => renderCenterLabel(props, total)}
            />
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary cards */}
      <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-3">
        {enrichedData.map((d) => (
          <div
            key={d.status}
            className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-white border border-border"
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COMPLIANCE_COLORS[d.status] }}
            />
            <span className="text-sm font-bold text-text">{d.count}</span>
            <span className="text-[10px] text-text-muted text-center leading-tight">{d.status}</span>
            <span className="text-[10px] font-medium text-text-muted">{d.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ComplianceDistributionChart
