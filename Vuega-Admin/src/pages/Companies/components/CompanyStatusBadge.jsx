import React from 'react'

const statusMap = {
  Pending: 'bg-secondary text-text',
  Active: 'bg-accent text-text',
  Suspended: 'bg-alert/20 text-alert',
  Rejected: 'bg-alert/10 text-alert',
}

const CompanyStatusBadge = ({ status }) => {
  const classes = statusMap[status] || 'bg-surface text-text'

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}
    >
      {status}
    </span>
  )
}

export default CompanyStatusBadge
