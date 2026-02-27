import React, { useMemo, useState, useSyncExternalStore } from 'react'
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
} from '@tanstack/react-table'
import { Clock, CheckCircle, XCircle, ShieldCheck, Key, AlertTriangle, Route } from 'lucide-react'
import AuditNotice from '../../BusApprovals/components/AuditNotice'
import { requestsStore } from '../../../data/requestsStore'


function RoutesTab({ company }) {
  const allRouteRequests = useSyncExternalStore(requestsStore.subscribe, requestsStore.getRouteSnapshot)
  const routes = useMemo(() => allRouteRequests.filter((r) => r.companyId === company?.id), [allRouteRequests, company?.id])
	const pendingCount = routes.filter((t) => t.status === 'Pending').length;
	const approvedCount = routes.filter((t) => t.status === 'Approved').length;
	const rejectedCount = routes.filter((t) => t.status === 'Rejected').length;

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

	const columns = useMemo(
		() => [
			{
				header: 'Route',
				id: 'route',
				accessorFn: (row) => `${row.origin} → ${row.destination}`,
				cell: (info) => {
					const row = info.row.original;
					return (
						<div className="flex flex-col gap-0.5">
							<div className="flex items-center gap-1.5">
								<span className="text-xs font-semibold text-text">{row.origin}</span>
								<span className="text-text-muted text-[10px]">→</span>
								<span className="text-xs font-semibold text-text">{row.destination}</span>
							</div>
							<span className="text-[10px] text-text-muted">{row.distance} · {row.duration}</span>
						</div>
					);
				},
			},
			{
				header: 'Status',
				accessorKey: 'status',
				cell: (info) => <RouteStatusBadge status={info.getValue()} />, 
			},
			{
				header: 'Action',
				id: 'action',
				cell: (info) => {
					const status = info.row.original.status;
					return status === 'Pending' ? (
						<div className="flex gap-2">
							<button
								className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-accent text-text hover:bg-accent/80 flex items-center gap-1 transition-colors"
								onClick={() => {
									setSelectedRoute(info.row.original);
									setApproveModalOpen(true);
								}}
							>
								<ShieldCheck className="w-3.5 h-3.5" /> Approve
							</button>
							<button
								className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-alert/10 text-alert hover:bg-alert/20 flex items-center gap-1 transition-colors"
								onClick={() => {
									setSelectedRoute(info.row.original);
									setRejectModalOpen(true);
								}}
							>
								<XCircle className="w-3.5 h-3.5" /> Reject
							</button>
						</div>
					) : (
						<span className="text-xs text-text-muted">—</span>
					);
				},
			},
		],
		[]
	);
  const table = useReactTable({
    data: routes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

	const handleApprove = () => {
		requestsStore.updateRouteRequest(selectedRoute.id, (r) => ({ ...r, status: 'Approved' }))
		setApproveModalOpen(false);
		setSelectedRoute(null);
	};

	const handleReject = (remarks) => {
		requestsStore.updateRouteRequest(selectedRoute.id, (r) => ({ ...r, status: 'Rejected', remarks }))
		setRejectModalOpen(false);
		setSelectedRoute(null);
	};

	if (routes.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 gap-3">
				<div className="w-12 h-12 rounded-xl bg-[#F5F5F4] flex items-center justify-center">
					<Route className="w-6 h-6 text-text-muted/40" />
				</div>
				<span className="text-text-muted">No routes registered for this company.</span>
				<span className="text-[10px] text-text-muted">
					Routes will appear here once the company submits route registration requests.
				</span>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3 py-1">
			{/* Approve Modal */}
			{approveModalOpen && selectedRoute && (
				<RouteApproveModal
					route={selectedRoute}
					companyName={company?.name || 'Unknown'}
					onConfirm={handleApprove}
					onCancel={() => {
						setApproveModalOpen(false);
						setSelectedRoute(null);
					}}
				/>
			)}
			{/* Reject Modal */}
			{rejectModalOpen && selectedRoute && (
				<RouteRejectModal
					route={selectedRoute}
					companyName={company?.name || 'Unknown'}
					onConfirm={handleReject}
					onCancel={() => {
						setRejectModalOpen(false);
						setSelectedRoute(null);
					}}
				/>
			)}

			{/* Summary strip */}
			<div className="flex items-center gap-4 px-1">
				<div className="flex items-center gap-1.5">
					<Clock className="w-3.5 h-3.5 text-[#D4A800]" />
					<span className="text-xs font-semibold text-[#D4A800]">
						{pendingCount} Pending
					</span>
				</div>
				<div className="flex items-center gap-1.5">
					<CheckCircle className="w-3.5 h-3.5 text-[#2E86AB]" />
					<span className="text-xs font-semibold text-[#2E86AB]">
						{approvedCount} Approved
					</span>
				</div>
				<div className="flex items-center gap-1.5">
					<XCircle className="w-3.5 h-3.5 text-alert" />
					<span className="text-xs font-semibold text-alert">
						{rejectedCount} Rejected
					</span>
				</div>
			</div>

			{/* Table */}
			<div className="border border-border rounded-lg overflow-hidden">
				<table className="w-full text-left">
					<thead>
						{table.getHeaderGroups().map((hg) => (
							<tr key={hg.id} className="bg-secondary/30 border-b border-border">
								{hg.headers.map((header) => (
									<th
										key={header.id}
										className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-text-muted"
									>
										{flexRender(header.column.columnDef.header, header.getContext())}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr
								key={row.id}
								className="border-b border-border last:border-b-0"
							>
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="px-3 py-2.5">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default RoutesTab;

/**
 * Route status badge
 */
const RouteStatusBadge = ({ status }) => {
	const config = {
		Pending: { bg: 'bg-secondary', text: 'text-[#D4A800]', icon: Clock },
		Approved: { bg: 'bg-accent/20', text: 'text-[#2E86AB]', icon: CheckCircle },
		Rejected: { bg: 'bg-alert/10', text: 'text-alert', icon: XCircle },
	};
	const c = config[status] || config.Pending;
	const Icon = c.icon;
	return (
		<span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.bg} ${c.text}`}>
			<Icon className="w-3 h-3" />
			{status}
		</span>
	);
};


/**
 * Route Approve Modal — exact match with Route Approval page
 */
const RouteApproveModal = ({ route, companyName, onConfirm, onCancel }) => {
	const atLimit = route.currentRouteCount >= route.routeLimit;
	const projectedCount = route.currentRouteCount + 1;
	const projectedUsage = Math.round((projectedCount / route.routeLimit) * 100);

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
			<div className="bg-primary rounded-xl shadow-lg w-full max-w-lg mx-4 flex flex-col max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="px-6 pt-6 pb-4 border-b border-border">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-lg bg-accent/30 flex items-center justify-center">
							<ShieldCheck className="w-5 h-5 text-[#2E86AB]" />
						</div>
						<div>
							<h3 className="text-lg font-bold text-text">Approve Route Request</h3>
							<span className="text-xs font-mono text-text-muted">{route.id}</span>
						</div>
					</div>
				</div>

				<div className="px-6 py-4 flex flex-col gap-4">
					{/* Request Details */}
					<div className="flex flex-col gap-2.5 text-sm text-text">
						<div className="flex justify-between">
							<span className="text-text-muted">Company</span>
							<span className="font-semibold">{companyName}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-text-muted">Route</span>
							<span className="font-semibold">{route.origin} → {route.destination}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-text-muted">Distance</span>
							<span>{route.distance}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-text-muted">Est. Duration</span>
							<span>{route.duration}</span>
						</div>
					</div>

					{/* Entitlement Validation Panel */}
					<div className="bg-[#F5F5F4] rounded-lg p-4 flex flex-col gap-3">
						<h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
							<Key className="w-3 h-3" />
							Route Entitlement Validation
						</h4>
						<div className="grid grid-cols-3 gap-3">
							<div className="flex flex-col gap-0.5">
								<span className="text-[10px] text-text-muted uppercase tracking-wider">Current</span>
								<span className="text-lg font-bold text-text">{route.currentRouteCount}</span>
							</div>
							<div className="flex flex-col gap-0.5">
								<span className="text-[10px] text-text-muted uppercase tracking-wider">Max Allowed</span>
								<span className="text-lg font-bold text-text">{route.routeLimit}</span>
							</div>
							<div className="flex flex-col gap-0.5">
								<span className="text-[10px] text-text-muted uppercase tracking-wider">Post-Approval</span>
								<span className={`text-lg font-bold ${projectedCount > route.routeLimit ? 'text-alert' : 'text-[#2E86AB]'}`}>
									{projectedCount}
								</span>
							</div>
						</div>
						{/* Usage bar */}
						<div className="flex flex-col gap-1">
							<div className="flex justify-between text-[10px] text-text-muted">
								<span>Projected utilization</span>
								<span className={projectedUsage >= 100 ? 'text-alert font-bold' : ''}>
									{projectedUsage}%
								</span>
							</div>
							<div className="w-full h-2 bg-primary rounded-full overflow-hidden">
								<div
									className={`h-full rounded-full transition-all ${
										projectedUsage >= 100 ? 'bg-alert' : projectedUsage >= 80 ? 'bg-[#D4A800]' : 'bg-accent'
									}`}
									style={{ width: `${Math.min(projectedUsage, 100)}%` }}
								/>
							</div>
						</div>
					</div>

					{/* At-limit warning */}
					{atLimit && (
						<div className="flex items-start gap-2 bg-alert/10 text-alert rounded-lg p-3 text-xs font-medium">
							<span className="mt-0.5">⚠</span>
							<span>
								This operator has reached their route entitlement limit
								({route.routeLimit}). Approval is blocked until the limit is
								increased.
							</span>
						</div>
					)}

					{/* Audit Notice */}
					<AuditNotice action="approve" performedBy="Super Admin" />
				</div>

				{/* Actions */}
				<div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
					<button
						onClick={onCancel}
						className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-secondary transition-colors"
					>
						Cancel
					</button>
					<button
						disabled={atLimit}
						onClick={onConfirm}
						className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
							atLimit
								? 'bg-border text-text-muted cursor-not-allowed'
								: 'bg-accent text-text hover:bg-accent/80'
						}`}
					>
						{atLimit ? 'Approval Blocked' : 'Confirm Approval'}
					</button>
				</div>
			</div>
		</div>
	);
};


/**
 * Route Reject Modal — exact match with Route Approval page
 */
const RouteRejectModal = ({ route, companyName, onConfirm, onCancel }) => {
	const [remarks, setRemarks] = useState('');
	const canSubmit = remarks.trim().length > 0;

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
			<div className="bg-primary rounded-xl shadow-lg w-full max-w-md mx-4 flex flex-col max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="px-6 pt-6 pb-4 border-b border-border">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-lg bg-alert/10 flex items-center justify-center">
							<AlertTriangle className="w-5 h-5 text-alert" />
						</div>
						<div>
							<h3 className="text-lg font-bold text-text">Reject Route Request</h3>
							<span className="text-xs font-mono text-text-muted">{route.id}</span>
						</div>
					</div>
				</div>

				<div className="px-6 py-4 flex flex-col gap-4">
					{/* Request Details */}
					<div className="flex flex-col gap-2.5 text-sm text-text">
						<div className="flex justify-between">
							<span className="text-text-muted">Company</span>
							<span className="font-semibold">{companyName}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-text-muted">Route</span>
							<span className="font-semibold">{route.origin} → {route.destination}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-text-muted">Current Usage</span>
							<span className="text-text">
								{route.currentRouteCount}/{route.routeLimit}
							</span>
						</div>
					</div>

					{/* Remarks (mandatory) */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
							Rejection Remarks <span className="text-alert">*</span>
						</label>
						<textarea
							value={remarks}
							onChange={(e) => setRemarks(e.target.value)}
							rows={3}
							placeholder="Provide detailed reason for rejection..."
							className="w-full p-3 text-text bg-primary border border-border rounded-lg placeholder-text-muted focus:ring-2 focus:ring-alert/30 focus:border-alert outline-none transition-all resize-none"
						/>
						{!canSubmit && remarks !== '' && (
							<span className="text-xs text-alert">Remarks are required to reject.</span>
						)}
					</div>

					{/* Audit Notice */}
					<AuditNotice action="reject" performedBy="Super Admin" />
				</div>

				{/* Actions */}
				<div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
					<button
						onClick={onCancel}
						className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-secondary transition-colors"
					>
						Cancel
					</button>
					<button
						disabled={!canSubmit}
						onClick={() => onConfirm(remarks.trim())}
						className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
							canSubmit
								? 'bg-alert/10 text-alert hover:bg-alert/20'
								: 'bg-border text-text-muted cursor-not-allowed'
						}`}
					>
						Confirm Rejection
					</button>
				</div>
			</div>
		</div>
	);
};
