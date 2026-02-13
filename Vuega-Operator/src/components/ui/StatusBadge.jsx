/**
 * Reusable status badge component.
 *
 * @param {"active"|"pending-approval"|"rejected"|"under-maintenance"|"maintenance"|"inactive"|"delayed"|"scheduled"|"completed"|"pending"|"confirmed"|"boarding"|"in-transit"} status
 * @param {string} [className] – additional classes
 */
const statusConfig = {
  active: {
    label: "Active",
    dot: "bg-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  "pending-approval": {
    label: "Pending Approval",
    dot: "bg-yellow-500",
    bg: "bg-v-secondary",
    text: "text-yellow-700",
    border: "border-v-secondary-border",
  },
  rejected: {
    label: "Rejected",
    dot: "bg-v-critical",
    bg: "bg-v-critical-light",
    text: "text-v-critical",
    border: "border-v-critical-border",
  },
  "under-maintenance": {
    label: "Under Maintenance",
    dot: "bg-orange-500",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  maintenance: {
    label: "Maintenance",
    dot: "bg-v-secondary-border",
    bg: "bg-v-secondary",
    text: "text-yellow-700",
    border: "border-v-secondary-border",
  },
  inactive: {
    label: "Inactive",
    dot: "bg-gray-400",
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
  },
  delayed: {
    label: "Delayed",
    dot: "bg-v-critical",
    bg: "bg-v-critical-light",
    text: "text-v-critical",
    border: "border-v-critical-border",
  },
  scheduled: {
    label: "Scheduled",
    dot: "bg-gray-400",
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  completed: {
    label: "Completed",
    dot: "bg-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  pending: {
    label: "Pending",
    dot: "bg-v-secondary-border",
    bg: "bg-v-secondary",
    text: "text-yellow-700",
    border: "border-v-secondary-border",
  },
  confirmed: {
    label: "Confirmed",
    dot: "bg-v-accent-dark",
    bg: "bg-v-accent/30",
    text: "text-v-text-secondary",
    border: "border-v-accent-border",
  },
  boarding: {
    label: "Boarding",
    dot: "bg-v-accent-dark",
    bg: "bg-v-accent/20",
    text: "text-v-text-secondary",
    border: "border-v-accent-border",
  },
  "in-transit": {
    label: "In Transit",
    dot: "bg-v-accent-dark",
    bg: "bg-v-accent/30",
    text: "text-v-text-secondary",
    border: "border-v-accent-border",
  },
};

const StatusBadge = ({ status, className = "" }) => {
  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className={`size-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
