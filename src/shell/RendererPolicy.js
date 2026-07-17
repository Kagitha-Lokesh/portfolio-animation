/**
 * shell/RendererPolicy.js
 *
 * Runs once at startup. Resolves which renderer should be loaded.
 * Prevents hot-swapping during runtime to avoid state loss.
 */

function resolveRenderer() {
  const width = window.innerWidth;
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const isTouch = maxTouchPoints > 0;
  
  // Check pointer capability (coarse vs fine)
  const isCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  
  // Compile capabilities log
  const capabilities = {
    width,
    isTouch,
    isCoarsePointer,
    deviceMemory: navigator.deviceMemory ?? 'unknown'
  };

  // Determine policy:
  // - Viewport >= 1200px AND fine pointer (mouse) -> desktop renderer
  // - Viewport < 1200px OR touch-only coarse interface (tablet/phone) -> mobile renderer
  if (width >= 1200 && !isCoarsePointer) {
    return {
      rendererId: 'desktop',
      capabilities
    };
  } else {
    return {
      rendererId: 'mobile',
      capabilities
    };
  }
}

const policyResult = resolveRenderer();

export const RENDERER_ID = policyResult.rendererId;
export const BOOT_CAPABILITIES = policyResult.capabilities;

export default RENDERER_ID;
