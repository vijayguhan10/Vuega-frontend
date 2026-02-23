import React from 'react'
import { FaTimes, FaCheckCircle, FaTimesCircle, FaClock, FaShieldAlt, FaKey } from 'react-icons/fa'
import StatusBadge from './StatusBadge'

// ═══════════════════════════════════════════════════════════════
//  Data source:
//    GET /api/control-plane/audit/:requestId
// ═══════════════════════════════════════════════════════════════

/**
 * @typedef {Object} AuditEvent
 * @property {string} id
 * @property {string} action     
 * @property {string} performedBy
 * @property {string} timestamp
 * @property {string} [remarks]
 * @property {Object} [metadata]
 */

const actionConfig = {
  BUS_SUBMITTED: { icon: FaClock, color: 'text-text-muted', bg: 'bg-[#F5F5F4]', label: 'Request Submitted' },
  BUS_APPROVED: { icon: FaCheckCircle, color: 'text-[#2E86AB]', bg: 'bg-accent/20', label: 'Approved' },
  BUS_REJECTED: { icon: FaTimesCircle, color: 'text-alert', bg: 'bg-alert/10', label: 'Rejected' },
  TOKEN_ISSUED: { icon: FaKey, color: 'text-[#D4A800]', bg: 'bg-secondary', label: 'Approval Token Issued' },
  LIMIT_OVERRIDE: { icon: FaShieldAlt, color: 'text-[#2E86AB]', bg: 'bg-accent/20', label: 'Entitlement Override' },
}

const HistoryDrawer = ({ isOpen, onClose, request, auditHistory = [] }) => {
  if (!isOpen || !request) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-primary shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-bold text-text">Request History</h3>
            <span className="text-xs font-mono text-text-muted">{request.id}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#F5F5F4] transition-colors"
          >
            <FaTimes className="w-4 h-4 text-text-muted" />
          </button>
        </div>

        {/* Request Summary Card */}
        <div className="px-6 py-4 border-b border-border">
          <div className="bg-[#F5F5F4] rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-text">{request.companyName}</span>
              <StatusBadge status={request.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-text-muted">
              <div>
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-text-muted/70">
                  Bus Number
                </span>
                <span className="font-mono text-text">{request.busNumber}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-text-muted/70">
                  Layout
                </span>
                <span className="text-text">{request.layoutType}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-text-muted/70">
                  Submitted
                </span>
                <span className="text-text">{request.submittedDate}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-text-muted/70">
                  Bus Usage
                </span>
                <span className={`font-semibold ${request.currentBusCount >= request.busLimit ? 'text-alert' : 'text-text'}`}>
                  {request.currentBusCount}/{request.busLimit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Timeline */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">
            Audit Trail
          </h4>

          {auditHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <FaShieldAlt className="w-6 h-6 text-text-muted/30" />
              <span className="text-xs text-text-muted">No audit events recorded yet.</span>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

              <div className="flex flex-col gap-4">
                {auditHistory.map((event, idx) => {
                  const config = actionConfig[event.action] || actionConfig.BUS_SUBMITTED
                  const Icon = config.icon

                  return (
                    <div key={event.id || idx} className="relative flex items-start gap-3 pl-0">
                      {/* Timeline dot */}
                      <div
                        className={`relative z-10 w-[22px] h-[22px] rounded-full flex items-center justify-center ${config.bg} shrink-0`}
                      >
                        <Icon className={`w-2.5 h-2.5 ${config.color}`} />
                      </div>

                      {/* Event content */}
                      <div className="flex flex-col gap-0.5 flex-1 pb-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${config.color}`}>
                            {config.label}
                          </span>
                          <span className="text-[10px] text-text-muted font-mono">
                            {event.timestamp}
                          </span>
                        </div>
                        <span className="text-[11px] text-text-muted">
                          By <span className="font-medium text-text">{event.performedBy}</span>
                        </span>
                        {event.remarks && (
                          <p className="text-[11px] text-text-muted mt-1 bg-[#F5F5F4] rounded p-2 italic">
                            "{event.remarks}"
                          </p>
                        )}
                        {event.metadata?.tokenId && (
                          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-text-muted">
                            <FaKey className="w-2.5 h-2.5 text-[#D4A800]" />
                            <span className="font-mono">Token: {event.metadata.tokenId}</span>
                            <span>• Expires: {event.metadata.tokenExpiry}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-[#F5F5F4]">
          <div className="flex items-center gap-2 text-[10px] text-text-muted">
            <FaShieldAlt className="w-3 h-3" />
            <span>
              Audit records are immutable and tamper-proof. All entries are permanently stored.
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default HistoryDrawer
