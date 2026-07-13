import { EventBus } from './EventBus';

/**
 * AudioManager Class
 * Registers event listeners on the EventBus to coordinate sound effects and ambient loops.
 * Modular placeholder for future audio libraries (e.g. Howler.js).
 */
export class AudioManager {
  constructor() {
    this.init();
  }

  init() {
    // Sync to transition events
    EventBus.on('TRANSITION_START', (_data) => {
      this.playSound('transition', { volume: 0.5 });
    });

    EventBus.on('SECTION_ENTER', (sectionId) => {
      this.playAmbientTrack(sectionId);
    });

    EventBus.on('NAVIGATION_CLICK', () => {
      this.playSound('click');
    });
  }

  playSound(soundType, options = {}) {
    console.log(`[Audio] Playing sound effect: "${soundType}"`, options);
  }

  playAmbientTrack(sectionId) {
    console.log(`[Audio] Triggering ambient track loop for section: "${sectionId}"`);
  }
}

export const Audio = new AudioManager();
export default Audio;
