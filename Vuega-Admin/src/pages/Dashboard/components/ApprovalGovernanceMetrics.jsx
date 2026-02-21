import React from 'react'
import { FaGavel } from 'react-icons/fa'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import GovernanceCard from './GovernanceCard'


// Mock data — will be replaced by API call
const approvalMetrics = {
  approved: 124,
  rejected: 18,
  avgProcessingTimeHours: 4.2,
  pendingOver24h: 3,
  pendingOver48h: 1,
}

const chartData = [
  { name: 'Approved', value: approvalMetrics.approved },
  { name: 'Rejected', value: approvalMetrics.rejected },
]

const CHART_COLORS = ['#000000', '#960000']

const ApprovalGovernanceMetrics = () => {
  const total = approvalMetrics.approved + approvalMetrics.rejected
  const approvalRate = ((approvalMetrics.approved / total) * 100).toFixed(1)

  return (
    <GovernanceCard title="Approval Governance Metrics" icon={FaGavel}>
      <div className="flex flex-col gap-5">
        {/* Mini donut chart + stats side by side */}
        <div className="flex items-center gap-6">
          {/* Chart */}
          <div className="w-28 h-28 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Stats */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-text" />
              <span className="text-xs text-text-muted">Approved</span>
              <span className="text-xs font-bold text-text">{approvalMetrics.approved}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-alert" />
              <span className="text-xs text-text-muted">Rejected</span>
              <span className="text-xs font-bold text-alert">{approvalMetrics.rejected}</span>
            </div>
            <p className="text-[10px] text-text-muted mt-1">
              Approval Rate: <span className="font-bold text-text">{approvalRate}%</span>
            </p>
          </div>
        </div>

        {/* Processing Time & Aging */}
        <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 rounded-lg border border-border/50 bg-white">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Avg Processing</p>
            <p className="text-lg font-bold text-text mt-1">{approvalMetrics.avgProcessingTimeHours}h</p>
          </div>
          <div className={`px-4 py-3 rounded-lg border border-border/50 ${approvalMetrics.pendingOver48h > 0 ? 'bg-alert/5' : 'bg-white'}`}>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Aging Requests</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className={`text-lg font-bold ${approvalMetrics.pendingOver48h > 0 ? 'text-alert' : 'text-text'}`}>
                {approvalMetrics.pendingOver24h + approvalMetrics.pendingOver48h}
              </p>
              {approvalMetrics.pendingOver48h > 0 && (
                <span className="text-[10px] text-alert font-medium">{approvalMetrics.pendingOver48h} critical</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </GovernanceCard>
  )
}

export default ApprovalGovernanceMetrics
