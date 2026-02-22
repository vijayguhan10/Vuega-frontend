import { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import StatusBadge from '../../components/ui/StatusBadge';
import Table from '../../components/ui/Table';
import StopsManager from './components/StopsManager';
import BoardingPointsManager from './components/BoardingPointsManager';
import DropPointsManager from './components/DropPointsManager';
import dummyRoutes from './data/dummyRoutes';

/* ──────────────────────────────────────────────
   RouteDetail — displays a single route with
   tabs: Overview · Stops · Boarding · Drop.

   For "approved" routes the operator can
   configure stops, boarding & drop points but
   cannot change fromCity, toCity or routeName.
   ────────────────────────────────────────────── */

const TABS = ['Overview', 'Stops', 'Boarding Points', 'Drop Points'];

export default function RouteDetail() {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('Overview');

  const baseRoute = useMemo(
    () => dummyRoutes.find((r) => r.id === routeId),
    [routeId],
  );

  /* Edit mode: via ?edit=true query param */
  const isEditMode = searchParams.get('edit') === 'true';
  const isApproved = baseRoute?.status === 'approved';
  const isEditable = isEditMode || isApproved;

  /* Local editable state */
  const [editableRoute, setEditableRoute] = useState(null);

  /* Initialise editable copy once */
  useMemo(() => {
    if (baseRoute && isEditable && !editableRoute) {
      setEditableRoute({ ...baseRoute });
    }
  }, [baseRoute]);

  const route = editableRoute && isEditable ? editableRoute : baseRoute;

  if (!route) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64 text-center space-y-3">
        <p className="text-v-text-muted">Route not found.</p>
        <button
          onClick={() => navigate('/routes')}
          className="text-v-accent-dark hover:underline"
        >
          ← Back to Routes
        </button>
      </div>
    );
  }

  /* ── Helpers for editable route ── */
  const setField = (key, value) =>
    setEditableRoute((prev) => (prev ? { ...prev, [key]: value } : prev));

  const handleSaveConfig = () => {
    // TODO: PUT /api/routes/:id when backend is ready
    console.log('── Route Config Saved ──');
    console.log(JSON.stringify(editableRoute, null, 2));
    alert('Route configuration saved! (check console)');
  };

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/routes')}
            className="text-v-text-muted hover:text-v-text transition-colors"
            title="Back"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="font-bold text-v-text">
              {route.fromCity} → {route.toCity}
            </h1>
            <p className="text-v-text-muted mt-0.5">Route #{route.id}</p>
          </div>
        </div>
        <StatusBadge status={route.status === 'disabled' ? 'inactive' : route.status} />
      </div>

      {/* ── Approved banner ── */}
      {isApproved && (
        <div className="px-4 py-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-blue-700 font-medium">
            This route has been approved by the Super Admin. Configure stops, boarding and drop points below.
            Route name, From City, and To City cannot be changed.
          </p>
        </div>
      )}

      {/* ── Edit mode banner ── */}
      {isEditMode && !isApproved && (
        <div className="px-4 py-3 rounded-lg bg-v-secondary border border-v-secondary-border">
          <p className="text-v-text-secondary font-medium">
            You are editing this route. From City and To City cannot be changed.
          </p>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-1 border-b border-v-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors -mb-px ${
              activeTab === tab
                ? 'text-v-text border-b-2 border-v-accent-dark'
                : 'text-v-text-muted hover:text-v-text-secondary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="bg-v-primary-bg border border-v-border rounded-xl p-6">
        {activeTab === 'Overview' && (
          <OverviewTab route={route} isEditable={isEditable} onFieldChange={setField} />
        )}
        {activeTab === 'Stops' && (
          isEditable ? (
            <StopsManager stops={route.stops} onChange={(v) => setField('stops', v)} />
          ) : (
            <StopsTab stops={route.stops} />
          )
        )}
        {activeTab === 'Boarding Points' && (
          isEditable ? (
            <BoardingPointsManager points={route.boardingPoints} onChange={(v) => setField('boardingPoints', v)} />
          ) : (
            <BoardingTab points={route.boardingPoints} />
          )
        )}
        {activeTab === 'Drop Points' && (
          isEditable ? (
            <DropPointsManager points={route.dropPoints} onChange={(v) => setField('dropPoints', v)} />
          ) : (
            <DropTab points={route.dropPoints} />
          )
        )}
      </div>

      {/* ── Save button for editable routes ── */}
      {isEditable && (
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => navigate('/routes')}
            className="px-5 py-2 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveConfig}
            className="px-5 py-2 rounded-lg font-medium text-v-text bg-v-accent hover:bg-v-accent-hover border border-v-accent-border shadow-sm transition-colors"
          >
            {isApproved ? 'Save Configuration' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────── */
/*                  Tab panels                    */
/* ────────────────────────────────────────────── */

function OverviewTab({ route, isEditable, onFieldChange }) {
  if (isEditable) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Locked fields */}
          <LockedField label="From City" value={route.fromCity} />
          <LockedField label="To City" value={route.toCity} />

          {/* Editable fields */}
          <EditableField
            label="Distance (km)"
            type="number"
            value={route.distance}
            onChange={(v) => onFieldChange('distance', Number(v) || 0)}
          />
          <EditableField
            label="Estimated Duration"
            value={route.duration}
            onChange={(v) => onFieldChange('duration', v)}
          />
        </div>

        {route.notes && (
          <div className="pt-3 border-t border-v-border">
            <p className="font-semibold text-v-text-muted uppercase tracking-wider mb-1">
              Admin Notes
            </p>
            <p className="text-v-text-secondary">{route.notes}</p>
          </div>
        )}
      </div>
    );
  }

  /* Read-only overview for active / disabled routes */
  const items = [
    { label: 'From City', value: route.fromCity },
    { label: 'To City', value: route.toCity },
    { label: 'Distance', value: `${route.distance} km` },
    { label: 'Duration', value: route.duration },
    { label: 'Stops', value: route.stops.length },
    { label: 'Boarding Points', value: route.boardingPoints.length },
    { label: 'Drop Points', value: route.dropPoints.length },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <p className="font-semibold text-v-text-muted uppercase tracking-wider">
            {item.label}
          </p>
          <p className="font-medium text-v-text">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Locked field (fromCity / toCity) ── */
function LockedField({ label, value }) {
  return (
    <div className="space-y-1">
      <label className="font-semibold text-v-text-muted uppercase tracking-wider">
        {label}
        <span className="ml-2 text-v-text-placeholder font-normal normal-case">(locked)</span>
      </label>
      <div className="px-3.5 py-2.5 rounded-lg border border-v-border bg-gray-100 text-v-text-secondary cursor-not-allowed select-none">
        {value}
      </div>
    </div>
  );
}

/* ── Editable field ── */
function EditableField({ label, value, onChange, type = 'text' }) {
  return (
    <div className="space-y-1">
      <label className="font-semibold text-v-text-muted uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text focus:outline-none focus:ring-1 focus:ring-v-accent-dark transition"
      />
    </div>
  );
}

/* ── Read-only tab panels (active / disabled routes) ── */

function StopsTab({ stops }) {
  const columns = [
    { key: 'order', label: '#', className: 'w-12 text-center' },
    { key: 'name', label: 'Stop Name' },
  ];

  return (
    <Table
      columns={columns}
      data={stops}
      emptyMessage="No intermediate stops."
    />
  );
}

function BoardingTab({ points }) {
  const columns = [
    { key: 'name', label: 'Boarding Point' },
    { key: 'timeOffset', label: 'Time Offset' },
  ];

  return (
    <Table
      columns={columns}
      data={points}
      emptyMessage="No boarding points."
    />
  );
}

function DropTab({ points }) {
  const columns = [
    { key: 'name', label: 'Drop Point' },
  ];

  return (
    <Table
      columns={columns}
      data={points}
      emptyMessage="No drop points."
    />
  );
}
