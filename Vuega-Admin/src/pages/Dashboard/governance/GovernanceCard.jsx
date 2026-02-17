import React from 'react'

// ═══════════════════════════════════════════════════════════════
//  GovernanceCard — Reusable card wrapper for all governance panels
//  Matches existing Dashboard card styling exactly:
//    bg-primary, rounded-xl, border border-border, shadow-sm, p-6
// ═══════════════════════════════════════════════════════════════

const GovernanceCard = ({ title, icon: Icon, children, className = '' }) => {
  return (
    <div className={`bg-primary rounded-xl border border-border shadow-sm p-6 flex flex-col ${className}`}>
      {title && (
        <div className="flex items-center gap-3 mb-5">
          {Icon && (
            <div className="p-2 rounded-lg bg-secondary flex items-center justify-center">
              <Icon size={18} className="text-text" />
            </div>
          )}
          <h3 className="text-sm font-bold text-text">{title}</h3>
        </div>
      )}
      {children}
    </div>
  )
}

export default GovernanceCard
