import React, { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Server, Cpu, HardDrive, Activity, AlertTriangle, Clock,
  CheckCircle, XCircle, Globe, Zap, Bell, ChevronRight,
  ArrowUpRight, RefreshCw, Building2, Bus, Route, FileCheck,
  ShieldCheck, FileText, TrendingUp, TrendingDown,
  Info, ShieldAlert, MessageSquare,
} from 'lucide-react'
import { FaEye, FaBuilding, FaCheckCircle, FaBan, FaBus, FaClock, FaClipboardList, FaArrowUp, FaArrowDown, FaRoute, FaHourglassHalf } from 'react-icons/fa'
import Table from '../../components/Common/Table'
import MetricCards from '../../components/Common/MetricCards'
import ServerDetailDrawer from './components/ServerDetailDrawer'


// ═══════════════════════════════════════════════════════════════
//  ADMIN OVERVIEW DATA
// ═══════════════════════════════════════════════════════════════

const dashboardSummary = {
  totalCompanies: 48,
  activeCompanies: 35,
  suspendedCompanies: 5,
  totalBuses: 312,
  totalRoutes: 186,
  pendingCompanyRequests: 8,
  pendingBusRequests: 14,
  pendingRouteRequests: 11,
}

const metricCards = [
  {
    label: 'Total Registered Companies',
    value: dashboardSummary.totalCompanies,
    icon: FaBuilding,
    borderColor: 'border-t-accent',
    iconBg: 'bg-accent/30',
    trend: { value: '+6', direction: 'up', label: 'this month' },
  },
  {
    label: 'Active Companies',
    value: dashboardSummary.activeCompanies,
    icon: FaCheckCircle,
    borderColor: 'border-t-accent',
    iconBg: 'bg-accent/30',
    trend: { value: '+3', direction: 'up', label: 'this month' },
  },
  {
    label: 'Suspended Companies',
    value: dashboardSummary.suspendedCompanies,
    icon: FaBan,
    borderColor: 'border-t-alert',
    iconBg: 'bg-alert/10',
    textColor: 'text-alert',
    trend: { value: '+1', direction: 'up', label: 'this week' },
    isAlert: true,
  },
  {
    label: 'Total Buses Across Platform',
    value: dashboardSummary.totalBuses,
    icon: FaBus,
    borderColor: 'border-t-accent',
    iconBg: 'bg-accent/30',
    trend: { value: '+24', direction: 'up', label: 'this month' },
  },
  {
    label: 'Total Routes',
    value: dashboardSummary.totalRoutes,
    icon: FaRoute,
    borderColor: 'border-t-accent',
    iconBg: 'bg-accent/30',
    trend: { value: '+9', direction: 'up', label: 'this month' },
  },
  {
    label: 'Pending Company Requests',
    value: dashboardSummary.pendingCompanyRequests,
    icon: FaClock,
    borderColor: 'border-t-secondary',
    iconBg: 'bg-secondary',
    trend: { value: '+2', direction: 'up', label: 'today' },
  },
  {
    label: 'Pending Bus Requests',
    value: dashboardSummary.pendingBusRequests,
    icon: FaClipboardList,
    borderColor: 'border-t-secondary',
    iconBg: 'bg-secondary',
    trend: { value: '-3', direction: 'down', label: 'this week' },
  },
  {
    label: 'Pending Route Requests',
    value: dashboardSummary.pendingRouteRequests,
    icon: FaHourglassHalf,
    borderColor: 'border-t-secondary',
    iconBg: 'bg-secondary',
    trend: { value: '+4', direction: 'up', label: 'this week' },
  },
]

const licenseSummary = {
  total: 128,
  active: 112,
  expiringSoon: 9,
  expired: 7,
}

// TODO: Replace with GET /api/control-plane/dashboard/recent-requests
const recentRequests = [
  {
    id: 1,
    companyName: 'SRS Travels Pvt Ltd',
    requestType: 'Company Registration',
    submittedDate: 'Feb 14, 2026',
    status: 'Pending',
  },
  {
    id: 2,
    companyName: 'KPN Travels',
    requestType: 'Bus Approval',
    submittedDate: 'Feb 13, 2026',
    status: 'Approved',
  },
  {
    id: 3,
    companyName: 'Parveen Travels',
    requestType: 'Route Approval',
    submittedDate: 'Feb 13, 2026',
    status: 'Pending',
  },
  {
    id: 4,
    companyName: 'Orange Tours',
    requestType: 'Company Registration',
    submittedDate: 'Feb 12, 2026',
    status: 'Rejected',
  },
  {
    id: 5,
    companyName: 'VRL Travels',
    requestType: 'Route Approval',
    submittedDate: 'Feb 12, 2026',
    status: 'Approved',
  },
  {
    id: 6,
    companyName: 'Neeta Travels',
    requestType: 'Bus Approval',
    submittedDate: 'Feb 11, 2026',
    status: 'Pending',
  },
  {
    id: 7,
    companyName: 'Sri Travels',
    requestType: 'Route Approval',
    submittedDate: 'Feb 11, 2026',
    status: 'Rejected',
  },
  {
    id: 8,
    companyName: 'Kaveri Travels',
    requestType: 'Bus Approval',
    submittedDate: 'Feb 10, 2026',
    status: 'Approved',
  },
]

const getStatusBadge = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-secondary text-text'
    case 'Approved':
      return 'bg-accent text-text'
    case 'Rejected':
      return 'bg-alert/10 text-alert'
    default:
      return 'bg-surface text-text'
  }
}

// ═══════════════════════════════════════════════════════════════
//  MOCK SERVER DATA
// ═══════════════════════════════════════════════════════════════
// TODO: Replace with GET /api/control-plane/servers/metrics (real-time)

