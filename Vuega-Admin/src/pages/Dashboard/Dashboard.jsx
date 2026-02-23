
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Table from '../../components/Common/Table'
import {
  FaBuilding,
  FaCheckCircle,
  FaBan,
  FaBus,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaClock,
  FaClipboardList,
  FaArrowUp,
  FaArrowDown,
  FaEye,
} from 'react-icons/fa'

import GovernanceHealthPanel from './components/GovernanceHealthPanel'
import LicenseComplianceWidget from './components/LicenseComplianceWidget'
import EntitlementOverview from './components/EntitlementOverview'
import ApprovalGovernanceMetrics from './components/ApprovalGovernanceMetrics'
import RiskViolationPanel from './components/RiskViolationPanel'
import AuditEnforcementSummary from './components/AuditEnforcementSummary'

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA — Will be replaced by API calls via useEffect
// ═══════════════════════════════════════════════════════════════
// TODO: Replace with:
//   useEffect(() => {
//     const fetchSummary = async () => {
//       const res = await fetch('/api/control-plane/dashboard/summary', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await res.json();
//       setDashboardSummary(data);
//     };
//     fetchSummary();
//   }, []);

const dashboardSummary = {
  totalCompanies: 48,
  activeCompanies: 35,
  suspendedCompanies: 5,
  totalBuses: 312,
  activeTrips: 87,
  platformRevenue: 12450000,
  pendingCompanyRequests: 8,
  pendingBusRequests: 14,
}

// TODO: Replace with GET /api/control-plane/dashboard/recent-requests
const recentRequests = [
  {
    id: 1,
    companyName: 'SRS Travels Pvt Ltd',
    requestType: 'Company Registration',
    submittedDate: 'Feb 14, 2026',
    status: 'Pending',
  },
  {
    id: 2,
    companyName: 'KPN Travels',
    requestType: 'Bus Approval',
    submittedDate: 'Feb 13, 2026',
    status: 'Approved',
  },
  {
    id: 3,
    companyName: 'Parveen Travels',
    requestType: 'Bus Approval',
    submittedDate: 'Feb 13, 2026',
    status: 'Pending',
  },
  {
    id: 4,
    companyName: 'Orange Tours',
    requestType: 'Company Registration',
    submittedDate: 'Feb 12, 2026',
    status: 'Rejected',
  },
  {
    id: 5,
    companyName: 'VRL Travels',
    requestType: 'Bus Approval',
    submittedDate: 'Feb 12, 2026',
    status: 'Approved',
  },
  {
    id: 6,
    companyName: 'Neeta Travels',
    requestType: 'Company Registration',
    submittedDate: 'Feb 11, 2026',
    status: 'Pending',
  },
]

// ═══════════════════════════════════════════════════════════════
//  METRIC CARD CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const metricCards = [
  {
    label: 'Total Registered Companies',
    value: dashboardSummary.totalCompanies,
    icon: FaBuilding,
    borderColor: 'border-t-accent',
    iconBg: 'bg-accent/30',
    trend: { value: '+6', direction: 'up', label: 'this month' },
  },
  {
    label: 'Active Companies',
    value: dashboardSummary.activeCompanies,
    icon: FaCheckCircle,
    borderColor: 'border-t-accent',
    iconBg: 'bg-accent/30',
    trend: { value: '+3', direction: 'up', label: 'this month' },
  },
  {
    label: 'Suspended Companies',
    value: dashboardSummary.suspendedCompanies,
    icon: FaBan,
    borderColor: 'border-t-alert',
    iconBg: 'bg-alert/10',
    textColor: 'text-alert',
    trend: { value: '+1', direction: 'up', label: 'this week' },
    isAlert: true,
  },
  {
    label: 'Total Buses Across Platform',
    value: dashboardSummary.totalBuses,
    icon: FaBus,
    borderColor: 'border-t-accent',
    iconBg: 'bg-accent/30',
    trend: { value: '+24', direction: 'up', label: 'this month' },
  },
  {
    label: 'Active Trips (Today)',
    value: dashboardSummary.activeTrips,
    icon: FaMapMarkerAlt,
    borderColor: 'border-t-accent',
    iconBg: 'bg-accent/30',
    trend: { value: '+12', direction: 'up', label: 'vs yesterday' },
  },
  {
    label: 'Platform Revenue',
    value: `₹${(dashboardSummary.platformRevenue / 100000).toFixed(1)}L`,
    icon: FaRupeeSign,
    borderColor: 'border-t-secondary',
    iconBg: 'bg-secondary',
    trend: { value: '+18%', direction: 'up', label: 'this month' },
  },
  {
    label: 'Pending Company Requests',
    value: dashboardSummary.pendingCompanyRequests,
    icon: FaClock,
    borderColor: 'border-t-secondary',
    iconBg: 'bg-secondary',
    trend: { value: '+2', direction: 'up', label: 'today' },
  },
  {
    label: 'Pending Bus Requests',
    value: dashboardSummary.pendingBusRequests,
    icon: FaClipboardList,
    borderColor: 'border-t-secondary',
    iconBg: 'bg-secondary',
    trend: { value: '-3', direction: 'down', label: 'this week' },
  },
]



