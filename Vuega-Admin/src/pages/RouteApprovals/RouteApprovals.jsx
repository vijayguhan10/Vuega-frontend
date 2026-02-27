import React, { useState, useMemo, useEffect, useSyncExternalStore } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, ShieldCheck, Key, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { FaShieldAlt } from 'react-icons/fa'
import FilterTabs from '../BusApprovals/components/FilterTabs'
import StatusBadge from '../BusApprovals/components/StatusBadge'
import AuditNotice from '../BusApprovals/components/AuditNotice'
import RouteRequestTable from './components/RouteRequestTable'
import MetricCards from '../../components/Common/MetricCards'
import { requestsStore } from '../../data/requestsStore'


// ═══════════════════════════════════════════════════════════════
//  BACKEND INTEGRATION ENDPOINTS (placeholder comments)
// ═══════════════════════════════════════════════════════════════
// GET    /api/control-plane/route-requests
//          → Returns list with entitlement data per request
// PATCH  /api/control-plane/route-requests/:id/approve
//          → Validates entitlement server-side
//          → Audit log: action = ROUTE_APPROVED
// PATCH  /api/control-plane/route-requests/:id/reject
//          → Requires mandatory remarks
//          → Audit log: action = ROUTE_REJECTED
// GET    /api/control-plane/audit/:requestId
//          → Returns immutable audit trail for the request
// ═══════════════════════════════════════════════════════════════


/**
 * @typedef {Object} RouteApprovalRequest
 * @property {string}  id
 * @property {string}  companyId
 * @property {string}  companyName
 * @property {string}  origin
 * @property {string}  destination
 * @property {string}  distance
 * @property {string}  duration
 * @property {string}  submittedDate
 * @property {number}  currentRouteCount
 * @property {number}  routeLimit
 * @property {string}  status          — Pending | Approved | Rejected
 * @property {string}  [remarks]
 * @property {AuditEvent[]} auditHistory
 */

/**
 * @typedef {Object} AuditEvent
 * @property {string} id
 * @property {string} action
 * @property {string} performedBy
 * @property {string} timestamp
 * @property {string} [remarks]
 */


// ═══════════════════════════════════════════════════════════════
//  SUMMARY — computed from request data
// ═══════════════════════════════════════════════════════════════

