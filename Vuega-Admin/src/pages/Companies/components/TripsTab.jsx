import React, { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import { FaShieldAlt } from 'react-icons/fa'
import {
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
//  Data source:
//    GET /api/companies/:id/details → trips array
// ═══════════════════════════════════════════════════════════════

// Mock trip data per company — keyed by company ID
// TODO: Replace with real data from GET /api/companies/:id/details
const companyTripsMap = {
  'C-101': [
    { id: 'T-5001', route: 'Bangalore → Mumbai', busNumber: 'KA-01-AB-1234', departure: 'Feb 21, 9:00 PM', arrival: 'Feb 22, 7:00 AM', status: 'Scheduled', seatsBooked: 28, totalSeats: 36 },
    { id: 'T-5002', route: 'Bangalore → Chennai', busNumber: 'KA-01-CD-5678', departure: 'Feb 21, 10:30 PM', arrival: 'Feb 22, 5:30 AM', status: 'In Transit', seatsBooked: 42, totalSeats: 48 },
    { id: 'T-5003', route: 'Bangalore → Hyderabad', busNumber: 'KA-01-EF-9012', departure: 'Feb 20, 8:00 PM', arrival: 'Feb 21, 6:00 AM', status: 'Completed', seatsBooked: 38, totalSeats: 40 },
    { id: 'T-5004', route: 'Bangalore → Mumbai', busNumber: 'KA-01-AB-1234', departure: 'Feb 22, 9:00 PM', arrival: 'Feb 23, 7:00 AM', status: 'Scheduled', seatsBooked: 12, totalSeats: 36 },
  ],
  'C-102': [
    { id: 'T-6001', route: 'Chennai → Bangalore', busNumber: 'TN-01-AB-1111', departure: 'Feb 21, 11:00 PM', arrival: 'Feb 22, 6:00 AM', status: 'Scheduled', seatsBooked: 30, totalSeats: 36 },
    { id: 'T-6002', route: 'Chennai → Madurai', busNumber: 'TN-01-CD-2222', departure: 'Feb 21, 7:00 PM', arrival: 'Feb 22, 2:00 AM', status: 'In Transit', seatsBooked: 45, totalSeats: 52 },
  ],
  'C-103': [
    { id: 'T-7001', route: 'Pune → Bangalore', busNumber: 'MH-01-AB-4444', departure: 'Feb 19, 6:00 PM', arrival: 'Feb 20, 8:00 AM', status: 'Completed', seatsBooked: 40, totalSeats: 44 },
  ],
  'C-105': [
    { id: 'T-8001', route: 'Ahmedabad → Mumbai', busNumber: 'GJ-01-AB-7777', departure: 'Feb 21, 10:00 PM', arrival: 'Feb 22, 5:00 AM', status: 'Scheduled', seatsBooked: 20, totalSeats: 36 },
  ],
  'C-107': [
    { id: 'T-9001', route: 'Delhi → Jaipur', busNumber: 'DL-01-AB-1010', departure: 'Feb 21, 6:00 PM', arrival: 'Feb 21, 11:00 PM', status: 'In Transit', seatsBooked: 40, totalSeats: 44 },
    { id: 'T-9002', route: 'Delhi → Chandigarh', busNumber: 'DL-01-CD-2020', departure: 'Feb 21, 9:00 PM', arrival: 'Feb 22, 3:00 AM', status: 'Scheduled', seatsBooked: 24, totalSeats: 36 },
    { id: 'T-9003', route: 'Delhi → Agra', busNumber: 'DL-01-EF-3030', departure: 'Feb 21, 7:00 AM', arrival: 'Feb 21, 12:00 PM', status: 'Completed', seatsBooked: 38, totalSeats: 44 },
    { id: 'T-9004', route: 'Delhi → Lucknow', busNumber: 'DL-01-GH-4040', departure: 'Feb 22, 8:00 PM', arrival: 'Feb 23, 5:00 AM', status: 'Scheduled', seatsBooked: 8, totalSeats: 40 },
  ],
  'C-110': [
    { id: 'T-0001', route: 'Hyderabad → Bangalore', busNumber: 'AP-01-AB-9090', departure: 'Feb 21, 9:30 PM', arrival: 'Feb 22, 6:30 AM', status: 'Scheduled', seatsBooked: 30, totalSeats: 36 },
    { id: 'T-0002', route: 'Hyderabad → Vijayawada', busNumber: 'AP-01-CD-8080', departure: 'Feb 21, 5:00 PM', arrival: 'Feb 21, 11:00 PM', status: 'In Transit', seatsBooked: 40, totalSeats: 48 },
    { id: 'T-0003', route: 'Hyderabad → Chennai', busNumber: 'AP-01-EF-7070', departure: 'Feb 22, 7:00 PM', arrival: 'Feb 23, 5:00 AM', status: 'Scheduled', seatsBooked: 15, totalSeats: 40 },
  ],
}

/**
 * Trip status badge
 */
const TripStatusBadge = ({ status }) => {
  const config = {
    Scheduled: { bg: 'bg-secondary', text: 'text-[#D4A800]', icon: Clock },
    'In Transit': { bg: 'bg-accent/20', text: 'text-[#2E86AB]', icon: ArrowRight },
    Completed: { bg: 'bg-[#F5F5F4]', text: 'text-text-muted', icon: CheckCircle },
    Cancelled: { bg: 'bg-alert/10', text: 'text-alert', icon: XCircle },
  }
  const c = config[status] || config.Scheduled
  const Icon = c.icon

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.bg} ${c.text}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  )
}

