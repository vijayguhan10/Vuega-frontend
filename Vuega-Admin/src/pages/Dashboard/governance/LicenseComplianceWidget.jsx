import React from 'react'
import { FaFileContract, FaExclamationTriangle } from 'react-icons/fa'
import GovernanceCard from './GovernanceCard'

// ═══════════════════════════════════════════════════════════════
//  License & Contract Compliance Widget
//  GET /api/control-plane/compliance
//
//  @typedef {Object} LicenseStatus
//  @property {number} expiringLicenses    — licenses expiring within 30 days
//  @property {number} expiredLicenses     — currently expired (critical)
//  @property {number} entitlementUtilization — % of entitlements used
//  @property {number} upgradeRequired     — operators needing plan upgrade
// ═══════════════════════════════════════════════════════════════

// Mock data — will be replaced by API call
const licenseCompliance = {
  expiringLicenses: 4,
  expiredLicenses: 1,
  entitlementUtilization: 78,
  upgradeRequired: 2,
}

const LicenseComplianceWidget = () => {
  const items = [
    {
      label: 'Expiring Licenses (<30d)',
      value: licenseCompliance.expiringLicenses,
      highlight: licenseCompliance.expiringLicenses > 0,
      highlightColor: 'text-text',
      badge: licenseCompliance.expiringLicenses > 0 ? 'bg-secondary' : '',
    },
    {
      label: 'Expired Licenses',
      value: licenseCompliance.expiredLicenses,
      highlight: licenseCompliance.expiredLicenses > 0,
      highlightColor: 'text-alert',
      badge: licenseCompliance.expiredLicenses > 0 ? 'bg-alert/10' : '',
    },
    {
      label: 'Entitlement Utilization',
      value: `${licenseCompliance.entitlementUtilization}%`,
      highlight: false,
      highlightColor: 'text-text',
      badge: '',
    },
    {
      label: 'Upgrade Required',
      value: licenseCompliance.upgradeRequired,
      highlight: licenseCompliance.upgradeRequired > 0,
      highlightColor: 'text-text',
      badge: licenseCompliance.upgradeRequired > 0 ? 'bg-accent/30' : '',
    },
  ]

  return (
    <GovernanceCard title="License & Contract Compliance" icon={FaFileContract}>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={`flex items-center justify-between px-4 py-3 rounded-lg border border-border/50 ${item.badge || 'bg-white'}`}
          >
            <div className="flex items-center gap-2">
              {item.highlight && (
                <FaExclamationTriangle size={12} className={item.highlightColor} />
              )}
              <span className="text-xs font-medium text-text-muted">{item.label}</span>
            </div>
            <span className={`text-sm font-bold ${item.highlight ? item.highlightColor : 'text-text'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </GovernanceCard>
  )
}

export default LicenseComplianceWidget
