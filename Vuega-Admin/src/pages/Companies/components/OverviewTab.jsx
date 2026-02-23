import React from 'react'
import {
  Building2,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Bus,
  Route,
} from 'lucide-react'
import { FaShieldAlt } from 'react-icons/fa'
import CompanyStatusBadge from './CompanyStatusBadge'


// ═══════════════════════════════════════════════════════════════
//  Data source:
//    GET /api/companies/:id/details  → overview section
// ═══════════════════════════════════════════════════════════════

/**
 * Renders a labeled info row
 */
const InfoRow = ({ icon: Icon, label, value, mono = false }) => (
  <div className="flex items-start gap-3">
    <div className="w-7 h-7 rounded-lg bg-[#F5F5F4] flex items-center justify-center shrink-0 mt-0.5">
      <Icon className="w-3.5 h-3.5 text-text-muted" />
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted/70">
        {label}
      </span>
      <span className={`text-sm text-text ${mono ? 'font-mono' : 'font-medium'}`}>
        {value}
      </span>
    </div>
  </div>
)

/**
 * Entitlement gauge bar
 */
const EntitlementGauge = ({ label, used, limit, icon: Icon }) => {
  const pct = limit > 0 ? Math.round((used / limit) * 100) : 0
  const isNearLimit = pct >= 80
  const barColor = isNearLimit ? 'bg-alert' : 'bg-accent'
  const textColor = isNearLimit ? 'text-alert' : 'text-text'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs font-semibold text-text">{label}</span>
        </div>
        <span className={`text-xs font-bold ${textColor}`}>
          {used}/{limit}
        </span>
      </div>
      <div className="w-full h-2 bg-[#F5F5F4] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="text-[10px] text-text-muted text-right">{pct}% utilized</span>
    </div>
  )
}

const OverviewTab = ({ company }) => {
  if (!company) return null

  const { compliance, entitlementsSummary, contact } = company

  // Compliance score color
  const scoreColor =
    compliance.score >= 80
      ? 'text-[#2E86AB]'
      : compliance.score >= 50
        ? 'text-[#D4A800]'
        : 'text-alert'

  const complianceIcon =
    compliance.status === 'Compliant'
      ? ShieldCheck
      : compliance.status === 'Non-Compliant'
        ? AlertTriangle
        : FaShieldAlt

  const ComplianceIcon = complianceIcon

  return (
    <div className="flex flex-col gap-5 py-1">
      {/* ── Company Identity Card ── */}
      <div className="bg-[#F5F5F4] rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-text" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-text">{company.name}</span>
              <span className="text-[10px] font-mono text-text-muted">
                {company.operatorCode}
              </span>
            </div>
          </div>
          <CompanyStatusBadge status={company.status} />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <InfoRow icon={Mail} label="Email" value={contact.email} />
          <InfoRow icon={Phone} label="Phone" value={contact.phone} />
          <InfoRow icon={Calendar} label="Registered" value={company.createdDate} />
          <InfoRow
            icon={Building2}
            label="Company ID"
            value={company.id}
            mono
          />
        </div>
      </div>

      {/* ── Compliance Status Card ── */}
      <div className="bg-primary rounded-xl border border-border p-4 flex flex-col gap-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Compliance Status
        </h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                compliance.status === 'Compliant'
                  ? 'bg-accent/20'
                  : compliance.status === 'Non-Compliant'
                    ? 'bg-alert/10'
                    : 'bg-secondary'
              }`}
            >
              <ComplianceIcon
                className={`w-4 h-4 ${
                  compliance.status === 'Compliant'
                    ? 'text-[#2E86AB]'
                    : compliance.status === 'Non-Compliant'
                      ? 'text-alert'
                      : 'text-text-muted'
                }`}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-text">
                {compliance.status}
              </span>
              <span className="text-[10px] text-text-muted">
                Governance compliance assessment
              </span>
            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center">
            <span className={`text-xl font-bold ${scoreColor}`}>
              {compliance.score}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-text-muted font-semibold">
              Score
            </span>
          </div>
        </div>
      </div>

      {/* ── Entitlements Summary ── */}
      <div className="bg-primary rounded-xl border border-border p-4 flex flex-col gap-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Entitlements Usage
        </h4>
        <EntitlementGauge
          label="Bus Allocation"
          used={entitlementsSummary.busUsed}
          limit={entitlementsSummary.busLimit}
          icon={Bus}
        />
        <EntitlementGauge
          label="Route Allocation"
          used={entitlementsSummary.routeUsed}
          limit={entitlementsSummary.routeLimit}
          icon={Route}
        />
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-primary rounded-xl border border-border p-3 flex flex-col gap-1 items-center">
          <span className="text-lg font-bold text-text">{company.totalBuses}</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted">
            Total Buses
          </span>
        </div>
        <div className="bg-primary rounded-xl border border-border p-3 flex flex-col gap-1 items-center">
          <span className="text-lg font-bold text-text">{company.activeTrips}</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted">
            Active Trips
          </span>
        </div>
      </div>
    </div>
  )
}

export default OverviewTab
