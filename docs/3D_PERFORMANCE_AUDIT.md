# 3D Performance Audit

Scope: audit only; no visual redesign was made in Phase 0–1.

## Post-Phase 1 homepage change — 2026-08-24

The homepage no longer imports `TyreSceneClient` and no active route imports the
old `SmoothScroll` component. The customer-facing hero now uses an optimized
transparent tyre image, native browser scrolling and IntersectionObserver-based
CSS reveals. On 2026-08-24, the CSS 3D composition was made deliberately visible:
a 22-second wheel rotation, a 7.5-second depth orbit, two animated orbital marker
rings, a moving scan light, glint, aura and ground-shadow response. Mouse-only
perspective tilt is scheduled through `requestAnimationFrame`; it does not update
React state while the pointer moves. The component does not attach touch-pointer
movement and resets to static behavior for the OS reduced-motion preference. An
IntersectionObserver pauses the composition after it leaves the viewport.

The legacy Three.js source remains in the repository for reference, but the final
production bundle scan found no `BurnoutSmoke`, `HighPerformanceWheel`, Lenis or
ScrollTrigger runtime match.

This removes the approximately 898.6 KiB deferred Three.js hero download, both
continuous `useFrame` loops, the procedural canvases, particle work and dynamic
shadow work described below. The `/` first-load JavaScript changed from 119 kB
at the original baseline to 124 kB because the revised page contains the finder,
motion controller and additional UI copy; the expensive deferred WebGL path is
absent.

The rounded homepage first-load figure is 124 kB after the expanded CSS 3D motion
change. This is a code/build result, not a field-performance claim. Mobile
Lighthouse, real-device frame pacing and p75 Core Web Vitals remain unmeasured.

## Current strengths

- `TyreSceneClient.tsx` dynamically imports the WebGL scene with `ssr: false`, so Three.js does not block server rendering or the initial homepage bundle.
- Unsupported WebGL and `prefers-reduced-motion: reduce` receive a functional non-WebGL placeholder.
- Mobile camera and particle counts are reduced relative to desktop.

## Measured implementation cost

- Deferred loadable chunks: approximately 898.6 KiB raw JavaScript.
- Procedural canvases: 1024x1024 tread, 1024x1024 sidewall, 512x512 rotor and 128x128 smoke alpha.
- Smoke: 45 continuously updated instanced particles.
- Sparkles: 8–25 mobile or 15–40 desktop, depending on interaction.
- Two continuous `useFrame` loops update smoke and wheel motion.
- Dynamic shadow map: 1024x1024; ContactShadows and city Environment are active.
- DPR range reaches 2, above the target cap of roughly 1–1.5.

## Gaps against the performance contract

- Mobile still renders the full WebGL scene; there is no required static/video mobile fallback.
- No `hardwareConcurrency`, `deviceMemory`, save-data or low-power detection.
- No Page Visibility pause when the tab is hidden.
- No Intersection Observer pause when the canvas is outside the viewport.
- The render loop is continuous even when idle.
- No measured FPS, GPU memory, long-task or mid-range-device evidence.
- The fallback is a generic CSS ring because `public/` contains no isolated brand/tyre fallback asset.

## Phase 0 decision

Do not alter the visual scene in Phase 0–1. Before launch, implement the
canonical mobile/weak-device fallback, cap DPR, pause offscreen/hidden work and
profile a real mid-range Android device. This remains a launch blocker, not a
current crash.
