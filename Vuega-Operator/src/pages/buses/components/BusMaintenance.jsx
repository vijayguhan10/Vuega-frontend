import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import StatusBadge from "../../../components/ui/StatusBadge";

const MAINTENANCE_RECORDS = [
  {
    id: 1,
    serviceDate: "2026-01-28",
    type: "Engine Service",
    insuranceExpiry: "2026-08-15",
    permitExpiry: "2026-12-31",
    status: "completed",
  },
  {
    id: 2,
    serviceDate: "2025-12-10",
    type: "Brake Inspection",
    insuranceExpiry: "2026-08-15",
    permitExpiry: "2026-12-31",
    status: "completed",
  },
  {
    id: 3,
    serviceDate: "2026-03-15",
    type: "AC Servicing",
    insuranceExpiry: "2026-08-15",
    permitExpiry: "2026-12-31",
    status: "scheduled",
  },
  {
    id: 4,
    serviceDate: "2026-02-20",
    type: "Tyre Replacement",
    insuranceExpiry: "2026-08-15",
    permitExpiry: "2026-12-31",
    status: "pending",
  },
];

const columns = [
  { key: "serviceDate", label: "Service Date" },
  { key: "type", label: "Service Type" },
  { key: "insuranceExpiry", label: "Insurance Expiry" },
  { key: "permitExpiry", label: "Permit Expiry" },
  { key: "status", label: "Status" },
];

const BusMaintenance = () => {
  const renderCell = (row, col) => {
    if (col.key === "status") {
      return <StatusBadge status={row.status} />;
    }
    if (
      col.key === "serviceDate" ||
      col.key === "insuranceExpiry" ||
      col.key === "permitExpiry"
    ) {
      const date = new Date(row[col.key]);
      const isExpiringSoon =
        (col.key === "insuranceExpiry" || col.key === "permitExpiry") &&
        date <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

      return (
        <span
          className={`text-sm ${
            isExpiringSoon
              ? "text-v-critical font-semibold"
              : "text-v-text-secondary"
          }`}
        >
          {date.toLocaleDateString("en-IN", {
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
        <h4 className="text-sm font-semibold text-v-text">
          Maintenance Records
        </h4>
        <p className="text-xs text-v-text-muted mt-0.5">
          Service history, insurance, and permit tracking
        </p>
      </div>
      <Table
        columns={columns}
        data={MAINTENANCE_RECORDS}
        renderCell={renderCell}
        emptyMessage="No maintenance records available."
      />
    </Card>
  );
};

export default BusMaintenance;
