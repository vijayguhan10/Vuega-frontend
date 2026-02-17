import React from 'react'

// ═══════════════════════════════════════════════════════════════
//  ProgressBar — Reusable progress visualization
//  Shows a bar with current/max values and optional color override
// ═══════════════════════════════════════════════════════════════

const ProgressBar = ({ current, max, label, showFraction = true }) => {
  const percentage = Math.min((current / max) * 100, 100)
  const isNearLimit = percentage >= 80 && percentage < 100
  const isExceeded = current >= max

  // Color logic: exceeded → alert red, near-limit → accent, normal → black
  const barColor = isExceeded
    ? 'bg-alert'
    : isNearLimit
      ? 'bg-accent'
      : 'bg-text'

  const textColor = isExceeded
    ? 'text-alert'
    : 'text-text'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted">{label}</span>
        {showFraction && (
          <span className={`text-xs font-semibold ${textColor}`}>
            {current}/{max}
          </span>
        )}
      </div>
      <div className="w-full h-2 bg-border/30 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
