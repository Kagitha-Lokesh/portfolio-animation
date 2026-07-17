import { PORTFOLIO_CONFIG } from '../config/portfolio.config';
import { EventBus } from './EventBus';

/**
 * CameraManager Class
 * Manages viewport camera adjustments, zoom profiles, parallax factors, and lighting profiles.
 */
export class CameraManager {
  constructor() {
    this.currentCamera = { focusX: 0.5, focusY: 0.5, zoom: 1.0, brightness: 1.0, rotation: 0 };
    this.currentLighting = { brightness: 1.0, contrast: 1.0, filter: 'none' };
  }

  /**
   * Resolves camera values based on section settings and profile templates.
   */
  sync(cameraConfig, lightingConfig = {}) {
    const profiles = PORTFOLIO_CONFIG.cameraProfiles;
    const profile = profiles[cameraConfig.profile] || { zoom: 1.0, parallax: 0.05 };

    this.currentCamera = {
      focusX: cameraConfig.focusX,
      focusY: cameraConfig.focusY,
      zoom: 1.0, // camera zoom factor is always flat 1.0
      brightness: cameraConfig.brightness !== undefined ? cameraConfig.brightness : 1.0,
      rotation: cameraConfig.rotation || 0,
      parallax: profile.parallax,
      safeZone: cameraConfig.safeZone
    };

    const lightProfiles = PORTFOLIO_CONFIG.lightingProfiles;
    this.currentLighting = lightProfiles[lightingConfig.profile] || { brightness: 1.0, contrast: 1.0, filter: 'none' };

    EventBus.emit('CAMERA_CHANGED', this.currentCamera);
    EventBus.emit('LIGHTING_CHANGED', this.currentLighting);

    return {
      camera: this.currentCamera,
      lighting: this.currentLighting
    };
  }

  getCurrentCamera() {
    return this.currentCamera;
  }
}

export default CameraManager;
