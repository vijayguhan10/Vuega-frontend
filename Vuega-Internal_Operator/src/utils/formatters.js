/**
 * Format a time string for display.
 * Accepts ISO string or HH:MM format.
 */
export function formatTime(timeStr) {
  if (!timeStr) return '--:--';
  try {
    const date = new Date(timeStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }
  } catch {
    // fallback
  }
  return timeStr;
}

/**
 * Capitalize first letter.
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate string to max length with ellipsis.
 */
export function truncate(str, maxLen = 30) {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '…';
}
