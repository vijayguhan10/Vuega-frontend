/**
 * Reusable data table component.
 *
 * @param {Array<{key: string, label: string, className?: string}>} columns
 * @param {Array<Object>} data
 * @param {(row, column) => React.ReactNode} renderCell – custom cell renderer
 * @param {string} [emptyMessage]
 */
const Table = ({
 columns = [],
 data = [],
 renderCell,
 emptyMessage = "No records found.",
}) => {
 return (
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-v-secondary/40 uppercase text-v-text-muted border-b border-v-border">
 {columns.map((col) => (
 <th
 key={col.key}
 className={`px-5 py-3 font-semibold tracking-wider ${col.className || ""}`}
 >
 {col.label}
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-v-border-light ">
 {data.length === 0 ? (
 <tr>
 <td
 colSpan={columns.length}
 className="px-5 py-10 text-center text-v-text-muted"
 >
 {emptyMessage}
 </td>
 </tr>
 ) : (
 data.map((row, rowIdx) => (
 <tr
 key={row.id ?? rowIdx}
 className="hover:bg-v-secondary/20 transition-colors"
 >
 {columns.map((col) => (
 <td key={col.key} className={`px-5 py-3.5 ${col.className || ""}`}>
 {renderCell ? renderCell(row, col) : row[col.key]}
 </td>
 ))}
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 );
};

export default Table;
