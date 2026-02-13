import { FaBus, FaMapMarkedAlt, FaCalendarAlt, FaWrench, FaCheckCircle } from "react-icons/fa";

const metrics = [
  {
    label: "Total Buses",
    value: 24,
    icon: FaBus,
    iconBg: "bg-v-accent",
    borderColor: "border-l-v-accent-dark",
    change: null,
  },
  {
    label: "Active Trips Today",
    value: 8,
    icon: FaMapMarkedAlt,
    iconBg: "bg-v-secondary",
    borderColor: "border-l-v-secondary-border",
    change: { value: "3 more", direction: "up", label: "vs yesterday" },
  },
  {
    label: "Scheduled Trips Today",
    value: 14,
    icon: FaCalendarAlt,
    iconBg: "bg-v-accent",
    borderColor: "border-l-v-accent-dark",
    change: null,
  },
  {
    label: "Under Maintenance",
    value: 3,
    icon: FaWrench,
    iconBg: "bg-v-critical-light",
    borderColor: "border-l-v-critical",
    change: { value: "1 critical", direction: "alert", label: "needs attention" },
  },
  {
    label: "Available Buses",
    value: 13,
    icon: FaCheckCircle,
    iconBg: "bg-v-secondary",
    borderColor: "border-l-v-secondary-border",
    change: null,
  },
];

const MetricsSection = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className={`flex flex-col gap-1 p-5 rounded-xl bg-v-primary-bg border border-v-border shadow-sm border-l-4 ${metric.borderColor}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-v-text-muted text-sm font-medium">
                  {metric.label}
                </p>
                <h3 className="text-v-text text-2xl font-bold mt-1">
                  {metric.value}
                </h3>
              </div>
              <div className={`${metric.iconBg} p-2 rounded-lg`}>
                <Icon size={20} className="text-v-text" />
              </div>
            </div>

            {metric.change && (
              <div className="mt-2 flex items-center gap-2">
                {metric.change.direction === "alert" ? (
                  <span className="text-xs font-semibold text-v-critical bg-v-critical-light px-1.5 py-0.5 rounded">
                    {metric.change.value}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-v-text bg-v-accent px-1.5 py-0.5 rounded">
                    {metric.change.value}
                  </span>
                )}
                <span className="text-xs text-v-text-muted">
                  {metric.change.label}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MetricsSection;
