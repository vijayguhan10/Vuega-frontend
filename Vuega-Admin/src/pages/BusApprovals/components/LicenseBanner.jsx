import React from 'react'
import { FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

// ═══════════════════════════════════════════════════════════════
//  Data source:
//    GET /api/control-plane/operators/:companyId/license
// ═══════════════════════════════════════════════════════════════

const bannerConfig = {
  valid: {
    bg: 'bg-accent/30',
    border: 'border-accent',
    icon: FaCheckCircle,
    iconColor: 'text-[#2E86AB]',
    title: 'License Valid',
  },
  expiring: {
    bg: 'bg-secondary',
    border: 'border-[#D4A800]',
    icon: FaExclamationTriangle,
    iconColor: 'text-[#D4A800]',
    title: 'License Expiring Soon',
  },
  expired: {
    bg: 'bg-alert/10',
    border: 'border-alert',
    icon: FaTimesCircle,
    iconColor: 'text-alert',
    title: 'License Expired',
  },
}

/**
 * @param {Object} props
 * @param {'valid' | 'expiring' | 'expired'} props.licenseStatus
 * @param {string} props.licenseNumber   
 * @param {string} props.validUntil      
 * @param {number} [props.daysRemaining] 
 */
const LicenseBanner = ({ licenseStatus, licenseNumber, validUntil, daysRemaining }) => {
  const config = bannerConfig[licenseStatus] || bannerConfig.valid
  const Icon = config.icon

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border ${config.border} ${config.bg} p-3`}
    >
      <div className="mt-0.5">
        <Icon className={`w-4 h-4 ${config.iconColor}`} />
      </div>
      <div className="flex flex-col gap-0.5 flex-1">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold ${config.iconColor}`}>
            {config.title}
          </span>
          <span className="text-[10px] font-mono text-text-muted">
            {licenseNumber}
          </span>
        </div>
        <p className="text-xs text-text-muted">
          {licenseStatus === 'expired' ? (
            <>
              Expired on <span className="font-semibold text-alert">{validUntil}</span>.
              Approval is <span className="font-bold text-alert">BLOCKED</span> until renewed.
            </>
          ) : licenseStatus === 'expiring' ? (
            <>
              Valid until <span className="font-semibold">{validUntil}</span> — only{' '}
              <span className="font-bold text-[#D4A800]">{daysRemaining} days</span> remaining.
            </>
          ) : (
            <>
              Valid until <span className="font-semibold">{validUntil}</span>.
              {daysRemaining != null && (
                <span className="text-text-muted"> ({daysRemaining} days remaining)</span>
              )}
            </>
          )}
        </p>
      </div>
      <div className="mt-0.5">
        <FaShieldAlt className="w-3.5 h-3.5 text-text-muted/40" />
      </div>
    </div>
  )
}

export default LicenseBanner
