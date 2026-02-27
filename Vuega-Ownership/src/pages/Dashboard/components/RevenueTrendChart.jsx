import { useState, useMemo } from 'react';
import { FaChartLine, FaExchangeAlt } from 'react-icons/fa';
import Card from '../../../components/ui/Card';
import { revenueTrendData } from '../data/dashboardData';

/* ══════════════════════════════════════════════════════
   RevenueTrendChart — pure-CSS bar chart with range
   filter and period comparison toggle.
   No external charting library required.
   Replace with Recharts / Chart.js when ready.
   ══════════════════════════════════════════════════════ */

const RANGES = [
  { key: '7d',  label: '7 Days' },
  { key: '30d', label: '30 Days' },
];

const formatCurrency = (v) => {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
  return `₹${v}`;
};

const RevenueTrendChart = () => {
  const [range, setRange] = useState('30d');
  const [showComparison, setShowComparison] = useState(false);

  const sliceCount = range === '7d' ? 7 : 30;

  const data = useMemo(() => {
    const labels  = revenueTrendData.labels.slice(-sliceCount);
    const current = revenueTrendData.current.slice(-sliceCount);
    const previous = revenueTrendData.previous.slice(-sliceCount);
    const maxVal  = Math.max(...current, ...(showComparison ? previous : []));
    return { labels, current, previous, maxVal };
  }, [sliceCount, showComparison]);

  const totalCurrent  = data.current.reduce((a, b) => a + b, 0);
  const totalPrevious = data.previous.reduce((a, b) => a + b, 0);
  const growthPct     = totalPrevious > 0 ? (((totalCurrent - totalPrevious) / totalPrevious) * 100).toFixed(1) : 0;

  return (
    <Card padding="p-0">
      {/* Header */}
      <div className="px-6 py-5 border-b border-v-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FaChartLine size={16} className="text-emerald-500" />
          <div>
            <h3 className="text-v-text font-bold">Revenue Trend</h3>
            <p className="text-v-text-muted mt-0.5">
              {formatCurrency(totalCurrent)} total
              {showComparison && (
                <span className={`ml-2 font-semibold ${Number(growthPct) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {Number(growthPct) >= 0 ? '+' : ''}{growthPct}% vs prior period
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Range filter */}
          <div className="flex rounded-lg border border-v-border overflow-hidden">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  range === r.key
                    ? 'bg-v-accent text-v-text'
                    : 'text-v-text-muted hover:bg-v-secondary'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Compare toggle */}
          <button
            onClick={() => setShowComparison((p) => !p)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              showComparison
                ? 'bg-violet-50 border-violet-200 text-violet-700'
                : 'border-v-border text-v-text-muted hover:bg-v-secondary'
            }`}
          >
            <FaExchangeAlt size={12} /> Compare
          </button>
        </div>
      </div>

      {/* Chart Body */}
      <div className="px-6 py-6">
        {/* Y-axis labels + bars area */}
        <div className="flex gap-2">
          {/* Y-axis */}
          <div className="flex flex-col justify-between text-v-text-muted font-mono pr-1 h-48 shrink-0 w-12 text-right">
            <span>{formatCurrency(data.maxVal)}</span>
            <span>{formatCurrency(data.maxVal * 0.5)}</span>
            <span>₹0</span>
          </div>

          {/* Bars */}
          <div className="flex-1 flex items-end gap-[2px] h-48 border-b border-l border-v-border pl-1 relative">
            {data.current.map((val, i) => {
              const heightPct = data.maxVal > 0 ? (val / data.maxVal) * 100 : 0;
              const prevPct   = showComparison && data.maxVal > 0
                ? (data.previous[i] / data.maxVal) * 100
                : 0;

              return (
                <div
                  key={i}
                  className="flex-1 flex items-end justify-center gap-[1px] group relative"
                >
                  {/* Previous period bar */}
                  {showComparison && (
                    <div
                      className="w-full max-w-[8px] rounded-t bg-violet-200 transition-all duration-300"
                      style={{ height: `${prevPct}%` }}
                    />
                  )}
                  {/* Current period bar */}
                  <div
                    className="w-full max-w-[10px] rounded-t bg-emerald-400 hover:bg-emerald-500 transition-all duration-300 cursor-pointer"
                    style={{ height: `${heightPct}%` }}
                  />
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-10">
                    <div className="bg-v-text text-v-primary-bg px-2 py-1 rounded font-semibold whitespace-nowrap shadow-lg">
                      {formatCurrency(val)}
                    </div>
                    <div className="w-2 h-2 bg-v-text rotate-45 -mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex gap-[2px] ml-14 mt-1.5">
          {data.labels.map((label, i) => (
            <div key={i} className="flex-1 text-center text-v-text-muted truncate" style={{ fontSize: '10px' }}>
              {sliceCount <= 7 ? label : i % 5 === 0 ? label : ''}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-v-border">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-400" />
            <span className="text-v-text-muted font-medium">Current Period</span>
          </span>
          {showComparison && (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-violet-200" />
              <span className="text-v-text-muted font-medium">Previous Period</span>
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RevenueTrendChart;
