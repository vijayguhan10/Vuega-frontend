import MetricsSection from "./components/MetricsSection";
import TodayTripsTable from "./components/TodayTripsTable";
import UpcomingTripsTable from "./components/UpcomingTripsTable";
import MaintenanceAlerts from "./components/MaintenanceAlerts";

const Dashboard = () => {
 return (
 <div className="max-w-[1360px] mx-auto flex flex-col gap-6">
 {/* ── Page Header ── */}
 <div className="flex flex-wrap items-end justify-between gap-4">
 <div className="flex flex-col gap-1">
 <h2 className="text-v-text font-bold tracking-tight">
 Operations Overview
 </h2>
 <p className="text-v-text-muted ">
 Monitor fleet status, trips, and maintenance in real-time.
 </p>
 </div>
 
 </div>

 {/* ── Metric Cards ── */}
 <MetricsSection />

 {/* ── Today's Trips ── */}
 <TodayTripsTable />

 {/* ── Bottom Row: Upcoming + Maintenance ── */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2">
 <UpcomingTripsTable />
 </div>
 <div className="lg:col-span-1">
 <MaintenanceAlerts />
 </div>
 </div>
 </div>
 );
};

export default Dashboard;