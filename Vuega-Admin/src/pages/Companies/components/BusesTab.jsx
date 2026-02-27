import React, { useMemo, useState, useSyncExternalStore } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import { Bus, CheckCircle, XCircle, Clock, ShieldCheck, AlertTriangle, Key } from 'lucide-react'
import { FaShieldAlt } from 'react-icons/fa'
import AuditNotice from '../../BusApprovals/components/AuditNotice'
import { requestsStore } from '../../../data/requestsStore'

/**
 * Bus status badge
 */
const BusStatusBadge = ({ status }) => {
  const config = {
    Approved: { bg: 'bg-accent/20', text: 'text-[#2E86AB]', icon: CheckCircle },
    Pending: { bg: 'bg-secondary', text: 'text-[#D4A800]', icon: Clock },
    Rejected: { bg: 'bg-alert/10', text: 'text-alert', icon: XCircle },
  }
  const c = config[status] || config.Pending
  const Icon = c.icon

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.bg} ${c.text}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  )
}

const BusesTab = ({ company }) => {
  const allBusRequests = useSyncExternalStore(requestsStore.subscribe, requestsStore.getBusSnapshot)
  const buses = useMemo(() => allBusRequests.filter((b) => b.companyId === company?.id), [allBusRequests, company?.id])

  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [selectedBus, setSelectedBus] = useState(null)

  const columns = useMemo(
    () => [
      {
        header: 'Bus Number',
        accessorKey: 'busNumber',
        cell: (info) => {
          const row = info.row.original
          return (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-mono font-semibold text-text">
                {info.getValue()}
              </span>
              <span className="text-[10px] text-text-muted">{row.type}</span>
            </div>
          )
        },
      },
      {
        header: 'Seats',
        accessorKey: 'capacity',
        cell: (info) => (
          <span className="text-xs font-medium text-text">{info.getValue()}</span>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => {
          const status = info.getValue()
          const config = {
            Approved: { bg: 'bg-accent text-text', icon: <ShieldCheck className="w-3 h-3 mr-1 text-accent" /> },
            Pending: { bg: 'bg-secondary text-text', icon: <Clock className="w-3 h-3 mr-1 text-[#D4A800]" /> },
            Rejected: { bg: 'bg-alert/10 text-alert', icon: <XCircle className="w-3 h-3 mr-1 text-alert" /> },
          }
          const c = config[status] || config.Pending
          return (
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.bg}`}>
              {c.icon}
              {status}
            </span>
          )
        },
      },
      {
        header: 'Action',
        id: 'action',
        cell: (info) => {
          const status = info.row.original.status
          return status === 'Pending' ? (
            <div className="flex gap-2">
              <button
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-accent text-text hover:bg-accent/80 flex items-center gap-1 transition-colors"
                onClick={() => {
                  setSelectedBus(info.row.original)
                  setApproveModalOpen(true)
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Approve
              </button>
              <button
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-alert/10 text-alert hover:bg-alert/20 flex items-center gap-1 transition-colors"
                onClick={() => {
                  setSelectedBus(info.row.original)
                  setRejectModalOpen(true)
                }}
              >
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
            </div>
          ) : (
            <span className="text-xs text-text-muted">—</span>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: buses,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (buses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#F5F5F4] flex items-center justify-center">
          <Bus className="w-6 h-6 text-text-muted/40" />
        </div>
        <span className="text-text-muted">No buses registered for this company.</span>
        <span className="text-[10px] text-text-muted">
          Buses will appear here once the company submits bus registration requests.
        </span>
      </div>
    )
  }
  // Approve/Reject handlers — update shared store
  const handleApprove = () => {
    requestsStore.updateBusRequest(selectedBus.id, (b) => ({ ...b, status: 'Approved' }))
    setApproveModalOpen(false)
    setSelectedBus(null)
  }

  const handleReject = (remarks) => {
    requestsStore.updateBusRequest(selectedBus.id, (b) => ({ ...b, status: 'Rejected', remarks }))
    setRejectModalOpen(false)
    setSelectedBus(null)
  }

  return (
    <div className="flex flex-col gap-3 py-1">
      {/* Approve Modal */}
      {approveModalOpen && selectedBus && (
        <BusApproveModal
          bus={selectedBus}
          companyName={company?.name || 'Unknown'}
          onConfirm={handleApprove}
          onCancel={() => {
            setApproveModalOpen(false)
            setSelectedBus(null)
          }}
        />
      )}
      {/* Reject Modal */}
      {rejectModalOpen && selectedBus && (
        <BusRejectModal
          bus={selectedBus}
          companyName={company?.name || 'Unknown'}
          onConfirm={handleReject}
          onCancel={() => {
            setRejectModalOpen(false)
            setSelectedBus(null)
          }}
        />
      )}
      {/* Summary strip */}
      <div className="flex items-center gap-4 px-1">
        <div className="flex items-center gap-1.5">
          <Bus className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs font-semibold text-text">
            {buses.length} {buses.length === 1 ? 'Bus' : 'Buses'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3 h-3 text-[#2E86AB]" />
          <span className="text-[10px] text-text-muted">
            {buses.filter((b) => b.status === 'Approved').length} Approved
          </span>
        </div>
        {buses.filter((b) => b.status === 'Pending').length > 0 && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[#D4A800]" />
            <span className="text-[10px] text-text-muted">
              {buses.filter((b) => b.status === 'Pending').length} Pending
            </span>
          </div>
        )}
        {buses.filter((b) => b.status === 'Rejected').length > 0 && (
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-alert" />
            <span className="text-[10px] text-text-muted">
              {buses.filter((b) => b.status === 'Rejected').length} Rejected
            </span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="bg-secondary/30 border-b border-border">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-text-muted"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-b-0"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Governance footer */}
      <div className="flex items-center gap-1.5 px-1 text-[10px] text-text-muted">
        <FaShieldAlt className="w-2.5 h-2.5" />
        <span>Bus approvals are governed by entitlement limits & compliance policy</span>
      </div>
    </div>
  )
}

export default BusesTab


/**
 * Bus Approve Modal — matches Bus Approval page modal
 */
const BusApproveModal = ({ bus, companyName, onConfirm, onCancel }) => {
  const atLimit = bus.currentBusCount >= bus.busLimit
  const projectedCount = bus.currentBusCount + 1
  const projectedUsage = Math.round((projectedCount / bus.busLimit) * 100)

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="bg-primary rounded-xl shadow-lg w-full max-w-lg mx-4 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#2E86AB]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text">Approve Bus Request</h3>
              <span className="text-xs font-mono text-text-muted">{bus.id}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4">
          {/* Request Details */}
          <div className="flex flex-col gap-2.5 text-sm text-text">
            <div className="flex justify-between">
              <span className="text-text-muted">Company</span>
              <span className="font-semibold">{companyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Bus Number</span>
              <span className="font-mono">{bus.busNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Layout</span>
              <span>{bus.layoutType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Capacity</span>
              <span>{bus.capacity} seats</span>
            </div>
          </div>

          {/* Entitlement Validation Panel */}
          <div className="bg-[#F5F5F4] rounded-lg p-4 flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Key className="w-3 h-3" />
              Bus Entitlement Validation
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Current</span>
                <span className="text-lg font-bold text-text">{bus.currentBusCount}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Max Allowed</span>
                <span className="text-lg font-bold text-text">{bus.busLimit}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Post-Approval</span>
                <span className={`text-lg font-bold ${projectedCount > bus.busLimit ? 'text-alert' : 'text-[#2E86AB]'}`}>
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
                This operator has reached their bus entitlement limit
                ({bus.busLimit}). Approval is blocked until the limit is
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


/**
 * Bus Reject Modal — matches Bus Approval page modal
 */
const BusRejectModal = ({ bus, companyName, onConfirm, onCancel }) => {
  const [remarks, setRemarks] = useState('')
  const canSubmit = remarks.trim().length > 0

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="bg-primary rounded-xl shadow-lg w-full max-w-md mx-4 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-alert/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-alert" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text">Reject Bus Request</h3>
              <span className="text-xs font-mono text-text-muted">{bus.id}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4">
          {/* Request Details */}
          <div className="flex flex-col gap-2.5 text-sm text-text">
            <div className="flex justify-between">
              <span className="text-text-muted">Company</span>
              <span className="font-semibold">{companyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Bus Number</span>
              <span className="font-mono">{bus.busNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Layout</span>
              <span>{bus.layoutType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Current Usage</span>
              <span className="text-text">
                {bus.currentBusCount}/{bus.busLimit}
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