const servers = [
  {
    id: 'SVR-001',
    name: 'API Gateway',
    host: 'gw-prod-01.vuega.io',
    region: 'ap-south-1a',
    status: 'healthy',
    uptime: '45d 12h 30m',
    lastRestart: 'Jan 10, 2026 03:15 AM',
    cpu: { current: 42, loadAvg: [1.2, 1.1, 0.9], trend: [35, 38, 40, 42, 39, 41, 43, 42] },
    memory: { total: 16384, used: 8192, free: 8192, percentage: 50, trend: [48, 49, 50, 51, 50, 49, 50, 50] },
    requests: { total: 2456700, successful: 2431450, failed: 25250, errorRate: 1.03, breakdown4xx: 16200, breakdown5xx: 9050 },
    latency: { avg: 145, p95: 320, p99: 580, trend: [140, 142, 145, 150, 148, 145, 143, 145] },
    activeRoutes: 24,
    endpoints: [
      { path: '/api/v1/routes/search', count: 425000, successRate: 99.2, avgLatency: 120, p95: 250, p99: 480, failures: 3400 },
      { path: '/api/v1/auth/login', count: 380000, successRate: 99.8, avgLatency: 85, p95: 180, p99: 350, failures: 760 },
      { path: '/api/v1/booking/create', count: 256000, successRate: 98.5, avgLatency: 210, p95: 450, p99: 820, failures: 3840 },
      { path: '/api/v1/operators/list', count: 189000, successRate: 99.6, avgLatency: 95, p95: 200, p99: 380, failures: 756 },
      { path: '/api/v1/routes/details', count: 312000, successRate: 99.4, avgLatency: 110, p95: 230, p99: 440, failures: 1872 },
    ],
    alertHistory: [
      { id: 'AH-001', type: 'High CPU', level: 'warning', timestamp: 'Feb 20, 2026 14:30', metric: 'CPU Usage', value: '76%', resolved: true, resolvedAt: 'Feb 20, 2026 14:45' },
    ],
  },
  {
    id: 'SVR-002',
    name: 'Auth Service',
    host: 'auth-prod-01.vuega.io',
    region: 'ap-south-1a',
    status: 'healthy',
    uptime: '30d 8h 15m',
    lastRestart: 'Jan 25, 2026 02:00 AM',
    cpu: { current: 35, loadAvg: [0.8, 0.7, 0.6], trend: [32, 34, 35, 33, 36, 34, 35, 35] },
    memory: { total: 8192, used: 3440, free: 4752, percentage: 42, trend: [40, 41, 42, 43, 42, 41, 42, 42] },
    requests: { total: 1890000, successful: 1884330, failed: 5670, errorRate: 0.30, breakdown4xx: 4200, breakdown5xx: 1470 },
    latency: { avg: 98, p95: 210, p99: 380, trend: [95, 96, 98, 100, 97, 98, 96, 98] },
    activeRoutes: 8,
    endpoints: [
      { path: '/auth/login', count: 680000, successRate: 99.8, avgLatency: 85, p95: 180, p99: 320, failures: 1360 },
      { path: '/auth/register', count: 120000, successRate: 99.5, avgLatency: 140, p95: 280, p99: 520, failures: 600 },
      { path: '/auth/refresh', count: 890000, successRate: 99.9, avgLatency: 45, p95: 95, p99: 180, failures: 890 },
      { path: '/auth/verify', count: 200000, successRate: 99.7, avgLatency: 65, p95: 140, p99: 260, failures: 600 },
    ],
    alertHistory: [],
  },
  {
    id: 'SVR-003',
    name: 'Booking Engine',
    host: 'booking-prod-01.vuega.io',
    region: 'ap-south-1b',
    status: 'warning',
    uptime: '15d 4h 20m',
    lastRestart: 'Feb 09, 2026 01:30 AM',
    cpu: { current: 78, loadAvg: [3.2, 2.8, 2.5], trend: [65, 70, 72, 75, 78, 76, 79, 78] },
    memory: { total: 32768, used: 23592, free: 9176, percentage: 72, trend: [68, 69, 70, 71, 72, 71, 72, 72] },
    requests: { total: 3120000, successful: 3020160, failed: 99840, errorRate: 3.20, breakdown4xx: 62400, breakdown5xx: 37440 },
    latency: { avg: 340, p95: 680, p99: 1200, trend: [280, 300, 320, 340, 360, 350, 340, 340] },
    activeRoutes: 18,
    endpoints: [
      { path: '/booking/create', count: 890000, successRate: 96.8, avgLatency: 420, p95: 850, p99: 1500, failures: 28480 },
      { path: '/booking/cancel', count: 156000, successRate: 98.5, avgLatency: 180, p95: 380, p99: 650, failures: 2340 },
      { path: '/booking/status', count: 1200000, successRate: 99.2, avgLatency: 65, p95: 140, p99: 280, failures: 9600 },
      { path: '/booking/list', count: 450000, successRate: 98.8, avgLatency: 290, p95: 580, p99: 980, failures: 5400 },
      { path: '/booking/payment', count: 424000, successRate: 97.2, avgLatency: 380, p95: 750, p99: 1300, failures: 11872 },
    ],
    alertHistory: [
      { id: 'AH-010', type: 'High CPU', level: 'warning', timestamp: 'Feb 24, 2026 09:30', metric: 'CPU Usage', value: '78%', resolved: false },
      { id: 'AH-011', type: 'Latency Spike', level: 'warning', timestamp: 'Feb 23, 2026 16:45', metric: 'P99 Latency', value: '1200ms', resolved: true, resolvedAt: 'Feb 23, 2026 17:30' },
    ],
  },
  {
    id: 'SVR-004',
    name: 'Route Manager',
    host: 'routes-prod-01.vuega.io',
    region: 'ap-south-1b',
    status: 'critical',
    uptime: '2d 6h 45m',
    lastRestart: 'Feb 22, 2026 05:00 AM',
    cpu: { current: 91, loadAvg: [4.8, 4.5, 4.2], trend: [82, 85, 88, 90, 92, 91, 93, 91] },
    memory: { total: 16384, used: 11141, free: 5243, percentage: 68, trend: [62, 64, 65, 67, 68, 67, 68, 68] },
    requests: { total: 1560000, successful: 1427400, failed: 132600, errorRate: 8.50, breakdown4xx: 46800, breakdown5xx: 85800 },
    latency: { avg: 520, p95: 980, p99: 1800, trend: [420, 450, 480, 500, 520, 540, 530, 520] },
    activeRoutes: 32,
    endpoints: [
      { path: '/routes/search', count: 620000, successRate: 91.5, avgLatency: 580, p95: 1100, p99: 2000, failures: 52700 },
      { path: '/routes/details', count: 380000, successRate: 94.2, avgLatency: 320, p95: 650, p99: 1200, failures: 22040 },
      { path: '/routes/schedule', count: 290000, successRate: 92.8, avgLatency: 450, p95: 900, p99: 1600, failures: 20880 },
      { path: '/routes/availability', count: 270000, successRate: 93.5, avgLatency: 380, p95: 780, p99: 1400, failures: 17550 },
    ],
    alertHistory: [
      { id: 'AH-020', type: 'High CPU', level: 'critical', timestamp: 'Feb 24, 2026 08:15', metric: 'CPU Usage', value: '91%', resolved: false },
      { id: 'AH-021', type: 'High Error Rate', level: 'critical', timestamp: 'Feb 24, 2026 07:00', metric: 'Error Rate', value: '8.5%', resolved: false },
      { id: 'AH-022', type: '5xx Spike', level: 'critical', timestamp: 'Feb 24, 2026 06:30', metric: '5xx Count', value: '85,800', resolved: false },
      { id: 'AH-023', type: 'Latency Spike', level: 'warning', timestamp: 'Feb 23, 2026 22:00', metric: 'P99 Latency', value: '1800ms', resolved: false },
    ],
  },
  {
    id: 'SVR-005',
    name: 'Payment Gateway',
    host: 'pay-prod-01.vuega.io',
    region: 'ap-south-1a',
    status: 'healthy',
    uptime: '60d 0h 10m',
    lastRestart: 'Dec 26, 2025 04:00 AM',
    cpu: { current: 45, loadAvg: [1.5, 1.3, 1.1], trend: [42, 43, 44, 45, 44, 46, 45, 45] },
    memory: { total: 16384, used: 9011, free: 7373, percentage: 55, trend: [53, 54, 55, 54, 55, 56, 55, 55] },
    requests: { total: 980000, successful: 972160, failed: 7840, errorRate: 0.80, breakdown4xx: 5880, breakdown5xx: 1960 },
    latency: { avg: 180, p95: 380, p99: 650, trend: [175, 178, 180, 182, 179, 180, 178, 180] },
    activeRoutes: 6,
    endpoints: [
      { path: '/payment/initiate', count: 420000, successRate: 99.3, avgLatency: 210, p95: 430, p99: 750, failures: 2940 },
      { path: '/payment/verify', count: 415000, successRate: 99.5, avgLatency: 150, p95: 310, p99: 550, failures: 2075 },
      { path: '/payment/refund', count: 85000, successRate: 99.0, avgLatency: 280, p95: 550, p99: 900, failures: 850 },
      { path: '/payment/status', count: 60000, successRate: 99.7, avgLatency: 75, p95: 160, p99: 300, failures: 180 },
    ],
    alertHistory: [
      { id: 'AH-030', type: 'High Memory', level: 'warning', timestamp: 'Feb 18, 2026 11:00', metric: 'Memory Usage', value: '82%', resolved: true, resolvedAt: 'Feb 18, 2026 12:15' },
    ],
  },
  {
    id: 'SVR-006',
    name: 'Notification Service',
    host: 'notify-prod-01.vuega.io',
    region: 'ap-south-1a',
    status: 'warning',
    uptime: '22d 16h 5m',
    lastRestart: 'Feb 01, 2026 08:00 AM',
    cpu: { current: 52, loadAvg: [2.0, 1.8, 1.5], trend: [48, 50, 51, 52, 50, 53, 52, 52] },
    memory: { total: 8192, used: 6963, free: 1229, percentage: 85, trend: [78, 80, 82, 83, 85, 84, 85, 85] },
    requests: { total: 1340000, successful: 1319900, failed: 20100, errorRate: 1.50, breakdown4xx: 12060, breakdown5xx: 8040 },
    latency: { avg: 210, p95: 420, p99: 750, trend: [195, 200, 205, 210, 208, 212, 210, 210] },
    activeRoutes: 4,
    endpoints: [
      { path: '/notify/email', count: 520000, successRate: 98.8, avgLatency: 230, p95: 460, p99: 800, failures: 6240 },
      { path: '/notify/sms', count: 380000, successRate: 98.5, avgLatency: 250, p95: 500, p99: 850, failures: 5700 },
      { path: '/notify/push', count: 290000, successRate: 99.0, avgLatency: 150, p95: 310, p99: 550, failures: 2900 },
      { path: '/notify/status', count: 150000, successRate: 99.5, avgLatency: 65, p95: 140, p99: 260, failures: 750 },
    ],
    alertHistory: [
      { id: 'AH-040', type: 'High Memory', level: 'warning', timestamp: 'Feb 24, 2026 10:00', metric: 'Memory Usage', value: '85%', resolved: false },
      { id: 'AH-041', type: 'High Memory', level: 'warning', timestamp: 'Feb 22, 2026 08:30', metric: 'Memory Usage', value: '83%', resolved: true, resolvedAt: 'Feb 22, 2026 10:00' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════

const formatNumber = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

const HealthBadge = ({ status, size = 'sm' }) => {
  const cfg = {
    healthy:  { bg: 'bg-accent/20', text: 'text-[#2E86AB]', dot: 'bg-[#2E86AB]', label: 'Healthy' },
    warning:  { bg: 'bg-secondary', text: 'text-[#D4A800]', dot: 'bg-[#D4A800]', label: 'Warning' },
    critical: { bg: 'bg-alert/10', text: 'text-alert', dot: 'bg-alert', label: 'Critical' },
  }
  const c = cfg[status] || cfg.healthy
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${size === 'lg' ? 'px-3 py-1.5 text-xs' : 'px-2 py-0.5 text-[10px]'} font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
      {c.label}
    </span>
  )
}

const AlertLevelBadge = ({ level }) => {
  const cfg = {
    info:     { bg: 'bg-accent/20', text: 'text-[#2E86AB]' },
    warning:  { bg: 'bg-secondary', text: 'text-[#D4A800]' },
    critical: { bg: 'bg-alert/10', text: 'text-alert' },
  }
  const c = cfg[level] || cfg.info
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.bg} ${c.text} capitalize`}>
      {level}
    </span>
  )
}

const UsageBar = ({ value, warning = 75, critical = 90, height = 'h-1.5' }) => {
  const color = value >= critical ? 'bg-alert' : value >= warning ? 'bg-[#D4A800]' : 'bg-accent'
  return (
    <div className={`w-full ${height} bg-[#F5F5F4] rounded-full overflow-hidden`}>
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  )
}

const MiniSparkline = ({ data, max, color = 'bg-accent' }) => {
  const m = max || Math.max(...data)
  return (
    <div className="flex items-end gap-[2px] h-6">
      {data.map((v, i) => (
        <div
          key={i}
          className={`flex-1 min-w-[3px] ${color} rounded-t-sm`}
          style={{ height: `${Math.max((v / m) * 100, 6)}%` }}
        />
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
//  DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════

const Dashboard = () => {
  const navigate = useNavigate()
  const [selectedServer, setSelectedServer] = useState(null)
  const [activeRequestTab, setActiveRequestTab] = useState('all')

  // Alert management state
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState(new Set())
  const [resolvedAlertIds, setResolvedAlertIds] = useState(new Set())
  const [ackModalAlert, setAckModalAlert] = useState(null)
  const [resolveModalAlert, setResolveModalAlert] = useState(null)
  const [ackNote, setAckNote] = useState('')
  const [resolveNote, setResolveNote] = useState('')
  const [resolveAction, setResolveAction] = useState('')

  // Filter logic for recent requests
  const filteredRequests =
    activeRequestTab === 'all'
      ? recentRequests
      : recentRequests.filter(
        (r) => r.status.toLowerCase() === activeRequestTab
      )

  // Compute server summary
  const serverSummary = useMemo(() => ({
    total: servers.length,
    healthy: servers.filter((s) => s.status === 'healthy').length,
    warning: servers.filter((s) => s.status === 'warning').length,
    critical: servers.filter((s) => s.status === 'critical').length,
  }), [])

  // Collect active alerts across all servers (filter out resolved)
  const activeAlerts = useMemo(() =>
    servers.flatMap((s) =>
      s.alertHistory
        .filter((a) => !a.resolved && !resolvedAlertIds.has(a.id))
        .map((a) => ({ ...a, serverId: s.id, serverName: s.name, serverStatus: s.status }))
    ).sort((a, b) => {
      const priority = { critical: 0, warning: 1, info: 2 }
      return (priority[a.level] ?? 2) - (priority[b.level] ?? 2)
    })
  , [resolvedAlertIds])

  // Acknowledge handler
  const handleAcknowledge = useCallback(() => {
    if (!ackModalAlert) return
    setAcknowledgedAlerts((prev) => new Set([...prev, ackModalAlert.id]))
    setAckModalAlert(null)
    setAckNote('')
  }, [ackModalAlert])

  // Resolve handler
  const handleResolve = useCallback(() => {
    if (!resolveModalAlert || !resolveAction) return
    setResolvedAlertIds((prev) => new Set([...prev, resolveModalAlert.id]))
    setResolveModalAlert(null)
    setResolveNote('')
    setResolveAction('')
  }, [resolveModalAlert, resolveAction])

  return (
    <div className="flex flex-col gap-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-text tracking-tight">
          Super Admin Dashboard
        </h1>
        <p className="text-text-muted">
          Platform overview, approvals, compliance, and infrastructure monitoring.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════
           SECTION A — Admin Overview Metric Cards
           ══════════════════════════════════════════════════════════ */}
      <MetricCards
        cards={metricCards.map((card) => ({
          ...card,
          valueColor: card.textColor || 'text-text',
          iconColor: card.isAlert ? 'text-alert' : 'text-text',
        }))}
        variant="trend"
        gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        gap="gap-5"
      />

      {/* ══════════════════════════════════════════════════════════
           SECTION B — License Overview
           ══════════════════════════════════════════════════════════ */}
      <div className="bg-primary rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Top accent stripe */}
        <div className="h-1 w-full flex">
          <div className="bg-[#2E86AB]" style={{ width: `${(licenseSummary.active / licenseSummary.total * 100)}%` }} />
          <div className="bg-[#D4A800]" style={{ width: `${(licenseSummary.expiringSoon / licenseSummary.total * 100)}%` }} />
          <div className="bg-alert" style={{ width: `${(licenseSummary.expired / licenseSummary.total * 100)}%` }} />
        </div>

        <div className="p-6">
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2E86AB] to-[#2E86AB]/60 flex items-center justify-center shadow-md shadow-[#2E86AB]/20">
                <ShieldCheck className="w-5.5 h-5.5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-text">License Compliance</h3>
                <p className="text-[11px] text-text-muted mt-0.5">Platform-wide operator license health</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-muted bg-[#F5F5F4] px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E86AB] animate-pulse" />
                Live
              </span>
            </div>
          </div>

          {/* Big compliance score + ring */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-6">
            {/* Donut-like visual */}
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#F5F5F4" strokeWidth="12" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#2E86AB" strokeWidth="12"
                  strokeDasharray={`${(licenseSummary.active / licenseSummary.total) * 314} 314`}
                  strokeLinecap="round" className="transition-all duration-700" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#D4A800" strokeWidth="12"
                  strokeDasharray={`${(licenseSummary.expiringSoon / licenseSummary.total) * 314} 314`}
                  strokeDashoffset={`-${(licenseSummary.active / licenseSummary.total) * 314}`}
                  className="transition-all duration-700" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#DC2626" strokeWidth="12"
                  strokeDasharray={`${(licenseSummary.expired / licenseSummary.total) * 314} 314`}
                  strokeDashoffset={`-${((licenseSummary.active + licenseSummary.expiringSoon) / licenseSummary.total) * 314}`}
                  className="transition-all duration-700" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-text">{(licenseSummary.active / licenseSummary.total * 100).toFixed(0)}%</span>
                <span className="text-[9px] text-text-muted font-medium uppercase tracking-wider">Compliant</span>
              </div>
            </div>

            {/* Stats cards */}
            <MetricCards
              cards={[
                { label: 'Total', value: licenseSummary.total, subText: 'All licenses', bg: 'bg-[#F8F8F7]', dotColor: 'bg-text/15', borderClass: 'border-transparent hover:border-border' },
                { label: 'Active', value: licenseSummary.active, subText: `${(licenseSummary.active / licenseSummary.total * 100).toFixed(1)}% of total`, bg: 'bg-[#2E86AB]/5', dotColor: 'bg-[#2E86AB]', dotPulse: true, labelColor: 'text-[#2E86AB]', valueColor: 'text-[#2E86AB]', subTextColor: 'text-[#2E86AB]/70', borderClass: 'border-[#2E86AB]/10 hover:border-[#2E86AB]/30' },
                { label: 'Expiring', value: licenseSummary.expiringSoon, subText: 'Within 30 days', bg: 'bg-[#D4A800]/5', dotColor: 'bg-[#D4A800]', dotPulse: true, labelColor: 'text-[#D4A800]', valueColor: 'text-[#D4A800]', subTextColor: 'text-[#D4A800]/70', borderClass: 'border-[#D4A800]/10 hover:border-[#D4A800]/30' },
                { label: 'Expired', value: licenseSummary.expired, subText: 'Service restricted', bg: 'bg-alert/5', dotColor: 'bg-alert', labelColor: 'text-alert', valueColor: 'text-alert', subTextColor: 'text-alert/70', borderClass: 'border-alert/10 hover:border-alert/30' },
              ]}
              variant="status"
              gridCols="grid-cols-2 md:grid-cols-4"
              gap="gap-3"
              className="flex-1 w-full"
            />
          </div>

          {/* Bottom legend bar */}
          <div className="flex items-center gap-4 pt-4 border-t border-border/60">
            <span className="text-[10px] text-text-muted font-medium">Distribution</span>
            <div className="flex-1 h-3 rounded-full overflow-hidden flex bg-[#F5F5F4]">
              <div className="h-full bg-[#2E86AB] rounded-l-full transition-all duration-500" style={{ width: `${(licenseSummary.active / licenseSummary.total * 100)}%` }} />
              <div className="h-full bg-[#D4A800] transition-all duration-500" style={{ width: `${(licenseSummary.expiringSoon / licenseSummary.total * 100)}%` }} />
              <div className="h-full bg-alert rounded-r-full transition-all duration-500" style={{ width: `${(licenseSummary.expired / licenseSummary.total * 100)}%` }} />
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1.5 text-[10px] text-text-muted font-medium"><span className="w-2.5 h-2 rounded-sm bg-[#2E86AB]" />Active</span>
              <span className="flex items-center gap-1.5 text-[10px] text-text-muted font-medium"><span className="w-2.5 h-2 rounded-sm bg-[#D4A800]" />Expiring</span>
              <span className="flex items-center gap-1.5 text-[10px] text-text-muted font-medium"><span className="w-2.5 h-2 rounded-sm bg-alert" />Expired</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
           SECTION C — Infrastructure Monitoring Header
           ══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-1 pt-2 border-t border-border">
        <h2 className="font-bold text-text tracking-tight flex items-center gap-2">
          <Server className="w-5 h-5 text-[#2E86AB]" />
          Infrastructure Monitoring
        </h2>
        <p className="text-xs text-text-muted">
          Real-time server health, performance metrics, failure detection, and alerting.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════
           SECTION 1 — Server Summary Cards
           ══════════════════════════════════════════════════════════ */}
      <MetricCards
        cards={[
          { label: 'Total Servers', value: serverSummary.total, icon: Server, iconBg: 'bg-accent/30', iconColor: 'text-[#2E86AB]', subText: 'Active instances', shadow: true },
          { label: 'Healthy', value: serverSummary.healthy, icon: CheckCircle, iconBg: 'bg-accent/20', iconColor: 'text-[#2E86AB]', valueColor: 'text-[#2E86AB]', subText: 'Operating normally', shadow: true },
          { label: 'Warning', value: serverSummary.warning, icon: AlertTriangle, iconBg: 'bg-secondary', iconColor: 'text-[#D4A800]', valueColor: 'text-[#D4A800]', subText: 'Needs attention', shadow: true },
          { label: 'Critical', value: serverSummary.critical, icon: XCircle, iconBg: 'bg-alert/10', iconColor: 'text-alert', valueColor: 'text-alert', subText: 'Immediate action required', subTextColor: 'text-alert', shadow: true },
        ]}
        variant="default"
        gridCols="grid-cols-2 md:grid-cols-4"
      />

      {/* ══════════════════════════════════════════════════════════
           SECTION 2 — Server Cards Grid
           ══════════════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-text">Server Overview</h2>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-muted hover:text-text hover:bg-secondary transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.map((server) => {
            const isHealthy = server.status === 'healthy'
            const isWarning = server.status === 'warning'
            const isCritical = server.status === 'critical'

            const statusGradient = isCritical
              ? 'from-alert/8 to-transparent'
              : isWarning
                ? 'from-[#D4A800]/8 to-transparent'
                : 'from-accent/10 to-transparent'

            const accentColor = isCritical ? '#960000' : isWarning ? '#D4A800' : '#2E86AB'
            const ringColor = isCritical ? 'ring-alert/20' : isWarning ? 'ring-[#D4A800]/20' : 'ring-accent/30'

            return (
              <button
                key={server.id}
                onClick={() => setSelectedServer(server)}
                className={`relative bg-primary rounded-2xl border border-border shadow-sm p-5 flex flex-col gap-4 text-left hover:shadow-lg hover:ring-2 ${ringColor} transition-all duration-200 cursor-pointer group overflow-hidden`}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${statusGradient} pointer-events-none rounded-2xl`} />

                {/* Status indicator line */}
                <div
                  className="absolute top-0 left-5 right-5 h-[2px] rounded-full"
                  style={{ backgroundColor: accentColor }}
                />

                {/* Header */}
                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                      isCritical ? 'bg-alert/10 ring-1 ring-alert/20' : isWarning ? 'bg-secondary ring-1 ring-[#D4A800]/20' : 'bg-accent/20 ring-1 ring-accent/30'
                    }`}>
                      <Server className={`w-5 h-5 ${
                        isCritical ? 'text-alert' : isWarning ? 'text-[#D4A800]' : 'text-[#2E86AB]'
                      }`} />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-sm font-bold text-text group-hover:text-[#2E86AB] transition-colors">{server.name}</h3>
                      <span className="text-[10px] font-mono text-text-muted/70">{server.id}</span>
                    </div>
                  </div>
                  <HealthBadge status={server.status} />
                </div>

                {/* Metrics — CPU & Memory */}
                <div className="relative grid grid-cols-2 gap-4">
                  {/* CPU */}
                  <div className="flex flex-col gap-2 bg-[#F8F8F7] rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-text-muted font-medium flex items-center gap-1">
                        <Cpu className="w-3 h-3" /> CPU
                      </span>
                      <span className={`text-xs font-bold ${server.cpu.current >= 90 ? 'text-alert' : server.cpu.current >= 75 ? 'text-[#D4A800]' : 'text-[#2E86AB]'}`}>
                        {server.cpu.current}%
                      </span>
                    </div>
                    <UsageBar value={server.cpu.current} height="h-2" />
                  </div>

                  {/* Memory */}
                  <div className="flex flex-col gap-2 bg-[#F8F8F7] rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-text-muted font-medium flex items-center gap-1">
                        <HardDrive className="w-3 h-3" /> MEM
                      </span>
                      <span className={`text-xs font-bold ${server.memory.percentage >= 90 ? 'text-alert' : server.memory.percentage >= 80 ? 'text-[#D4A800]' : 'text-[#2E86AB]'}`}>
                        {server.memory.percentage}%
                      </span>
                    </div>
                    <UsageBar value={server.memory.percentage} warning={80} critical={90} height="h-2" />
                  </div>
                </div>

                {/* Bottom stats row */}
                <div className="relative flex items-center justify-between pt-3 border-t border-border/60">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-text-muted/60" />
                      <span className="text-[10px] text-text-muted">Err</span>
                      <span className={`text-[11px] font-bold ${server.requests.errorRate >= 5 ? 'text-alert' : server.requests.errorRate >= 2 ? 'text-[#D4A800]' : 'text-text'}`}>
                        {server.requests.errorRate}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-text-muted/60" />
                      <span className="text-[10px] text-text-muted">Lat</span>
                      <span className={`text-[11px] font-bold ${server.latency.avg >= 500 ? 'text-alert' : server.latency.avg >= 300 ? 'text-[#D4A800]' : 'text-text'}`}>
                        {server.latency.avg}ms
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-text-muted/60" />
                      <span className="text-[10px] text-text-muted">Routes</span>
                      <span className="text-[11px] font-bold text-text">{server.activeRoutes}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-text-muted/40 group-hover:text-[#2E86AB] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
           SECTION 3 — Active Alerts Panel
           ══════════════════════════════════════════════════════════ */}
      <div className="bg-primary rounded-xl border border-border shadow-sm">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-text" />
              <h2 className="font-bold text-text">Active Alerts</h2>
            </div>
            {activeAlerts.length > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-alert text-white">
                {activeAlerts.length}
              </span>
            )}
          </div>
          <span className="text-[10px] text-text-muted">Auto-clears when resolved</span>
        </div>

        {activeAlerts.length === 0 ? (
          <div className="px-6 py-12 flex flex-col items-center gap-2">
            <CheckCircle className="w-8 h-8 text-[#2E86AB]/40" />
            <span className="text-text-muted">All systems operating normally. No active alerts.</span>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {activeAlerts.map((alert) => {
              const isAcked = acknowledgedAlerts.has(alert.id)
              return (
              <div key={alert.id} className={`px-6 py-4 flex items-center gap-4 ${isAcked ? 'bg-[#FAFAFA]/60' : ''}`}>
                {/* Level */}
                <div className="shrink-0">
                  <AlertLevelBadge level={alert.level} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text">{alert.type}</span>
                    <span className="text-[10px] text-text-muted">•</span>
                    <span className="text-xs text-text-muted font-mono">{alert.serverName}</span>
                    {isAcked && (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold bg-accent/20 text-[#2E86AB]">
                        <CheckCircle className="w-2.5 h-2.5" /> Acknowledged
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-text-muted flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {alert.timestamp}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {alert.metric}: <strong className="text-text">{alert.value}</strong>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {!isAcked ? (
                    <button
                      onClick={() => setAckModalAlert(alert)}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-accent text-text hover:bg-accent/80 transition-colors cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <button
                      onClick={() => setResolveModalAlert(alert)}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-[#2E86AB] text-white hover:bg-[#2E86AB]/90 transition-colors cursor-pointer"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
              )
            })}
          </div>
        )}

        {/* Footer */}
        {activeAlerts.length > 0 && (
          <div className="px-6 py-3 border-t border-border bg-primary flex justify-between items-center">
            <span className="text-xs text-text-muted">
              {activeAlerts.filter((a) => a.level === 'critical').length} critical, {activeAlerts.filter((a) => a.level === 'warning').length} warning
            </span>
            <span className="text-[10px] text-text-muted flex items-center gap-1">
              <Bell className="w-3 h-3" /> All alerts are auto-tracked and audit-logged
            </span>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
           SECTION E — Recent Requests
           ══════════════════════════════════════════════════════════ */}
      {/* TODO: Replace mock data with GET /api/control-plane/dashboard/recent-requests */}
      <div className="bg-primary rounded-xl border border-border shadow-sm">
        {/* Section Header */}
        <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-bold text-text">
              Recent Requests
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Latest company registrations and bus approval submissions
            </p>
          </div>
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-primary rounded-lg p-1 border border-border">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveRequestTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                  activeRequestTab === tab
                    ? 'bg-primary text-text shadow-sm'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Table
          data={filteredRequests}
          columns={[
            {
              header: 'Company Name',
              accessorKey: 'companyName',
              cell: (info) => (
                <span className="font-semibold text-text">
                  {info.getValue()}
                </span>
              ),
            },
            {
              header: 'Request Type',
              accessorKey: 'requestType',
              cell: (info) => (
                <span className="text-text-muted">
                  {info.getValue()}
                </span>
              ),
            },
            {
              header: 'Submitted Date',
              accessorKey: 'submittedDate',
              cell: (info) => (
                <span className="text-text-muted">
                  {info.getValue()}
                </span>
              ),
            },
            {
              header: 'Status',
              accessorKey: 'status',
              cell: (info) => (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadge(
                    info.getValue()
                  )}`}
                >
                  {info.getValue()}
                </span>
              ),
            },
            {
              header: () => <span className="block text-center">Action</span>,
              id: 'actions',
              cell: (info) => {
                const row = info.row.original
                let path
                if (row.requestType === 'Bus Approval') {
                  path = `/bus-approvals?company=${encodeURIComponent(row.companyName)}`
                } else if (row.requestType === 'Route Approval') {
                  path = `/route-approvals?company=${encodeURIComponent(row.companyName)}`
                } else {
                  path = `/companies?company=${encodeURIComponent(row.companyName)}`
                }
                return (
                  <div className="flex justify-center">
                    <button
                      onClick={() => navigate(path)}
                      title="View details"
                      className="inline-flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-text-muted hover:text-text hover:bg-border/40 transition-colors"
                    >
                      <FaEye size={15} />
                      <span className="text-[10px] font-medium leading-none">View</span>
                    </button>
                  </div>
                )
              },
            },
          ]}
        />

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-primary flex justify-between items-center">
          <span className="text-xs text-text-muted">
            Showing {filteredRequests.length} of {recentRequests.length} requests
          </span>
          <button className="text-xs font-semibold text-text hover:underline">
            View All Requests
          </button>
        </div>
      </div>

      {/* ── Server Detail Drawer ── */}
      {selectedServer && (
        <ServerDetailDrawer
          server={selectedServer}
          onClose={() => setSelectedServer(null)}
        />
      )}

      {/* ══════════════════════════════════════════════════════════
           ACKNOWLEDGE ALERT MODAL
           ══════════════════════════════════════════════════════════ */}
      {ackModalAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setAckModalAlert(null); setAckNote('') }} />
          <div className="relative bg-primary rounded-2xl border border-border shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  ackModalAlert.level === 'critical' ? 'bg-alert/10' : 'bg-secondary'
                }`}>
                  <ShieldAlert className={`w-6 h-6 ${
                    ackModalAlert.level === 'critical' ? 'text-alert' : 'text-[#D4A800]'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-text">Acknowledge Alert</h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Confirm you are aware of this alert and it is being investigated.
                  </p>
                </div>
                <button
                  onClick={() => { setAckModalAlert(null); setAckNote('') }}
                  className="p-1 rounded-lg hover:bg-secondary transition-colors text-text-muted hover:text-text"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Alert details card */}
            <div className="mx-6 mb-4 rounded-xl border border-border bg-[#FAFAFA] p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertLevelBadge level={ackModalAlert.level} />
                <span className="font-bold text-text">{ackModalAlert.type}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="text-text-muted uppercase text-[10px] font-semibold tracking-wider">Server</span>
                  <span className="font-mono font-semibold text-text">{ackModalAlert.serverName}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-text-muted uppercase text-[10px] font-semibold tracking-wider">Server ID</span>
                  <span className="font-mono font-semibold text-text">{ackModalAlert.serverId}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-text-muted uppercase text-[10px] font-semibold tracking-wider">Metric</span>
                  <span className="font-semibold text-text">{ackModalAlert.metric}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-text-muted uppercase text-[10px] font-semibold tracking-wider">Current Value</span>
                  <span className={`font-bold ${ackModalAlert.level === 'critical' ? 'text-alert' : 'text-[#D4A800]'}`}>{ackModalAlert.value}</span>
                </div>
                <div className="flex flex-col gap-0.5 col-span-2">
                  <span className="text-text-muted uppercase text-[10px] font-semibold tracking-wider">Triggered At</span>
                  <span className="font-semibold text-text flex items-center gap-1"><Clock className="w-3 h-3 text-text-muted" />{ackModalAlert.timestamp}</span>
                </div>
              </div>
            </div>

            {/* Note input */}
            <div className="mx-6 mb-4">
              <label className="text-xs font-semibold text-text mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-text-muted" />
                Acknowledgment Note <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <textarea
                value={ackNote}
                onChange={(e) => setAckNote(e.target.value)}
                placeholder="e.g. Investigating CPU spike, scaling horizontally..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-primary text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-[#2E86AB]/20 focus:border-[#2E86AB] resize-none transition-all"
              />
            </div>

            {/* Info banner */}
            <div className="mx-6 mb-4 flex items-start gap-2 rounded-lg bg-accent/10 px-3 py-2.5">
              <Info className="w-3.5 h-3.5 text-[#2E86AB] mt-0.5 shrink-0" />
              <span className="text-[11px] text-[#2E86AB]/80 leading-relaxed">
                Acknowledging an alert marks it as being investigated. The alert will remain active until resolved. This action is audit-logged.
              </span>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-border bg-[#FAFAFA] flex items-center justify-between">
              <span className="text-[10px] text-text-muted flex items-center gap-1">
                <Bell className="w-3 h-3" /> Audit-tracked action
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setAckModalAlert(null); setAckNote('') }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-text-muted hover:text-text hover:bg-border/40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcknowledge}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-[#2E86AB] text-white hover:bg-[#2E86AB]/90 shadow-sm shadow-[#2E86AB]/20 transition-colors"
                >
                  Acknowledge Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
           RESOLVE ALERT MODAL
           ══════════════════════════════════════════════════════════ */}
      {resolveModalAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setResolveModalAlert(null); setResolveNote(''); setResolveAction('') }} />
          <div className="relative bg-primary rounded-2xl border border-border shadow-2xl w-full max-w-sm mx-4 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal header */}
            <div className="px-5 pt-5 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#2E86AB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-text">Resolve Alert</h3>
                  <p className="text-[11px] text-text-muted">Mark this alert as resolved</p>
                </div>
                <button
                  onClick={() => { setResolveModalAlert(null); setResolveNote(''); setResolveAction('') }}
                  className="p-1 rounded-lg hover:bg-secondary transition-colors text-text-muted hover:text-text"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-5">
              {/* Alert summary - compact inline */}
              <div className="mb-3 rounded-lg border border-border bg-[#FAFAFA] px-3 py-2.5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertLevelBadge level={resolveModalAlert.level} />
                  <span className="text-xs font-bold text-text truncate">{resolveModalAlert.type}</span>
                  <span className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-semibold bg-accent/20 text-[#2E86AB] ml-auto shrink-0">
                    <CheckCircle className="w-2 h-2" /> Acked
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-text-muted">
                  <span className="font-mono font-semibold text-text">{resolveModalAlert.serverName}</span>
                  <span>·</span>
                  <span>{resolveModalAlert.metric}: <span className={`font-bold ${resolveModalAlert.level === 'critical' ? 'text-alert' : 'text-[#D4A800]'}`}>{resolveModalAlert.value}</span></span>
                </div>
              </div>

              {/* Resolution action - compact 2-col grid */}
              <div className="mb-3">
                <label className="text-[11px] font-semibold text-text mb-1.5 block">
                  Resolution Action <span className="text-alert">*</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { value: 'auto_recovered', label: 'Auto-Recovered' },
                    { value: 'manual_fix', label: 'Manual Fix' },
                    { value: 'scaled', label: 'Scaled Up' },
                    { value: 'false_positive', label: 'False Positive' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setResolveAction(opt.value)}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all ${
                        resolveAction === opt.value
                          ? 'border-[#2E86AB] bg-[#2E86AB]/5 ring-1 ring-[#2E86AB]/20'
                          : 'border-border hover:border-text-muted/30 hover:bg-secondary'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        resolveAction === opt.value ? 'border-[#2E86AB]' : 'border-border'
                      }`}>
                        {resolveAction === opt.value && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#2E86AB]" />
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-text">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution note - compact */}
              <div className="mb-3">
                <label className="text-[11px] font-semibold text-text mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-text-muted" />
                  Notes <span className="text-text-muted font-normal">(optional)</span>
                </label>
                <textarea
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                  placeholder="e.g. Restarted service, patched in v2.4.1..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-primary text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-[#2E86AB]/20 focus:border-[#2E86AB] resize-none transition-all"
                />
              </div>

              {/* Info banner - compact */}
              <div className="mb-3 flex items-start gap-1.5 rounded-lg bg-accent/10 px-2.5 py-2">
                <Info className="w-3 h-3 text-[#2E86AB] mt-0.5 shrink-0" />
                <span className="text-[10px] text-[#2E86AB]/80 leading-relaxed">
                  This removes the alert from the active panel and logs the resolution. Cannot be undone.
                </span>
              </div>
            </div>

            {/* Actions - sticky footer */}
            <div className="px-5 py-3 border-t border-border bg-[#FAFAFA] flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => { setResolveModalAlert(null); setResolveNote(''); setResolveAction('') }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-text-muted hover:text-text hover:bg-border/40 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                disabled={!resolveAction}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors ${
                  resolveAction
                    ? 'bg-[#2E86AB] text-white hover:bg-[#2E86AB]/90 shadow-[#2E86AB]/20'
                    : 'bg-border text-text-muted cursor-not-allowed'
                }`}
              >
                Resolve Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
