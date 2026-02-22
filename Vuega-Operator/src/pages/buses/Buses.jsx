import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaSlidersH, FaPlus, FaEye, FaPencilAlt, FaClock, FaBan } from "react-icons/fa";
import StatusBadge from "../../components/ui/StatusBadge";
import Table from "../../components/ui/Table";
import RequestBusModal from "./components/RequestBusModal";

/* ── Dummy Data ── */
const INITIAL_BUSES = [
 {
 id: "bus-001",
 busNumber: "KA01 AB 1234",
 layoutTemplate: "2+2 Seater (40 seats)",
 totalSeats: 40,
 status: "active",
 currentTrip: "Bangalore → Chennai",
 },
 {
 id: "bus-002",
 busNumber: "KA53 MN 8899",
 layoutTemplate: "2+1 Sleeper (24 berths)",
 totalSeats: 24,
 status: "active",
 currentTrip: "Bangalore → Hyderabad",
 },
 {
 id: "bus-003",
 busNumber: "KA02 XY 5555",
 layoutTemplate: "2+2 Semi-Sleeper (36 seats)",
 totalSeats: 36,
 status: "under-maintenance",
 currentTrip: "—",
 },
 {
 id: "bus-004",
 busNumber: "KA04 CD 7890",
 layoutTemplate: "2+1 Seater (30 seats)",
 totalSeats: 30,
 status: "active",
 currentTrip: "Bangalore → Goa",
 },
 {
 id: "bus-005",
 busNumber: "KA19 PQ 3456",
 layoutTemplate: "2+2 Seater (40 seats)",
 totalSeats: 0,
 status: "pending-approval",
 layoutStatus: "Not Configured",
 currentTrip: "—",
 },
 {
 id: "bus-006",
 busNumber: "KA41 RS 2211",
 layoutTemplate: "2+1 Sleeper (24 berths)",
 totalSeats: 24,
 status: "active",
 currentTrip: "Bangalore → Pune",
 },
 {
 id: "bus-007",
 busNumber: "KA08 TU 9988",
 layoutTemplate: "2+2 Semi-Sleeper (36 seats)",
 totalSeats: 0,
 status: "rejected",
 layoutStatus: "Not Configured",
 currentTrip: "—",
 },
 {
 id: "bus-008",
 busNumber: "KA22 VW 4455",
 layoutTemplate: "2+2 Seater (40 seats)",
 totalSeats: 40,
 status: "active",
 currentTrip: "Bangalore → Mumbai",
 },
];

const STATUS_FILTERS = [
 "All",
 "Pending Approval",
 "Active",
 "Rejected",
 "Under Maintenance",
];

const columns = [
 { key: "busNumber", label: "Bus Number" },
 { key: "layoutTemplate", label: "Layout Template" },
 { key: "totalSeats", label: "Total Seats" },
 { key: "status", label: "Status" },
 { key: "currentTrip", label: "Current Trip" },
 { key: "actions", label: "Actions", className: "text-right" },
];

