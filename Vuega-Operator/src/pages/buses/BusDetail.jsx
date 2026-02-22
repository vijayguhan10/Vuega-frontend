import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPencilAlt, FaShieldAlt } from "react-icons/fa";
import StatusBadge from "../../components/ui/StatusBadge";
import BusOverview from "./components/BusOverview";
import BusLayoutView from "./components/BusLayoutView";
import BusTripHistory from "./components/BusTripHistory";
import BusMaintenance from "./components/BusMaintenance";

/* ── Dummy bus lookup ── */
const BUSES_MAP = {
 "bus-001": {
 id: "bus-001",
 busNumber: "KA01 AB 1234",
 busType: "Seater",
 layoutTemplate: "2+2 Seater (40 seats)",
 totalSeats: 40,
 status: "active",
 currentTrip: "Bangalore → Chennai",
 },
 "bus-002": {
 id: "bus-002",
 busNumber: "KA53 MN 8899",
 busType: "Sleeper",
 layoutTemplate: "2+1 Sleeper (24 berths)",
 totalSeats: 24,
 status: "active",
 currentTrip: "Bangalore → Hyderabad",
 },
 "bus-003": {
 id: "bus-003",
 busNumber: "KA02 XY 5555",
 busType: "Semi-Sleeper",
 layoutTemplate: "2+2 Semi-Sleeper (36 seats)",
 totalSeats: 36,
 status: "under-maintenance",
 currentTrip: "—",
 },
 "bus-004": {
 id: "bus-004",
 busNumber: "KA04 CD 7890",
 busType: "Seater",
 layoutTemplate: "2+1 Seater (30 seats)",
 totalSeats: 30,
 status: "active",
 currentTrip: "Bangalore → Goa",
 },
 "bus-005": {
 id: "bus-005",
 busNumber: "KA19 PQ 3456",
 busType: "Seater",
 layoutTemplate: "2+2 Seater (40 seats)",
 totalSeats: 0,
 status: "pending-approval",
 layoutStatus: "Not Configured",
 currentTrip: "—",
 },
 "bus-006": {
 id: "bus-006",
 busNumber: "KA41 RS 2211",
 busType: "Sleeper",
 layoutTemplate: "2+1 Sleeper (24 berths)",
 totalSeats: 24,
 status: "active",
 currentTrip: "Bangalore → Pune",
 },
 "bus-007": {
 id: "bus-007",
 busNumber: "KA08 TU 9988",
 busType: "Semi-Sleeper",
 layoutTemplate: "2+2 Semi-Sleeper (36 seats)",
 totalSeats: 0,
 status: "rejected",
 layoutStatus: "Not Configured",
 currentTrip: "—",
 },
 "bus-008": {
 id: "bus-008",
 busNumber: "KA22 VW 4455",
 busType: "Seater",
 layoutTemplate: "2+2 Seater (40 seats)",
 totalSeats: 40,
 status: "active",
 currentTrip: "Bangalore → Mumbai",
 },
};

const ALL_TABS = [
 { key: "overview", label: "Overview" },
 { key: "layout", label: "Layout View" },
 { key: "trips", label: "Trip History" },
 { key: "maintenance", label: "Maintenance Records" },
];

const BusDetail = () => {
 const { busId } = useParams();
 const navigate = useNavigate();
 const [activeTab, setActiveTab] = useState("overview");

 // TODO: Replace with API call — GET /api/buses/:busId
 const bus = BUSES_MAP[busId];

 const isApproved = bus?.status === "active" || bus?.status === "under-maintenance";
 const visibleTabs = isApproved ? ALL_TABS : ALL_TABS.filter((t) => t.key === "overview");

 if (!bus) {
 return (
 <div className="max-w-[1360px] mx-auto flex flex-col items-center justify-center h-64 text-center">
 <div className="w-12 h-12 rounded-full bg-v-critical-light flex items-center justify-center mb-4">
 <span className="text-v-critical ">!</span>
 </div>
 <h2 className=" font-semibold text-v-text">Bus Not Found</h2>
 <p className=" text-v-text-muted mt-1">
 The requested bus does not exist.
 </p>
 <button
 onClick={() => navigate("/buses")}
 className="mt-4 px-4 py-2 rounded-lg font-medium bg-v-accent hover:bg-v-accent-hover text-v-text border border-v-accent-border transition-colors"
 >
 Back to Buses
 </button>
 </div>
 );
 }

 /* ── Tab content mapping ── */
 const renderTab = () => {
 switch (activeTab) {
 case "overview":
 return <BusOverview bus={bus} />;
 case "layout":
 return <BusLayoutView bus={bus} />;
 case "trips":
 return <BusTripHistory />;
 case "maintenance":
 return <BusMaintenance />;
 default:
 return null;
 }
 };

 return (
 <div className="max-w-[1360px] mx-auto flex flex-col gap-6">
 {/* ── Header ── */}
 <div className="flex flex-wrap items-start justify-between gap-4">
 <div className="flex items-center gap-4">
 <button
 onClick={() => navigate("/buses")}
 className="p-2 rounded-lg border border-v-border hover:bg-v-secondary transition-colors text-v-text-muted"
 >
 <FaArrowLeft size={18} />
 </button>
 <div>
 <div className="flex items-center gap-3">
 <h2 className="text-v-text font-bold tracking-tight">
 {bus.busNumber}
 </h2>
 <StatusBadge status={bus.status} />
 </div>
 <p className="text-v-text-muted mt-0.5">
 {bus.busType} • {bus.layoutTemplate}
 </p>
 </div>
 </div>

 <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-secondary hover:border-v-secondary-border transition-colors">
 <FaPencilAlt size={16} />
 Edit Bus
 </button>
 </div>

 {/* ── Restriction Banner (non-active buses) ── */}
 {!isApproved && (
 <div className="flex items-start gap-3 px-4 py-3.5 rounded-lg bg-v-secondary border border-v-secondary-border">
 <FaShieldAlt size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
 <div>
 <p className=" font-semibold text-v-text">
 {bus.status === "rejected"
 ? "This bus request was rejected."
 : "This bus is not yet approved."}
 </p>
 <p className=" text-v-text-muted mt-0.5">
 {bus.status === "rejected"
 ? "You cannot configure layout or schedule trips for a rejected bus. Contact your Super Admin for details."
 : "You cannot configure layout or schedule trips until the Super Admin approves this request."}
 </p>
 </div>
 </div>
 )}

 {/* ── Tab Navigation ── */}
 <div className="border-b border-v-border">
 <nav className="flex gap-1 -mb-px">
 {visibleTabs.map((tab) => (
 <button
 key={tab.key}
 onClick={() => setActiveTab(tab.key)}
 className={`px-4 py-2.5 font-medium rounded-t-lg transition-colors relative ${
 activeTab === tab.key
 ? "text-v-text bg-v-primary-bg border border-v-border border-b-transparent -mb-px"
 : "text-v-text-muted hover:text-v-text-secondary hover:bg-v-secondary/40"
 }`}
 >
 {tab.label}
 </button>
 ))}
 </nav>
 </div>

 {/* ── Tab Content ── */}
 <div>{renderTab()}</div>
 </div>
 );
};

export default BusDetail;
