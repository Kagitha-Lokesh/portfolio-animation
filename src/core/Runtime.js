import { EventBus } from './EventBus';
import { PORTFOLIO_CONFIG } from '../config/portfolio.config';
import { PlaybackController } from './PlaybackController';
import { SectionRuntime } from './SectionRuntime';
import { InputManager } from './InputManager';
import { CommandQueue } from './CommandQueue';
import { ExperienceManager } from './ExperienceManager';
import { CameraManager } from './CameraManager';
import './AudioManager';
import './EffectManager';
import { ScrollManager } from '../animation/ScrollManager';
import { FrameLoader } from '../rendering/FrameLoader';
import { FrameCache } from '../rendering/FrameCache';
import { FrameScheduler } from '../rendering/FrameScheduler';
import { fitCover, getDeviceProfile } from '../rendering/fitCover';

/**
 * Runtime Class
 * Main orchestrator of the entire cinematic 3D scrolling system.
 * Framework-independent engine linking playback ticker, input queue, experiences and rendering.
 */
class RuntimeClass {
  constructor() {
    this.state = {
      runtimeState: 'BOOTING',
      currentSectionId: 'home',
      currentFrame: 0,
      loadedPercent: 0,
      fps: 60,
      droppedFrames: 0,
      camera: { focusX: 0.38, focusY: 0.5, zoom: 1, brightness: 1, rotation: 0 }
    };

    this.listeners = new Set();
    
    this.canvas = null;
    this.ctx = null;
    this.isReady = false;
    this.isRunning = false;

    // Cache metrics properties
    this.fpsCount = 0;
    this.fpsLastTime = 0;
    this.lastLoopTime = 0;

    // Decoupled engine layers
    this.playback = new PlaybackController();
    this.sectionRuntime = new SectionRuntime(this.playback);
    this.input = new InputManager(this);
    this.commands = new CommandQueue(this);
    this.experienceManager = new ExperienceManager();
    this.cameraManager = new CameraManager();
    this.frameCache = new FrameCache();
    this.frameLoader = new FrameLoader(this.frameCache);
    this.frameScheduler = new FrameScheduler(this.frameLoader, this.frameCache);

    // Wire up frame synchronization callback to prevent frame skips during transitions
    this.playback.onCheckFrameCached = (frameIdx) => this.frameCache.has(frameIdx);
    this.playback.onLoadFrame = (frameIdx) => {
      this.frameLoader.loadFrame(frameIdx)
        .then(loadedImg => {
          this.frameCache.add(frameIdx, loadedImg, frameIdx);
        })
        .catch(() => {});
    };

    this.bounds = {
      sx: 0, sy: 0, sWidth: 0, sHeight: 0,
      x: 0, y: 0, width: 0, height: 0,
      scale: 1.0, cropX: 0, cropY: 0
    };

    this.lastAppliedFilter = '';
    this.loopHandler = this.loopHandler.bind(this);
  }

  /**
   * Initializes Canvas, triggers loading of manifest and boots Managers.
   */
  async init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isReady = false;

    this.updateState({
      runtimeState: 'BOOTING',
      currentSectionId: 'home',
      currentFrame: 0,
      loadedPercent: 0
    });

    this.lastPlaybackDirection = 1;
    this.frameUnsub = EventBus.on('FRAME_CHANGED', (frameIdx) => {
      this.updateState({ currentFrame: frameIdx });
      this.draw(frameIdx);

      // Re-schedule predictive loading if loop playback direction changes
      if (this.state.runtimeState === 'SECTION_ACTIVE' && this.playback.direction !== this.lastPlaybackDirection) {
        this.lastPlaybackDirection = this.playback.direction;
        this.frameScheduler.schedule(
          this.state.currentSectionId,
          this.state.runtimeState,
          1,
          frameIdx,
          this.playback.direction
        );
      }

      // Check timeline markers globally
      const section = PORTFOLIO_CONFIG.sections[this.state.currentSectionId];
      if (section && section.timeline) {
        const marker = section.timeline.find(t => t.frame === frameIdx);
        if (marker) {
          EventBus.emit(marker.event, this.state.currentSectionId);
        }
      }
    });

