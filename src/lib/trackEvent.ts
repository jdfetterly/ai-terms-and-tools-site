// Centralized GA4 event tracking utility
// Reference event names and parameters in docs/analytics-instrumentation.md

/**
 * Tracks a GA4 event using gtag. Supports debug mode via window.GA_DEBUG.
 * @param {string} eventName - The GA4 event name (see docs/analytics-instrumentation.md)
 * @param {object} params - The event parameters (see docs/analytics-instrumentation.md)
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  // Debug mode: set window.GA_DEBUG = true in the browser console to enable
  const debug = typeof window !== 'undefined' && (window as any).GA_DEBUG;
  if (debug) {
    // eslint-disable-next-line no-console
    console.log('[GA4 DEBUG]', eventName, params);
  }
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', eventName, params);
  }
} 