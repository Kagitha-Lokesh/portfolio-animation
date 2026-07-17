/**
 * TransitionDirector.js
 *
 * The thin coordinator. ~150 lines.
 * Reads AnimationStateMachine state and dispatches to 9 specialized modules.
 * Never animates anything directly — it only delegates.
 *
 * Module responsibilities:
 *   typography   → headings, subtitles, body text
 *   cards        → glass panels with physical mass
 *   decorations  → per-section decoration entry/exit sequences
 *   bridge       → cross-section visual transformations
 *   theme        → CSS variable color sync
 *   ambient      → environmental wind + particle micro-motion
 *   navbar       → compact/full + light/dark
 *   rail         → scroll rail dot transitions
 *   overlay      → container orchestration + depth parallax
 */

import { EventBus }             from '../core/EventBus';
import { AnimationStateMachine } from './AnimationStateMachine';
import { SceneClock }            from './SceneClock';
import { SCENE_DNA }             from './SceneDNA';

// Modules
import { TypographyAnimator }   from './modules/TypographyAnimator';
import { CardAnimator }         from './modules/CardAnimator';
import { DecorationAnimator }   from './modules/DecorationAnimator';
import { SceneBridgeAnimator }  from './modules/SceneBridgeAnimator';
import { ThemeAnimator }        from './modules/ThemeAnimator';
import { AmbientAnimator }      from './modules/AmbientAnimator';
import { NavbarAnimator }       from './modules/NavbarAnimator';
import { ProgressRailAnimator } from './modules/ProgressRailAnimator';
import { OverlayAnimator }      from './modules/OverlayAnimator';

export class TransitionDirector {
  constructor() {
    // Core systems
    this.sm    = new AnimationStateMachine();
    this.clock = new SceneClock();

    // Specialized animation modules
    this.modules = {
      typography:  new TypographyAnimator(),
      cards:       new CardAnimator(),
      decorations: new DecorationAnimator(),
      bridge:      new SceneBridgeAnimator(),
      theme:       new ThemeAnimator(),
      ambient:     new AmbientAnimator(),
      navbar:      new NavbarAnimator(),
      rail:        new ProgressRailAnimator(),
      overlay:     new OverlayAnimator(),
    };

    // Forward all state changes to every module
    this._stateUnsub = EventBus.on('CINEMATIC_STATE', ({ state, prev, context }) => {
      this._onStateChange(state, prev, context);
    });

    // Wire frame-marker events → content emergence
    this._bindFrameMarkers();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STATE HANDLER — dispatch to modules
  // ─────────────────────────────────────────────────────────────────────────

  _onStateChange(state, prev, context) {
    // Broadcast to all modules (each ignores states it doesn't own)
    Object.values(this.modules).forEach(mod => mod.onStateChange?.(state, context));

    // Director-level orchestration per state:
    switch (state) {

      case 'PREPARING_EXIT':
        // Stop the scene clock if a transition fires during active clock
        this.clock.stop();
        break;

      case 'EXIT_SYNC':
        // Bridge fires: old scene begins transforming into new
        this.modules.bridge.startBridge(context.from, context.to, context.direction ?? 1);
        break;

      case 'ENV_BUILD': {
        // Determine clock duration from destination section DNA
        const dna = SCENE_DNA[context.to];
        const totalMs = dna ? _sectionClockDuration(dna) : 1200;

        this.clock.start(totalMs);

        // Register all module callbacks at their normalized times
        this.clock.at(0.00, () => {
          // Decoration layer gets visibility immediately for bridge continuity
        });

        this.clock.at(0.15, () => {
          // Ambient hints: particles, glow
          this.modules.ambient.onStateChange('ENV_BUILD', context);
        });

        this.clock.at(0.35, () => {
          // Decoration primary elements
          this.modules.decorations.build(context.to, context.direction ?? 1);
        });

        this.clock.at(0.52, () => {
          // Typography: title sharpens from blur (camera-focus feel)
          this.modules.typography.emerge(context.to, context.direction ?? 1);
        });

        this.clock.at(0.58, () => {
          // Cards: glass materializes with physical mass — follows heading much quicker
          this.modules.cards.materialize(context.to, context.direction ?? 1);
        });

        this.clock.at(0.85, () => {
          // Interactive: buttons lift and glow activates last
          this.modules.overlay.activateInteractive(context.to);
        });

        this.clock.at(1.00, () => {
          // Clock complete — advance to ACTIVE
          this.sm.advance('ACTIVE', context);
        });

        break;
      }

      case 'LOOPING':
        // Full ambient life restored
        this.modules.ambient.onStateChange('LOOPING', context);
        break;

      default:
        break;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FRAME MARKER BRIDGE
  // Legacy TITLE_IN, CONTENT_IN etc still fire from SectionRuntime.
  // If the clock hasn't fired those callbacks yet, we use the events as fallback.
  // ─────────────────────────────────────────────────────────────────────────

  _bindFrameMarkers() {
    const ctx = () => this.sm.context;

    this._markerUnsubs = [
      EventBus.on('TITLE_IN', (secId) => {
        const c = ctx();
        if (c.to === secId && this.sm.is('ENV_BUILD', 'CONTENT_BUILD')) {
          this.modules.typography.emerge(secId, c.direction ?? 1);
        }
      }),

      EventBus.on('CONTENT_IN', (secId) => {
        const c = ctx();
        if (c.to === secId && !this.clock.isRunning) {
          // Clock already finished — fire cards immediately as fallback
          this.modules.cards.materialize(secId, c.direction ?? 1);
        }
      }),
    ];
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LIFECYCLE
  // ─────────────────────────────────────────────────────────────────────────

  destroy() {
    this.clock.stop();
    this._stateUnsub?.();
    this._markerUnsubs?.forEach(u => u());
    this.sm.destroy();

    // Destroy modules that have cleanup
    Object.values(this.modules).forEach(mod => mod.destroy?.());
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Clock duration per section (derived from DNA rhythm + gravity)
// ─────────────────────────────────────────────────────────────────────────────
function _sectionClockDuration(dna) {
  const base = 1200;
  const gravityScale = { light: 0.85, medium: 1.0, heavy: 1.2 }[dna.gravity] ?? 1.0;
  return Math.round(base * gravityScale);
}

export default TransitionDirector;
