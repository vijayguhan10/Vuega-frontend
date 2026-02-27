import React from 'react'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'

/**
 * Reusable MetricCards Component
 *
 * Works like the Table component — define card configs with renderCell-style
 * customisation, then pass them in. Supports multiple variants.
 *
 * ── VARIANTS ──
 *  "default"  → icon + label top-row, big value, optional sub-text
 *  "trend"    → label + value on left, icon on right, trend row at bottom
 *  "centered" → value on top, label below, centered layout
 *  "status"   → colored-dot label, big value, sub-text (license-style cards)
 *
 * @param {Array}  cards       - Array of card config objects
 * @param {string} variant     - "default" | "trend" | "centered" | "status"
 * @param {string} gridCols    - Tailwind grid classes (default: "grid-cols-2 md:grid-cols-4")
 * @param {string} gap         - Tailwind gap class (default: "gap-4")
 * @param {string} className   - Extra classes for the grid wrapper
 */

// ═══════════════════════════════════════════════════════════════
//  INDIVIDUAL CARD RENDERERS
// ═══════════════════════════════════════════════════════════════

/** Default card — icon + label row, value underneath, optional sub-text */
const DefaultCard = ({ card }) => {
  const Icon = card.icon
  return (
    <div className={`bg-primary rounded-xl border border-border p-4 flex flex-col gap-2 ${card.shadow ? 'shadow-sm' : ''} ${card.className || ''}`}>
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg ${card.iconBg || 'bg-secondary'} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${card.iconColor || 'text-text'}`} />
        </div>
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          {card.label}
        </span>
      </div>
      <span className={`text-2xl font-bold ${card.valueColor || 'text-text'} leading-none`}>
        {card.value}
      </span>
      {card.subText && (
        <span className={`text-[10px] ${card.subTextColor || 'text-text-muted'}`}>
          {card.subText}
        </span>
      )}
      {card.renderExtra && card.renderExtra(card)}
    </div>
  )
}

/** Trend card — label + value left, icon right, trend row at bottom */
const TrendCard = ({ card }) => {
  const Icon = card.icon
  return (
    <div className={`bg-primary rounded-xl border border-border shadow-sm p-6 flex flex-col gap-4 border-t-[3px] ${card.borderColor || 'border-t-accent'} ${card.className || ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
            {card.label}
          </p>
          <h3 className={`text-2xl font-bold ${card.valueColor || 'text-text'}`}>
            {card.value}
          </h3>
        </div>
        <div className={`p-2.5 rounded-lg ${card.iconBg || 'bg-accent/30'} flex items-center justify-center`}>
          <Icon size={20} className={card.iconColor || 'text-text'} />
        </div>
      </div>
      {card.trend && (
        <div className="flex items-center gap-2">
          {card.trend.direction === 'up' ? (
            <FaArrowUp size={14} className={card.isAlert ? 'text-alert' : 'text-text-muted'} />
          ) : (
            <FaArrowDown size={14} className="text-text-muted" />
          )}
          <span className={`text-xs font-semibold ${card.isAlert ? 'text-alert' : 'text-text'}`}>
            {card.trend.value}
          </span>
          <span className="text-xs text-text-muted">
            {card.trend.label}
          </span>
        </div>
      )}
      {card.renderExtra && card.renderExtra(card)}
    </div>
  )
}

/** Centered card — value on top, label below */
const CenteredCard = ({ card }) => (
  <div className={`bg-primary rounded-xl border border-border p-3 flex flex-col gap-1 items-center ${card.className || ''}`}>
    <span className={`text-lg font-bold ${card.valueColor || 'text-text'}`}>
      {card.value}
    </span>
    <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted">
      {card.label}
    </span>
    {card.renderExtra && card.renderExtra(card)}
  </div>
)

/** Status card — colored dot + label, value, sub-text (license-style) */
const StatusCard = ({ card }) => (
  <div className={`rounded-xl p-4 flex flex-col gap-1.5 border transition-colors ${card.bg || 'bg-[#F8F8F7]'} ${card.borderClass || 'border-transparent hover:border-border'} ${card.className || ''}`}>
    <div className="flex items-center gap-1.5">
      <span className={`w-2.5 h-2.5 rounded-md ${card.dotColor || 'bg-text/15'} ${card.dotPulse ? 'animate-pulse' : ''}`} />
      <span className={`text-[10px] font-bold uppercase tracking-wider ${card.labelColor || 'text-text-muted'}`}>
        {card.label}
      </span>
    </div>
    <span className={`text-2xl font-bold leading-none ${card.valueColor || 'text-text'}`}>
      {card.value}
    </span>
    {card.subText && (
      <span className={`text-[10px] ${card.subTextColor || 'text-text-muted'}`}>
        {card.subText}
      </span>
    )}
    {card.renderExtra && card.renderExtra(card)}
  </div>
)

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const MetricCards = ({
  cards = [],
  variant = 'default',
  gridCols = 'grid-cols-2 md:grid-cols-4',
  gap = 'gap-4',
  className = '',
}) => {
  const CardComponent = {
    default: DefaultCard,
    trend: TrendCard,
    centered: CenteredCard,
    status: StatusCard,
  }[variant] || DefaultCard

  return (
    <div className={`grid ${gridCols} ${gap} ${className}`}>
      {cards.map((card, idx) => (
        <CardComponent key={card.label || idx} card={card} />
      ))}
    </div>
  )
}

export default MetricCards
