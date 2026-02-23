import React from 'react'
import {
  Eye,
  CheckCircle,
  XCircle,
  ShieldOff,
  RotateCcw,
  FileSearch,
} from 'lucide-react'

const ActionDropdown = ({ status, onAction }) => {
  // Build actions based on lifecycle governance
  const actions = []

  actions.push({
    key: 'view',
    label: 'View Details',
    icon: Eye,
    color: 'text-text-muted hover:text-[#2E86AB] hover:bg-accent/15',
  })

  if (status === 'Pending') {
    actions.push({
      key: 'approve',
      label: 'Approve',
      icon: CheckCircle,
      color: 'text-[#2E86AB] hover:bg-accent/15',
    })
    actions.push({
      key: 'reject',
      label: 'Reject',
      icon: XCircle,
      color: 'text-alert/70 hover:text-alert hover:bg-alert/8',
    })
  }

  if (status === 'Active') {
    actions.push({
      key: 'suspend',
      label: 'Suspend',
      icon: ShieldOff,
      color: 'text-alert/70 hover:text-alert hover:bg-alert/8',
    })
  }

  if (status === 'Suspended') {
    actions.push({
      key: 'reactivate',
      label: 'Reactivate',
      icon: RotateCcw,
      color: 'text-[#2E86AB] hover:bg-accent/15',
    })
  }

  if (status !== 'Rejected') {
    actions.push({
      key: 'kyc',
      label: 'KYC',
      icon: FileSearch,
      color: 'text-text-muted hover:text-[#D4A800] hover:bg-secondary/60',
    })
  }

  return (
    <div className="flex items-center gap-0.5">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.key}
            onClick={() => onAction(action.key)}
            className={`p-1.5 rounded-lg transition-all duration-150 ${action.color}`}
            title={action.label}
          >
            <Icon className="w-[15px] h-[15px]" strokeWidth={2} />
          </button>
        )
      })}
    </div>
  )
}

export default ActionDropdown
