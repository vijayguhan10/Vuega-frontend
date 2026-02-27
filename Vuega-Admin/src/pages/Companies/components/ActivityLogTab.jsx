import React from 'react'
import { FaShieldAlt, FaKey } from 'react-icons/fa'
import {
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  FileText,
  UserPlus,
  Bus,
  Activity,
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
//  Data source:
//    GET /api/companies/:id/details → activityLogs array
//    GET /api/control-plane/audit?companyId=:id
// ═══════════════════════════════════════════════════════════════

// Action configuration for timeline rendering
const actionConfig = {
  COMPANY_REGISTERED: { icon: Clock, color: 'text-text-muted', bg: 'bg-[#F5F5F4]', label: 'Company Registered' },
  COMPANY_APPROVED: { icon: CheckCircle, color: 'text-[#2E86AB]', bg: 'bg-accent/20', label: 'Company Approved' },
  COMPANY_REJECTED: { icon: XCircle, color: 'text-alert', bg: 'bg-alert/10', label: 'Company Rejected' },
  COMPANY_SUSPENDED: { icon: AlertTriangle, color: 'text-alert', bg: 'bg-alert/10', label: 'Company Suspended' },
  COMPANY_REACTIVATED: { icon: RotateCcw, color: 'text-[#2E86AB]', bg: 'bg-accent/20', label: 'Company Reactivated' },
  BUS_SUBMITTED: { icon: Bus, color: 'text-text-muted', bg: 'bg-[#F5F5F4]', label: 'Bus Submitted' },
  BUS_APPROVED: { icon: CheckCircle, color: 'text-[#2E86AB]', bg: 'bg-accent/20', label: 'Bus Approved' },
  BUS_REJECTED: { icon: XCircle, color: 'text-alert', bg: 'bg-alert/10', label: 'Bus Rejected' },
  KYC_UPLOADED: { icon: FileText, color: 'text-[#D4A800]', bg: 'bg-secondary', label: 'KYC Document Uploaded' },
  KYC_VERIFIED: { icon: ShieldCheck, color: 'text-[#2E86AB]', bg: 'bg-accent/20', label: 'KYC Verified' },
  KYC_REJECTED: { icon: XCircle, color: 'text-alert', bg: 'bg-alert/10', label: 'KYC Rejected' },
  EMPLOYEE_ADDED: { icon: UserPlus, color: 'text-text-muted', bg: 'bg-[#F5F5F4]', label: 'Employee Added' },
  ENTITLEMENT_UPDATED: { icon: FaKey, color: 'text-[#D4A800]', bg: 'bg-secondary', label: 'Entitlement Updated' },
  COMPLIANCE_FLAGGED: { icon: AlertTriangle, color: 'text-alert', bg: 'bg-alert/10', label: 'Compliance Flagged' },
}

// Mock activity logs per company
// Mock activity log data for demonstration
const companyActivityMap = {
  'C-101': [
    { id: 'AL-1001', action: 'KYC_VERIFIED', performedBy: 'Admin-01', timestamp: 'Feb 20, 2026 • 3:45 PM', remarks: 'Pollution Certificate verified.' },
    { id: 'AL-1002', action: 'BUS_APPROVED', performedBy: 'Admin-02', timestamp: 'Feb 12, 2025 • 11:30 AM', remarks: 'Bus KA-01-GH-3456 approved for Bangalore–Goa route.' },
    { id: 'AL-1003', action: 'ENTITLEMENT_UPDATED', performedBy: 'System', timestamp: 'Feb 01, 2025 • 9:00 AM', metadata: { detail: 'Bus limit raised from 15 to 20' } },
    { id: 'AL-1004', action: 'BUS_APPROVED', performedBy: 'Admin-01', timestamp: 'Jan 20, 2025 • 2:15 PM' },
    { id: 'AL-1005', action: 'KYC_VERIFIED', performedBy: 'Admin-01', timestamp: 'Jan 12, 2025 • 10:00 AM', remarks: 'All initial KYC documents verified.' },
    { id: 'AL-1006', action: 'COMPANY_APPROVED', performedBy: 'Admin-01', timestamp: 'Jan 10, 2025 • 4:30 PM', remarks: 'Company meets all compliance requirements.' },
    { id: 'AL-1007', action: 'COMPANY_REGISTERED', performedBy: 'System', timestamp: 'Jan 10, 2025 • 2:00 PM' },
  ],
  'C-102': [
    { id: 'AL-2001', action: 'BUS_REJECTED', performedBy: 'Admin-01', timestamp: 'Mar 01, 2025 • 1:30 PM', remarks: 'Bus TN-01-EF-3333 does not meet safety standards.' },
    { id: 'AL-2002', action: 'COMPANY_APPROVED', performedBy: 'Admin-01', timestamp: 'Feb 07, 2025 • 11:00 AM' },
    { id: 'AL-2003', action: 'KYC_VERIFIED', performedBy: 'Admin-01', timestamp: 'Feb 07, 2025 • 10:00 AM' },
    { id: 'AL-2004', action: 'COMPANY_REGISTERED', performedBy: 'System', timestamp: 'Feb 05, 2025 • 3:00 PM' },
  ],
  'C-103': [
    { id: 'AL-3001', action: 'COMPLIANCE_FLAGGED', performedBy: 'System', timestamp: 'Feb 15, 2026 • 8:00 AM', remarks: 'Compliance score dropped below 60. Auto-flagged.' },
    { id: 'AL-3002', action: 'COMPANY_SUSPENDED', performedBy: 'Admin-02', timestamp: 'Feb 10, 2026 • 4:00 PM', remarks: 'Suspended due to non-compliance. GST certificate expired, insurance mismatch.' },
    { id: 'AL-3003', action: 'KYC_REJECTED', performedBy: 'Admin-02', timestamp: 'Jan 15, 2026 • 11:00 AM', remarks: 'Insurance policy coverage mismatch.' },
    { id: 'AL-3004', action: 'KYC_REJECTED', performedBy: 'Admin-01', timestamp: 'Dec 15, 2024 • 2:00 PM', remarks: 'GST certificate expired.' },
    { id: 'AL-3005', action: 'COMPANY_APPROVED', performedBy: 'Admin-02', timestamp: 'Nov 30, 2024 • 10:00 AM' },
    { id: 'AL-3006', action: 'COMPANY_REGISTERED', performedBy: 'System', timestamp: 'Nov 28, 2024 • 1:00 PM' },
  ],
  'C-104': [
    { id: 'AL-4001', action: 'KYC_UPLOADED', performedBy: 'Orange Tours Admin', timestamp: 'Feb 18, 2026 • 10:30 AM', remarks: '3 documents uploaded for review.' },
    { id: 'AL-4002', action: 'COMPANY_REGISTERED', performedBy: 'System', timestamp: 'Feb 18, 2026 • 10:00 AM' },
  ],
  'C-107': [
    { id: 'AL-7001', action: 'ENTITLEMENT_UPDATED', performedBy: 'Admin-01', timestamp: 'Feb 01, 2026 • 9:00 AM', metadata: { detail: 'Route limit raised from 35 to 45' } },
    { id: 'AL-7002', action: 'BUS_APPROVED', performedBy: 'Admin-02', timestamp: 'May 05, 2024 • 3:00 PM' },
    { id: 'AL-7003', action: 'EMPLOYEE_ADDED', performedBy: 'System', timestamp: 'Apr 20, 2024 • 11:00 AM', remarks: 'Employee Sneha Das added as Support.' },
    { id: 'AL-7004', action: 'COMPANY_APPROVED', performedBy: 'Admin-01', timestamp: 'Mar 03, 2024 • 2:00 PM', remarks: 'Premium operator onboarded.' },
    { id: 'AL-7005', action: 'COMPANY_REGISTERED', performedBy: 'System', timestamp: 'Mar 01, 2024 • 10:00 AM' },
  ],
  'C-108': [
    { id: 'AL-8001', action: 'COMPANY_REJECTED', performedBy: 'Admin-01', timestamp: 'Jan 05, 2025 • 4:00 PM', remarks: 'Company does not meet minimum fleet and safety requirements.' },
    { id: 'AL-8002', action: 'COMPANY_REGISTERED', performedBy: 'System', timestamp: 'Dec 20, 2024 • 2:00 PM' },
  ],
  'C-110': [
    { id: 'AL-0001', action: 'KYC_UPLOADED', performedBy: 'Abhibus Admin', timestamp: 'Feb 12, 2026 • 3:00 PM', remarks: 'Fleet insurance policy uploaded.' },
    { id: 'AL-0002', action: 'BUS_APPROVED', performedBy: 'Admin-01', timestamp: 'Oct 01, 2024 • 2:00 PM' },
    { id: 'AL-0003', action: 'COMPANY_APPROVED', performedBy: 'Admin-01', timestamp: 'Sep 03, 2024 • 11:00 AM' },
    { id: 'AL-0004', action: 'KYC_VERIFIED', performedBy: 'Admin-01', timestamp: 'Sep 03, 2024 • 10:00 AM' },
    { id: 'AL-0005', action: 'COMPANY_REGISTERED', performedBy: 'System', timestamp: 'Sep 01, 2024 • 9:00 AM' },
  ],
}

const ActivityLogTab = ({ company }) => {
  const logs = companyActivityMap[company?.id] || []

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#F5F5F4] flex items-center justify-center">
          <Activity className="w-6 h-6 text-text-muted/40" />
        </div>
        <span className="text-text-muted">No activity recorded yet.</span>
        <span className="text-[10px] text-text-muted">
          All governance actions will be logged here automatically.
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-1">
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <Activity className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-xs font-semibold text-text">
          {logs.length} audit {logs.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

        <div className="flex flex-col gap-4">
          {logs.map((event, idx) => {
            const config = actionConfig[event.action] || actionConfig.COMPANY_REGISTERED
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
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-semibold ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono shrink-0">
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
                  {event.metadata?.detail && (
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-text-muted">
                      <FaKey className="w-2.5 h-2.5 text-[#D4A800]" />
                      <span className="font-mono">{event.metadata.detail}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Governance footer */}
      <div className="flex items-center gap-1.5 px-1 text-[10px] text-text-muted mt-2">
        <FaShieldAlt className="w-2.5 h-2.5" />
        <span>Audit trail is immutable and tamper-proof. All entries are cryptographically signed.</span>
      </div>
    </div>
  )
}

export default ActivityLogTab
