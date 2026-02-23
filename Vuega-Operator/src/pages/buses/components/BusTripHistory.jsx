import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import StatusBadge from "../../../components/ui/StatusBadge";

const TRIP_HISTORY = [
 {
 id: 1,
 date: "2026-02-12",
 route: "Bangalore → Chennai",
 departure: "10:00 PM",
 status: "completed",
 },
 {
 id: 2,
 date: "2026-02-11",
 route: "Bangalore → Hyderabad",
 departure: "09:30 PM",
 status: "completed",
 },
 {
 id: 3,
 date: "2026-02-10",
 route: "Bangalore → Mumbai",
 departure: "08:00 PM",
 status: "delayed",
 },
 {
 id: 4,
 date: "2026-02-09",
 route: "Bangalore → Goa",
 departure: "07:45 PM",
 status: "completed",
 },
 {
 id: 5,
 date: "2026-02-08",
 route: "Bangalore → Pune",
 departure: "10:30 PM",
 status: "completed",
 },
];

const columns = [
 { key: "date", label: "Date" },
 { key: "route", label: "Route" },
 { key: "departure", label: "Departure Time" },
 { key: "status", label: "Status" },
];

const BusTripHistory = () => {
 const renderCell = (row, col) => {
 if (col.key === "status") {
 return <StatusBadge status={row.status} />;
 }
 if (col.key === "date") {
 return (
 <span className="text-v-text-secondary font-medium">
 {new Date(row.date).toLocaleDateString("en-IN", {
 day: "2-digit",
 month: "short",
 year: "numeric",
 })}
 </span>
 );
 }
 return <span className="text-v-text-secondary">{row[col.key]}</span>;
 };

 return (
 <Card padding="p-0">
 <div className="px-5 py-4 border-b border-v-border">
 <h4 className=" font-semibold text-v-text">Trip History</h4>
 <p className=" text-v-text-muted mt-0.5">
 Past trips completed by this bus
 </p>
 </div>
 <Table
 columns={columns}
 data={TRIP_HISTORY}
 renderCell={renderCell}
 emptyMessage="No trip history available."
 />
 </Card>
 );
};

export default BusTripHistory;