const getStatusBadge = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-secondary text-text'
    case 'Approved':
      return 'bg-accent text-text'
    case 'Rejected':
      return 'bg-alert/10 text-alert'
    default:
      return 'bg-surface text-text'
  }
}

// ═══════════════════════════════════════════════════════════════
//  DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════

const Dashboard = () => {
  // TODO: Replace with API-driven state
  // const [summary, setSummary] = useState(null);
  // const [requests, setRequests] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  const navigate = useNavigate()
  const [activeRequestTab, setActiveRequestTab] = useState('all')

  // Filter logic separated from JSX for performance
  const filteredRequests =
    activeRequestTab === 'all'
      ? recentRequests
      : recentRequests.filter(
        (r) => r.status.toLowerCase() === activeRequestTab
      )

  return (
    <div className="flex flex-col gap-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-text tracking-tight">
          Platform Overview
        </h1>
        <p className="text-sm text-text-muted">
          Governance dashboard for the centralized control plane. Monitor all
          registered operators, approvals, and platform-wide analytics.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════
           SECTION 1 — Metric Cards
           ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((card) => {
          const IconComponent = card.icon
          return (
            <div
              key={card.label}
              className={`
                bg-primary rounded-xl border border-border
                shadow-sm p-6 flex flex-col gap-4
                border-t-[3px] ${card.borderColor}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    {card.label}
                  </p>
                  <h3
                    className={`text-2xl font-bold ${card.textColor || 'text-text'
                      }`}
                  >
                    {card.value}
                  </h3>
                </div>
                <div
                  className={`p-2.5 rounded-lg ${card.iconBg} flex items-center justify-center`}
                >
                  <IconComponent
                    size={20}
                    className={card.isAlert ? 'text-alert' : 'text-text'}
                  />
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
            </div>
          )
        })}
      </div>

      <div>
        <h2 className="text-lg font-bold text-text mb-4">
          Governance & Compliance
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <GovernanceHealthPanel />
          <LicenseComplianceWidget />
          <div className="min-h-[120px]">
            <ApprovalGovernanceMetrics />
          </div>
          <RiskViolationPanel />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
           SECTION 3 — Entitlement Utilization (full width)
           ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <EntitlementOverview />
        <AuditEnforcementSummary />
      </div>

      {/* ══════════════════════════════════════════════════════════
           SECTION 4 — Recent Requests
           ══════════════════════════════════════════════════════════ */}
      {/* TODO: Replace mock data with GET /api/control-plane/dashboard/recent-requests */}
      <div className="bg-primary rounded-xl border border-border shadow-sm">
        {/* Section Header */}
        <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-text">
              Recent Requests
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Latest company registrations and bus approval submissions
            </p>
          </div>
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-border">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveRequestTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${activeRequestTab === tab
                  ? 'bg-primary text-text shadow-sm'
                  : 'text-text-muted hover:text-text'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Table
          data={filteredRequests}
          columns={[
            {
              header: 'Company Name',
              accessorKey: 'companyName',
              cell: (info) => (
                <span className="font-semibold text-text">
                  {info.getValue()}
                </span>
              ),
            },
            {
              header: 'Request Type',
              accessorKey: 'requestType',
              cell: (info) => (
                <span className="text-text-muted">
                  {info.getValue()}
                </span>
              ),
            },
            {
              header: 'Submitted Date',
              accessorKey: 'submittedDate',
              cell: (info) => (
                <span className="text-text-muted">
                  {info.getValue()}
                </span>
              ),
            },
            {
              header: 'Status',
              accessorKey: 'status',
              cell: (info) => (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadge(
                    info.getValue()
                  )}`}
                >
                  {info.getValue()}
                </span>
              ),
            },
            {
              header: () => <span className="block text-center">Action</span>,
              id: 'actions',
              cell: (info) => {
                const row = info.row.original
                const path =
                  row.requestType === 'Bus Approval'
                    ? `/bus-approvals?company=${encodeURIComponent(row.companyName)}`
                    : `/companies?company=${encodeURIComponent(row.companyName)}`
                return (
                  <div className="flex justify-center">
                    <button
                      onClick={() => navigate(path)}
                      title="View details"
                      className="inline-flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-text-muted hover:text-text hover:bg-border/40 transition-colors"
                    >
                      <FaEye size={15} />
                      <span className="text-[10px] font-medium leading-none">View</span>
                    </button>
                  </div>
                )
              },
            },
          ]}
        />

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-white flex justify-between items-center">
          <span className="text-xs text-text-muted">
            Showing {filteredRequests.length} of {recentRequests.length} requests
          </span>
          <button className="text-xs font-semibold text-text hover:underline">
            View All Requests
          </button>
        </div>
      </div>

    </div>
  )
}

export default Dashboard
