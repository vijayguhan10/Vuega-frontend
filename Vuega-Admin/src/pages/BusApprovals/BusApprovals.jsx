import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, History, ShieldCheck, Key, AlertTriangle } from 'lucide-react'
import { FaShieldAlt } from 'react-icons/fa'
import FilterTabs from './components/FilterTabs'
import BusRequestTable from './components/BusRequestTable'
import StatusBadge from './components/StatusBadge'
import RiskBadge from './components/RiskBadge'
import LicenseBanner from './components/LicenseBanner'
import AuditNotice from './components/AuditNotice'
import HistoryDrawer from './components/HistoryDrawer'


// ═══════════════════════════════════════════════════════════════
//  BACKEND INTEGRATION ENDPOINTS (placeholder comments)
// ═══════════════════════════════════════════════════════════════
// GET    /api/control-plane/bus-requests
//          → Returns list with license, risk, audit data per request
// GET    /api/control-plane/operators/:companyId/license
//          → Returns { licenseNumber, validUntil, status }
// GET    /api/control-plane/operators/:companyId/risk-score
//          → Returns { level, score, factors[] }
// PATCH  /api/control-plane/bus-requests/:id/approve
//          → Validates license + entitlement server-side
//          → Generates signed, time-bound approval token
//          → POST /api/control-plane/approval-token
//          → Audit log: action = BUS_APPROVED
// PATCH  /api/control-plane/bus-requests/:id/reject
//          → Requires mandatory remarks
//          → Audit log: action = BUS_REJECTED
// GET    /api/control-plane/audit/:requestId
//          → Returns immutable audit trail for the request
// ═══════════════════════════════════════════════════════════════



/**
 * @typedef {Object} BusApprovalRequest
 * @property {string}  id
 * @property {string}  companyId
 * @property {string}  companyName
 * @property {string}  busNumber
 * @property {string}  layoutType
 * @property {string}  submittedDate
 * @property {number}  currentBusCount
 * @property {number}  busLimit
 * @property {string}  status          — Pending | Approved | Rejected
 * @property {string}  [remarks]
 * @property {string}  riskLevel       — Low | Medium | High | Critical
 * @property {number}  riskScore       — 0–100
 * @property {LicenseInfo} license
 * @property {ApprovalToken} [approvalToken]
 * @property {AuditEvent[]} auditHistory
 */

/**
 * @typedef {Object} LicenseInfo
 * @property {string} licenseNumber
 * @property {string} validUntil
 * @property {'valid' | 'expiring' | 'expired'} status
 * @property {number} daysRemaining
 */

/**
 * @typedef {Object} ApprovalToken
 * @property {string} tokenId
 * @property {string} issuedAt
 * @property {string} expiresAt
 * @property {'active' | 'consumed' | 'expired' | 'revoked'} state
 */

/**
 * @typedef {Object} AuditEvent
 * @property {string} id
 * @property {string} action
 * @property {string} performedBy
 * @property {string} timestamp
 * @property {string} [remarks]
 * @property {Object} [metadata]
 */

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA — Will be replaced by API calls via useEffect
// ═══════════════════════════════════════════════════════════════
// TODO: Replace with:
//   useEffect(() => {
//     const fetchRequests = async () => {
//       const res = await fetch('/api/control-plane/bus-requests', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await res.json();
//       setRequests(data);
//     };
//     fetchRequests();
//   }, []);

