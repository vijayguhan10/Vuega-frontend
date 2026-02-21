import React, { useState } from 'react'
import { X } from 'lucide-react'
import { FaShieldAlt } from 'react-icons/fa'
import OverviewTab from './OverviewTab'
import BusesTab from './BusesTab'
import TripsTab from './TripsTab'

// ═══════════════════════════════════════════════════════════════
//  COMPANY DETAIL DRAWER — Stage 2
//  Right-side slide-in drawer with tabbed navigation:
//    Overview | Buses | Trips
// ═══════════════════════════════════════════════════════════════
//  Data source:
//    GET /api/companies/:id/details  → full company object
// ═══════════════════════════════════════════════════════════════

// Tab config
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'buses', label: 'Buses' },
  { id: 'trips', label: 'Trips' },
  // Stage 3 tabs (placeholder):
  // { id: 'employees', label: 'Employees' },
  // { id: 'analytics', label: 'Analytics' },
  // { id: 'kyc', label: 'KYC' },
  // { id: 'activity', label: 'Activity' },
]

const CompanyDetailDrawer = ({ isOpen, onClose, company, initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState(initialTab)

  // Reset tab when company changes
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab)
    }
  }, [isOpen, company?.id, initialTab])

  if (!isOpen || !company) return null

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab company={company} />
      case 'buses':
        return <BusesTab company={company} />
      case 'trips':
        return <TripsTab company={company} />
      default:
        return <OverviewTab company={company} />
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-primary shadow-2xl flex flex-col animate-slide-in-right">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-bold text-text">{company.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-text-muted">
                {company.operatorCode}
              </span>
              <span className="text-text-muted/30">•</span>
              <span className="text-[10px] font-mono text-text-muted">
                {company.id}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#F5F5F4] transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4 text-text-muted" />
          </button>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="flex border-b border-border px-6 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-3 text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'text-text'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              {tab.label}
              {/* Active indicator */}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-text rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderTabContent()}
        </div>

        {/* ── Governance Footer ── */}
        <div className="px-6 py-3 border-t border-border bg-white flex items-center gap-2 shrink-0">
          <FaShieldAlt className="w-3 h-3 text-text-muted shrink-0" />
          <span className="text-[10px] text-text-muted">
            Company details are read-only. Status changes must go through governance actions.
          </span>
        </div>
      </div>
    </>
  )
}

export default CompanyDetailDrawer
