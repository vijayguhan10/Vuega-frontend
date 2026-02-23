import { memo } from 'react';

/**
 * Full-screen loading spinner.
 */
function Loader({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-[#16A34A] rounded-full animate-spin" />
      <p className="text-sm text-gray-500 font-medium">{message}</p>
    </div>
  );
}

export default memo(Loader);
