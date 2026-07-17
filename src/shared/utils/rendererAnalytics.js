/**
 * shared/utils/rendererAnalytics.js
 *
 * Logging and diagnostics tracker for active renderer deployment.
 * Helps determine device/viewport distribution patterns.
 */

export function logRendererSelection(rendererId, capabilities) {
  console.info(`[RendererPolicy] Mounted: ${rendererId}`, {
    timestamp: new Date().toISOString(),
    ...capabilities
  });

  // Future: window.analytics?.track('renderer_selected', { rendererId, ...capabilities });
}

export default logRendererSelection;
