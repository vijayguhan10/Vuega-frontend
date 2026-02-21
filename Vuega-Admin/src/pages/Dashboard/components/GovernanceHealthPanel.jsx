import React from 'react'
import { FaHeartbeat, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa'
import GovernanceCard from './GovernanceCard'

// ═══════════════════════════════════════════════════════════════
//  GET /api/control-plane/governance-metrics
// ═══════════════════════════════════════════════════════════════

// Mock data — will be replaced by API call
const governanceHealth = {
  slaCompliancePercent: 96.4,
  operatorsWithinSLA: 43,
  slaViolations: 2,
  systemHealth: 'Healthy', // 'Healthy' | 'Warning' | 'Critical'
  heartbeatActive: true,
}

const healthConfig = {
  Healthy: { color: 'text-text', bg: 'bg-accent/20', icon: FaCheckCircle, label: 'All Systems Operational' },
  Warning: { color: 'text-text', bg: 'bg-secondary', icon: FaExclamationTriangle, label: 'Degraded Performance' },
  Critical: { color: 'text-alert', bg: 'bg-alert/10', icon: FaTimesCircle, label: 'Critical Issues Detected' },
}

const GovernanceHealthPanel = () => {
  const health = healthConfig[governanceHealth.systemHealth]
  const HealthIcon = health.icon

  return (
    <GovernanceCard title="Platform Governance Health" icon={FaHeartbeat}>
      <div className="flex flex-col gap-4">
        {/* System Health Status */}
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${health.bg}`}>
          <HealthIcon size={20} className={health.color} />
          <div>
            <p className={`text-sm font-semibold ${health.color}`}>{governanceHealth.systemHealth}</p>
            <p className="text-xs text-text-muted">{health.label}</p>
          </div>
          {/* Live Heartbeat Indicator */}
          <div className="ml-auto flex items-center gap-2">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${governanceHealth.heartbeatActive ? 'bg-text animate-pulse' : 'bg-alert'}`} />
            <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
              {governanceHealth.heartbeatActive ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">SLA Compliance</p>
            <p className="text-xl font-bold text-text">{governanceHealth.slaCompliancePercent}%</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Within SLA</p>
            <p className="text-xl font-bold text-text">{governanceHealth.operatorsWithinSLA}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Violations</p>
            <p className={`text-xl font-bold ${governanceHealth.slaViolations > 0 ? 'text-alert' : 'text-text'}`}>
              {governanceHealth.slaViolations}
            </p>
          </div>
        </div>
      </div>
    </GovernanceCard>
  )
}

export default GovernanceHealthPanel
