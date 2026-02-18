import React from 'react'
import { FaBus } from 'react-icons/fa'
import GovernanceCard from './GovernanceCard'

// ═══════════════════════════════════════════════════════════════
//  Entitlement Risk Overview — Compact card
//  GET /api/control-plane/entitlements
// ═══════════════════════════════════════════════════════════════

// Mock data — will be replaced by API call
const entitlementRisk = {
  exceededCount: 3,
  nearLimitCount: 5,
  healthyCount: 40,
  avgUtilization: 62,
}

const EntitlementOverview = () => {
  return (
    <GovernanceCard title="Entitlement Risk Overview" icon={FaBus}>
      <div className="flex flex-col gap-3">
        {/* Exceeded */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-alert/5 border border-border/50">
          <span className="w-3 h-3 rounded-full bg-alert flex-shrink-0" />
          <span className="text-sm font-semibold text-alert">
            {entitlementRisk.exceededCount} Operators Exceeded
          </span>
        </div>

        {/* Near Limit */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary border border-border/50">
          <span className="w-3 h-3 rounded-full bg-text flex-shrink-0" />
          <span className="text-sm font-semibold text-text">
            {entitlementRisk.nearLimitCount} Near Limit
          </span>
        </div>

        {/* Healthy */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent/20 border border-border/50">
          <span className="w-3 h-3 rounded-full bg-accent flex-shrink-0" />
          <span className="text-sm font-semibold text-text">
            {entitlementRisk.healthyCount} Healthy
          </span>
        </div>

        {/* Average Utilization */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border border-border/50">
          <span className="text-base">📈</span>
          <span className="text-sm text-text-muted">
            Avg Utilization: <span className="font-bold text-text">{entitlementRisk.avgUtilization}%</span>
          </span>
        </div>
      </div>
    </GovernanceCard>
  )
}

export default EntitlementOverview
