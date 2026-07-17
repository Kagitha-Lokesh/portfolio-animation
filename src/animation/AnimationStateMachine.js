/**
 * AnimationStateMachine.js
 *
 * Single source of truth for the cinematic transition phase.
 * Every module asks "what state am I in?" — never reacts to raw EventBus events.
 *
 * States:
 *   IDLE           → Section fully visible, looping animation
 *   PREPARING_EXIT → User intent detected (200ms soft prep)
 *   EXIT_SYNC      → Character exit frames playing, UI drifts
 *   ENV_DISSOLVE   → Old scene melts into background (350ms)
 *   SCENE_SWAP     → Between sections, bridge objects appear (100ms)
 *   ENV_BUILD      → New environment materializes (400ms)
 *   CONTENT_BUILD  → Typography → cards → buttons emerge (600ms)
 *   ACTIVE         → Content fully visible, interactive
 *   LOOPING        → Character idle loop, ambient wind restored
 */

import { EventBus } from '../core/EventBus';

const VALID_TRANSITIONS = {
  IDLE:           ['PREPARING_EXIT'],
  PREPARING_EXIT: ['EXIT_SYNC', 'IDLE'],          // IDLE allows cancel
  EXIT_SYNC:      ['ENV_DISSOLVE'],
  ENV_DISSOLVE:   ['SCENE_SWAP'],
  SCENE_SWAP:     ['ENV_BUILD'],
  ENV_BUILD:      ['CONTENT_BUILD'],
  CONTENT_BUILD:  ['ACTIVE'],
  ACTIVE:         ['LOOPING', 'PREPARING_EXIT'],
  LOOPING:        ['PREPARING_EXIT'],
};

export class AnimationStateMachine {
  constructor() {
    this._state   = 'IDLE';
    this._context = { from: null, to: null, direction: 1 };
    this._listeners = [];
    this._bindEventBus();
  }

  /** Current state string */
  get state() { return this._state; }

  /** Current transition context: { from, to, direction } */
  get context() { return { ...this._context }; }

  /**
   * Advance to a new state. Validates the transition.
   * Emits 'CINEMATIC_STATE' on EventBus for all modules.
   */
  advance(nextState, contextPatch = {}) {
    const allowed = VALID_TRANSITIONS[this._state] || [];
    if (!allowed.includes(nextState)) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[ASM] Invalid transition: ${this._state} → ${nextState}. Allowed: [${allowed.join(', ')}]`
        );
      }
      return false;
    }

    const prev = this._state;
    this._state = nextState;
    this._context = { ...this._context, ...contextPatch };

    EventBus.emit('CINEMATIC_STATE', {
      state:   nextState,
      prev,
      context: this.context,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[ASM] ${prev} → ${nextState}`, this._context);
    }

    return true;
  }

  /** Convenience: is the machine currently in one of the given states? */
  is(...states) {
    return states.includes(this._state);
  }

  /**
   * Wire existing EventBus lifecycle events to state machine advances.
   * Called once during construction.
   */
  _bindEventBus() {
    // High scroll tension = user is about to navigate
    this._listeners.push(
      EventBus.on('SCROLL_TENSION', ({ percent }) => {
        if (percent > 0.65 && this.is('IDLE', 'LOOPING')) {
          this.advance('PREPARING_EXIT');
        }
      })
    );

    // Tension released without transition (user backed off)
    this._listeners.push(
      EventBus.on('SCROLL_TENSION_RELEASE', () => {
        if (this.is('PREPARING_EXIT')) {
          this.advance('IDLE');
        }
      })
    );

    // Section runtime fires transition
    this._listeners.push(
      EventBus.on('TRANSITION_START', ({ from, to, direction = 1 }) => {
        // Force through PREPARING_EXIT if not already there
        if (this.is('IDLE', 'LOOPING', 'ACTIVE')) {
          this.advance('PREPARING_EXIT', { from, to, direction });
        }
        this.advance('EXIT_SYNC', { from, to, direction });

        // Auto-advance to ENV_DISSOLVE after 200ms of exit walking
        setTimeout(() => {
          if (this.is('EXIT_SYNC')) {
            this.advance('ENV_DISSOLVE');
          }
        }, 200);
      })
    );

    // After character exit frames finish
    this._listeners.push(
      EventBus.on('SECTION_AFTEREXIT', () => {
        if (this.is('EXIT_SYNC')) this.advance('ENV_DISSOLVE');
      })
    );

    // Transition complete — entering new section
    this._listeners.push(
      EventBus.on('TRANSITION_END', ({ from, to }) => {
        // Force transition to SCENE_SWAP if still in a previous state
        if (this.is('EXIT_SYNC', 'ENV_DISSOLVE')) {
          if (this.is('EXIT_SYNC')) {
            this.advance('ENV_DISSOLVE');
          }
          this.advance('SCENE_SWAP', { from, to });
          
          // Auto-advance to ENV_BUILD after bridge window
          setTimeout(() => {
            if (this.is('SCENE_SWAP')) this.advance('ENV_BUILD');
          }, 100);
        }
      })
    );

    // Section enter frames start
    this._listeners.push(
      EventBus.on('SECTION_ENTER', (sectionId) => {
        if (this.is('SCENE_SWAP', 'ENV_BUILD')) {
          this.advance('ENV_BUILD', { to: sectionId });
        }
      })
    );

    // Frame marker: TITLE_IN fires — content build starts
    this._listeners.push(
      EventBus.on('TITLE_IN', () => {
        if (this.is('ENV_BUILD')) this.advance('CONTENT_BUILD');
      })
    );

    // Section fully active
    this._listeners.push(
      EventBus.on('SECTION_ACTIVE', (sectionId) => {
        if (this.is('CONTENT_BUILD', 'ENV_BUILD', 'SCENE_SWAP')) {
          // If still in SCENE_SWAP, force through ENV_BUILD
          if (this.is('SCENE_SWAP')) {
            this.advance('ENV_BUILD', { to: sectionId });
          }
          this.advance('ACTIVE', { to: sectionId });
        }
      })
    );

    // Character idle loop starts
    this._listeners.push(
      EventBus.on('LOOP_START', () => {
        if (this.is('ACTIVE')) this.advance('LOOPING');
      })
    );
  }

  /** Clean up all EventBus subscriptions */
  destroy() {
    this._listeners.forEach(unsub => unsub());
    this._listeners = [];
  }
}

export default AnimationStateMachine;
