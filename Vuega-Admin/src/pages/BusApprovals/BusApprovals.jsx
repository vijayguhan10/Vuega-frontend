import React, { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import FilterTabs from './components/FilterTabs'
import BusRequestTable from './components/BusRequestTable'
import StatusBadge from './components/StatusBadge'

// ═══════════════════════════════════════════════════════════════
//  SECURITY AWARENESS
// ═══════════════════════════════════════════════════════════════
// - This page requires SUPER_ADMIN role.
// - Must be wrapped in ProtectedRoute with JWT validation.
// - All approve / reject actions must be audit-logged.
// - Entitlement enforcement (bus limits) must be performed
//   server-side in production; frontend validation is advisory only.
// - JWT middleware should verify token on every API call.
// - Session expiry should auto-redirect to /login.
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
//  BACKEND INTEGRATION ENDPOINTS (placeholder comments)
// ═══════════════════════════════════════════════════════════════
// GET  /api/control-plane/bus-requests
// PATCH /api/control-plane/bus-requests/:id/approve
//   → Approval must generate a signed, time-bound token for the
//     Operator Data Plane (POST /api/control-plane/approval-token)
//   → Must be audit-logged with action = BUS_APPROVED
// PATCH /api/control-plane/bus-requests/:id/reject
//   → Requires mandatory remarks
//   → Must be audit-logged with action = BUS_REJECTED
// ═══════════════════════════════════════════════════════════════

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
 */

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
  },
]

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
//  BUS APPROVALS PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

const BusApprovals = () => {
  // --- State ---
  const [requests, setRequests] = useState(initialRequests)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal state (Milestone 3)
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  // --- Filtering logic separated from JSX for performance ---
  const filteredRequests = useMemo(() => {
    let result = requests

    // Tab filter
    if (activeTab !== 'all') {
      result = result.filter((r) => r.status === activeTab)
    }

    // Search filter (company name or bus number)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.companyName.toLowerCase().includes(q) ||
          r.busNumber.toLowerCase().includes(q)
      )
    }

    return result
  }, [requests, activeTab, searchQuery])

  // --- Approve handler ---
  const handleApproveClick = (request) => {
    setSelectedRequest(request)
    setApproveModalOpen(true)
  }

  // --- Reject handler ---
  const handleRejectClick = (request) => {
    setSelectedRequest(request)
    setRejectModalOpen(true)
  }

  // --- Approve confirm (simulated) ---
  const confirmApprove = () => {
    // TODO: PATCH /api/control-plane/bus-requests/:id/approve
    // TODO: POST /api/control-plane/approval-token
    //   → Generate signed, time-bound token for the Operator Data Plane
    //   → Audit log: action = BUS_APPROVED, performedBy = currentUser
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id ? { ...r, status: 'Approved' } : r
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
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? { ...r, status: 'Rejected', remarks }
          : r
      )
    )
    setRejectModalOpen(false)
    setSelectedRequest(null)
  }

  // ═══════════════════════════════════════════════════════════
  //  TABLE COLUMNS — with render callbacks
  // ═══════════════════════════════════════════════════════════

  const columns = useMemo(
    () => [
      {
        header: 'Company Name',
        accessorKey: 'companyName',
        cell: (info) => (
          <span className="font-semibold text-text">{info.getValue()}</span>
        ),
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
          <span className="text-text-muted">{info.getValue()}</span>
        ),
      },
      {
        header: 'Submitted Date',
        accessorKey: 'submittedDate',
        cell: (info) => (
          <span className="text-text-muted">{info.getValue()}</span>
        ),
      },
      {
        header: 'Bus Usage',
        id: 'busUsage',
        accessorFn: (row) => row,
        cell: (info) => {
          const row = info.getValue()
          const atLimit = row.currentBusCount >= row.busLimit
          return (
            <span className={atLimit ? 'font-semibold text-alert' : 'text-text-muted'}>
              {row.currentBusCount}/{row.busLimit}
            </span>
          )
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      },
      {
        header: 'Action',
        id: 'actions',
        cell: (info) => {
          const row = info.row.original
          if (row.status !== 'Pending') {
            return <span className="text-xs text-text-muted">—</span>
          }
          const atLimit = row.currentBusCount >= row.busLimit
          return (
            <div className="flex items-center gap-2">
              <button
                disabled={atLimit}
                onClick={() => handleApproveClick(row)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  atLimit
                    ? 'bg-border text-text-muted cursor-not-allowed'
                    : 'bg-accent text-text hover:bg-accent/80'
                }`}
                title={atLimit ? 'Bus limit reached — cannot approve' : 'Approve this request'}
              >
                Approve
              </button>
              <button
                onClick={() => handleRejectClick(row)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-alert/10 text-alert hover:bg-alert/20 transition-colors"
              >
                Reject
              </button>
            </div>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [requests]
  )

  // ═══════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="flex flex-col gap-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-text tracking-tight">
          Bus Approval Management
        </h1>
        <p className="text-sm text-text-muted">
          Review and approve operator bus expansion requests under platform
          governance policies.
        </p>
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
              placeholder="Search by company or bus number..."
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
          {/* TODO: Add pagination controls when backend pagination is integrated */}
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
//  - Styled consistently with Dashboard cards (secondary bg,
//    rounded corners, subtle shadow).
//  - Validates entitlement: disable Approve if
//    currentBusCount >= busLimit, show red warning.
// ═══════════════════════════════════════════════════════════════

const ApproveModal = ({ request, onConfirm, onCancel }) => {
  const atLimit = request.currentBusCount >= request.busLimit

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-secondary rounded-xl shadow-lg w-full max-w-md mx-4 p-6 flex flex-col gap-5">
        <h3 className="text-lg font-bold text-text">Approve Bus Request</h3>

        <div className="flex flex-col gap-3 text-sm text-text">
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
            <span className="text-text-muted">Current Usage</span>
            <span className={atLimit ? 'text-alert font-semibold' : ''}>
              {request.currentBusCount} / {request.busLimit}
            </span>
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

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-border/30 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={atLimit}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              atLimit
                ? 'bg-border text-text-muted cursor-not-allowed'
                : 'bg-accent text-text hover:bg-accent/80'
            }`}
          >
            Confirm Approval
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
//  REJECT MODAL
//  - Reject requires mandatory remarks before submission.
//  - Styled consistently with Dashboard cards.
// ═══════════════════════════════════════════════════════════════

const RejectModal = ({ request, onConfirm, onCancel }) => {
  const [remarks, setRemarks] = useState('')
  const canSubmit = remarks.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-secondary rounded-xl shadow-lg w-full max-w-md mx-4 p-6 flex flex-col gap-5">
        <h3 className="text-lg font-bold text-text">Reject Bus Request</h3>

        <div className="flex flex-col gap-3 text-sm text-text">
          <div className="flex justify-between">
            <span className="text-text-muted">Company</span>
            <span className="font-semibold">{request.companyName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Bus Number</span>
            <span className="font-mono">{request.busNumber}</span>
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
            placeholder="Provide reason for rejection..."
            className="w-full p-3 text-sm text-text bg-primary border border-border rounded-lg placeholder-text-muted focus:ring-2 focus:ring-alert/30 focus:border-alert outline-none transition-all resize-none"
          />
          {!canSubmit && remarks !== '' && (
            <span className="text-xs text-alert">Remarks are required to reject.</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-border/30 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            onClick={() => onConfirm(remarks.trim())}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
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
