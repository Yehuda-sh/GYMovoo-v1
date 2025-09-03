/**
 * Simple performance utilities
 */

/**
 * Simple debounce function for search inputs
 */
export function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  return ((...args: never[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}
