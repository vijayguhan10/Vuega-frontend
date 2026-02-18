import React from 'react'


const statusMap = {
  Pending: 'bg-secondary text-text',
  Approved: 'bg-accent text-text',
  Rejected: 'bg-alert/10 text-alert',
}

const StatusBadge = ({ status }) => {
  const classes = statusMap[status] || 'bg-surface text-text'

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      {status}
    </span>
  )
}

export default StatusBadge
