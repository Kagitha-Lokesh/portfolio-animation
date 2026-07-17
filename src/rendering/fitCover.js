/**
 * Device Profiles Configurations
 * Defines safe zones, default camera centers, and memory limits per device.
 */
export const DEVICE_PROFILES = {
  DESKTOP: {
    name: 'DESKTOP',
    safeZone: 'Left 38%',
    focusX: 0.38,
    focusY: 0.50,
    cacheLimit: 1200 * 1024 * 1024 // 1.2GB cache (~144 decoded frames — fits entire loop and exit/enter ranges)
  },
  TABLET: {
    name: 'TABLET',
    safeZone: 'Centered Bottom',
    focusX: 0.50,
    focusY: 0.50,
    cacheLimit: 600 * 1024 * 1024 // 600MB cache (~72 decoded frames)
  },
  MOBILE: {
    name: 'MOBILE',
    safeZone: 'Top 30%',
    focusX: 0.50,
    focusY: 0.30,
    cacheLimit: 300 * 1024 * 1024 // 300MB cache (~36 decoded frames)
  }
};

/**
 * Pre-allocated static bounds target object.
 * Re-used inside render loops to achieve zero garbage collection sweeps.
 */
const boundsInstance = {
  sx: 0,
  sy: 0,
  sWidth: 0,
  sHeight: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  scale: 1.0,
  cropX: 0,
  cropY: 0
};

/**
 * Returns active profile based on viewport size.
 * @returns {object}
 */
/**
 * Module-level cache: avoids DOM read on every draw frame.
 * Invalidated only on window resize.
 */
let _cachedProfile = null;
let _cachedWidth   = -1;

/**
 * Returns active profile based on viewport size.
 * Result is cached and only recomputed when the viewport width changes.
 * @returns {object}
 */
export function getDeviceProfile() {
  const width = window.innerWidth;
  if (width === _cachedWidth && _cachedProfile) return _cachedProfile;
  _cachedWidth = width;
  if (width <= 480) _cachedProfile = DEVICE_PROFILES.MOBILE;
  else if (width <= 768) _cachedProfile = DEVICE_PROFILES.TABLET;
  else _cachedProfile = DEVICE_PROFILES.DESKTOP;
  return _cachedProfile;
}

/** Call this on window resize to bust the profile cache. */
export function invalidateDeviceProfileCache() {
  _cachedWidth   = -1;
  _cachedProfile = null;
}

/**
 * fitCover Algorithm
 * Calculates cropped coordinate mapping to cover the canvas full screen.
 */
export function fitCover(cWidth, cHeight, imgWidth, imgHeight, camera = {}, out = boundsInstance) {
  const profile = getDeviceProfile();
  
  const focusX = camera.focusX !== undefined ? camera.focusX : profile.focusX;
  const focusY = camera.focusY !== undefined ? camera.focusY : profile.focusY;
  const zoom = 1.0; /* camera zoom factor is always flat 1.0 */

  const canvasRatio = cWidth / cHeight;
  const imgRatio = imgWidth / imgHeight;

  let sWidth, sHeight;
  let sx, sy;

  if (imgRatio > canvasRatio) {
    sHeight = imgHeight;
    sWidth = imgHeight * canvasRatio;
  } else {
    sWidth = imgWidth;
    sHeight = imgWidth / canvasRatio;
  }

  sWidth /= zoom;
  sHeight /= zoom;

  sx = imgWidth * focusX - sWidth / 2;
  sy = imgHeight * focusY - sHeight / 2;

  if (sx < 0) sx = 0;
  if (sx + sWidth > imgWidth) sx = imgWidth - sWidth;
  if (sy < 0) sy = 0;
  if (sy + sHeight > imgHeight) sy = imgHeight - sHeight;

  out.sx = sx;
  out.sy = sy;
  out.sWidth = sWidth;
  out.sHeight = sHeight;
  out.x = 0;
  out.y = 0;
  out.width = cWidth;
  out.height = cHeight;
  out.scale = cWidth / sWidth;
  out.cropX = Math.round(sx);
  out.cropY = Math.round(sy);

  return out;
}

export default fitCover;
