import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
//  ActionDropdown — Context-aware action menu for company rows
//  Actions vary based on company status (lifecycle governance):
//    Pending   → View Details, Approve, Reject, View KYC
//    Active    → View Details, Suspend, View KYC
//    Suspended → View Details, Reactivate, View KYC
//    Rejected  → View Details only (read-only)
// ═══════════════════════════════════════════════════════════════

const ActionDropdown = ({ status, onAction }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAction = (action) => {
    setIsOpen(false)
    onAction(action)
  }

  // Build actions based on lifecycle governance
  const actions = []

  actions.push({ key: 'view', label: 'View Details', destructive: false })

  if (status === 'Pending') {
    actions.push({ key: 'approve', label: 'Approve Company', destructive: false })
    actions.push({ key: 'reject', label: 'Reject Company', destructive: true })
  }

  if (status === 'Active') {
    actions.push({ key: 'suspend', label: 'Suspend Company', destructive: true })
  }

  if (status === 'Suspended') {
    actions.push({ key: 'reactivate', label: 'Reactivate Company', destructive: false })
  }

  if (status !== 'Rejected') {
    actions.push({ key: 'kyc', label: 'View & Verify KYC', destructive: false })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg text-text-muted hover:bg-[#F5F5F4] hover:text-text transition-colors"
        title="Actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-primary rounded-lg border border-border shadow-lg z-50 py-1 animate-fade-in">
          {actions.map((action, idx) => (
            <button
              key={action.key}
              onClick={() => handleAction(action.key)}
              className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                action.destructive
                  ? 'text-alert hover:bg-alert/5'
                  : 'text-text hover:bg-[#F5F5F4]'
              } ${idx > 0 && actions[idx - 1]?.key === 'view' ? 'border-t border-border' : ''}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActionDropdown
