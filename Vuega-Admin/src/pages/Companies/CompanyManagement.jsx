import React, { useState, useMemo } from 'react'
import { Search, Building2, ShieldCheck, ChevronDown } from 'lucide-react'
import { FaShieldAlt } from 'react-icons/fa'
import CompanyTable from './components/CompanyTable'
import CompanyStatusBadge from './components/CompanyStatusBadge'
import ActionDropdown from './components/ActionDropdown'
import ConfirmationModal from './components/ConfirmationModal'
import CompanyDetailDrawer from './components/CompanyDetailDrawer'

// ═══════════════════════════════════════════════════════════════
//  SECURITY AWARENESS
// ═══════════════════════════════════════════════════════════════
// - This page requires SUPER_ADMIN role.
// - Must be wrapped in ProtectedRoute with JWT validation.
// - All status-change actions must be audit-logged.
// - Lifecycle governance rules are advisory on frontend;
//   server must enforce them authoritatively.
// - JWT middleware should verify token on every API call.
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
//  BACKEND INTEGRATION ENDPOINTS (placeholder comments)
// ═══════════════════════════════════════════════════════════════
// GET    /api/companies
//          → Returns paginated list of companies with status, metrics
//          → Query params: ?search=, ?status=, ?page=, ?limit=
// GET    /api/companies/:id/details
//          → Returns full company detail (buses, trips, employees, KYC, logs)
// PATCH  /api/companies/:id/status
//          → Body: { status: 'Active' | 'Rejected' | 'Suspended', remarks? }
//          → Enforces lifecycle governance server-side
//          → Audit log: action = COMPANY_STATUS_CHANGED
// PATCH  /api/companies/:id/kyc
//          → Body: { documentId, action: 'verify' | 'reject' }
//          → Audit log: action = KYC_VERIFIED | KYC_REJECTED
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
//  TYPE DEFINITIONS (Backend-ready interfaces)
// ═══════════════════════════════════════════════════════════════

/**
 * @typedef {Object} Company
 * @property {string}  id
 * @property {string}  name
 * @property {string}  operatorCode
 * @property {string}  status          — Pending | Active | Suspended | Rejected
 * @property {number}  totalBuses
 * @property {number}  activeTrips
 * @property {string}  createdDate
 * @property {Object}  contact         — { email, phone }
 * @property {Object}  compliance      — { status, score }
 * @property {Object}  entitlementsSummary — { busLimit, busUsed, routeLimit, routeUsed }
 * @property {Array}   buses
 * @property {Array}   trips
 * @property {Array}   employees
 * @property {Object}  analyticsData
 * @property {Array}   kycDocuments
 * @property {Array}   activityLogs
 */

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA — Will be replaced by API calls via useEffect
// ═══════════════════════════════════════════════════════════════
// TODO: Replace with:
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       const res = await fetch('/api/companies', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await res.json();
//       setCompanies(data);
//     };
//     fetchCompanies();
//   }, []);

const initialCompanies = [
  {
    id: 'C-101',
    name: 'SRS Travels Pvt Ltd',
    operatorCode: 'OP-SRS-2024',
    status: 'Active',
    totalBuses: 14,
    activeTrips: 8,
    createdDate: 'Jan 10, 2025',
    contact: { email: 'admin@srstravels.in', phone: '+91 98765 43210' },
    compliance: { status: 'Compliant', score: 94 },
    entitlementsSummary: { busLimit: 20, busUsed: 14, routeLimit: 30, routeUsed: 22 },
  },
  {
    id: 'C-102',
    name: 'KPN Travels',
    operatorCode: 'OP-KPN-2024',
    status: 'Active',
    totalBuses: 8,
    activeTrips: 5,
    createdDate: 'Feb 05, 2025',
    contact: { email: 'ops@kpntravels.com', phone: '+91 87654 32109' },
    compliance: { status: 'Compliant', score: 87 },
    entitlementsSummary: { busLimit: 12, busUsed: 8, routeLimit: 18, routeUsed: 12 },
  },
  {
    id: 'C-103',
    name: 'VRL Travels',
    operatorCode: 'OP-VRL-2023',
    status: 'Suspended',
    totalBuses: 20,
    activeTrips: 0,
    createdDate: 'Nov 28, 2024',
    contact: { email: 'support@vrltravels.in', phone: '+91 76543 21098' },
    compliance: { status: 'Non-Compliant', score: 52 },
    entitlementsSummary: { busLimit: 25, busUsed: 20, routeLimit: 40, routeUsed: 30 },
  },
  {
    id: 'C-104',
    name: 'Orange Tours',
    operatorCode: 'OP-ORT-2025',
    status: 'Pending',
    totalBuses: 0,
    activeTrips: 0,
    createdDate: 'Feb 18, 2026',
    contact: { email: 'contact@orangetours.co', phone: '+91 65432 10987' },
    compliance: { status: 'Under Review', score: 0 },
    entitlementsSummary: { busLimit: 15, busUsed: 0, routeLimit: 20, routeUsed: 0 },
  },
  {
    id: 'C-105',
    name: 'Neeta Travels',
    operatorCode: 'OP-NTA-2024',
    status: 'Active',
    totalBuses: 7,
    activeTrips: 3,
    createdDate: 'Jun 15, 2024',
    contact: { email: 'info@neetatravels.in', phone: '+91 54321 09876' },
    compliance: { status: 'Compliant', score: 78 },
    entitlementsSummary: { busLimit: 10, busUsed: 7, routeLimit: 15, routeUsed: 14 },
  },
  {
    id: 'C-106',
    name: 'Parveen Travels',
    operatorCode: 'OP-PVN-2025',
    status: 'Pending',
    totalBuses: 0,
    activeTrips: 0,
    createdDate: 'Feb 15, 2026',
    contact: { email: 'admin@parveentravels.com', phone: '+91 43210 98765' },
    compliance: { status: 'Under Review', score: 0 },
    entitlementsSummary: { busLimit: 12, busUsed: 0, routeLimit: 15, routeUsed: 0 },
  },
  {
    id: 'C-107',
    name: 'IntrCity SmartBus',
    operatorCode: 'OP-ISB-2024',
    status: 'Active',
    totalBuses: 22,
    activeTrips: 12,
    createdDate: 'Mar 01, 2024',
    contact: { email: 'ops@intrcity.com', phone: '+91 32109 87654' },
    compliance: { status: 'Compliant', score: 91 },
    entitlementsSummary: { busLimit: 30, busUsed: 22, routeLimit: 45, routeUsed: 38 },
  },
  {
    id: 'C-108',
    name: 'Greenline Travels',
    operatorCode: 'OP-GLN-2023',
    status: 'Rejected',
    totalBuses: 0,
    activeTrips: 0,
    createdDate: 'Dec 20, 2024',
    contact: { email: 'info@greenlinetravels.in', phone: '+91 21098 76543' },
    compliance: { status: 'Rejected', score: 0 },
    entitlementsSummary: { busLimit: 0, busUsed: 0, routeLimit: 0, routeUsed: 0 },
  },
  {
    id: 'C-109',
    name: 'Sharma Transport Co',
    operatorCode: 'OP-STC-2025',
    status: 'Pending',
    totalBuses: 0,
    activeTrips: 0,
    createdDate: 'Feb 10, 2026',
    contact: { email: 'sharma@transport.co.in', phone: '+91 10987 65432' },
    compliance: { status: 'Under Review', score: 0 },
    entitlementsSummary: { busLimit: 8, busUsed: 0, routeLimit: 10, routeUsed: 0 },
  },
  {
    id: 'C-110',
    name: 'Abhibus Express',
    operatorCode: 'OP-ABE-2024',
    status: 'Active',
    totalBuses: 16,
    activeTrips: 9,
    createdDate: 'Aug 22, 2024',
    contact: { email: 'support@abhibus.com', phone: '+91 09876 54321' },
    compliance: { status: 'Compliant', score: 88 },
    entitlementsSummary: { busLimit: 20, busUsed: 16, routeLimit: 25, routeUsed: 19 },
  },
]

// ═══════════════════════════════════════════════════════════════
//  GOVERNANCE SUMMARY — computed from company data
// ═══════════════════════════════════════════════════════════════

const computeGovernanceSummary = (companies) => {
  const active = companies.filter((c) => c.status === 'Active')
  const pending = companies.filter((c) => c.status === 'Pending')
  const suspended = companies.filter((c) => c.status === 'Suspended')
  const rejected = companies.filter((c) => c.status === 'Rejected')
  return {
    total: companies.length,
    activeCount: active.length,
    pendingCount: pending.length,
    suspendedCount: suspended.length,
    rejectedCount: rejected.length,
  }
}

// ═══════════════════════════════════════════════════════════════
//  FILTER OPTIONS
// ═══════════════════════════════════════════════════════════════

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Active', value: 'Active' },
  { label: 'Suspended', value: 'Suspended' },
  { label: 'Rejected', value: 'Rejected' },
]

// ═══════════════════════════════════════════════════════════════
//  COMPANY MANAGEMENT PAGE — Stage 1: Company List View
// ═══════════════════════════════════════════════════════════════

const CompanyManagement = () => {
  // --- State ---
  const [companies, setCompanies] = useState(initialCompanies)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)

  // Confirmation modal state
  const [modalAction, setModalAction] = useState(null) // 'approve' | 'reject' | 'suspend' | 'reactivate'
  const [selectedCompany, setSelectedCompany] = useState(null)

  // Detail drawer state (Stage 2)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerCompany, setDrawerCompany] = useState(null)
  const [drawerInitialTab, setDrawerInitialTab] = useState('overview')

  // Governance summary (memoized)
  const govSummary = useMemo(() => computeGovernanceSummary(companies), [companies])

  // --- Filtering logic ---
  const filteredCompanies = useMemo(() => {
    let result = companies

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter)
    }

    // Search filter (company name, email, or operator code)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.contact.email.toLowerCase().includes(q) ||
          c.operatorCode.toLowerCase().includes(q)
      )
    }

    return result
  }, [companies, statusFilter, searchQuery])

  // --- Action handler from dropdown ---
  const handleAction = (company, action) => {
    setSelectedCompany(company)

    if (action === 'view') {
      setDrawerCompany(company)
      setDrawerInitialTab('overview')
      setDrawerOpen(true)
      return
    }

    if (action === 'kyc') {
      // Stage 3: Will open KYC tab in drawer
      setDrawerCompany(company)
      setDrawerInitialTab('overview') // Will be 'kyc' in Stage 3
      setDrawerOpen(true)
      return
    }

    // Governance action — open confirmation modal
    if (['approve', 'reject', 'suspend', 'reactivate'].includes(action)) {
      setModalAction(action)
    }
  }

  // --- Status change handler (simulated) ---
  // TODO: Replace with updateCompanyStatus(id, status)
  //   const updateCompanyStatus = async (id, status, remarks) => {
  //     await fetch(`/api/companies/${id}/status`, {
  //       method: 'PATCH',
  //       headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ status, remarks }),
  //     });
  //   };
  const handleConfirmAction = (remarks) => {
    if (!selectedCompany || !modalAction) return

    const statusMap = {
      approve: 'Active',
      reject: 'Rejected',
      suspend: 'Suspended',
      reactivate: 'Active',
    }

    const newStatus = statusMap[modalAction]

    setCompanies((prev) =>
      prev.map((c) =>
        c.id === selectedCompany.id
          ? { ...c, status: newStatus }
          : c
      )
    )

    setModalAction(null)
    setSelectedCompany(null)
  }

  const handleCancelModal = () => {
    setModalAction(null)
    setSelectedCompany(null)
  }

  // ═══════════════════════════════════════════════════════════
  //  TABLE COLUMNS — Governance-styled with renderCell pattern
  // ═══════════════════════════════════════════════════════════

  const columns = useMemo(
    () => [
      {
        header: 'Company Name',
        accessorKey: 'name',
        cell: (info) => {
          const row = info.row.original
          return (
            <button
              onClick={() => {
                setDrawerCompany(row)
                setDrawerInitialTab('overview')
                setDrawerOpen(true)
              }}
              className="flex flex-col gap-0.5 text-left group"
            >
              <span className="font-semibold text-text group-hover:text-[#2E86AB] transition-colors">
                {info.getValue()}
              </span>
              <span className="text-[10px] font-mono text-text-muted">{row.operatorCode}</span>
            </button>
          )
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => <CompanyStatusBadge status={info.getValue()} />,
      },
      {
        header: 'Total Buses',
        accessorKey: 'totalBuses',
        cell: (info) => (
          <span className="text-text font-medium">{info.getValue()}</span>
        ),
      },
      {
        header: 'Active Trips',
        accessorKey: 'activeTrips',
        cell: (info) => (
          <span className="text-text font-medium">{info.getValue()}</span>
        ),
      },
      {
        header: 'Created Date',
        accessorKey: 'createdDate',
        cell: (info) => (
          <span className="text-text-muted text-xs">{info.getValue()}</span>
        ),
      },
      {
        header: 'Action',
        id: 'actions',
        cell: (info) => {
          const row = info.row.original
          return (
            <ActionDropdown
              status={row.status}
              onAction={(action) => handleAction(row, action)}
            />
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [companies]
  )

  // ═══════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-text tracking-tight">
          Company Management
        </h1>
        <p className="text-sm text-text-muted">
          Governance-level control over registered operators. Manage company
          lifecycle, compliance status, and platform access.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════
           GOVERNANCE OVERVIEW CARDS
           ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total */}
        <div className="bg-primary rounded-xl border border-border p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Building2 className="w-4 h-4 text-text" />
            </div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Total</span>
          </div>
          <span className="text-2xl font-bold text-text">{govSummary.total}</span>
        </div>

        {/* Active */}
        <div className="bg-primary rounded-xl border border-border p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#2E86AB]" />
            </div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Active</span>
          </div>
          <span className="text-2xl font-bold text-text">{govSummary.activeCount}</span>
        </div>

        {/* Pending */}
        <div className="bg-primary rounded-xl border border-border p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Building2 className="w-4 h-4 text-text" />
            </div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Pending</span>
          </div>
          <span className="text-2xl font-bold text-text">{govSummary.pendingCount}</span>
        </div>

        {/* Suspended */}
        <div className="bg-primary rounded-xl border border-border p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-alert/10 flex items-center justify-center">
              <FaShieldAlt className="w-3.5 h-3.5 text-alert" />
            </div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Suspended</span>
          </div>
          <span className="text-2xl font-bold text-alert">{govSummary.suspendedCount}</span>
        </div>

        {/* Rejected */}
        <div className="bg-primary rounded-xl border border-border p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-alert/10 flex items-center justify-center">
              <FaShieldAlt className="w-3.5 h-3.5 text-alert" />
            </div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Rejected</span>
          </div>
          <span className="text-2xl font-bold text-text-muted">{govSummary.rejectedCount}</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
           MAIN TABLE CARD
           ═══════════════════════════════════════════════════════ */}
      <div className="bg-primary rounded-xl border border-border shadow-sm">
        {/* Section Header — Search + Filter */}
        <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search */}
          <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or operator code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-sm text-text bg-white border border-border rounded-lg placeholder-text-muted focus:ring-2 focus:ring-accent/50 focus:border-accent focus:bg-primary outline-none transition-all"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-text bg-white border border-border rounded-lg hover:bg-[#FAFAFA] transition-colors"
            >
              <span>Status: {statusFilter === 'all' ? 'All' : statusFilter}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${filterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {filterDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-primary rounded-lg border border-border shadow-lg z-30 py-1">
                {filterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setStatusFilter(opt.value)
                      setFilterDropdownOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                      statusFilter === opt.value
                        ? 'bg-accent/20 text-text'
                        : 'text-text-muted hover:bg-[#F5F5F4] hover:text-text'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <CompanyTable
          data={filteredCompanies}
          columns={columns}
          isLoading={false}
          emptyMessage="No companies match your filters."
        />

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-white flex justify-between items-center">
          <span className="text-xs text-text-muted">
            Showing {filteredCompanies.length} of {companies.length} companies
          </span>
          <div className="flex items-center gap-2 text-[10px] text-text-muted">
            <FaShieldAlt className="w-3 h-3" />
            <span>All actions are governance-enforced & audit-logged</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
           CONFIRMATION MODAL
           ═══════════════════════════════════════════════════════ */}
      {modalAction && selectedCompany && (
        <ConfirmationModal
          action={modalAction}
          company={selectedCompany}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelModal}
        />
      )}

      {/* ═══════════════════════════════════════════════════════
           DETAIL DRAWER — Stage 2
           ═══════════════════════════════════════════════════════ */}
      <CompanyDetailDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setDrawerCompany(null)
        }}
        company={drawerCompany}
        initialTab={drawerInitialTab}
      />
    </div>
  )
}

export default CompanyManagement
