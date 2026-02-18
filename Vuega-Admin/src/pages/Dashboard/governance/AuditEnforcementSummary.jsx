import React from 'react'
import { FaClipboardCheck, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa'
import GovernanceCard from './GovernanceCard'

// ═══════════════════════════════════════════════════════════════
//  Audit & Enforcement Summary
//  GET /api/control-plane/audit-summary
// ═══════════════════════════════════════════════════════════════

// Mock data — will be replaced by API call
const auditSummary = {
  totalActionsToday: 47,
  criticalActions: 3,
  recentEnforcementEvents: [
    {
      id: 'AE-001',
      action: 'Booking Suspension',
      operator: 'VRL Travels',
      timestamp: 'Today, 14:32',
      severity: 'critical',
    },
    {
      id: 'AE-002',
      action: 'Read-Only Mode Enforced',
      operator: 'Parveen Travels',
      timestamp: 'Today, 11:15',
      severity: 'warning',
    },
    {
      id: 'AE-003',
      action: 'License Renewal Notice Sent',
      operator: 'Orange Tours',
      timestamp: 'Today, 09:45',
      severity: 'info',
    },
  ],
}

const severityStyles = {
  critical: { dot: 'bg-alert', text: 'text-alert' },
  warning: { dot: 'bg-text', text: 'text-text' },
  info: { dot: 'bg-accent', text: 'text-text-muted' },
}

const AuditEnforcementSummary = () => {
  return (
    <GovernanceCard title="Audit & Enforcement Summary" icon={FaClipboardCheck}>
      <div className="flex flex-col gap-5">
        {/* Counters */}
        <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 rounded-lg border border-border/50 bg-white">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Actions Today</p>
            <p className="text-xl font-bold text-text mt-1">{auditSummary.totalActionsToday}</p>
          </div>
          <div className={`px-4 py-3 rounded-lg border border-border/50 ${auditSummary.criticalActions > 0 ? 'bg-alert/5' : 'bg-white'}`}>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Critical Actions</p>
            <p className={`text-xl font-bold mt-1 ${auditSummary.criticalActions > 0 ? 'text-alert' : 'text-text'}`}>
              {auditSummary.criticalActions}
            </p>
          </div>
        </div>

        {/* Recent Enforcement Events */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Recent Enforcement Events</p>
          {auditSummary.recentEnforcementEvents.map((event) => {
            const style = severityStyles[event.severity]
            return (
              <div
                key={event.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border/30 bg-white"
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${style.text} truncate`}>{event.action}</p>
                  <p className="text-[10px] text-text-muted">{event.operator} · {event.timestamp}</p>
                </div>
                {event.severity === 'critical' && (
                  <FaExclamationTriangle size={12} className="text-alert flex-shrink-0" />
                )}
              </div>
            )
          })}
        </div>

        {/* Action Button */}
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-xs font-semibold text-text hover:bg-secondary/50 transition-colors">
          View Audit Logs
          <FaArrowRight size={10} />
        </button>
      </div>
    </GovernanceCard>
  )
}

export default AuditEnforcementSummary
