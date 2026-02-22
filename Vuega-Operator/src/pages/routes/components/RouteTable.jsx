import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../../components/ui/StatusBadge';
import Table from '../../../components/ui/Table';

/* ──────────────────────────────────────────────
 RouteTable — displays all routes in the
 reusable Table component.
 ────────────────────────────────────────────── */

const columns = [
 { key: 'routeName', label: 'Route Name' },
 { key: 'fromCity', label: 'From City' },
 { key: 'toCity', label: 'To City' },
 { key: 'distance', label: 'Distance (km)', className: 'text-right' },
 { key: 'stops', label: 'Stops' , className: 'text-center' },
 { key: 'duration', label: 'Est. Duration' },
 { key: 'status', label: 'Status' },
 { key: 'actions', label: 'Actions' },
];

export default function RouteTable({ routes, onDisable }) {
 const navigate = useNavigate();

 const renderCell = (row, col) => {
 switch (col.key) {
 case 'routeName':
 return (
 <span className="font-medium text-v-text">
 {row.fromCity} → {row.toCity}
 </span>
 );
 case 'distance':
 return <span className="tabular-nums">{row.distance}</span>;
 case 'stops':
 return <span className="tabular-nums">{row.stops.length}</span>;
 case 'status':
 return <StatusBadge status={row.status === 'disabled' ? 'inactive' : row.status} />;
 case 'actions':
 return (
 <div className="flex items-center gap-2">
 <button
 onClick={() => navigate(`/routes/${row.id}`)}
 className=" font-medium text-v-accent-dark hover:underline"
 >
 View
 </button>
 <span className="text-v-border">|</span>
 <button
 onClick={() => navigate(`/routes/${row.id}?edit=true`)}
 className=" font-medium text-v-text-secondary hover:underline"
 >
 Edit
 </button>
 <span className="text-v-border">|</span>
 <button
 onClick={() => onDisable(row.id)}
 className=" font-medium text-v-critical hover:underline"
 >
 {row.status === 'active' ? 'Disable' : 'Enable'}
 </button>
 </div>
 );
 default:
 return row[col.key];
 }
 };

 return (
 <Table
 columns={columns}
 data={routes}
 renderCell={renderCell}
 emptyMessage="No routes found."
 />
 );
}
