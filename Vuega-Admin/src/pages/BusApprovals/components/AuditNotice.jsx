import React from 'react'
import { FaLock } from 'react-icons/fa'


/**
 * @param {Object} props
 * @param {'approve' | 'reject'} props.action — The action type
 * @param {string} props.performedBy          — Admin user name / ID
 */
const AuditNotice = ({ action = 'approve', performedBy = 'Super Admin' }) => {
  const actionLabel = action === 'reject' ? 'REJECTION' : 'APPROVAL'

  return (
    <div className="flex items-start gap-2 rounded-lg bg-[#F5F5F4] border border-border p-3">
      <FaLock className="w-3 h-3 text-text-muted mt-0.5 shrink-0" />
      <p className="text-[10px] leading-relaxed text-text-muted">
        This {actionLabel.toLowerCase()} action will be{' '}
        <span className="text-[10px] text-text">permanently recorded</span> in the
        platform audit ledger. Performed by{' '}
        <span className="text-[10px] text-text">{performedBy}</span> •{' '}
        Timestamp auto-captured • Action ID auto-generated •{' '}
        <span className="text-[10px] text-text">Immutable — cannot be reversed.</span>
      </p>
    </div>
  )
}

export default AuditNotice
