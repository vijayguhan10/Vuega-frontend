import {
  FaRupeeSign,
  FaCoins,
  FaChartPie,
  FaUndoAlt,
  FaRoute,
  FaBus,
  FaWrench,
  FaShieldAlt,
  FaArrowUp,
  FaArrowDown,
  FaExclamationCircle,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { executiveKPIs } from '../data/dashboardData';

/* ══════════════════════════════════════════════════════
   ExecutiveSummaryCards — top-row KPI cards for
   company_admin executive dashboard.
   ══════════════════════════════════════════════════════ */

const ICON_MAP = {
  revenue:       FaRupeeSign,
  todayRevenue:  FaCoins,
  occupancy:     FaChartPie,
  refund:        FaUndoAlt,
  trips:         FaRoute,
  bus:           FaBus,
  maintenance:   FaWrench,
  insurance:     FaShieldAlt,
};

const ICON_STYLE_MAP = {
  revenue:       'bg-emerald-100 text-emerald-600',
  todayRevenue:  'bg-emerald-50  text-emerald-500',
  occupancy:     'bg-blue-100    text-blue-600',
  refund:        'bg-orange-100  text-orange-500',
  trips:         'bg-violet-100  text-violet-600',
  bus:           'bg-cyan-100    text-cyan-600',
  maintenance:   'bg-amber-100   text-amber-600',
  insurance:     'bg-red-100     text-red-500',
};

const TrendBadge = ({ trend }) => {
  if (!trend) return null;

  if (trend.direction === 'up') {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
        <FaArrowUp size={10} /> {trend.value}
        {trend.label && <span className="font-normal text-v-text-muted ml-0.5">{trend.label}</span>}
      </span>
    );
  }
  if (trend.direction === 'down') {
    // For refund/cost, "down" is good
    return (
      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
        <FaArrowDown size={10} /> {trend.value}
        {trend.label && <span className="font-normal text-v-text-muted ml-0.5">{trend.label}</span>}
      </span>
    );
  }
  if (trend.direction === 'alert') {
    return (
      <span className="inline-flex items-center gap-1 text-red-500 font-semibold">
        <FaExclamationCircle size={10} /> {trend.value}
      </span>
    );
  }
  // neutral
  return (
    <span className="text-v-text-muted font-medium">
      {trend.value}
    </span>
  );
};

const ExecutiveSummaryCards = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {executiveKPIs.map((kpi) => {
        const IconComp = ICON_MAP[kpi.icon] ?? FaChartPie;
        const iconStyle = ICON_STYLE_MAP[kpi.icon] ?? 'bg-v-secondary text-v-text-muted';

        return (
          <button
            key={kpi.key}
            onClick={() => navigate(kpi.drillDownPath)}
            className="flex flex-col gap-2 px-5 py-4 rounded-xl bg-v-primary-bg border border-v-border shadow-sm hover:shadow-md hover:border-v-accent-border transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <p className="text-v-text-muted font-medium">{kpi.label}</p>
              <div className={`p-2 rounded-lg ${iconStyle} transition-transform group-hover:scale-110`}>
                <IconComp size={16} />
              </div>
            </div>

            <h3 className="text-v-text font-bold text-2xl tracking-tight">{kpi.value}</h3>

            <TrendBadge trend={kpi.trend} />
          </button>
        );
      })}
    </div>
  );
};

export default ExecutiveSummaryCards;
