import React, { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import { FaShieldAlt } from 'react-icons/fa'
import { Bus, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
//  Data source:
//    GET /api/companies/:id/details → buses array
// ═══════════════════════════════════════════════════════════════

// Mock bus data per company — keyed by company ID
// TODO: Replace with real data from GET /api/companies/:id/details
const companyBusesMap = {
  'C-101': [
    { id: 'B-1001', busNumber: 'KA-01-AB-1234', type: 'AC Sleeper', capacity: 36, status: 'Approved', route: 'Bangalore → Mumbai', addedDate: 'Jan 15, 2025' },
    { id: 'B-1002', busNumber: 'KA-01-CD-5678', type: 'Non-AC Seater', capacity: 48, status: 'Approved', route: 'Bangalore → Chennai', addedDate: 'Jan 20, 2025' },
    { id: 'B-1003', busNumber: 'KA-01-EF-9012', type: 'AC Semi-Sleeper', capacity: 40, status: 'Approved', route: 'Bangalore → Hyderabad', addedDate: 'Feb 01, 2025' },
    { id: 'B-1004', busNumber: 'KA-01-GH-3456', type: 'AC Sleeper', capacity: 36, status: 'Pending', route: 'Bangalore → Goa', addedDate: 'Feb 12, 2025' },
  ],
  'C-102': [
    { id: 'B-2001', busNumber: 'TN-01-AB-1111', type: 'AC Sleeper', capacity: 36, status: 'Approved', route: 'Chennai → Bangalore', addedDate: 'Feb 10, 2025' },
    { id: 'B-2002', busNumber: 'TN-01-CD-2222', type: 'Non-AC Seater', capacity: 52, status: 'Approved', route: 'Chennai → Madurai', addedDate: 'Feb 15, 2025' },
    { id: 'B-2003', busNumber: 'TN-01-EF-3333', type: 'AC Semi-Sleeper', capacity: 40, status: 'Rejected', route: 'Chennai → Coimbatore', addedDate: 'Mar 01, 2025' },
  ],
  'C-103': [
    { id: 'B-3001', busNumber: 'MH-01-AB-4444', type: 'Multi-Axle Volvo', capacity: 44, status: 'Approved', route: 'Pune → Bangalore', addedDate: 'Dec 05, 2024' },
    { id: 'B-3002', busNumber: 'MH-01-CD-5555', type: 'AC Sleeper', capacity: 36, status: 'Approved', route: 'Mumbai → Goa', addedDate: 'Dec 10, 2024' },
  ],
  'C-105': [
    { id: 'B-5001', busNumber: 'GJ-01-AB-7777', type: 'AC Sleeper', capacity: 36, status: 'Approved', route: 'Ahmedabad → Mumbai', addedDate: 'Jul 01, 2024' },
    { id: 'B-5002', busNumber: 'GJ-01-CD-8888', type: 'Multi-Axle Volvo', capacity: 44, status: 'Approved', route: 'Ahmedabad → Pune', addedDate: 'Jul 15, 2024' },
  ],
  'C-107': [
    { id: 'B-7001', busNumber: 'DL-01-AB-1010', type: 'Multi-Axle Scania', capacity: 44, status: 'Approved', route: 'Delhi → Jaipur', addedDate: 'Mar 10, 2024' },
    { id: 'B-7002', busNumber: 'DL-01-CD-2020', type: 'AC Sleeper', capacity: 36, status: 'Approved', route: 'Delhi → Chandigarh', addedDate: 'Mar 15, 2024' },
    { id: 'B-7003', busNumber: 'DL-01-EF-3030', type: 'Multi-Axle Volvo', capacity: 44, status: 'Approved', route: 'Delhi → Agra', addedDate: 'Apr 01, 2024' },
    { id: 'B-7004', busNumber: 'DL-01-GH-4040', type: 'AC Semi-Sleeper', capacity: 40, status: 'Approved', route: 'Delhi → Lucknow', addedDate: 'Apr 20, 2024' },
    { id: 'B-7005', busNumber: 'DL-01-IJ-5050', type: 'AC Sleeper', capacity: 36, status: 'Pending', route: 'Delhi → Dehradun', addedDate: 'May 05, 2024' },
  ],
  'C-110': [
    { id: 'B-0001', busNumber: 'AP-01-AB-9090', type: 'AC Sleeper', capacity: 36, status: 'Approved', route: 'Hyderabad → Bangalore', addedDate: 'Sep 01, 2024' },
    { id: 'B-0002', busNumber: 'AP-01-CD-8080', type: 'Non-AC Seater', capacity: 48, status: 'Approved', route: 'Hyderabad → Vijayawada', addedDate: 'Sep 10, 2024' },
    { id: 'B-0003', busNumber: 'AP-01-EF-7070', type: 'AC Semi-Sleeper', capacity: 40, status: 'Approved', route: 'Hyderabad → Chennai', addedDate: 'Oct 01, 2024' },
  ],
}

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
  const buses = companyBusesMap[company?.id] || []

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
        header: 'Route',
        accessorKey: 'route',
        cell: (info) => (
          <span className="text-xs text-text">{info.getValue()}</span>
        ),
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
        cell: (info) => <BusStatusBadge status={info.getValue()} />,
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
        <span className="text-sm text-text-muted">No buses registered for this company.</span>
        <span className="text-[10px] text-text-muted">
          Buses will appear here once the company submits bus registration requests.
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 py-1">
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
              <tr key={hg.id} className="bg-white border-b border-border">
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
                className="border-b border-border last:border-b-0 hover:bg-[#FAFAFA] transition-colors"
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
