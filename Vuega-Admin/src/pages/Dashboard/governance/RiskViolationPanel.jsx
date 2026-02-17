import React from 'react'
import { FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa'
import GovernanceCard from './GovernanceCard'

// ═══════════════════════════════════════════════════════════════
//  Risk & Violation Monitoring Panel
//  GET /api/control-plane/governance-metrics
//
//  @typedef {Object} RiskFlag
//  @property {string} operatorName
//  @property {'Low'|'Medium'|'High'} fraudRiskScore
//  @property {number} repeatedRejections
//  @property {boolean} manualOverrideAlert
//  @property {string} flagReason
// ═══════════════════════════════════════════════════════════════

// Mock data — will be replaced by API call
const riskFlags = [
  {
    operatorName: 'VRL Travels',
    fraudRiskScore: 'High',
    repeatedRejections: 4,
    manualOverrideAlert: true,
    flagReason: 'Multiple bus approvals rejected; exceeded entitlement limits',
  },
  {
    operatorName: 'Parveen Travels',
    fraudRiskScore: 'Medium',
    repeatedRejections: 2,
    manualOverrideAlert: false,
    flagReason: 'Incomplete KYC documentation submitted repeatedly',
  },
  {
    operatorName: 'CityLink',
    fraudRiskScore: 'Low',
    repeatedRejections: 0,
    manualOverrideAlert: true,
    flagReason: 'Admin override detected on bus configuration',
  },
]

const riskColors = {
  High: { text: 'text-alert', bg: 'bg-alert/10' },
  Medium: { text: 'text-text', bg: 'bg-secondary' },
  Low: { text: 'text-text-muted', bg: 'bg-accent/20' },
}

const RiskViolationPanel = () => {
  return (
    <GovernanceCard title="Risk & Violation Monitoring" icon={FaShieldAlt}>
      <div className="flex flex-col gap-3">
        {riskFlags.map((flag) => {
          const risk = riskColors[flag.fraudRiskScore]
          return (
            <div
              key={flag.operatorName}
              className="flex flex-col gap-2 px-4 py-3 rounded-lg border border-border/50 bg-white"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text">{flag.operatorName}</span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${risk.text} ${risk.bg}`}>
                  {flag.fraudRiskScore} Risk
                </span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">{flag.flagReason}</p>
              <div className="flex items-center gap-4 text-[10px]">
                {flag.repeatedRejections > 0 && (
                  <span className="flex items-center gap-1 text-text-muted">
                    <FaExclamationTriangle size={10} className={flag.repeatedRejections >= 3 ? 'text-alert' : 'text-text-muted'} />
                    {flag.repeatedRejections} rejections
                  </span>
                )}
                {flag.manualOverrideAlert && (
                  <span className="flex items-center gap-1 text-alert font-medium">
                    <FaExclamationTriangle size={10} />
                    Override Alert
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </GovernanceCard>
  )
}

export default RiskViolationPanel
