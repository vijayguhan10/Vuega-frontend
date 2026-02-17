import React from 'react'
import { FaBus } from 'react-icons/fa'
import GovernanceCard from './GovernanceCard'
import ProgressBar from './ProgressBar'

// ═══════════════════════════════════════════════════════════════
//  Entitlement Utilization Overview
//  GET /api/control-plane/entitlements
//
//  @typedef {Object} EntitlementUsage
//  @property {string} operatorName
//  @property {number} busesUsed
//  @property {number} busesAllowed
//  @property {number} routesUsed
//  @property {number} routesAllowed
//  @property {number} apiQuotaUsed
//  @property {number} apiQuotaAllowed
// ═══════════════════════════════════════════════════════════════

// Mock data — will be replaced by API call
const entitlementData = [
  { operatorName: 'SRS Travels', busesUsed: 14, busesAllowed: 15, routesUsed: 22, routesAllowed: 25, apiQuotaUsed: 8500, apiQuotaAllowed: 10000 },
  { operatorName: 'KPN Travels', busesUsed: 8, busesAllowed: 10, routesUsed: 12, routesAllowed: 20, apiQuotaUsed: 4200, apiQuotaAllowed: 10000 },
  { operatorName: 'VRL Travels', busesUsed: 20, busesAllowed: 20, routesUsed: 30, routesAllowed: 30, apiQuotaUsed: 9800, apiQuotaAllowed: 10000 },
  { operatorName: 'Orange Tours', busesUsed: 5, busesAllowed: 12, routesUsed: 8, routesAllowed: 15, apiQuotaUsed: 2100, apiQuotaAllowed: 10000 },
]

const EntitlementOverview = () => {
  return (
    <GovernanceCard title="Entitlement Utilization Overview" icon={FaBus}>
      <div className="flex flex-col gap-5">
        {entitlementData.map((op) => (
          <div key={op.operatorName} className="flex flex-col gap-2.5 pb-4 border-b border-border/30 last:border-b-0 last:pb-0">
            <span className="text-xs font-semibold text-text">{op.operatorName}</span>
            <ProgressBar current={op.busesUsed} max={op.busesAllowed} label="Buses" />
            <ProgressBar current={op.routesUsed} max={op.routesAllowed} label="Routes" />
            <ProgressBar
              current={op.apiQuotaUsed}
              max={op.apiQuotaAllowed}
              label="API Quota"
              showFraction={false}
            />
          </div>
        ))}
      </div>
    </GovernanceCard>
  )
}

export default EntitlementOverview