    try {
      // Step 1: Initialize Loader (loads assets manifest)
      await this.frameLoader.init();

      // Step 2: Bind Input listeners
      this.input.init();

      const initialSec = PORTFOLIO_CONFIG.sections[this.state.currentSectionId];
      this.syncCamera(initialSec.camera, initialSec.lighting);

      // Step 3: Trigger progressive preload starting with active section
      this.updateState({ runtimeState: 'PRELOADING' });
      
      this.frameLoader.start(initialSec, (percent, count, stage) => {
        this.updateState({ loadedPercent: percent });

        if (stage === 'READY' && !this.isReady) {
          this.isReady = true;
          this.updateState({ runtimeState: 'READY' });
          
          // Step 4: Fire ready and boot loop
          EventBus.emit('BOOT_COMPLETE');
          EventBus.emit('READY');
          
          this.start();
          
          const enterStart = initialSec.animation.enter[0];
          const enterEnd = initialSec.animation.enter[1];

          if (enterStart !== undefined && enterStart !== enterEnd) {
            this.updateState({ runtimeState: 'SECTION_TRANSITION' });
            
            // Set initial camera target configuration details
            this.syncCamera(initialSec.camera, initialSec.lighting);
            EventBus.emit('TRANSITION_START', { from: null, to: initialSec.id, direction: 1 });

            this.playback.play(enterStart, enterEnd, {
              loop: false,
              fps: initialSec.animation.fps,
              direction: 1,
              onComplete: () => {
                EventBus.emit('TRANSITION_END', { from: null, to: initialSec.id });
                this.enterSection(initialSec.id);
              }
            });
          } else {
            this.enterSection(initialSec.id);
          }
        }
      });
    } catch (err) {
      console.error('[Runtime] Initialization failure:', err);
      this.updateState({ runtimeState: 'ERROR' });
    }

