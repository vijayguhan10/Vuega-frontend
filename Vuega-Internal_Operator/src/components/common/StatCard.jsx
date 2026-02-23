import { memo } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

/**
 * Dashboard stat card matching the admin panel design.
 *
 * @param {string}  label       — Uppercase small label text
 * @param {string|number} value — Large display value
 * @param {string}  [trend]     — Trend text e.g. "+6" or "+18%"
 * @param {string}  [trendNote] — Trend context e.g. "this month"
 * @param {'up'|'down'} [trendDir] — Arrow direction
 * @param {React.ComponentType} [icon] — react-icon component
 * @param {string}  [iconBg]    — Icon background class
 * @param {string}  [iconColor] — Icon color class
 * @param {string}  [borderColor] — Optional colored left/top border (e.g. dashed danger)
 * @param {string}  [bg]        — Background class override
 * @param {string}  [valueColor] — Value text color override
 */
function StatCard({
  label,
  value,
  trend,
  trendNote,
  trendDir = 'up',
  icon: Icon,
  iconBg = 'bg-gray-100',
  iconColor = 'text-gray-600',
  borderColor,
  bg = 'bg-white',
  valueColor = 'text-gray-900',
}) {
  const isUp = trendDir === 'up';

  return (
    <div
      className={`${bg} rounded-xl p-4 md:p-5 border border-gray-100 relative ${
        borderColor ? `border-l-[3px] ${borderColor}` : ''
      }`}
    >
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between">
        <p className="text-[10px] md:text-[11px] font-semibold text-gray-400 uppercase tracking-wider leading-tight">
          {label}
        </p>
        {Icon && (
          <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center shrink-0`}>
            <Icon className={`text-sm ${iconColor}`} />
          </div>
        )}
      </div>

      {/* Value */}
      <p className={`text-2xl md:text-3xl font-bold mt-2 leading-none ${valueColor}`}>
        {value}
      </p>

      {/* Trend row */}
      {trend && (
        <div className="flex items-center gap-1.5 mt-3">
          {isUp ? (
            <FaArrowUp className="text-[10px] text-green-600" />
          ) : (
            <FaArrowDown className="text-[10px] text-[#960000]" />
          )}
          <span className={`text-[11px] font-semibold ${isUp ? 'text-green-600' : 'text-[#960000]'}`}>
            {trend}
          </span>
          {trendNote && (
            <span className="text-[11px] text-gray-400 ml-0.5">{trendNote}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(StatCard);
