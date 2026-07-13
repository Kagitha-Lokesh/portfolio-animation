# MASTER IMPLEMENTATION PROMPT
# CINEMATIC PORTFOLIO RUNTIME v1.0
# SECTION-DRIVEN ANIMATION ENGINE

You are a Principal Frontend Engineer, Creative Developer, Motion Engineer, Performance Engineer and Software Architect.

Your task is NOT to build a normal portfolio.

Your task is to build a cinematic portfolio runtime that behaves like an Apple keynote presentation mixed with an Awwwards experience.

=========================================================
PROJECT GOAL
=========================================================

The portfolio consists of 9 fullscreen sections.

The character animation is NOT controlled frame-by-frame by scrolling.

Instead,

Scrolling controls SECTIONS.

Each section owns:

• Enter Animation
• Loop Animation
• Exit Animation

The transition animation plays ONCE.

The loop animation repeats while the section is active.

When the user scrolls to the next section,

the runtime

plays transition frames,

then switches to the next looping animation.

The experience should feel like

Apple Product Page

+

Disney cinematic presentation

+

Interactive movie

instead of

video scrubbing.

=========================================================
IMPORTANT DESIGN PRINCIPLE
=========================================================

DO NOT map scroll position directly to frame index.

DO NOT continuously scrub all 517 frames.

Instead

Map

Scroll

↓

Section

↓

Animation State

↓

Animation Playback

↓

Canvas

=========================================================
ANIMATION STATES
=========================================================

Every section has

ENTER

↓

LOOP

↓

EXIT

The runtime is responsible for changing states.

The loop animation always plays automatically.

Transition animations never loop.

=========================================================
SECTION ORDER
=========================================================

Section 1 - HOME
Section 2 - ABOUT
Section 3 - SKILLS
Section 4 - TECH STACK
Section 5 - PROJECTS
Section 6 - EXPERIENCE
Section 7 - EDUCATION
Section 8 - ACHIEVEMENTS
Section 9 - CONTACT

=========================================================
FRAME RANGES  (see src/config/sections.js for the machine-readable version)
=========================================================

HOME — Enter 0-14 / Loop 15-26 / Exit 27-69
ABOUT — Enter 70-74 / Loop 75-85 / Exit 86-149
SKILLS — Enter 150-154 / Loop 155-165 / Exit 166-214
TECH STACK — Enter 215-219 / Loop 220-230 / Exit 231-270
PROJECTS — Enter 271-279 / Loop 280-305 / Exit 306-339
EXPERIENCE — Enter 340-349 / Loop 350-370 / Exit 371-405
EDUCATION — Enter 406-408 / Loop 409-413 / Exit 414-459
ACHIEVEMENTS — Enter 460-463 / Loop 464-473 / Exit 474-504
CONTACT — Enter 505-509 / Loop 510-517 / Stay Here Forever

=========================================================
LOOP PLAYBACK
=========================================================

The loop must play automatically.

Do NOT freeze on one frame.

Example: HOME loop plays 15,16,17,...,26, then repeats from 15. Forever.

Playback Speed: 12 FPS. NOT 24 FPS.

Do NOT duplicate frames. Do NOT interpolate. Simply play each frame naturally.

=========================================================
SCROLL BEHAVIOUR
=========================================================

Scrolling should behave section-by-section.

Treat wheel/touch input as INTENT, not distance:
- User scrolls down → trigger next section.
- Disable further scrolling temporarily (scroll lock) while the transition plays.
- Play Exit of current section, then Enter of next section, then begin its Loop.
- Re-enable scrolling once the Loop is running.

Exactly the opposite when scrolling upward:
User scrolls upward → Disable Scroll → Reverse Transition → Play Previous Loop → Enable Scroll.

The user should NEVER manually scrub transition frames. Transition frames always play automatically, and always finish even if the user scrolls quickly — queue further requests, never interrupt an active transition.

=========================================================
SECTION MANAGER
=========================================================

Create a SectionManager. Responsibilities:
Current Section, Next Section, Previous Section, Direction, Progress, Animation State, Active Loop, Transition Status.

=========================================================
STATE MACHINE
=========================================================

BOOT → READY → SECTION_IDLE → SCROLL_TRIGGER → PLAY_EXIT → PLAY_ENTER → LOOP → WAIT → NEXT_TRIGGER

