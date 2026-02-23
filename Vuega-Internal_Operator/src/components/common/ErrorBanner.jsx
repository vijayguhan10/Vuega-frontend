import { memo } from 'react';

/**
 * Reusable error banner.
 */
function ErrorBanner({ message, onRetry, onDismiss }) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-[#960000]/20 rounded-xl px-4 py-3 mx-4 md:mx-6 lg:mx-8 mt-3 flex items-start gap-3">
      <span className="text-[#960000] text-lg mt-0.5">⚠</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#960000] font-medium">{message}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs font-semibold text-[#960000] underline"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-[#960000] text-lg leading-none"
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(ErrorBanner);
