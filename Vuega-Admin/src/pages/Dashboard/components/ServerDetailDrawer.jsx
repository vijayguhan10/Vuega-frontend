import React, { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import {
  X, Cpu, HardDrive, Activity, AlertTriangle, Clock,
  CheckCircle, XCircle, Globe, Zap, TrendingUp,
  BarChart3, Bell, Server, ArrowUpRight, RefreshCw,
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
//  TABS
// ═══════════════════════════════════════════════════════════════

const tabs = [
  { id: 'overview', label: 'Overview', icon: Server },
  { id: 'cpu', label: 'CPU', icon: Cpu },
  { id: 'memory', label: 'Memory', icon: HardDrive },
  { id: 'requests', label: 'Requests', icon: Activity },
  { id: 'endpoints', label: 'Endpoints', icon: Globe },
  { id: 'latency', label: 'Latency', icon: Zap },
  { id: 'alerts', label: 'Alerts', icon: Bell },
]

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════

const HealthBadge = ({ status }) => {
  const cfg = {
    healthy:  { bg: 'bg-accent/20', text: 'text-[#2E86AB]', dot: 'bg-[#2E86AB]', label: 'Healthy' },
    warning:  { bg: 'bg-secondary', text: 'text-[#D4A800]', dot: 'bg-[#D4A800]', label: 'Warning' },
    critical: { bg: 'bg-alert/10', text: 'text-alert', dot: 'bg-alert', label: 'Critical' },
  }
  const c = cfg[status] || cfg.healthy
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${c.bg} ${c.text}`}>
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

const MiniSparkline = ({ data, max, color = 'bg-accent', height = 'h-8' }) => {
  const m = max || Math.max(...data)
  return (
    <div className={`flex items-end gap-[3px] ${height}`}>
      {data.map((v, i) => (
        <div
          key={i}
          className={`flex-1 min-w-[4px] ${color} rounded-t-sm transition-all`}
          style={{ height: `${Math.max((v / m) * 100, 4)}%` }}
        />
      ))}
    </div>
  )
}

const MetricRow = ({ label, value, sub }) => (
  <div className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
    <span className="text-xs text-text-muted">{label}</span>
    <div className="flex flex-col items-end">
      <span className="font-semibold text-text">{value}</span>
      {sub && <span className="text-[10px] text-text-muted">{sub}</span>}
    </div>
  </div>
)

const UsageBar = ({ value, warning = 75, critical = 90 }) => {
  const color = value >= critical ? 'bg-alert' : value >= warning ? 'bg-[#D4A800]' : 'bg-accent'
  return (
    <div className="w-full h-2.5 bg-[#F5F5F4] rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  )
}

const formatNumber = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

const formatMB = (mb) => {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`
  return `${mb} MB`
}

// ═══════════════════════════════════════════════════════════════
//  TAB CONTENT COMPONENTS
// ═══════════════════════════════════════════════════════════════

const OverviewTab = ({ server }) => (
  <div className="flex flex-col gap-5">
    {/* Server Info */}
    <div className="bg-[#F5F5F4] rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Server Info</span>
        <HealthBadge status={server.status} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex flex-col"><span className="text-text-muted">Server Name</span><span className="font-semibold text-text">{server.name}</span></div>
        <div className="flex flex-col"><span className="text-text-muted">Server ID</span><span className="font-mono font-semibold text-text">{server.id}</span></div>
        <div className="flex flex-col"><span className="text-text-muted">Host</span><span className="font-mono font-semibold text-text">{server.host}</span></div>
        <div className="flex flex-col"><span className="text-text-muted">Region</span><span className="font-semibold text-text">{server.region}</span></div>
        <div className="flex flex-col"><span className="text-text-muted">Uptime</span><span className="font-semibold text-text">{server.uptime}</span></div>
        <div className="flex flex-col"><span className="text-text-muted">Last Restart</span><span className="font-semibold text-text">{server.lastRestart}</span></div>
      </div>
    </div>

    {/* Quick Metrics */}
    <div className="grid grid-cols-2 gap-3">
      <div className="border border-border rounded-lg p-3 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">CPU</span>
        </div>
        <span className={`text-xl font-bold ${server.cpu.current >= 90 ? 'text-alert' : server.cpu.current >= 75 ? 'text-[#D4A800]' : 'text-text'}`}>
          {server.cpu.current}%
        </span>
        <UsageBar value={server.cpu.current} />
      </div>
      <div className="border border-border rounded-lg p-3 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <HardDrive className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Memory</span>
        </div>
        <span className={`text-xl font-bold ${server.memory.percentage >= 90 ? 'text-alert' : server.memory.percentage >= 80 ? 'text-[#D4A800]' : 'text-text'}`}>
          {server.memory.percentage}%
        </span>
        <UsageBar value={server.memory.percentage} warning={80} critical={90} />
      </div>
      <div className="border border-border rounded-lg p-3 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Error Rate</span>
        </div>
        <span className={`text-xl font-bold ${server.requests.errorRate >= 5 ? 'text-alert' : server.requests.errorRate >= 2 ? 'text-[#D4A800]' : 'text-text'}`}>
          {server.requests.errorRate}%
        </span>
      </div>
      <div className="border border-border rounded-lg p-3 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Avg Latency</span>
        </div>
        <span className={`text-xl font-bold ${server.latency.avg >= 500 ? 'text-alert' : server.latency.avg >= 300 ? 'text-[#D4A800]' : 'text-text'}`}>
          {server.latency.avg}ms
        </span>
      </div>
    </div>

    {/* Active Routes */}
    <div className="flex items-center justify-between border border-border rounded-lg p-3">
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-text-muted" />
        <span className="text-xs font-semibold text-text">Active Routes</span>
      </div>
      <span className="text-lg font-bold text-text">{server.activeRoutes}</span>
    </div>
  </div>
)

const CpuTab = ({ server }) => (
  <div className="flex flex-col gap-5">
    {/* Current Usage */}
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
        <Cpu className="w-3 h-3" /> Current CPU Usage
      </h4>
      <div className="flex items-end gap-4">
        <span className={`text-4xl font-bold ${server.cpu.current >= 90 ? 'text-alert' : server.cpu.current >= 75 ? 'text-[#D4A800]' : 'text-text'}`}>
          {server.cpu.current}%
        </span>
        <span className="text-xs text-text-muted mb-1">
          {server.cpu.current >= 90 ? '⚠ CRITICAL' : server.cpu.current >= 75 ? '⚠ WARNING' : '✓ Normal'}
        </span>
      </div>
      <UsageBar value={server.cpu.current} />
    </div>

    {/* Load Average */}
    <div className="bg-[#F5F5F4] rounded-lg p-4 flex flex-col gap-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Load Average</h4>
      <div className="grid grid-cols-3 gap-4">
        {['1m', '5m', '15m'].map((period, i) => (
          <div key={period} className="flex flex-col gap-0.5">
            <span className="text-[10px] text-text-muted uppercase">{period}</span>
            <span className="text-lg font-bold text-text">{server.cpu.loadAvg[i]}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Trend */}
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
        <TrendingUp className="w-3 h-3" /> CPU Trend (Last 8 Readings)
      </h4>
      <MiniSparkline
        data={server.cpu.trend}
        max={100}
        color={server.cpu.current >= 90 ? 'bg-alert' : server.cpu.current >= 75 ? 'bg-[#D4A800]' : 'bg-accent'}
        height="h-20"
      />
      <div className="flex justify-between text-[10px] text-text-muted">
        <span>Min: {Math.min(...server.cpu.trend)}%</span>
        <span>Avg: {Math.round(server.cpu.trend.reduce((a, b) => a + b, 0) / server.cpu.trend.length)}%</span>
        <span>Max: {Math.max(...server.cpu.trend)}%</span>
      </div>
    </div>

    {/* Thresholds */}
    <div className="border border-border rounded-lg p-4 flex flex-col gap-2">
      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Alert Thresholds</h4>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#D4A800]" />
          <span className="text-xs text-text">Warning: &gt; 75%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-alert" />
          <span className="text-xs text-text">Critical: &gt; 90%</span>
        </div>
      </div>
    </div>
  </div>
)

const MemoryTab = ({ server }) => (
  <div className="flex flex-col gap-5">
    {/* Current Usage */}
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
        <HardDrive className="w-3 h-3" /> Memory Usage
      </h4>
      <div className="flex items-end gap-4">
        <span className={`text-4xl font-bold ${server.memory.percentage >= 90 ? 'text-alert' : server.memory.percentage >= 80 ? 'text-[#D4A800]' : 'text-text'}`}>
          {server.memory.percentage}%
        </span>
        <span className="text-xs text-text-muted mb-1">
          {server.memory.percentage >= 90 ? '⚠ CRITICAL' : server.memory.percentage >= 80 ? '⚠ WARNING' : '✓ Normal'}
        </span>
      </div>
      <UsageBar value={server.memory.percentage} warning={80} critical={90} />
    </div>

    {/* Breakdown */}
    <div className="bg-[#F5F5F4] rounded-lg p-4 flex flex-col gap-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Memory Breakdown</h4>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-text-muted uppercase">Total</span>
          <span className="text-lg font-bold text-text">{formatMB(server.memory.total)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-text-muted uppercase">Used</span>
          <span className="text-lg font-bold text-[#D4A800]">{formatMB(server.memory.used)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-text-muted uppercase">Free</span>
          <span className="text-lg font-bold text-[#2E86AB]">{formatMB(server.memory.free)}</span>
        </div>
      </div>
    </div>

    {/* Trend */}
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
        <TrendingUp className="w-3 h-3" /> Memory Trend (Last 8 Readings)
      </h4>
      <MiniSparkline
        data={server.memory.trend}
        max={100}
        color={server.memory.percentage >= 90 ? 'bg-alert' : server.memory.percentage >= 80 ? 'bg-[#D4A800]' : 'bg-accent'}
        height="h-20"
      />
      <div className="flex justify-between text-[10px] text-text-muted">
        <span>Min: {Math.min(...server.memory.trend)}%</span>
        <span>Avg: {Math.round(server.memory.trend.reduce((a, b) => a + b, 0) / server.memory.trend.length)}%</span>
        <span>Max: {Math.max(...server.memory.trend)}%</span>
      </div>
    </div>

    {/* Thresholds */}
    <div className="border border-border rounded-lg p-4 flex flex-col gap-2">
      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Alert Thresholds</h4>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#D4A800]" />
          <span className="text-xs text-text">Warning: &gt; 80%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-alert" />
          <span className="text-xs text-text">Critical: &gt; 90%</span>
        </div>
      </div>
    </div>
  </div>
)

const RequestsTab = ({ server }) => {
  const { requests } = server
  const successRate = ((requests.successful / requests.total) * 100).toFixed(2)
  const total4xx5xx = requests.breakdown4xx + requests.breakdown5xx

  return (
    <div className="flex flex-col gap-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-border rounded-lg p-3 flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Total Requests</span>
          <span className="text-xl font-bold text-text">{formatNumber(requests.total)}</span>
        </div>
        <div className="border border-border rounded-lg p-3 flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Success Rate</span>
          <span className={`text-xl font-bold ${parseFloat(successRate) < 95 ? 'text-alert' : 'text-[#2E86AB]'}`}>{successRate}%</span>
        </div>
        <div className="border border-border rounded-lg p-3 flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Successful</span>
          <span className="text-xl font-bold text-[#2E86AB]">{formatNumber(requests.successful)}</span>
        </div>
        <div className="border border-border rounded-lg p-3 flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Failed</span>
          <span className="text-xl font-bold text-alert">{formatNumber(requests.failed)}</span>
        </div>
      </div>

      {/* Error Rate */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3" /> Error Rate
        </h4>
        <div className="flex items-end gap-4">
          <span className={`text-3xl font-bold ${requests.errorRate >= 5 ? 'text-alert' : requests.errorRate >= 2 ? 'text-[#D4A800]' : 'text-text'}`}>
            {requests.errorRate}%
          </span>
        </div>
      </div>

      {/* 4xx vs 5xx Breakdown */}
      <div className="bg-[#F5F5F4] rounded-lg p-4 flex flex-col gap-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Error Breakdown</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-xs text-text-muted">4xx Client Errors</span>
              <span className="text-xs font-semibold text-[#D4A800]">{formatNumber(requests.breakdown4xx)}</span>
            </div>
            <div className="w-full h-2 bg-primary rounded-full overflow-hidden">
              <div className="h-full bg-[#D4A800] rounded-full" style={{ width: `${(requests.breakdown4xx / total4xx5xx) * 100}%` }} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-xs text-text-muted">5xx Server Errors</span>
              <span className="text-xs font-semibold text-alert">{formatNumber(requests.breakdown5xx)}</span>
            </div>
            <div className="w-full h-2 bg-primary rounded-full overflow-hidden">
              <div className="h-full bg-alert rounded-full" style={{ width: `${(requests.breakdown5xx / total4xx5xx) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const EndpointsTab = ({ server }) => {
  const sorted = useMemo(() => [...server.endpoints], [server.endpoints])
  const slowest = useMemo(() => [...sorted].sort((a, b) => b.p99 - a.p99).slice(0, 3), [sorted])
  const failing = useMemo(() => [...sorted].sort((a, b) => b.failures - a.failures).slice(0, 3), [sorted])

  const columns = useMemo(() => [
    {
      header: 'Endpoint',
      accessorKey: 'path',
      cell: (info) => <span className="text-xs font-mono text-text">{info.getValue()}</span>,
    },
    {
      header: 'Requests',
      accessorKey: 'count',
      cell: (info) => <span className="text-xs text-text">{formatNumber(info.getValue())}</span>,
    },
    {
      header: 'Success',
      accessorKey: 'successRate',
      cell: (info) => {
        const v = info.getValue()
        return <span className={`text-xs font-semibold ${v < 95 ? 'text-alert' : v < 99 ? 'text-[#D4A800]' : 'text-[#2E86AB]'}`}>{v}%</span>
      },
    },
    {
      header: 'Avg',
      accessorKey: 'avgLatency',
      cell: (info) => <span className="text-xs text-text">{info.getValue()}ms</span>,
    },
    {
      header: 'P95',
      accessorKey: 'p95',
      cell: (info) => <span className="text-xs text-text-muted">{info.getValue()}ms</span>,
    },
    {
      header: 'P99',
      accessorKey: 'p99',
      cell: (info) => {
        const v = info.getValue()
        return <span className={`text-xs font-semibold ${v >= 1000 ? 'text-alert' : v >= 500 ? 'text-[#D4A800]' : 'text-text'}`}>{v}ms</span>
      },
    },
  ], [])

  const table = useReactTable({ data: sorted, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="flex flex-col gap-5">
      {/* Full Table */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <Globe className="w-3 h-3" /> All Endpoints
        </h4>
        <div className="border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="bg-secondary/30 border-b border-border">
                  {hg.headers.map((header) => (
                    <th key={header.id} className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-b-0">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 gap-4">
        {/* Top Slowest */}
        <div className="bg-[#F5F5F4] rounded-lg p-3 flex flex-col gap-2">
          <h5 className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Top Slowest (P99)</h5>
          {slowest.map((e) => (
            <div key={e.path} className="flex justify-between text-xs">
              <span className="font-mono text-text truncate mr-2">{e.path.split('/').pop()}</span>
              <span className={`font-semibold ${e.p99 >= 1000 ? 'text-alert' : 'text-[#D4A800]'}`}>{e.p99}ms</span>
            </div>
          ))}
        </div>
        {/* Top Failing */}
        <div className="bg-[#F5F5F4] rounded-lg p-3 flex flex-col gap-2">
          <h5 className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Top Failing</h5>
          {failing.map((e) => (
            <div key={e.path} className="flex justify-between text-xs">
              <span className="font-mono text-text truncate mr-2">{e.path.split('/').pop()}</span>
              <span className="font-semibold text-alert">{formatNumber(e.failures)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const LatencyTab = ({ server }) => (
  <div className="flex flex-col gap-5">
    {/* Current Metrics */}
    <div className="grid grid-cols-3 gap-3">
      <div className="border border-border rounded-lg p-3 flex flex-col gap-1 items-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Average</span>
        <span className={`text-2xl font-bold ${server.latency.avg >= 500 ? 'text-alert' : server.latency.avg >= 300 ? 'text-[#D4A800]' : 'text-text'}`}>
          {server.latency.avg}
        </span>
        <span className="text-[10px] text-text-muted">ms</span>
      </div>
      <div className="border border-border rounded-lg p-3 flex flex-col gap-1 items-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">P95</span>
        <span className={`text-2xl font-bold ${server.latency.p95 >= 800 ? 'text-alert' : server.latency.p95 >= 500 ? 'text-[#D4A800]' : 'text-text'}`}>
          {server.latency.p95}
        </span>
        <span className="text-[10px] text-text-muted">ms</span>
      </div>
      <div className="border border-border rounded-lg p-3 flex flex-col gap-1 items-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">P99</span>
        <span className={`text-2xl font-bold ${server.latency.p99 >= 1000 ? 'text-alert' : server.latency.p99 >= 600 ? 'text-[#D4A800]' : 'text-text'}`}>
          {server.latency.p99}
        </span>
        <span className="text-[10px] text-text-muted">ms</span>
      </div>
    </div>

    {/* Trend */}
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
        <TrendingUp className="w-3 h-3" /> Latency Trend (Last 8 Readings)
      </h4>
      <MiniSparkline
        data={server.latency.trend}
        max={Math.max(...server.latency.trend) * 1.2}
        color={server.latency.avg >= 500 ? 'bg-alert' : server.latency.avg >= 300 ? 'bg-[#D4A800]' : 'bg-accent'}
        height="h-20"
      />
      <div className="flex justify-between text-[10px] text-text-muted">
        <span>Min: {Math.min(...server.latency.trend)}ms</span>
        <span>Avg: {Math.round(server.latency.trend.reduce((a, b) => a + b, 0) / server.latency.trend.length)}ms</span>
        <span>Max: {Math.max(...server.latency.trend)}ms</span>
      </div>
    </div>

    {/* Alert conditions */}
    <div className="border border-border rounded-lg p-4 flex flex-col gap-2">
      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Alert Conditions</h4>
      <div className="flex flex-col gap-1.5 text-xs text-text">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#D4A800]" />
          Latency exceeds threshold (&gt; 500ms avg)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-alert" />
          Sudden latency spike detected
        </div>
      </div>
    </div>
  </div>
)

const AlertsTab = ({ server }) => {
  const alerts = server.alertHistory
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#F5F5F4] flex items-center justify-center">
          <Bell className="w-6 h-6 text-text-muted/40" />
        </div>
        <span className="text-text-muted">No alerts recorded for this server.</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
        <Bell className="w-3 h-3" /> Alert History
      </h4>
      <div className="flex flex-col gap-2">
        {alerts.map((alert) => (
          <div key={alert.id} className={`border rounded-lg p-3 flex flex-col gap-2 ${alert.resolved ? 'border-border bg-primary' : 'border-alert/30 bg-alert/5'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertLevelBadge level={alert.level} />
                <span className="text-xs font-semibold text-text">{alert.type}</span>
              </div>
              {alert.resolved ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2E86AB]">
                  <CheckCircle className="w-3 h-3" /> Resolved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-alert animate-pulse">
                  <AlertTriangle className="w-3 h-3" /> Active
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-[10px] text-text-muted">
              <span><Clock className="w-2.5 h-2.5 inline mr-0.5" />{alert.timestamp}</span>
              <span>{alert.metric}: <strong className="text-text">{alert.value}</strong></span>
            </div>
            {alert.resolved && alert.resolvedAt && (
              <span className="text-[10px] text-text-muted">Resolved at: {alert.resolvedAt}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
//  MAIN DRAWER COMPONENT
// ═══════════════════════════════════════════════════════════════

const ServerDetailDrawer = ({ server, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview')

  if (!server) return null

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab server={server} />
      case 'cpu': return <CpuTab server={server} />
      case 'memory': return <MemoryTab server={server} />
      case 'requests': return <RequestsTab server={server} />
      case 'endpoints': return <EndpointsTab server={server} />
      case 'latency': return <LatencyTab server={server} />
      case 'alerts': return <AlertsTab server={server} />
      default: return <OverviewTab server={server} />
    }
  }

  const activeAlerts = server.alertHistory.filter((a) => !a.resolved).length

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 sm:left-64 z-40 bg-black/30 transition-opacity" onClick={onClose} />

      {/* Drawer — fills content area (sidebar stays visible) */}
      <div className="fixed inset-0 sm:left-64 z-50 bg-primary flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              server.status === 'critical' ? 'bg-alert/10' : server.status === 'warning' ? 'bg-secondary' : 'bg-accent/30'
            }`}>
              <Server className={`w-5 h-5 ${
                server.status === 'critical' ? 'text-alert' : server.status === 'warning' ? 'text-[#D4A800]' : 'text-[#2E86AB]'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text">{server.name}</h3>
              <span className="text-xs font-mono text-text-muted">{server.id}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary text-text-muted hover:text-text transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-border flex gap-1 overflow-x-auto shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? 'border-accent text-text bg-primary'
                    : 'border-transparent text-text-muted'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.id === 'alerts' && activeAlerts > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-alert text-white">
                    {activeAlerts}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {renderTab()}
        </div>
      </div>
    </>
  )
}

export default ServerDetailDrawer
