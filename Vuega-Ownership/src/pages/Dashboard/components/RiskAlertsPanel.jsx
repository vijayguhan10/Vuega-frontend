import {
  FaExclamationTriangle,
  FaShieldAlt,
  FaIdCard,
  FaTimesCircle,
  FaTools,
} from 'react-icons/fa';
import Card from '../../../components/ui/Card';
import { riskAlerts } from '../data/dashboardData';

/* ══════════════════════════════════════════════════════
   RiskAlertsPanel — color-coded risk summary for
   company_admin: insurance, permits, cancellations,
   breakdowns.
   ══════════════════════════════════════════════════════ */

const TYPE_META = {
  insurance_expiry:    { icon: FaShieldAlt,         label: 'Insurance' },
  permit_expiry:       { icon: FaIdCard,             label: 'Permit' },
  high_cancellation:   { icon: FaTimesCircle,        label: 'Cancellation' },
  breakdown_frequency: { icon: FaTools,              label: 'Breakdown' },
};

const SEVERITY_STYLES = {
  critical: {
    border: 'border-l-red-500',
    bg:     'bg-red-50',
    dot:    'bg-red-500',
    text:   'text-red-700',
    badge:  'bg-red-100 text-red-700 border-red-200',
  },
  warning: {
    border: 'border-l-amber-400',
    bg:     'bg-amber-50',
    dot:    'bg-amber-400',
    text:   'text-amber-700',
    badge:  'bg-amber-100 text-amber-700 border-amber-200',
  },
  info: {
    border: 'border-l-blue-400',
    bg:     'bg-blue-50',
    dot:    'bg-blue-400',
    text:   'text-blue-700',
    badge:  'bg-blue-100 text-blue-700 border-blue-200',
  },
};

const RiskAlertsPanel = () => {
  const criticalCount = riskAlerts.filter((a) => a.severity === 'critical').length;
  const warningCount  = riskAlerts.filter((a) => a.severity === 'warning').length;

  return (
    <Card padding="p-0">
      {/* Header */}
      <div className="px-6 py-5 border-b border-v-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaExclamationTriangle size={16} className="text-red-500" />
          <div>
            <h3 className="text-v-text font-bold">Risk & Alerts</h3>
            <p className="text-v-text-muted mt-0.5">Governance items requiring attention</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 font-bold text-xs">
              {criticalCount} Critical
            </span>
          )}
          {warningCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 font-bold text-xs">
              {warningCount} Warning
            </span>
          )}
        </div>
      </div>

      {/* Alerts */}
      <div className="divide-y divide-v-border-light">
        {riskAlerts.map((alert) => {
          const sev  = SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES.info;
          const meta = TYPE_META[alert.type] ?? TYPE_META.insurance_expiry;
          const TypeIcon = meta.icon;

          return (
            <div
              key={alert.id}
              className={`flex items-start gap-4 px-6 py-4 border-l-4 ${sev.border} ${sev.bg} hover:brightness-[.98] transition-all`}
            >
              <div className={`p-2 rounded-lg ${sev.badge} border mt-0.5 shrink-0`}>
                <TypeIcon size={14} />
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-semibold ${sev.text}`}>{alert.title}</p>
                <p className="text-v-text-muted mt-0.5">{alert.description}</p>
              </div>

              <span className={`px-2.5 py-1 rounded-full border font-semibold text-xs whitespace-nowrap ${sev.badge} shrink-0`}>
                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-v-border bg-v-secondary/30 flex justify-center">
        <button className="font-semibold text-v-text-secondary hover:text-v-text transition-colors">
          View All Alerts
        </button>
      </div>
    </Card>
  );
};

export default RiskAlertsPanel;
