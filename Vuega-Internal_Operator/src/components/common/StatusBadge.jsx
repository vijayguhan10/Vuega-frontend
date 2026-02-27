import { memo } from 'react';

/**
 * Reusable status badge with color coding.
 */
function StatusBadge({ status }) {
  const config = {
    pending: {
      bg: 'bg-[#FFFADF]',
      text: 'text-yellow-800',
      label: 'Pending',
    },
    boarded: {
      bg: 'bg-[#16A34A]/10',
      text: 'text-[#16A34A]',
      label: 'Boarded',
    },
    'no-show': {
      bg: 'bg-[#960000]/10',
      text: 'text-[#960000]',
      label: 'No-show',
    },
  };

  const { bg, text, label } = config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${bg} ${text}`}
    >
      {label}
    </span>
  );
}

export default memo(StatusBadge);
