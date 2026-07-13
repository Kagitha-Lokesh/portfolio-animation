import { SAFE_ZONE, FOCUS } from './constants';

/**
 * Camera profiles for viewport layouts
 */
export const CAMERA_PROFILES = {
  DESKTOP: {
    focusY: 0.50,
    zoom: 1.0,
    brightness: 1.0,
    contrast: 1.0,
    parallax: 18,
    safeZone: 'desktop-left',
  },
  TABLET: {
    focusY: 0.50,
    zoom: 1.0,
    brightness: 1.0,
    contrast: 1.0,
    parallax: 10,
    safeZone: 'tablet-center',
  },
  MOBILE: {
    focusY: 0.35,
    zoom: 1.05,
    brightness: 1.0,
    contrast: 1.0,
    parallax: 5,
    safeZone: 'mobile-top',
  }
};