const Buses = () => {
 const navigate = useNavigate();
 const [search, setSearch] = useState("");
 const [statusFilter, setStatusFilter] = useState("All");
 const [showRequestModal, setShowRequestModal] = useState(false);
 const [buses, setBuses] = useState(INITIAL_BUSES);

 /* ── Handle new bus request submission ── */
 const handleBusRequest = (newBus) => {
 setBuses((prev) => [newBus, ...prev]);
 };

 /* ── Filtering ── */
 const filtered = buses.filter((bus) => {
 const matchesSearch =
 !search ||
 bus.busNumber.toLowerCase().includes(search.toLowerCase()) ||
 bus.layoutTemplate.toLowerCase().includes(search.toLowerCase());

 const matchesStatus =
 statusFilter === "All" ||
 bus.status ===
 statusFilter.toLowerCase().replace(/ /g, "-");

 return matchesSearch && matchesStatus;
 });

 /* ── Cell Renderer ── */
 const renderCell = (row, col) => {
 switch (col.key) {
 case "busNumber":
 return (
 <span className="font-semibold text-v-text">{row.busNumber}</span>
 );
 case "totalSeats":
 return (
 <span className="text-v-text-secondary font-medium">
 {row.totalSeats || "—"}
 </span>
 );
 case "status":
 return <StatusBadge status={row.status} />;
 case "currentTrip":
 return (
 <span className="text-v-text-secondary">{row.currentTrip}</span>
 );
 case "actions":
 return renderActions(row);
 default:
 return (
 <span className="text-v-text-secondary">{row[col.key]}</span>
 );
 }
 };

 /* ── Action buttons based on status ── */
 const renderActions = (row) => {
 if (row.status === "pending-approval") {
 return (
 <div className="flex items-center justify-end gap-2">
 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-yellow-600 bg-v-secondary border border-v-secondary-border">
 <FaClock size={14} />
 Waiting for Approval
 </span>
 </div>
 );
 }

 if (row.status === "rejected") {
 return (
 <div className="flex items-center justify-end gap-2" title="This bus request was rejected by the Super Admin">
 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-v-critical bg-v-critical-light border border-v-critical-border cursor-not-allowed">
 <FaBan size={14} />
 Request Rejected
 </span>
 </div>
 );
 }

 return (
 <div className="flex items-center justify-end gap-2">
 <button
 onClick={() => navigate(`/buses/${row.id}`)}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-accent/20 hover:border-v-accent-border transition-colors"
 >
 <FaEye size={14} />
 View
 </button>
 <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-secondary hover:border-v-secondary-border transition-colors">
 <FaPencilAlt size={14} />
 Edit
 </button>
 </div>
 );
 };

 return (
 <div className="max-w-[1360px] mx-auto flex flex-col gap-6">
 {/* ── Page Header ── */}
 <div className="flex flex-wrap items-end justify-between gap-4">
 <div>
 <h2 className="text-v-text font-bold tracking-tight">
 Buses
 </h2>
 <p className="text-v-text-muted mt-0.5">
 Manage your fleet — request, monitor, and track bus status.
 </p>
 </div>
 <button
 onClick={() => setShowRequestModal(true)}
 className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold bg-v-accent hover:bg-v-accent-hover text-v-text border border-v-accent-border transition-colors shadow-sm"
 >
 <FaPlus size={18} />
 Request New Bus
 </button>
 </div>

 {/* ── Toolbar: Search + Filter ── */}
 <div className="flex flex-wrap items-center gap-3">
 {/* Search */}
 <div className="relative flex-1 min-w-[220px] max-w-md">
 <FaSearch
 size={16}
 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-v-text-placeholder"
 />
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Search by bus number or layout…"
 className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text placeholder:text-v-text-placeholder focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
 />
 </div>

 {/* Status Filter */}
 <div className="relative">
 <FaSlidersH
 size={14}
 className="absolute left-3 top-1/2 -translate-y-1/2 text-v-text-placeholder pointer-events-none"
 />
 <select
 value={statusFilter}
 onChange={(e) => setStatusFilter(e.target.value)}
 className="pl-9 pr-8 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text-secondary focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors appearance-none cursor-pointer"
 >
 {STATUS_FILTERS.map((s) => (
 <option key={s} value={s}>
 {s}
 </option>
 ))}
 </select>
 </div>
 </div>

 {/* ── Bus Table ── */}
 <div className="bg-v-primary-bg border border-v-border rounded-xl shadow-sm overflow-hidden">
 <Table
 columns={columns}
 data={filtered}
 renderCell={renderCell}
 emptyMessage="No buses match your filters."
 />

 {/* Footer */}
 <div className="px-5 py-3 border-t border-v-border bg-v-secondary/20 text-v-text-muted">
 Showing {filtered.length} of {buses.length} buses
 </div>
 </div>

 {/* ── Request Bus Modal ── */}
 <RequestBusModal
 isOpen={showRequestModal}
 onClose={() => setShowRequestModal(false)}
 onSubmit={handleBusRequest}
 />
 </div>
 );
};

export default Buses;