const initialRequests = [
  {
    id: 'BR-001',
    companyId: 'C-101',
    companyName: 'SRS Travels Pvt Ltd',
    busNumber: 'KA-01-AB-1234',
    layoutType: '2+1 Sleeper',
    submittedDate: 'Feb 16, 2026',
    currentBusCount: 10,
    busLimit: 15,
    status: 'Pending',
    riskLevel: 'Low',
    riskScore: 12,
    license: { licenseNumber: 'LIC-KA-2024-0451', validUntil: 'Dec 31, 2026', status: 'valid', daysRemaining: 318 },
    auditHistory: [
      { id: 'A-001', action: 'BUS_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 16, 2026 09:14 AM' },
    ],
  },
  {
    id: 'BR-002',
    companyId: 'C-102',
    companyName: 'KPN Travels',
    busNumber: 'TN-07-CD-5678',
    layoutType: '2+2 Seater',
    submittedDate: 'Feb 15, 2026',
    currentBusCount: 8,
    busLimit: 10,
    status: 'Pending',
    riskLevel: 'Medium',
    riskScore: 45,
    license: { licenseNumber: 'LIC-TN-2023-0892', validUntil: 'Mar 15, 2026', status: 'expiring', daysRemaining: 28 },
    auditHistory: [
      { id: 'A-002', action: 'BUS_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 15, 2026 02:30 PM' },
    ],
  },
  {
    id: 'BR-003',
    companyId: 'C-103',
    companyName: 'VRL Travels',
    busNumber: 'MH-12-EF-9101',
    layoutType: '2+1 AC Sleeper',
    submittedDate: 'Feb 15, 2026',
    currentBusCount: 20,
    busLimit: 20,
    status: 'Pending',
    riskLevel: 'High',
    riskScore: 78,
    license: { licenseNumber: 'LIC-MH-2024-1103', validUntil: 'Jan 10, 2026', status: 'expired', daysRemaining: 0 },
    auditHistory: [
      { id: 'A-003', action: 'BUS_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 15, 2026 11:00 AM' },
      { id: 'A-004', action: 'LIMIT_OVERRIDE', performedBy: 'System', timestamp: 'Feb 15, 2026 11:01 AM', remarks: 'Operator has reached bus entitlement limit (20/20).' },
    ],
  },
  {
    id: 'BR-004',
    companyId: 'C-104',
    companyName: 'Orange Tours',
    busNumber: 'AP-09-GH-1122',
    layoutType: '2+2 Semi-Sleeper',
    submittedDate: 'Feb 14, 2026',
    currentBusCount: 5,
    busLimit: 12,
    status: 'Approved',
    riskLevel: 'Low',
    riskScore: 8,
    license: { licenseNumber: 'LIC-AP-2025-0234', validUntil: 'Nov 30, 2026', status: 'valid', daysRemaining: 288 },
    approvalToken: { tokenId: 'TKN-8A3F-C901', issuedAt: 'Feb 14, 2026 03:00 PM', expiresAt: 'Feb 21, 2026 03:00 PM', state: 'consumed' },
    auditHistory: [
      { id: 'A-005', action: 'BUS_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 14, 2026 10:22 AM' },
      { id: 'A-006', action: 'BUS_APPROVED', performedBy: 'Admin (SA-001)', timestamp: 'Feb 14, 2026 03:00 PM' },
      { id: 'A-007', action: 'TOKEN_ISSUED', performedBy: 'System', timestamp: 'Feb 14, 2026 03:00 PM', metadata: { tokenId: 'TKN-8A3F-C901', tokenExpiry: 'Feb 21, 2026' } },
    ],
  },
  {
    id: 'BR-005',
    companyId: 'C-105',
    companyName: 'Neeta Travels',
    busNumber: 'GJ-05-IJ-3344',
    layoutType: '2+1 Seater',
    submittedDate: 'Feb 13, 2026',
    currentBusCount: 7,
    busLimit: 10,
    status: 'Rejected',
    remarks: 'Incomplete documentation submitted.',
    riskLevel: 'High',
    riskScore: 72,
    license: { licenseNumber: 'LIC-GJ-2024-0567', validUntil: 'Sep 30, 2026', status: 'valid', daysRemaining: 226 },
    auditHistory: [
      { id: 'A-008', action: 'BUS_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 13, 2026 08:45 AM' },
      { id: 'A-009', action: 'BUS_REJECTED', performedBy: 'Admin (SA-001)', timestamp: 'Feb 13, 2026 04:12 PM', remarks: 'Incomplete documentation submitted.' },
    ],
  },
  {
    id: 'BR-006',
    companyId: 'C-101',
    companyName: 'SRS Travels Pvt Ltd',
    busNumber: 'KA-01-KL-5566',
    layoutType: '2+2 AC Seater',
    submittedDate: 'Feb 12, 2026',
    currentBusCount: 10,
    busLimit: 15,
    status: 'Approved',
    riskLevel: 'Low',
    riskScore: 12,
    license: { licenseNumber: 'LIC-KA-2024-0451', validUntil: 'Dec 31, 2026', status: 'valid', daysRemaining: 318 },
    approvalToken: { tokenId: 'TKN-4B7D-E205', issuedAt: 'Feb 12, 2026 11:30 AM', expiresAt: 'Feb 19, 2026 11:30 AM', state: 'active' },
    auditHistory: [
      { id: 'A-010', action: 'BUS_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 12, 2026 09:00 AM' },
      { id: 'A-011', action: 'BUS_APPROVED', performedBy: 'Admin (SA-001)', timestamp: 'Feb 12, 2026 11:30 AM' },
      { id: 'A-012', action: 'TOKEN_ISSUED', performedBy: 'System', timestamp: 'Feb 12, 2026 11:30 AM', metadata: { tokenId: 'TKN-4B7D-E205', tokenExpiry: 'Feb 19, 2026' } },
    ],
  },
  {
    id: 'BR-007',
    companyId: 'C-106',
    companyName: 'Parveen Travels',
    busNumber: 'KA-19-MN-7788',
    layoutType: '2+1 Sleeper',
    submittedDate: 'Feb 11, 2026',
    currentBusCount: 12,
    busLimit: 12,
    status: 'Pending',
    riskLevel: 'Critical',
    riskScore: 91,
    license: { licenseNumber: 'LIC-KA-2023-1290', validUntil: 'Apr 01, 2026', status: 'expiring', daysRemaining: 45 },
    auditHistory: [
      { id: 'A-013', action: 'BUS_SUBMITTED', performedBy: 'Operator Portal', timestamp: 'Feb 11, 2026 07:15 AM' },
      { id: 'A-014', action: 'LIMIT_OVERRIDE', performedBy: 'System', timestamp: 'Feb 11, 2026 07:16 AM', remarks: 'Operator at 100% bus entitlement (12/12). License expiring in 45 days.' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════
//  GOVERNANCE SUMMARY — computed from request data
// ═══════════════════════════════════════════════════════════════

const computeGovernanceSummary = (requests) => {
  const pending = requests.filter((r) => r.status === 'Pending')
  const highRisk = requests.filter((r) => r.riskLevel === 'High' || r.riskLevel === 'Critical')
  const expiredLicense = requests.filter((r) => r.license.status === 'expired')
  const atLimit = requests.filter((r) => r.currentBusCount >= r.busLimit)
  return {
    totalPending: pending.length,
    highRiskCount: highRisk.length,
    expiredLicenseCount: expiredLicense.length,
    entitlementBlockedCount: atLimit.filter((r) => r.status === 'Pending').length,
  }
}

// ═══════════════════════════════════════════════════════════════
//  FILTER TAB CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const filterTabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
]

// ═══════════════════════════════════════════════════════════════
//  BUS APPROVALS PAGE COMPONENT — Governance-Aware
// ═══════════════════════════════════════════════════════════════

const BusApprovals = () => {
  // --- State ---
  const [searchParams] = useSearchParams()
  const [requests, setRequests] = useState(initialRequests)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Pre-fill search from Dashboard "View" navigation (?company=Name)
  useEffect(() => {
    const company = searchParams.get('company')
    if (company) setSearchQuery(company)
  }, [searchParams])

  // Modal state
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  // History drawer state
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false)
  const [historyRequest, setHistoryRequest] = useState(null)

  // Governance summary (memoized)
  const govSummary = useMemo(() => computeGovernanceSummary(requests), [requests])

  // --- Filtering logic ---
  const filteredRequests = useMemo(() => {
    let result = requests

    // Tab filter
    if (activeTab !== 'all') {
      result = result.filter((r) => r.status === activeTab)
    }

    // Search filter (company name, bus number, or request ID)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.companyName.toLowerCase().includes(q) ||
          r.busNumber.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
      )
    }

    return result
  }, [requests, activeTab, searchQuery])

  // --- Handlers ---
  const handleApproveClick = (request) => {
    setSelectedRequest(request)
    setApproveModalOpen(true)
  }

  const handleRejectClick = (request) => {
    setSelectedRequest(request)
    setRejectModalOpen(true)
  }

  const handleHistoryClick = (request) => {
    setHistoryRequest(request)
    setHistoryDrawerOpen(true)
  }

  // --- Approve confirm (simulated) ---
  const confirmApprove = () => {
    // TODO: PATCH /api/control-plane/bus-requests/:id/approve
    // TODO: POST /api/control-plane/approval-token
    //   → Server validates license status + entitlement before approval
    //   → Generate signed, time-bound token for the Operator Data Plane
    //   → Audit log: action = BUS_APPROVED, performedBy = currentUser
    const now = new Date()
    const expiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const tokenId = `TKN-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: 'Approved',
              approvalToken: {
                tokenId,
                issuedAt: now.toLocaleString(),
                expiresAt: expiry.toLocaleString(),
                state: 'active',
              },
              auditHistory: [
                ...r.auditHistory,
                {
                  id: `A-${Date.now()}`,
                  action: 'BUS_APPROVED',
                  performedBy: 'Admin (SA-001)',
                  timestamp: now.toLocaleString(),
                },
                {
                  id: `A-${Date.now() + 1}`,
                  action: 'TOKEN_ISSUED',
                  performedBy: 'System',
                  timestamp: now.toLocaleString(),
                  metadata: { tokenId, tokenExpiry: expiry.toLocaleDateString() },
                },
              ],
            }
          : r
      )
    )
    setApproveModalOpen(false)
    setSelectedRequest(null)
  }

  // --- Reject confirm (simulated) ---
  const confirmReject = (remarks) => {
    // TODO: PATCH /api/control-plane/bus-requests/:id/reject
    //   → Body: { remarks }
    //   → Audit log: action = BUS_REJECTED, performedBy = currentUser
    const now = new Date()
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: 'Rejected',
              remarks,
              auditHistory: [
                ...r.auditHistory,
                {
                  id: `A-${Date.now()}`,
                  action: 'BUS_REJECTED',
                  performedBy: 'Admin (SA-001)',
                  timestamp: now.toLocaleString(),
                  remarks,
                },
              ],
            }
          : r
      )
    )
    setRejectModalOpen(false)
    setSelectedRequest(null)
  }

  // ═══════════════════════════════════════════════════════════
  //  TABLE COLUMNS — Governance-enhanced
  // ═══════════════════════════════════════════════════════════

  const columns = useMemo(
    () => [
      {
        header: 'Company Name',
        accessorKey: 'companyName',
        cell: (info) => {
          const row = info.row.original
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-text">{info.getValue()}</span>
              <span className="text-[10px] font-mono text-text-muted">{row.id}</span>
            </div>
          )
        },
      },
      {
        header: 'Bus Number',
        accessorKey: 'busNumber',
        cell: (info) => (
          <span className="font-mono text-text-muted">{info.getValue()}</span>
        ),
      },
      {
        header: 'Layout Type',
        accessorKey: 'layoutType',
        cell: (info) => (
          <span className="text-text-muted text-xs">{info.getValue()}</span>
        ),
      },
      {
        header: 'Submitted',
        accessorKey: 'submittedDate',
        cell: (info) => (
          <span className="text-text-muted text-xs">{info.getValue()}</span>
        ),
      },
      {
        header: 'Entitlement',
        id: 'busUsage',
        accessorFn: (row) => row,
        cell: (info) => {
          const row = info.getValue()
          const atLimit = row.currentBusCount >= row.busLimit
          const usage = Math.round((row.currentBusCount / row.busLimit) * 100)
          return (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${atLimit ? 'text-alert' : 'text-text'}`}>
                  {row.currentBusCount}/{row.busLimit}
                </span>
                <span className={`text-[10px] ${atLimit ? 'text-alert' : 'text-text-muted'}`}>
                  {usage}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#F5F5F4] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    atLimit ? 'bg-alert' : usage >= 80 ? 'bg-[#D4A800]' : 'bg-accent'
                  }`}
                  style={{ width: `${Math.min(usage, 100)}%` }}
                />
              </div>
            </div>
          )
        },
      },
      {
        header: 'Risk',
        accessorKey: 'riskLevel',
        cell: (info) => <RiskBadge level={info.getValue()} />,
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: (info) => {
          const row = info.row.original
          return (
            <div className="flex items-center gap-1.5">
              {row.status === 'Pending' && (
                <>
                  <button
                    disabled={row.currentBusCount >= row.busLimit || row.license.status === 'expired'}
                    onClick={() => handleApproveClick(row)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                      row.currentBusCount >= row.busLimit || row.license.status === 'expired'
                        ? 'bg-border text-text-muted cursor-not-allowed'
                        : 'bg-accent text-text hover:bg-accent/80'
                    }`}
                    title={
                      row.license.status === 'expired'
                        ? 'License expired — cannot approve'
                        : row.currentBusCount >= row.busLimit
                        ? 'Bus limit reached — cannot approve'
                        : 'Approve this request'
                    }
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectClick(row)}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-alert/10 text-alert hover:bg-alert/20 transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => handleHistoryClick(row)}
                className="p-1.5 rounded-lg text-text-muted hover:bg-[#F5F5F4] hover:text-text transition-colors"
                title="View request history & audit trail"
              >
                <History className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        },
      },
    ],
    [requests]
  )

  // ═══════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-text tracking-tight">
          Bus Approval Management
        </h1>
        <p className="text-sm text-text-muted">
          Review and approve operator bus expansion requests under platform
          governance policies. All actions are permanently audit-logged.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════
           GOVERNANCE OVERVIEW CARDS
           ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Pending Requests */}
        <div className="bg-primary rounded-xl border border-border p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-text" />
            </div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Pending</span>
          </div>
          <span className="text-2xl font-bold text-text">{govSummary.totalPending}</span>
          <span className="text-[10px] text-text-muted">Awaiting review</span>
        </div>

        {/* High Risk */}
        <div className="bg-primary rounded-xl border border-border p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-alert/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-alert" />
            </div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">High Risk</span>
          </div>
          <span className="text-2xl font-bold text-alert">{govSummary.highRiskCount}</span>
          <span className="text-[10px] text-text-muted">Flagged operators</span>
        </div>

        {/* Expired Licenses */}
        <div className="bg-primary rounded-xl border border-border p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-alert/10 flex items-center justify-center">
              <FaShieldAlt className="w-3.5 h-3.5 text-alert" />
            </div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">License Issues</span>
          </div>
          <span className="text-2xl font-bold text-alert">{govSummary.expiredLicenseCount}</span>
          <span className="text-[10px] text-text-muted">Expired licenses blocking approval</span>
        </div>

        {/* Entitlement Blocked */}
        <div className="bg-primary rounded-xl border border-border p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Key className="w-4 h-4 text-text" />
            </div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">At Limit</span>
          </div>
          <span className="text-2xl font-bold text-text">{govSummary.entitlementBlockedCount}</span>
          <span className="text-[10px] text-text-muted">Requests blocked by entitlement cap</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
           MAIN TABLE CARD
           ═══════════════════════════════════════════════════════ */}
      <div className="bg-primary rounded-xl border border-border shadow-sm">
        {/* Section Header — Search + Filters */}
        <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search */}
          <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search by company, bus number, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-sm text-text bg-white border border-border rounded-lg placeholder-text-muted focus:ring-2 focus:ring-accent/50 focus:border-accent focus:bg-primary outline-none transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <FilterTabs
            tabs={filterTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Table */}
        <BusRequestTable
          data={filteredRequests}
          columns={columns}
          isLoading={false}
          emptyMessage="No bus approval requests match your filters."
        />

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-white flex justify-between items-center">
          <span className="text-xs text-text-muted">
            Showing {filteredRequests.length} of {requests.length} requests
          </span>
          <div className="flex items-center gap-2 text-[10px] text-text-muted">
            <FaShieldAlt className="w-3 h-3" />
            <span>All actions are governance-enforced & audit-logged</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
           APPROVE MODAL — Enhanced with Governance
           ═══════════════════════════════════════════════════════ */}
      {approveModalOpen && selectedRequest && (
        <ApproveModal
          request={selectedRequest}
          onConfirm={confirmApprove}
          onCancel={() => {
            setApproveModalOpen(false)
            setSelectedRequest(null)
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════
           REJECT MODAL — Enhanced with Audit Notice
           ═══════════════════════════════════════════════════════ */}
      {rejectModalOpen && selectedRequest && (
        <RejectModal
          request={selectedRequest}
          onConfirm={confirmReject}
          onCancel={() => {
            setRejectModalOpen(false)
            setSelectedRequest(null)
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════
           HISTORY DRAWER
           ═══════════════════════════════════════════════════════ */}
      <HistoryDrawer
        isOpen={historyDrawerOpen}
        onClose={() => {
          setHistoryDrawerOpen(false)
          setHistoryRequest(null)
        }}
        request={historyRequest}
        auditHistory={historyRequest?.auditHistory || []}
      />
    </div>
  )
}


const ApproveModal = ({ request, onConfirm, onCancel }) => {
  const atLimit = request.currentBusCount >= request.busLimit
  const licenseExpired = request.license.status === 'expired'
  const isBlocked = atLimit || licenseExpired

  const projectedCount = request.currentBusCount + 1
  const projectedUsage = Math.round((projectedCount / request.busLimit) * 100)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-primary rounded-xl shadow-lg w-full max-w-lg mx-4 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#2E86AB]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text">Approve Bus Request</h3>
              <span className="text-xs font-mono text-text-muted">{request.id}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4">
          {/* License Validation Banner */}
          <LicenseBanner
            licenseStatus={request.license.status}
            licenseNumber={request.license.licenseNumber}
            validUntil={request.license.validUntil}
            daysRemaining={request.license.daysRemaining}
          />

          {/* Request Details */}
          <div className="flex flex-col gap-2.5 text-sm text-text">
            <div className="flex justify-between">
              <span className="text-text-muted">Company</span>
              <span className="font-semibold">{request.companyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Bus Number</span>
              <span className="font-mono">{request.busNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Layout</span>
              <span>{request.layoutType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Risk Score</span>
              <RiskBadge level={request.riskLevel} />
            </div>
          </div>

          {/* ── Entitlement Validation Panel ── */}
          <div className="bg-[#F5F5F4] rounded-lg p-4 flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Key className="w-3 h-3" />
              Entitlement Validation
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Current</span>
                <span className="text-lg font-bold text-text">{request.currentBusCount}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Max Allowed</span>
                <span className="text-lg font-bold text-text">{request.busLimit}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Post-Approval</span>
                <span className={`text-lg font-bold ${projectedCount > request.busLimit ? 'text-alert' : 'text-[#2E86AB]'}`}>
                  {projectedCount}
                </span>
              </div>
            </div>
            {/* Usage bar */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>Projected utilization</span>
                <span className={projectedUsage >= 100 ? 'text-alert font-bold' : ''}>
                  {projectedUsage}%
                </span>
              </div>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    projectedUsage >= 100 ? 'bg-alert' : projectedUsage >= 80 ? 'bg-[#D4A800]' : 'bg-accent'
                  }`}
                  style={{ width: `${Math.min(projectedUsage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Entitlement warning */}
          {atLimit && (
            <div className="flex items-start gap-2 bg-alert/10 text-alert rounded-lg p-3 text-xs font-medium">
              <span className="mt-0.5">⚠</span>
              <span>
                This operator has reached their bus entitlement limit
                ({request.busLimit}). Approval is blocked until the limit is
                increased.
              </span>
            </div>
          )}

          {/* ── Approval Token Preview ── */}
          {!isBlocked && (
            <div className="bg-secondary/60 rounded-lg p-3 flex flex-col gap-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Key className="w-2.5 h-2.5" />
                Approval Token — Will Be Generated
              </h4>
              <div className="flex flex-col gap-1 text-[11px] text-text-muted">
                <div className="flex justify-between">
                  <span>Token Type</span>
                  <span className="font-mono text-text">Signed JWT (time-bound)</span>
                </div>
                <div className="flex justify-between">
                  <span>Validity</span>
                  <span className="font-mono text-text">7 days from issuance</span>
                </div>
                <div className="flex justify-between">
                  <span>Purpose</span>
                  <span className="text-text">Operator Data Plane authorization</span>
                </div>
              </div>
            </div>
          )}

          {/* Audit Notice */}
          <AuditNotice action="approve" performedBy="Super Admin" />
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-[#F5F5F4] transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={isBlocked}
            onClick={onConfirm}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              isBlocked
                ? 'bg-border text-text-muted cursor-not-allowed'
                : 'bg-accent text-text hover:bg-accent/80'
            }`}
          >
            {isBlocked ? 'Approval Blocked' : 'Confirm Approval'}
          </button>
        </div>
      </div>
    </div>
  )
}


const RejectModal = ({ request, onConfirm, onCancel }) => {
  const [remarks, setRemarks] = useState('')
  const canSubmit = remarks.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-primary rounded-xl shadow-lg w-full max-w-md mx-4 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-alert/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-alert" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text">Reject Bus Request</h3>
              <span className="text-xs font-mono text-text-muted">{request.id}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4">
          {/* Request Details */}
          <div className="flex flex-col gap-2.5 text-sm text-text">
            <div className="flex justify-between">
              <span className="text-text-muted">Company</span>
              <span className="font-semibold">{request.companyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Bus Number</span>
              <span className="font-mono">{request.busNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Risk Score</span>
              <RiskBadge level={request.riskLevel} />
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Current Usage</span>
              <span className="text-text">
                {request.currentBusCount}/{request.busLimit}
              </span>
            </div>
          </div>

          {/* Remarks (mandatory) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Rejection Remarks <span className="text-alert">*</span>
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              placeholder="Provide detailed reason for rejection..."
              className="w-full p-3 text-sm text-text bg-white border border-border rounded-lg placeholder-text-muted focus:ring-2 focus:ring-alert/30 focus:border-alert outline-none transition-all resize-none"
            />
            {!canSubmit && remarks !== '' && (
              <span className="text-xs text-alert">Remarks are required to reject.</span>
            )}
          </div>

          {/* Audit Notice */}
          <AuditNotice action="reject" performedBy="Super Admin" />
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-[#F5F5F4] transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            onClick={() => onConfirm(remarks.trim())}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              canSubmit
                ? 'bg-alert/10 text-alert hover:bg-alert/20'
                : 'bg-border text-text-muted cursor-not-allowed'
            }`}
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  )
}

export default BusApprovals
