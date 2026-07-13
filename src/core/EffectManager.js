import { EventBus } from './EventBus';

/**
 * EffectManager Class
 * Listens to section enters and transitions to trigger overlays, canvas filters, or shaders.
 * Reusable placeholder for WebGL shaders, particle canvas rendering, or CSS effects.
 */
export class EffectManager {
  constructor() {
    this.activeEffects = new Set();
    this.init();
  }

  init() {
    EventBus.on('SECTION_ENTER', (sectionId) => {
      this.clearAllEffects();
      
      // Example: activate special particles for dark sections
      if (sectionId === 'skills' || sectionId === 'techstack' || sectionId === 'contact') {
        this.enableEffect('cyber-particles');
      } else {
        this.enableEffect('ambient-dust');
      }
    });

    EventBus.on('TRANSITION_START', () => {
      this.enableEffect('lens-flare-wipe');
    });

    EventBus.on('TRANSITION_END', () => {
      this.disableEffect('lens-flare-wipe');
    });
  }

  enableEffect(effectName) {
    this.activeEffects.add(effectName);
    console.log(`[Effects] Enabled visual effect: "${effectName}"`);
  }

  disableEffect(effectName) {
    this.activeEffects.delete(effectName);
    console.log(`[Effects] Disabled visual effect: "${effectName}"`);
  }

  clearAllEffects() {
    this.activeEffects.clear();
  }

  getActiveEffects() {
    return Array.from(this.activeEffects);
  }
}

export const Effect = new EffectManager();
export default Effect;
