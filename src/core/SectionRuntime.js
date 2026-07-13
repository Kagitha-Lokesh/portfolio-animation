import { EventBus } from './EventBus';

/**
 * SectionRuntime Class
 * Orchestrates section transitions and executes lifecycle hooks.
 * Supports forward play (Exit -> Enter) and backward reverse play.
 */
export class SectionRuntime {
  /**
   * @param {PlaybackController} playbackController - Central playback controller
   */
  constructor(playbackController) {
    this.playback = playbackController;
  }

  /**
   * Transitions forward from one section to another.
   * Plays: Current Section Exit (forward) -> Next Section Enter (forward).
   */
  playForwardTransition(fromSec, toSec, onComplete) {
    this.fireLifecycle(fromSec.id, 'BeforeExit');
    this.fireLifecycle(fromSec.id, 'Exit');

    const exitStart = fromSec.animation.exit ? fromSec.animation.exit[0] : -1;
    const exitEnd = fromSec.animation.exit ? fromSec.animation.exit[1] : -1;

    const playEnter = () => {
      this.fireLifecycle(fromSec.id, 'AfterExit');
      this.fireLifecycle(toSec.id, 'BeforeEnter');
      this.fireLifecycle(toSec.id, 'Enter');

      const enterStart = toSec.animation.enter[0];
      const enterEnd = toSec.animation.enter[1];

      this.playback.play(enterStart, enterEnd, {
        loop: false,
        fps: toSec.animation.fps,
        direction: 1,
        onComplete: () => {
          this.fireLifecycle(toSec.id, 'AfterEnter');
          onComplete();
        }
      });
    };

    if (exitStart !== -1) {
      this.playback.play(exitStart, exitEnd, {
        loop: false,
        fps: fromSec.animation.fps,
        direction: 1,
        onComplete: playEnter
      });
    } else {
      playEnter();
    }
  }

  /**
   * Transitions backward from one section to another.
   * Plays: Current Section Enter (reversed) -> Previous Section Exit (reversed).
   */
  playBackwardTransition(fromSec, toSec, onComplete) {
    this.fireLifecycle(fromSec.id, 'BeforeExit');
    this.fireLifecycle(fromSec.id, 'Exit');

    const enterStart = fromSec.animation.enter[0];
    const enterEnd = fromSec.animation.enter[1];

    const playReverseExit = () => {
      this.fireLifecycle(fromSec.id, 'AfterExit');
      this.fireLifecycle(toSec.id, 'BeforeEnter');
      this.fireLifecycle(toSec.id, 'Enter');

      const exitStart = toSec.animation.exit ? toSec.animation.exit[0] : -1;
      const exitEnd = toSec.animation.exit ? toSec.animation.exit[1] : -1;

      if (exitStart !== -1) {
        this.playback.play(exitStart, exitEnd, {
          loop: false,
          fps: toSec.animation.fps,
          direction: -1, // plays backwards
          onComplete: () => {
            this.fireLifecycle(toSec.id, 'AfterEnter');
            onComplete();
          }
        });
      } else {
        this.fireLifecycle(toSec.id, 'AfterEnter');
        onComplete();
      }
    };

    this.playback.play(enterStart, enterEnd, {
      loop: false,
      fps: fromSec.animation.fps,
      direction: -1, // plays backwards
      onComplete: playReverseExit
    });
  }

  /**
   * Helper to log lifecycle hooks and emit system-wide events.
   */
  fireLifecycle(sectionId, hookName) {
    console.log(`[Lifecycle] Section "${sectionId}": ${hookName}`);
    EventBus.emit(`SECTION_${hookName.toUpperCase()}`, sectionId);
  }
}

export default SectionRuntime;