const computeSummary = (requests) => {
  const pending = requests.filter((r) => r.status === 'Pending')
  const approved = requests.filter((r) => r.status === 'Approved')
  const rejected = requests.filter((r) => r.status === 'Rejected')
  const atLimit = requests.filter((r) => r.currentRouteCount >= r.routeLimit && r.status === 'Pending')
  return {
    totalPending: pending.length,
    totalApproved: approved.length,
    totalRejected: rejected.length,
    atLimitCount: atLimit.length,
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
//  ROUTE APPROVALS PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

const RouteApprovals = () => {
  // --- State ---
  const [searchParams] = useSearchParams()
  const requests = useSyncExternalStore(requestsStore.subscribe, requestsStore.getRouteSnapshot)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Pre-fill search from Dashboard navigation (?company=Name)
  useEffect(() => {
    const company = searchParams.get('company')
    if (company) setSearchQuery(company)
  }, [searchParams])

  // Modal state
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  // Summary (memoized)
  const summary = useMemo(() => computeSummary(requests), [requests])

  // --- Filtering logic ---
  const filteredRequests = useMemo(() => {
    let result = requests

    // Tab filter
    if (activeTab !== 'all') {
      result = result.filter((r) => r.status === activeTab)
    }

    // Search filter (company name, origin, destination, or request ID)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.companyName.toLowerCase().includes(q) ||
          r.origin.toLowerCase().includes(q) ||
          r.destination.toLowerCase().includes(q) ||
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

  // --- Approve confirm (simulated) ---
  const confirmApprove = () => {
    const now = new Date()
    requestsStore.updateRouteRequest(selectedRequest.id, (r) => ({
      ...r,
      status: 'Approved',
      auditHistory: [
        ...r.auditHistory,
        {
          id: `A-${Date.now()}`,
          action: 'ROUTE_APPROVED',
          performedBy: 'Admin (SA-001)',
          timestamp: now.toLocaleString(),
        },
      ],
    }))
    setApproveModalOpen(false)
    setSelectedRequest(null)
  }

  // --- Reject confirm (simulated) ---
  const confirmReject = (remarks) => {
    const now = new Date()
    requestsStore.updateRouteRequest(selectedRequest.id, (r) => ({
      ...r,
      status: 'Rejected',
      remarks,
      auditHistory: [
        ...r.auditHistory,
        {
          id: `A-${Date.now()}`,
          action: 'ROUTE_REJECTED',
          performedBy: 'Admin (SA-001)',
          timestamp: now.toLocaleString(),
          remarks,
        },
      ],
    }))
    setRejectModalOpen(false)
    setSelectedRequest(null)
  }

  // ═══════════════════════════════════════════════════════════
  //  TABLE COLUMNS
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
        header: 'Route',
        id: 'route',
        accessorFn: (row) => `${row.origin} → ${row.destination}`,
        cell: (info) => {
          const row = info.row.original
          return (
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-text">{row.origin}</span>
              <span className="text-text-muted">→</span>
              <span className="font-medium text-text">{row.destination}</span>
            </div>
          )
        },
      },
      {
        header: 'Distance / Duration',
        id: 'distanceDuration',
        cell: (info) => {
          const row = info.row.original
          return (
            <span className="text-text-muted text-xs">{row.distance} · {row.duration}</span>
          )
        },
      },
      {
        header: 'Submitted',
        accessorKey: 'submittedDate',
        cell: (info) => (
          <span className="text-text-muted text-xs">{info.getValue()}</span>
        ),
      },
      {
        header: 'Route Entitlement',
        id: 'routeUsage',
        accessorFn: (row) => row,
        cell: (info) => {
          const row = info.getValue()
          const atLimit = row.currentRouteCount >= row.routeLimit
          const usage = Math.round((row.currentRouteCount / row.routeLimit) * 100)
          return (
            <div className="flex flex-col gap-1 min-w-[100px]">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${atLimit ? 'text-alert' : 'text-text'}`}>
                  {row.currentRouteCount}/{row.routeLimit}
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
                    disabled={row.currentRouteCount >= row.routeLimit}
                    onClick={() => handleApproveClick(row)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                      row.currentRouteCount >= row.routeLimit
                        ? 'bg-border text-text-muted cursor-not-allowed'
                        : 'bg-accent text-text hover:bg-accent/80'
                    }`}
                    title={
                      row.currentRouteCount >= row.routeLimit
                        ? 'Route limit reached — cannot approve'
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
          Route Approval Management
        </h1>
        <p className="text-text-muted">
          Review and approve operator route expansion requests. All actions are
          permanently audit-logged.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════
           OVERVIEW CARDS
           ═══════════════════════════════════════════════════════ */}
      <MetricCards
        cards={[
          { label: 'Pending', value: summary.totalPending, icon: ShieldCheck, iconBg: 'bg-secondary', iconColor: 'text-text', subText: 'Awaiting review' },
          { label: 'At Limit', value: summary.atLimitCount, icon: Key, iconBg: 'bg-secondary', iconColor: 'text-text', subText: 'Blocked by entitlement cap' },
          { label: 'Total Rejected', value: summary.totalRejected, icon: XCircle, iconBg: 'bg-alert/10', iconColor: 'text-alert', valueColor: 'text-alert', subText: 'Rejected requests' },
          { label: 'Total Approved', value: summary.totalApproved, icon: CheckCircle, iconBg: 'bg-accent/30', iconColor: 'text-[#2E86AB]', valueColor: 'text-[#2E86AB]', subText: 'Approved requests' },
        ]}
        variant="default"
        gridCols="grid-cols-2 md:grid-cols-4"
      />

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
              placeholder="Search by company, route, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-text bg-primary border border-border rounded-lg placeholder-text-muted focus:ring-2 focus:ring-accent/50 focus:border-accent focus:bg-primary outline-none transition-all"
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
        <RouteRequestTable
          data={filteredRequests}
          columns={columns}
          isLoading={false}
          emptyMessage="No route approval requests match your filters."
        />

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-primary flex justify-between items-center">
          <span className="text-xs text-text-muted">
            Showing {filteredRequests.length} of {requests.length} requests
          </span>
          <div className="flex items-center gap-2 text-[10px] text-text-muted">
            <FaShieldAlt className="w-3 h-3" />
            <span>All actions are audit-logged</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
           APPROVE MODAL
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
           REJECT MODAL
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
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════
//  APPROVE MODAL
// ═══════════════════════════════════════════════════════════════

const ApproveModal = ({ request, onConfirm, onCancel }) => {
  const atLimit = request.currentRouteCount >= request.routeLimit
  const projectedCount = request.currentRouteCount + 1
  const projectedUsage = Math.round((projectedCount / request.routeLimit) * 100)

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
              <h3 className="text-lg font-bold text-text">Approve Route Request</h3>
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
              <span className="text-text-muted">Route</span>
              <span className="font-semibold">{request.origin} → {request.destination}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Distance</span>
              <span>{request.distance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Est. Duration</span>
              <span>{request.duration}</span>
            </div>
          </div>

          {/* ── Entitlement Validation Panel ── */}
          <div className="bg-[#F5F5F4] rounded-lg p-4 flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Key className="w-3 h-3" />
              Route Entitlement Validation
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Current</span>
                <span className="text-lg font-bold text-text">{request.currentRouteCount}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Max Allowed</span>
                <span className="text-lg font-bold text-text">{request.routeLimit}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Post-Approval</span>
                <span className={`text-lg font-bold ${projectedCount > request.routeLimit ? 'text-alert' : 'text-[#2E86AB]'}`}>
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
              <div className="w-full h-2 bg-primary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    projectedUsage >= 100 ? 'bg-alert' : projectedUsage >= 80 ? 'bg-[#D4A800]' : 'bg-accent'
                  }`}
                  style={{ width: `${Math.min(projectedUsage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* At-limit warning */}
          {atLimit && (
            <div className="flex items-start gap-2 bg-alert/10 text-alert rounded-lg p-3 text-xs font-medium">
              <span className="mt-0.5">⚠</span>
              <span>
                This operator has reached their route entitlement limit
                ({request.routeLimit}). Approval is blocked until the limit is
                increased.
              </span>
            </div>
          )}

          {/* Audit Notice */}
          <AuditNotice action="approve" performedBy="Super Admin" />
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={atLimit}
            onClick={onConfirm}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              atLimit
                ? 'bg-border text-text-muted cursor-not-allowed'
                : 'bg-accent text-text hover:bg-accent/80'
            }`}
          >
            {atLimit ? 'Approval Blocked' : 'Confirm Approval'}
          </button>
        </div>
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════
//  REJECT MODAL
// ═══════════════════════════════════════════════════════════════

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
              <h3 className="text-lg font-bold text-text">Reject Route Request</h3>
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
              <span className="text-text-muted">Route</span>
              <span className="font-semibold">{request.origin} → {request.destination}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Current Usage</span>
              <span className="text-text">
                {request.currentRouteCount}/{request.routeLimit}
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
              className="w-full p-3 text-text bg-primary border border-border rounded-lg placeholder-text-muted focus:ring-2 focus:ring-alert/30 focus:border-alert outline-none transition-all resize-none"
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
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-secondary transition-colors"
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

export default RouteApprovals
