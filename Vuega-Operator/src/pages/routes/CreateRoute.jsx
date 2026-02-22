import RouteForm from './components/RouteForm';

/* ──────────────────────────────────────────────
   CreateRoute — page wrapper for RouteForm.
   ────────────────────────────────────────────── */

export default function CreateRoute() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-v-text">Create Route</h1>
        <p className="text-sm text-v-text-muted mt-1">
          Define a new geographical route with stops, boarding and drop points.
        </p>
      </div>

      {/* Form */}
      <RouteForm />
    </div>
  );
}
