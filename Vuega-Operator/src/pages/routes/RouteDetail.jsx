import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBadge from '../../components/ui/StatusBadge';
import Table from '../../components/ui/Table';
import dummyRoutes from './data/dummyRoutes';

/* ──────────────────────────────────────────────
 RouteDetail — displays a single route with
 tabs: Overview · Stops · Boarding · Drop.
 ────────────────────────────────────────────── */

const TABS = ['Overview', 'Stops', 'Boarding Points', 'Drop Points'];

export default function RouteDetail() {
 const { routeId } = useParams();
 const navigate = useNavigate();
 const [activeTab, setActiveTab] = useState('Overview');

 const route = useMemo(
 () => dummyRoutes.find((r) => r.id === routeId),
 [routeId],
 );

 if (!route) {
 return (
 <div className="p-6 flex flex-col items-center justify-center h-64 text-center space-y-3">
 <p className="text-v-text-muted ">Route not found.</p>
 <button
 onClick={() => navigate('/routes')}
 className=" text-v-accent-dark hover:underline"
 >
 ← Back to Routes
 </button>
 </div>
 );
 }

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
 <h1 className=" font-bold text-v-text">
 {route.fromCity} → {route.toCity}
 </h1>
 <p className=" text-v-text-muted mt-0.5">Route #{route.id}</p>
 </div>
 </div>
 <StatusBadge status={route.status === 'disabled' ? 'inactive' : route.status} />
 </div>

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
 {activeTab === 'Overview' && <OverviewTab route={route} />}
 {activeTab === 'Stops' && <StopsTab stops={route.stops} />}
 {activeTab === 'Boarding Points' && <BoardingTab points={route.boardingPoints} />}
 {activeTab === 'Drop Points' && <DropTab points={route.dropPoints} />}
 </div>
 </div>
 );
}

/* ── Tab panels ── */

function OverviewTab({ route }) {
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
 <p className=" font-semibold text-v-text-muted uppercase tracking-wider">
 {item.label}
 </p>
 <p className=" font-medium text-v-text">{item.value}</p>
 </div>
 ))}
 </div>
 );
}

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