=========================================================
RUNTIME
=========================================================

Animation Runtime owns everything. React should NEVER control animations — React only displays UI.

Runtime controls: Current Frame, Current Section, Loop, Playback, Transitions, Events.

=========================================================
EVENT SYSTEM
=========================================================

Implement event architecture with events:
SECTION_ENTER, SECTION_EXIT, TRANSITION_START, TRANSITION_END, LOOP_START, LOOP_STOP, FRAME_CHANGED, NAVIGATION_CLICK, ANIMATION_COMPLETE.

=========================================================
SCROLL LOCK
=========================================================

During transitions: temporarily disable wheel scrolling, ignore additional wheel events. After transition completes: enable scrolling again. This prevents users from skipping multiple sections.

=========================================================
NAVIGATION
=========================================================

Navbar links: Home, About, Skills, Tech Stack, Projects, Experience, Education, Achievements, Contact.

Clicking "Projects" does NOT jump instantly. Instead: Play transition → Projects Loop → Highlight Navbar.

=========================================================
CANVAS
=========================================================

Canvas remains fixed, 100vw × 100vh, always fullscreen. Use fitCover(). No stretching, no black borders, no letterboxing, no pillarboxing.

=========================================================
FIT COVER
=========================================================

Implement custom object-fit cover. Support Desktop, Tablet, Mobile, UltraWide. Use camera focus focusX/focusY.

=========================================================
CAMERA
=========================================================

Each section owns focusX, focusY, zoom, brightness, safeZone (see sections.js). Later these will animate. For now, support configuration.

=========================================================
CONTENT
=========================================================

React overlays remain completely independent (see src/config/content.js for all copy). Each section displays Title, Description, Buttons, Cards.

Content fades in after the transition completes. Content fades out before transition starts. Animation and UI are decoupled.

=========================================================
SECTION CONFIGURATION
=========================================================

Use src/config/sections.js as the canonical data source. All sections use the same structure:
{ id, order, title, enter: {start,end}, loop: {start,end}, exit: {start,end}|null, camera: {focusX,focusY,zoom,brightness}, theme, safeZone }

=========================================================
DIRECTORY STRUCTURE
=========================================================

src/
  runtime/
    AnimationRuntime.js
    SectionManager.js
    LoopPlayer.js
    TransitionPlayer.js
    AnimationPlayer.js
    ScrollManager.js
    CameraManager.js
    EventBus.js
  rendering/
    FrameLoader.js
    FrameCache.js
    fitCover.js
    CanvasRenderer.jsx
  presentation/
    Navigation/
    Section/
    Hero/
    About/
    Skills/
    TechStack/
    Projects/
    Experience/
    Education/
    Achievements/
    Contact/
  stores/
    UIStore.js
    AnimationStore.js
  config/
    sections.js
    content.js
    camera.js
    motion.js
    theme.js
  styles/
    global.css
  App.jsx

=========================================================
PERFORMANCE
=========================================================

Target: 60 FPS Desktop, 30-60 FPS Mobile. Only decode nearby frames. Keep sliding cache. Avoid allocations inside render loop. No React rerenders while animation is playing. Canvas paints only when frame changes.

=========================================================
DEBUG PANEL
=========================================================

Show: Current Section, Animation State, Current Frame, Loop Frame, Direction, FPS, Loaded Frames, Cached Frames, Current Camera, Transition Status, Scroll Locked.

=========================================================
FINAL EXPERIENCE
=========================================================

The website must feel like an interactive animated film. The user never notices frame numbers. The user only experiences smooth cinematic transitions between sections. The animation should support the portfolio content rather than compete with it.

The overall feeling should resemble an Apple keynote presentation combined with an Awwwards-winning interactive website.

Code quality must be production-ready, modular, maintainable, and thoroughly documented.

=========================================================
ADDITIONAL UX RULE
=========================================================

Don't use wheel distance to determine the next section — treat the mouse wheel or touch gesture as intent:
- User scrolls down → trigger next section.
- Ignore additional scroll input until the transition finishes.
- Once the next section's loop is running, accept another scroll.
This gives a polished, presentation-like feel and avoids accidental skipping of multiple sections, and stays consistent across mouse wheels, touchpads, and mobile swipes.
