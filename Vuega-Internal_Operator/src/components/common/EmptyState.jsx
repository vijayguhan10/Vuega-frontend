import { memo } from 'react';

/**
 * Empty state placeholder.
 */
function EmptyState({ icon = '📋', title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-20 px-6 text-center">
      <span className="text-5xl md:text-6xl mb-4">{icon}</span>
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">{title}</h3>
      {description && (
        <p className="text-sm md:text-base text-gray-500 max-w-[260px] md:max-w-sm">{description}</p>
      )}
    </div>
  );
}

export default memo(EmptyState);
