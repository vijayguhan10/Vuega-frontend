import React from 'react'
import { AlertTriangle, ShieldCheck, RotateCcw, XCircle } from 'lucide-react'

const actionConfig = {
  approve: {
    title: 'Approve Company',
    description: 'This company will be activated and granted platform access. The operator will be able to manage buses, trips, and employees.',
    icon: ShieldCheck,
    iconBg: 'bg-accent/30',
    iconColor: 'text-[#2E86AB]',
    confirmLabel: 'Confirm Approval',
    confirmStyle: 'bg-accent text-text hover:bg-accent/80',
    destructive: false,
  },
  reject: {
    title: 'Reject Company',
    description: 'This company registration will be rejected. The operator will be notified and will need to resubmit their application.',
    icon: XCircle,
    iconBg: 'bg-alert/10',
    iconColor: 'text-alert',
    confirmLabel: 'Confirm Rejection',
    confirmStyle: 'bg-alert/10 text-alert hover:bg-alert/20',
    destructive: true,
    requireRemarks: true,
  },
  suspend: {
    title: 'Suspend Company',
    description: 'This company will be immediately suspended. All active bus operations and trip listings will be frozen until reactivation.',
    icon: AlertTriangle,
    iconBg: 'bg-alert/10',
    iconColor: 'text-alert',
    confirmLabel: 'Confirm Suspension',
    confirmStyle: 'bg-alert/10 text-alert hover:bg-alert/20',
    destructive: true,
    requireRemarks: true,
  },
  reactivate: {
    title: 'Reactivate Company',
    description: 'This company will be reactivated and restored to Active status. All bus operations and trip listings will resume.',
    icon: RotateCcw,
    iconBg: 'bg-accent/30',
    iconColor: 'text-[#2E86AB]',
    confirmLabel: 'Confirm Reactivation',
    confirmStyle: 'bg-accent text-text hover:bg-accent/80',
    destructive: false,
  },
}

const ConfirmationModal = ({ action, company, onConfirm, onCancel }) => {
  const config = actionConfig[action]
  const [remarks, setRemarks] = React.useState('')

  if (!config || !company) return null

  const Icon = config.icon
  const canSubmit = config.requireRemarks ? remarks.trim().length > 0 : true

  const handleConfirm = () => {
    onConfirm(config.requireRemarks ? remarks.trim() : null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-primary rounded-xl shadow-lg w-full max-w-md mx-4 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${config.iconBg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text">{config.title}</h3>
              <span className="text-xs font-mono text-text-muted">{company.operatorCode}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4">
          {/* Company details */}
          <div className="flex flex-col gap-2.5 text-sm text-text">
            <div className="flex justify-between">
              <span className="text-text-muted">Company</span>
              <span className="font-semibold">{company.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Current Status</span>
              <span className="font-semibold">{company.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Total Buses</span>
              <span>{company.totalBuses}</span>
            </div>
          </div>

          {/* Description */}
          <div className={`rounded-lg p-3 text-xs ${config.destructive ? 'bg-alert/5 text-alert' : 'bg-accent/20 text-text'}`}>
            <p>{config.description}</p>
          </div>

          {/* Remarks (mandatory for destructive actions) */}
          {config.requireRemarks && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Remarks <span className="text-alert">*</span>
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                placeholder={`Provide reason for ${action}...`}
                className="w-full p-3 text-text bg-primary border border-border rounded-lg placeholder-text-muted focus:ring-2 focus:ring-alert/30 focus:border-alert outline-none transition-all resize-none"
              />
            </div>
          )}

          {/* Audit notice */}
          <div className="flex items-start gap-2 rounded-lg bg-[#F5F5F4] border border-border p-3">
            <ShieldCheck className="w-3 h-3 text-text-muted mt-0.5 shrink-0" />
            <p className="text-[10px] leading-relaxed text-text-muted">
              This action will be <span className="text-[10px] text-text">permanently recorded</span> in the
              platform audit ledger. Performed by <span className="text-[10px] text-text">Super Admin</span> •
              Timestamp auto-captured • <span className="text-[10px] text-text">Immutable — cannot be reversed.</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            onClick={handleConfirm}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              canSubmit
                ? config.confirmStyle
                : 'bg-border text-text-muted cursor-not-allowed'
            }`}
          >
            {config.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