/**
 * Occupancy bar (mini)
 */
const OccupancyBar = ({ booked, total }) => {
  const pct = total > 0 ? Math.round((booked / total) * 100) : 0
  const barColor = pct >= 90 ? 'bg-alert' : pct >= 70 ? 'bg-[#D4A800]' : 'bg-accent'

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-[#F5F5F4] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="text-[10px] font-semibold text-text-muted">
        {booked}/{total}
      </span>
    </div>
  )
}

const TripsTab = ({ company }) => {
  const trips = companyTripsMap[company?.id] || []

  const columns = useMemo(
    () => [
      {
        header: 'Route',
        accessorKey: 'route',
        cell: (info) => {
          const row = info.row.original
          return (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-text">{info.getValue()}</span>
              <span className="text-[10px] font-mono text-text-muted">{row.busNumber}</span>
            </div>
          )
        },
      },
      {
        header: 'Departure',
        accessorKey: 'departure',
        cell: (info) => (
          <span className="text-[11px] text-text">{info.getValue()}</span>
        ),
      },
      {
        header: 'Occupancy',
        id: 'occupancy',
        cell: (info) => {
          const row = info.row.original
          return <OccupancyBar booked={row.seatsBooked} total={row.totalSeats} />
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => <TripStatusBadge status={info.getValue()} />,
      },
    ],
    []
  )

  const table = useReactTable({
    data: trips,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#F5F5F4] flex items-center justify-center">
          <MapPin className="w-6 h-6 text-text-muted/40" />
        </div>
        <span className="text-sm text-text-muted">No trips found for this company.</span>
        <span className="text-[10px] text-text-muted">
          Trips will appear once the company creates scheduled services.
        </span>
      </div>
    )
  }

  // Summary counts
  const scheduled = trips.filter((t) => t.status === 'Scheduled').length
  const inTransit = trips.filter((t) => t.status === 'In Transit').length
  const completed = trips.filter((t) => t.status === 'Completed').length

  return (
    <div className="flex flex-col gap-3 py-1">
      {/* Summary strip */}
      <div className="flex items-center gap-4 px-1">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs font-semibold text-text">
            {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'}
          </span>
        </div>
        {scheduled > 0 && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[#D4A800]" />
            <span className="text-[10px] text-text-muted">{scheduled} Scheduled</span>
          </div>
        )}
        {inTransit > 0 && (
          <div className="flex items-center gap-1.5">
            <ArrowRight className="w-3 h-3 text-[#2E86AB]" />
            <span className="text-[10px] text-text-muted">{inTransit} In Transit</span>
          </div>
        )}
        {completed > 0 && (
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3 h-3 text-text-muted" />
            <span className="text-[10px] text-text-muted">{completed} Completed</span>
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
        <span>Trip scheduling is governed by route entitlements & operator compliance</span>
      </div>
    </div>
  )
}

export default TripsTab
