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
    cacheLimit: 384 * 1024 * 1024 // 384MB cache (~48 decoded frames)
  },
  TABLET: {
    name: 'TABLET',
    safeZone: 'Centered Bottom',
    focusX: 0.50,
    focusY: 0.50,
    cacheLimit: 192 * 1024 * 1024 // 192MB cache (~24 decoded frames)
  },
  MOBILE: {
    name: 'MOBILE',
    safeZone: 'Top 30%',
    focusX: 0.50,
    focusY: 0.30,
    cacheLimit: 96 * 1024 * 1024 // 96MB cache (~12 decoded frames)
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
export function getDeviceProfile() {
  const width = window.innerWidth;
  if (width <= 480) return DEVICE_PROFILES.MOBILE;
  if (width <= 768) return DEVICE_PROFILES.TABLET;
  return DEVICE_PROFILES.DESKTOP;
}

/**
 * fitCover Algorithm
 * Calculates cropped coordinate mapping to cover the canvas full screen.
 */
export function fitCover(cWidth, cHeight, imgWidth, imgHeight, camera = {}, out = boundsInstance) {
  const profile = getDeviceProfile();
  
  const focusX = camera.focusX !== undefined ? camera.focusX : profile.focusX;
  const focusY = camera.focusY !== undefined ? camera.focusY : profile.focusY;
  const zoom = camera.zoom !== undefined ? camera.zoom : 1.0;

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
