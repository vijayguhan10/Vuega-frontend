import React, { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import { FaShieldAlt } from 'react-icons/fa'
import { Users, UserCheck, UserX, ShieldCheck, Mail, Phone } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
//  Data source:
//    GET /api/companies/:id/details → employees array
// ═══════════════════════════════════════════════════════════════

// Mock employee data per company — keyed by company ID
// TODO: Replace with real data from GET /api/companies/:id/details
const companyEmployeesMap = {
  'C-101': [
    { id: 'E-1001', name: 'Rajesh Kumar', role: 'Admin', email: 'rajesh@srstravels.in', phone: '+91 98765 00001', status: 'Active', joinedDate: 'Jan 10, 2025' },
    { id: 'E-1002', name: 'Priya Sharma', role: 'Operator', email: 'priya@srstravels.in', phone: '+91 98765 00002', status: 'Active', joinedDate: 'Jan 15, 2025' },
    { id: 'E-1003', name: 'Vikram Singh', role: 'Driver Manager', email: 'vikram@srstravels.in', phone: '+91 98765 00003', status: 'Active', joinedDate: 'Feb 01, 2025' },
    { id: 'E-1004', name: 'Anita Desai', role: 'Support', email: 'anita@srstravels.in', phone: '+91 98765 00004', status: 'Inactive', joinedDate: 'Mar 10, 2025' },
  ],
  'C-102': [
    { id: 'E-2001', name: 'Suresh Nair', role: 'Admin', email: 'suresh@kpntravels.com', phone: '+91 87654 00001', status: 'Active', joinedDate: 'Feb 05, 2025' },
    { id: 'E-2002', name: 'Meena Ravi', role: 'Operator', email: 'meena@kpntravels.com', phone: '+91 87654 00002', status: 'Active', joinedDate: 'Feb 20, 2025' },
  ],
  'C-103': [
    { id: 'E-3001', name: 'Arun Patil', role: 'Admin', email: 'arun@vrltravels.in', phone: '+91 76543 00001', status: 'Active', joinedDate: 'Nov 28, 2024' },
    { id: 'E-3002', name: 'Deepak Joshi', role: 'Operator', email: 'deepak@vrltravels.in', phone: '+91 76543 00002', status: 'Active', joinedDate: 'Dec 05, 2024' },
    { id: 'E-3003', name: 'Sonal Mehta', role: 'Finance', email: 'sonal@vrltravels.in', phone: '+91 76543 00003', status: 'Inactive', joinedDate: 'Dec 20, 2024' },
  ],
  'C-105': [
    { id: 'E-5001', name: 'Kiran Patel', role: 'Admin', email: 'kiran@neetatravels.in', phone: '+91 54321 00001', status: 'Active', joinedDate: 'Jun 15, 2024' },
    { id: 'E-5002', name: 'Neha Gupta', role: 'Operator', email: 'neha@neetatravels.in', phone: '+91 54321 00002', status: 'Active', joinedDate: 'Jul 01, 2024' },
  ],
  'C-107': [
    { id: 'E-7001', name: 'Amit Verma', role: 'Admin', email: 'amit@intrcity.com', phone: '+91 32109 00001', status: 'Active', joinedDate: 'Mar 01, 2024' },
    { id: 'E-7002', name: 'Pooja Reddy', role: 'Operator', email: 'pooja@intrcity.com', phone: '+91 32109 00002', status: 'Active', joinedDate: 'Mar 15, 2024' },
    { id: 'E-7003', name: 'Rahul Tiwari', role: 'Fleet Manager', email: 'rahul@intrcity.com', phone: '+91 32109 00003', status: 'Active', joinedDate: 'Apr 01, 2024' },
    { id: 'E-7004', name: 'Sneha Das', role: 'Support', email: 'sneha@intrcity.com', phone: '+91 32109 00004', status: 'Active', joinedDate: 'Apr 20, 2024' },
    { id: 'E-7005', name: 'Manoj Kumar', role: 'Driver Manager', email: 'manoj@intrcity.com', phone: '+91 32109 00005', status: 'Inactive', joinedDate: 'May 10, 2024' },
  ],
  'C-110': [
    { id: 'E-0001', name: 'Ravi Chandra', role: 'Admin', email: 'ravi@abhibus.com', phone: '+91 09876 00001', status: 'Active', joinedDate: 'Sep 01, 2024' },
    { id: 'E-0002', name: 'Lakshmi Iyer', role: 'Operator', email: 'lakshmi@abhibus.com', phone: '+91 09876 00002', status: 'Active', joinedDate: 'Sep 15, 2024' },
    { id: 'E-0003', name: 'Venkat Rao', role: 'Finance', email: 'venkat@abhibus.com', phone: '+91 09876 00003', status: 'Active', joinedDate: 'Oct 01, 2024' },
  ],
}

/**
 * Role badge
 */
const RoleBadge = ({ role }) => {
  const isAdmin = role === 'Admin'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        isAdmin
          ? 'bg-accent/20 text-[#2E86AB]'
          : 'bg-[#F5F5F4] text-text-muted'
      }`}
    >
      {isAdmin && <ShieldCheck className="w-3 h-3" />}
      {role}
    </span>
  )
}

/**
 * Employee status dot
 */
const StatusDot = ({ status }) => (
  <div className="flex items-center gap-1.5">
    <span
      className={`w-1.5 h-1.5 rounded-full ${
        status === 'Active' ? 'bg-[#2E86AB]' : 'bg-text-muted/40'
      }`}
    />
    <span className={`text-[10px] font-medium ${
      status === 'Active' ? 'text-text' : 'text-text-muted'
    }`}>
      {status}
    </span>
  </div>
)

const EmployeesTab = ({ company }) => {
  const employees = companyEmployeesMap[company?.id] || []

  const columns = useMemo(
    () => [
      {
        header: 'Employee',
        accessorKey: 'name',
        cell: (info) => {
          const row = info.row.original
          return (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-text">{info.getValue()}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-text-muted">{row.email}</span>
              </div>
            </div>
          )
        },
      },
      {
        header: 'Role',
        accessorKey: 'role',
        cell: (info) => <RoleBadge role={info.getValue()} />,
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => <StatusDot status={info.getValue()} />,
      },
      {
        header: 'Joined',
        accessorKey: 'joinedDate',
        cell: (info) => (
          <span className="text-[10px] text-text-muted">{info.getValue()}</span>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: employees,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#F5F5F4] flex items-center justify-center">
          <Users className="w-6 h-6 text-text-muted/40" />
        </div>
        <span className="text-sm text-text-muted">No employees registered for this company.</span>
        <span className="text-[10px] text-text-muted">
          Employee records will appear once the company onboards staff.
        </span>
      </div>
    )
  }

  const activeCount = employees.filter((e) => e.status === 'Active').length
  const inactiveCount = employees.filter((e) => e.status === 'Inactive').length
  const adminCount = employees.filter((e) => e.role === 'Admin').length

  return (
    <div className="flex flex-col gap-3 py-1">
      {/* Summary strip */}
      <div className="flex items-center gap-4 px-1">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs font-semibold text-text">
            {employees.length} {employees.length === 1 ? 'Employee' : 'Employees'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <UserCheck className="w-3 h-3 text-[#2E86AB]" />
          <span className="text-[10px] text-text-muted">{activeCount} Active</span>
        </div>
        {inactiveCount > 0 && (
          <div className="flex items-center gap-1.5">
            <UserX className="w-3 h-3 text-text-muted/60" />
            <span className="text-[10px] text-text-muted">{inactiveCount} Inactive</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-[#2E86AB]" />
          <span className="text-[10px] text-text-muted">{adminCount} Admin</span>
        </div>
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
        <span>Employee access is governed by tenant-level role policies</span>
      </div>
    </div>
  )
}

export default EmployeesTab