    this.resize();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastLoopTime = performance.now();
    this.fpsLastTime = performance.now();
    requestAnimationFrame(this.loopHandler);
  }

  stop() {
    this.isRunning = false;
  }

  /**
   * Main ticker loop driving playback ticker and canvas redraws.
   */
  loopHandler(now) {
    if (!this.isRunning) return;

    // Track FPS
    this.fpsCount++;
    if (now - this.fpsLastTime >= 1000) {
      const activeFps = Math.round((this.fpsCount * 1000) / (now - this.fpsLastTime));
      if (activeFps !== this.state.fps) {
        this.updateState({ fps: activeFps });
      }
      this.fpsCount = 0;
      this.fpsLastTime = now;
    }

    // Tick Playback Controller to update frame index cursor
    this.playback.tick(now);

    requestAnimationFrame(this.loopHandler);
  }

  /**
   * Subscribes UI states to Runtime events (e.g. Loading percentages)
   */
  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  updateState(partialState) {
    Object.assign(this.state, partialState);
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  isTransitionLocked() {
    return this.state.runtimeState === 'SECTION_TRANSITION';
  }

  /**
   * Requests navigation to the next sequential section.
   */
  requestNext() {
    const sections = Object.keys(PORTFOLIO_CONFIG.sections);
    const currentIndex = sections.indexOf(this.state.currentSectionId);
    if (currentIndex < sections.length - 1) {
      this.commands.push({ type: 'NAVIGATE', sectionId: sections[currentIndex + 1] });
    }
  }

  /**
   * Requests navigation to the previous sequential section.
   */
  requestPrev() {
    const sections = Object.keys(PORTFOLIO_CONFIG.sections);
    const currentIndex = sections.indexOf(this.state.currentSectionId);
    if (currentIndex > 0) {
      this.commands.push({ type: 'NAVIGATE', sectionId: sections[currentIndex - 1] });
    }
  }

  /**
   * Main navigation trigger logic. Coordinates transitions and locks inputs.
   */
  executeNavigate(targetSectionId) {
    const sections = PORTFOLIO_CONFIG.sections;
    const fromSec = sections[this.state.currentSectionId];
    const toSec = sections[targetSectionId];

    if (!fromSec || !toSec || targetSectionId === this.state.currentSectionId) {
      this.commands.process(); // Unblock queue
      return;
    }

    this.playback.stop();
    this.updateState({ 
      runtimeState: 'SECTION_TRANSITION',
      currentSectionId: targetSectionId 
    });

    // Snap scrollbar to the target section
    ScrollManager.scrollToSection(toSec.order - 1);

    const isForward = toSec.order > fromSec.order;
    const direction = isForward ? 1 : -1;

    // Trigger pre-warm schedule on the loader for the target section assets
    this.frameScheduler.schedule(targetSectionId, 'SECTION_TRANSITION', direction);

    EventBus.emit('TRANSITION_START', { from: fromSec.id, to: toSec.id, direction });

    const onTransitionFinished = () => {
      EventBus.emit('TRANSITION_END', { from: fromSec.id, to: toSec.id });
      this.enterSection(targetSectionId);
      this.commands.process(); // Process next queued navigations
    };

    if (isForward) {
      this.sectionRuntime.playForwardTransition(fromSec, toSec, onTransitionFinished);
    } else {
      this.sectionRuntime.playBackwardTransition(fromSec, toSec, onTransitionFinished);
    }
  }

  /**
   * Active section landing logic: sets up the seamless looping state.
   */
  enterSection(sectionId) {
    const sections = PORTFOLIO_CONFIG.sections;
    const section = sections[sectionId];
    if (!section) return;

    this.updateState({ 
      runtimeState: 'SECTION_LOOP',
      currentSectionId: sectionId 
    });

    // Check if high-level experience changed
    const expChange = this.experienceManager.updateActiveExperience(sectionId);
    if (expChange) {
      const theme = section.lighting.profile === 'WarmMorning' ? 'light' : 'dark';
      EventBus.emit('THEME_CHANGED', theme);
    }

    // Apply Camera profile configuration details
    this.syncCamera(section.camera, section.lighting);

    const loopStart = section.animation.loop[0];
    const loopEnd = section.animation.loop[1];

    // Trigger frame predictive load around loop range
    this.frameScheduler.schedule(sectionId, 'SECTION_LOOP', 1, loopStart, 1);

    EventBus.emit('SECTION_ENTER', sectionId);
    EventBus.emit('LOOP_START', sectionId);
    EventBus.emit('SECTION_ACTIVE', sectionId);

    // Play loop infinite
    this.playback.play(loopStart, loopEnd, {
      loop: true,
      fps: section.animation.fps,
      direction: 1
    });

    this.updateState({ runtimeState: 'SECTION_ACTIVE' });
  }

  syncCamera(cameraConfig, lightingConfig) {
    const { camera } = this.cameraManager.sync(cameraConfig, lightingConfig);
    this.updateState({ camera });
  }

  resize() {
    if (!this.canvas || !this.ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    const profile = getDeviceProfile();
    if (this.frameCache) {
      this.frameCache.setLimit(profile.cacheLimit);
    }

    this.draw(this.state.currentFrame);
  }

  /**
   * Draws target frame index to canvas with custom object-fit cropping.
   */
  draw(frameIndex) {
    if (!this.canvas || !this.ctx || !this.frameLoader) return;

    const img = this.frameCache.get(frameIndex);
    
    // If the loader hasn't fully loaded this frame yet, fetch it on-demand
    if (!img) {
      this.frameLoader.loadFrame(frameIndex)
        .then(loadedImg => {
          this.frameCache.add(frameIndex, loadedImg, frameIndex);
          if (this.state.currentFrame === frameIndex) {
            this.draw(frameIndex);
          }
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            console.warn(`[Runtime] Failed to draw frame index ${frameIndex}:`, err);
          }
        });
      return;
    }

    const cWidth = this.canvas.width;
    const cHeight = this.canvas.height;
    const imgWidth = img.width || 1920;
    const imgHeight = img.height || 1080;

    // Calculate crop bounds target details in-place
    fitCover(cWidth, cHeight, imgWidth, imgHeight, this.state.camera, this.bounds);

    // Apply brightness filters if needed
    const desiredFilter = (this.state.camera.brightness !== undefined && this.state.camera.brightness !== 1.0)
      ? `brightness(${this.state.camera.brightness})`
      : 'none';

    if (this.lastAppliedFilter !== desiredFilter) {
      this.ctx.filter = desiredFilter;
      this.lastAppliedFilter = desiredFilter;
    }

    // Bypass clearRect since crop bounds cover 100% of canvas area
    this.ctx.drawImage(
      img,
      this.bounds.sx,
      this.bounds.sy,
      this.bounds.sWidth,
      this.bounds.sHeight,
      this.bounds.x,
      this.bounds.y,
      this.bounds.width,
      this.bounds.height
    );
  }

  destroy() {
    this.stop();
    this.input.destroy();
    this.commands.clear();
    if (this.frameCache) {
      this.frameCache.clear();
    }
    if (this.frameUnsub) {
      this.frameUnsub();
      this.frameUnsub = null;
    }
    this.listeners.clear();
    this.isReady = false;
  }
}

export const Runtime = new RuntimeClass();
export default Runtime;
