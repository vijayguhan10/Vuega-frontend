import ExecutiveSummaryCards from './components/ExecutiveSummaryCards';
import RevenueTrendChart from './components/RevenueTrendChart';
import RoutePerformanceTable from './components/RoutePerformanceTable';
import RiskAlertsPanel from './components/RiskAlertsPanel';
import RecentCriticalActivities from './components/RecentCriticalActivities';

const Dashboard = () => {
  return (
    <div className="max-w-[1360px] mx-auto flex flex-col gap-6">
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-v-text font-bold tracking-tight">
            Executive Dashboard
          </h2>
          <p className="text-v-text-muted">
            Strategic overview of revenue, fleet health, and governance.
          </p>
        </div>
      </div>

      {/* ── Executive KPI Cards ── */}
      <ExecutiveSummaryCards />

      {/* ── Revenue Trend ── */}
      <RevenueTrendChart />

      {/* ── Route Performance ── */}
      <RoutePerformanceTable />

      {/* ── Risk & Recent Activity (side-by-side) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskAlertsPanel />
        <RecentCriticalActivities />
      </div>
    </div>
  );
};

export default Dashboard;