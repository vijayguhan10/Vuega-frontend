import React from 'react'


const riskConfig = {
  Low: {
    bg: 'bg-accent',
    text: 'text-text',
    dot: 'bg-[#4DA8DA]',
    label: 'Low',
  },
  Medium: {
    bg: 'bg-secondary',
    text: 'text-text',
    dot: 'bg-[#D4A800]',
    label: 'Medium',
  },
  High: {
    bg: 'bg-alert/15',
    text: 'text-alert',
    dot: 'bg-alert/60',
    label: 'High',
  },
  Critical: {
    bg: 'bg-alert/20',
    text: 'text-alert',
    dot: 'bg-alert',
    label: 'Critical',
  },
}

const RiskBadge = ({ level }) => {
  const config = riskConfig[level] || riskConfig.Low

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

export default RiskBadge
