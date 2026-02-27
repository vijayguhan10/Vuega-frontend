import React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'


const BusRequestTable = ({ data, columns, isLoading, emptyMessage = 'No bus approval requests found' }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-primary rounded-xl border border-border">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-accent border-t-text rounded-full animate-spin" />
          <span className="text-text-muted">Loading data...</span>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-primary rounded-xl border border-border">
        <span className="text-text-muted">{emptyMessage}</span>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-secondary/30 border-b border-border">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text/80"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-border/10">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-primary transition-colors bg-primary"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 text-text">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BusRequestTable
