import { memo } from 'react';
import useNetworkStatus from '../../hooks/useNetworkStatus';

/**
 * Thin network status bar shown when offline.
 */
function NetworkStatusBar() {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="bg-[#960000] text-white text-xs font-semibold text-center py-1.5 px-4 sticky top-0 z-50">
      You are offline — updates will not sync
    </div>
  );
}

export default memo(NetworkStatusBar);
