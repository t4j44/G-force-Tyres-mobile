# DESIGN.md — G Force Tyres Mobile
> Drop this file into your project root. Every AI coding agent reads it to generate consistent, brand-accurate UI.
> Inspired by BMW M motorsport editorial aesthetic. Adapted for G Force Tyres brand identity.

---

## 1. Visual Theme & Atmosphere

### Design Philosophy
G Force Tyres is not a budget tyre shop. It is a precision mobile fitting service operating in London's premium automotive market. Every design decision must communicate speed, technical authority, and professional excellence.

The visual language draws from motorsport editorial design — specifically BMW M and Lamborghini's approach to dark, high-contrast, performance-first interfaces. Think pit lane, not petrol station.

### Mood Board
- **Primary mood:** Dark performance machine. Engineered precision.
- **Secondary mood:** London urban confidence. Fast. Reliable.
- **Tertiary mood:** Premium hospitality. Professional. Trustworthy.
- **Never:** Budget, playful, casual, overcomplicated, clinical, corporate.

### Design Density
- **Marketing pages:** High impact, low density. Massive type, full-bleed imagery, breathing room.
- **Booking flow:** Medium density. Clear steps, confident inputs, no clutter.
- **Admin dashboard:** Higher density. Data-forward, scannable, functional first.

### Reference Aesthetics
- BMW M: Pure black canvas, tricolor stripe accents, full-bleed photography, uppercase precision
- Tesla: Radical subtraction, cinematic full-viewport photography
- Lamborghini: True black cathedral, monumental display type, singular accent
- Stripe: Typography-first, precise layout, one dominant CTA per section

---

## 2. Color Palette & Roles

### Core Palette

```css
:root {
  /* Backgrounds */
  --void:          #000000;   /* True black — hero backgrounds, photography overlays */
  --surface:       #0D0D0D;   /* Primary app surface — most pages */
  --surface-2:     #141414;   /* Cards, panels, elevated surfaces */
  --surface-3:     #1C1C1C;   /* Input fields, secondary containers */
  --surface-4:     #242424;   /* Hover states on surface-2 */

  /* Borders */
  --border:        #2A2A2A;   /* Default dividers and card outlines */
  --border-2:      #383838;   /* Stronger borders, focus-adjacent */
  --border-brand:  rgba(56,189,248,0.35); /* Brand-coloured border on hover */

  /* Brand */
  --brand:         #38BDF8;   /* Sky blue — primary CTAs, key highlights, links */
  --brand-dim:     #1E8FC0;   /* Hover state on brand */
  --brand-subtle:  rgba(56,189,248,0.10); /* Brand-tinted surface */
  --brand-glow:    rgba(56,189,248,0.20); /* Focus rings, glows */
  --brand-ghost:   rgba(56,189,248,0.06); /* Card hover tint */

  /* Text */
  --text-1:        #F5F5F5;   /* Headlines, primary body, high importance */
  --text-2:        #A3A3A3;   /* Secondary text, descriptions */
  --text-3:        #6B6B6B;   /* Tertiary, placeholders, timestamps */
  --text-4:        #404040;   /* Disabled text */
  --text-inverse:  #0D0D0D;   /* Text on brand-blue backgrounds */

  /* Semantic */
  --success:       #22C55E;   /* Confirmed, completed, available */
  --success-bg:    rgba(34,197,94,0.10);
  --success-border:rgba(34,197,94,0.25);
  --warning:       #F59E0B;   /* Pending, attention, hold timer */
  --warning-bg:    rgba(245,158,11,0.10);
  --warning-border:rgba(245,158,11,0.25);
  --danger:        #EF4444;   /* Errors, cancellations, critical */
  --danger-bg:     rgba(239,68,68,0.10);
  --danger-border: rgba(239,68,68,0.25);
  --info:          #60A5FA;   /* Informational, neutral alerts */
  --info-bg:       rgba(96,165,250,0.10);

  /* Brand Stripe (M-style tricolor accent) */
  --stripe-1:      #38BDF8;   /* Brand sky blue */
  --stripe-2:      #FFFFFF;   /* Pure white */
  --stripe-3:      #0D0D0D;   /* Near black */

  /* Special */
  --overlay:       rgba(0,0,0,0.72); /* Photography overlays */
  --scrim:         rgba(0,0,0,0.85); /* Navigation blur backdrop */
}
```

### Dark Mode Note
This design system is dark-first. There is no light mode variant for the public-facing site. The admin dashboard may optionally support a light mode as a future enhancement.

### High Contrast Mode
```css
@media (prefers-contrast: more) {
  :root {
    --border:    #555555;
    --text-2:    #D0D0D0;
    --text-3:    #999999;
  }
}
```

### Color Usage Rules
- **Brand blue is used ONCE per viewport section** — only on the primary CTA or the most important highlight
- **Never use brand blue for body text** — it is an accent, not a text colour
- **Never use pure white (#FFF) for backgrounds** — use --surface or --surface-2
- **Semantic colours (success/warning/danger) are only for status communication** — never decorative
- **Photography always sits on --void or behind --overlay** — never floating on a surface

---

## 3. Typography System

### Font Stack
```css
/* Import in _document or layout */
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --font-display: 'Bebas Neue', 'Arial Black', sans-serif;
  --font-body:    'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
}
```

### Type Scale

| Role | Font | Size | Line Height | Weight | Transform | Tracking |
|------|------|------|-------------|--------|-----------|----------|
| Hero display | Bebas Neue | clamp(4.5rem, 11vw, 10rem) | 0.88 | 400 | uppercase | -0.01em |
| H1 | Bebas Neue | clamp(3rem, 6vw, 6.5rem) | 0.92 | 400 | uppercase | -0.01em |
| H2 | Bebas Neue | clamp(2.25rem, 4vw, 4.5rem) | 0.95 | 400 | uppercase | 0 |
| H3 | Inter | clamp(1.25rem, 2.5vw, 1.75rem) | 1.25 | 700 | none | -0.02em |
| H4 | Inter | 1.125rem | 1.35 | 600 | none | -0.01em |
| Body large | Inter | 1.125rem | 1.65 | 400 | none | 0 |
| Body | Inter | 1rem | 1.6 | 400 | none | 0 |
| Body small | Inter | 0.875rem | 1.55 | 400 | none | 0 |
| Label | Inter | 0.75rem | 1.4 | 500 | uppercase | 0.1em |
| Label large | Inter | 0.875rem | 1.4 | 500 | uppercase | 0.08em |
| Price | Bebas Neue | clamp(2rem, 5vw, 4rem) | 1 | 400 | none | 0 |
| Ref/Code | JetBrains Mono | 0.875rem | 1.5 | 500 | none | 0 |
| Caption | Inter | 0.75rem | 1.5 | 400 | none | 0.02em |

### Typography Rules
- **Bebas Neue is always uppercase** — never sentence case or title case
- **Leading (line-height) is tight on display** — 0.88–0.95 for H1-H2. Breathes on body: 1.6
- **Never mix display and body in the same visual weight** — clear hierarchy always
- **Price displays use Bebas Neue** — makes numbers feel premium and fast
- **Booking references and codes use JetBrains Mono** — technical precision signal
- **Max line length for body text: 68 characters** — prevents unreadable long lines

---

## 4. Component Library

### Buttons

#### Primary Button
```css
.btn-primary {
  background: var(--brand);
  color: var(--text-inverse);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 15px 36px;
  border: none;
  border-radius: 0px;           /* Hard edges — performance aesthetic */
  cursor: pointer;
  transition: background 150ms ease, transform 100ms ease, box-shadow 200ms ease;
  white-space: nowrap;
  min-height: 52px;             /* Touch target compliance */
}
.btn-primary:hover {
  background: #60CDFF;
  box-shadow: 0 0 28px rgba(56,189,248,0.35);
}
.btn-primary:active { transform: scale(0.98); }
.btn-primary:disabled { background: var(--surface-3); color: var(--text-4); cursor: not-allowed; }
.btn-primary:focus-visible { outline: 2px solid var(--brand); outline-offset: 3px; }
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--text-1);
  border: 1px solid var(--border-2);
  /* Same typography as primary */
  transition: border-color 150ms, color 150ms;
}
.btn-secondary:hover { border-color: var(--brand); color: var(--brand); }
```

#### Ghost Button
```css
.btn-ghost {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  color: var(--text-2);
}
.btn-ghost:hover { background: var(--brand-ghost); border-color: var(--border-brand); color: var(--brand); }
```

#### Destructive Button
```css
.btn-destructive {
  background: transparent;
  border: 1px solid var(--danger-border);
  color: var(--danger);
}
.btn-destructive:hover { background: var(--danger-bg); }
```

#### Icon Button
```css
.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: 4px;         /* Small radius OK for icon-only controls */
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Input Fields

#### Text Input
```css
.input {
  background: var(--surface-3);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-1);
  font-family: var(--font-body);
  font-size: 1rem;             /* Never below 16px — prevents mobile zoom */
  padding: 14px 16px;
  width: 100%;
  transition: border-color 150ms, box-shadow 150ms;
}
.input::placeholder { color: var(--text-4); }
.input:hover { border-color: var(--border-2); }
.input:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-glow);
  outline: none;
}
.input[aria-invalid="true"] { border-color: var(--danger); box-shadow: 0 0 0 3px var(--danger-bg); }
```

#### Registration Plate Input (VRM)
```css
.input-vrm {
  font-family: var(--font-display);
  font-size: 2.5rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-align: center;
  background: var(--surface-2);
  border: 2px solid var(--border-2);
  border-radius: 6px;          /* Slight radius — mirrors UK plate style */
  color: var(--text-1);
  padding: 20px 24px;
  max-width: 320px;
}
.input-vrm:focus { border-color: var(--brand); box-shadow: 0 0 0 4px var(--brand-glow); }
```

#### Select / Dropdown
- Same visual treatment as text input
- Custom chevron icon in brand color on focus
- Options list: background var(--surface-2), hover background var(--surface-3)

### Cards

#### Standard Card
```css
.card {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 24px;
  transition: border-color 200ms, box-shadow 200ms;
}
.card:hover {
  border-color: var(--border-brand);
  box-shadow: 0 0 0 1px var(--border-brand), 0 8px 32px rgba(0,0,0,0.4);
}
```

#### Tyre Product Card
```css
.card-tyre {
  /* Extends .card */
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  gap: 12px;
  overflow: hidden;
}
/* Left accent bar — appears on hover */
.card-tyre::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--brand);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 200ms ease;
}
.card-tyre:hover::before { transform: scaleY(1); }
```

#### Booking Confirmation Card
```css
.card-confirmation {
  background: var(--surface-2);
  border: 1px solid var(--success-border);
  box-shadow: 0 0 40px rgba(34,197,94,0.08);
}
```

#### Feature Card (How It Works)
```css
.card-feature {
  background: var(--surface-2);
  border: 1px solid var(--border);
  padding: 32px;
  position: relative;
  /* 3D tilt on hover via JS transform */
  transform-style: preserve-3d;
  transition: transform 200ms ease;
}
```

### Badges & Status

#### Tier Badges (Tyre quality)
```css
.badge-budget  { background: rgba(107,114,128,0.15); color: #9CA3AF; border: 1px solid rgba(107,114,128,0.3); }
.badge-mid     { background: rgba(59,130,246,0.12);  color: #60A5FA; border: 1px solid rgba(59,130,246,0.3); }
.badge-premium { background: rgba(234,179,8,0.12);   color: #EAB308; border: 1px solid rgba(234,179,8,0.3);  }
```

#### Booking Status Badges
```css
.badge-pending   { background: var(--warning-bg);  color: var(--warning);  border: 1px solid var(--warning-border);  }
.badge-confirmed { background: var(--success-bg);  color: var(--success);  border: 1px solid var(--success-border);  }
.badge-cancelled { background: var(--danger-bg);   color: var(--danger);   border: 1px solid var(--danger-border);   }
.badge-enroute   { background: var(--info-bg);     color: var(--info);     border: 1px solid rgba(96,165,250,0.25);  }
```

All badges:
```css
.badge {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
```

### Navigation

#### Desktop Header
```css
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(13,13,13,0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid transparent;
  transition: border-color 200ms;
}
.header.scrolled { border-bottom-color: var(--border); }
```

#### Mobile Bottom Nav
```css
.mobile-nav {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  height: 64px;
  z-index: 50;
  padding-bottom: env(safe-area-inset-bottom);
}
```

### Forms

#### Form Group
```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-label {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-2);
}
.form-error {
  font-size: 0.8125rem;
  color: var(--danger);
  display: flex;
  align-items: center;
  gap: 5px;
}
```

### Dividers

#### M-Stripe Divider (Brand Identity Element)
```css
.m-stripe {
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 48px;         /* Default — can be overridden */
}
.m-stripe-line-1 { height: 3px; background: var(--stripe-1); } /* Sky blue */
.m-stripe-line-2 { height: 3px; background: var(--stripe-2); } /* White */
.m-stripe-line-3 { height: 3px; background: var(--stripe-3); } /* Black */
```

Usage: Place above section headings, below section introductions, or as a decorative element before large typography reveals.

### Step Indicators

#### Booking Progress Steps
```css
.step-indicator {
  display: flex;
  align-items: center;
  gap: 0;
}
.step {
  display: flex;
  align-items: center;
  gap: 8px;
}
.step-number {
  width: 32px;
  height: 32px;
  border-radius: 0;      /* Square — matches button aesthetic */
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 500;
}
.step.active   .step-number { background: var(--brand); color: var(--text-inverse); }
.step.complete .step-number { background: var(--success); color: var(--text-inverse); }
.step.pending  .step-number { background: var(--surface-3); color: var(--text-3); border: 1px solid var(--border); }
.step-connector { flex: 1; height: 1px; background: var(--border); min-width: 24px; }
.step.complete + .step-connector { background: var(--success); }
```

### Slot Calendar (Booking)
```css
.slot-available {
  background: var(--surface-3);
  border: 1px solid var(--border);
  color: var(--text-1);
  cursor: pointer;
  transition: all 150ms;
}
.slot-available:hover { border-color: var(--brand); background: var(--brand-subtle); }
.slot-selected { background: var(--brand); color: var(--text-inverse); border-color: var(--brand); }
.slot-full     { background: var(--surface-3); color: var(--text-4); border: 1px solid var(--border); cursor: not-allowed; opacity: 0.5; }
.slot-hold     { background: var(--warning-bg); border: 1px solid var(--warning-border); color: var(--warning); }
```

---

## 5. Layout System

### Grid
```css
:root {
  --grid-cols:    12;
  --grid-gutter:  clamp(16px, 3vw, 32px);
  --container:    1400px;
  --container-sm: 860px;
  --container-xs: 640px;
}

.container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--grid-gutter);
}
```

### Spacing Scale
```
4px   0.25rem   micro — icon gap, badge padding
8px   0.5rem    tight — form gap, list gap
12px  0.75rem   small — internal card gap
16px  1rem      base — label to input gap
24px  1.5rem    medium — between form fields
32px  2rem      large — between card groups
48px  3rem      section internal — above/below headings
64px  4rem      section gap on mobile
96px  6rem      section gap on desktop
128px 8rem      major section breaks
192px 12rem     hero breathing room
```

### Section Anatomy
Every public page section follows:
1. M-stripe divider (optional but recommended)
2. Label ("HOW IT WORKS") in uppercase label style
3. H2 headline in Bebas Neue
4. Supporting subtext in body style
5. Content (cards, image, feature list)
6. Single CTA at bottom (optional)
7. 96px padding top + bottom on desktop, 64px mobile

---

## 6. Motion & Animation System

### Principles
1. **Purpose-first:** Every animation must serve the user — reveal content, guide attention, confirm action
2. **GPU-only:** Only animate `transform` and `opacity`. Never animate `width`, `height`, `margin`, `padding`
3. **Respect preferences:** Check `prefers-reduced-motion` — if true, set duration to 0.01ms
4. **Consistent easing:** Use the defined easing curves below — do not invent new ones

### Easing Curves
```javascript
const ease = {
  in:     'power2.in',      // accelerating — for exit animations
  out:    'power2.out',     // decelerating — for entrance animations (most common)
  inOut:  'power2.inOut',   // both — for transforms between states
  bounce: 'back.out(1.4)',  // subtle overshoot — for playful UI moments
  expo:   'expo.out',       // dramatic decel — for hero reveals only
}
```

### Duration Scale
```javascript
const duration = {
  instant: 0.1,   // hover state changes, button presses
  fast:    0.2,   // icon changes, small state transitions
  normal:  0.35,  // most UI transitions
  medium:  0.5,   // modal enter, drawer open
  slow:    0.7,   // scroll reveal animations
  hero:    1.2,   // hero section entrance (first load only)
}
```

### Standard Animations

#### Scroll Reveal (all non-hero content)
```javascript
gsap.from(element, {
  opacity: 0,
  y: 32,
  duration: 0.7,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: element,
    start: 'top 88%',
    toggleActions: 'play none none none', // play once
  }
})
```

#### Stagger for card grids
```javascript
gsap.from(cards, {
  opacity: 0,
  y: 24,
  duration: 0.6,
  ease: 'power2.out',
  stagger: 0.1,
  scrollTrigger: { trigger: container, start: 'top 80%' }
})
```

#### Hero Text Reveal (first load only)
```javascript
// Split H1 into characters using SplitText
gsap.from(chars, {
  opacity: 0,
  y: 40,
  duration: 0.6,
  ease: 'expo.out',
  stagger: 0.025,
  delay: 0.4,
})
```

#### Counter Animations
```javascript
gsap.from({ val: 0 }, {
  val: targetNumber,
  duration: 2,
  ease: 'power2.out',
  onUpdate: function() { element.textContent = Math.round(this.targets()[0].val).toLocaleString() },
  scrollTrigger: { trigger: element, start: 'top 75%' }
})
```

#### Page Transitions
```javascript
// Exit: current page
gsap.to(pageContent, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' })
// Enter: new page
gsap.from(pageContent, { opacity: 0, y: 20, duration: 0.4, ease: 'power2.out', delay: 0.1 })
```

### Smooth Scroll (Lenis)
```javascript
const lenis = new Lenis({
  lerp: 0.1,
  duration: 1.2,
  smoothWheel: true,
  smoothTouch: false,   // Disable on touch — native scroll feels better
})
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

---

## 7. 3D Design Language

### Scene Philosophy
The 3D tyre is the hero asset of the product. It should feel like a piece of precision engineering displayed in a showroom — dramatically lit, slowly rotating, inviting inspection.

### Tyre Geometry Specifications
```javascript
// Outer tyre ring
const outerTyre = new THREE.TorusGeometry(
  1.2,    // major radius (tyre outer diameter)
  0.45,   // minor radius (tyre cross-section)
  64,     // tubular segments (smooth silhouette)
  128     // radial segments (smooth circumference)
)

// Wheel rim
const rim = new THREE.CylinderGeometry(
  0.82,   // top radius
  0.82,   // bottom radius
  0.36,   // height (tyre width)
  64      // radial segments
)

// Rim spokes (5 spokes at 72deg intervals)
const spoke = new THREE.BoxGeometry(0.055, 0.72, 0.30)
```

### Material Specifications
```javascript
// Rubber tyre
const tyreMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#1A1A1A'),
  roughness: 0.88,
  metalness: 0.02,
  // normalMap: tyreNormalMap, // tread detail
  // normalScale: new THREE.Vector2(0.8, 0.8),
})

// Chrome rim
const rimMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#D4D4D4'),
  roughness: 0.06,
  metalness: 0.97,
  envMapIntensity: 2.2,
})

// Tyre sidewall (slightly different from tread)
const sidewallMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#141414'),
  roughness: 0.92,
  metalness: 0.0,
})
```

### Lighting Setup
```javascript
// 1. Ambient — very subtle base illumination
<ambientLight color="#1A2A3A" intensity={0.4} />

// 2. Key light — cool blue from upper right (main illumination)
<directionalLight
  color="#7AB8E0"
  intensity={1.6}
  position={[5, 8, 3]}
  castShadow
/>

// 3. Brand fill — sky blue from left (brand identity in lighting)
<pointLight
  color="#38BDF8"
  intensity={0.9}
  position={[-3.5, 2, 3]}
  distance={12}
/>

// 4. Warm ground bounce — subtle amber from below
<rectAreaLight
  color="#FFAA44"
  intensity={0.5}
  position={[0, -2.5, 1]}
  width={4}
  height={2}
/>

// 5. Environment for rim reflections
<Environment preset="city" />
```

### Camera
```javascript
// PerspectiveCamera
fov: 45
position: [0, 0.4, 4.5]
near: 0.1
far: 100

// Post-processing (optional, disable on low-end devices)
// SSAO (subtle ambient occlusion on tyre/rim junction)
// Bloom (very subtle on rim highlights — intensity 0.15)
```

### Animation Behaviour
```javascript
useFrame((state, delta) => {
  if (!tyreRef.current) return

  // Continuous rotation
  tyreRef.current.rotation.y += delta * 0.35  // ~2rpm

  // Mouse parallax
  const mouseX = state.mouse.x * 0.08
  const mouseY = state.mouse.y * 0.05
  tyreRef.current.rotation.x = THREE.MathUtils.lerp(
    tyreRef.current.rotation.x,
    mouseY,
    0.04
  )
  // Note: Don't override Y rotation with mouse — it's auto-rotating
})
```

### Performance Targets
| Device class | Target FPS | Strategy |
|---|---|---|
| High-end (iPhone 15+, M-chip Mac) | 60fps | Full quality |
| Mid-range (iPhone 12, modern Android) | 30fps | Reduce segments, no post-processing |
| Low-end (< 4 cores, < 4GB RAM) | Skip 3D | Static image fallback |

Detection: `if (navigator.hardwareConcurrency < 4 || navigator.deviceMemory < 4) { showFallback() }`

---

## 8. Responsive Behaviour

### Breakpoints
```javascript
const breakpoints = {
  mobile: '0px',      // < 640px — single column, bottom nav
  tablet: '640px',    // 640–1024px — two columns emerging
  desktop: '1024px',  // 1024–1280px — full layout
  wide: '1280px',     // 1280px+ — max-width container kicks in
}
```

### Key Responsive Rules
- **Hero 3D scene:** Full screen on desktop. Reduced size (60vw) on tablet. Static image on mobile.
- **Booking flow:** Full-width single column on mobile. Max 640px centered on desktop.
- **Tyre results:** 1 card on mobile, 2 on tablet, 3 on desktop.
- **Admin dashboard:** Bottom nav on mobile, sidebar on desktop.
- **Typography:** All clamp() values defined in type scale above.
- **Touch targets:** Minimum 44×44px on all interactive elements.

---

## 9. Accessibility Requirements

- WCAG 2.2 AA compliance minimum
- Colour contrast: 4.5:1 for body text, 3:1 for large text (18px+ or 14px+ bold)
- Focus indicators: 2px solid var(--brand), outline-offset: 3px (never remove, only restyle)
- Screen reader labels: all icon buttons have aria-label, form inputs have associated labels
- Live regions: booking status updates, error messages use aria-live="polite"
- Reduced motion: GSAP checks `window.matchMedia('(prefers-reduced-motion: reduce)')`
- Skip navigation: visible on focus, top of every page
- Alt text: all meaningful images have descriptive alt, decorative images have alt=""

---

## 10. Do's and Don'ts

### DO
- Use full-bleed sections that extend edge to edge (no max-width on background)
- Stack Bebas Neue headlines with tight leading (0.88-0.95)
- Use the M-stripe divider between major sections
- Apply the 3D card tilt effect on hover for feature cards
- Show 1 primary CTA per viewport section
- Use box-shadow with rgba blue for hover glows on cards (never solid shadows)
- Animate scroll reveals from y: 32px with opacity 0→1
- Show tyre photography full-bleed, always with an overlay for text contrast

### DON'T
- Don't use border-radius > 8px on any component (exception: small icon buttons)
- Don't add drop shadows — use border + glow (box-shadow with rgba brand)
- Don't use gradients except for photography overlays
- Don't animate layout properties (no width/height/margin transitions)
- Don't use more than 2 typeface families on any page
- Don't float 3D scenes on white or light backgrounds
- Don't use brand blue on body text (only CTAs and key highlights)
- Don't animate before the user has scrolled (use ScrollTrigger, not auto-play)
- Don't show 3D on mobile — use the image fallback

---

## 11. Agent Prompt Guide

### Quick Reference
```
Colors:
  bg: #0D0D0D (surface) or #000000 (hero)
  accent: #38BDF8 (sky blue — ONE per section)
  text: #F5F5F5 (primary) #A3A3A3 (secondary)
  success: #22C55E | warning: #F59E0B | danger: #EF4444

Fonts:
  headlines: 'Bebas Neue' UPPERCASE, tight leading 0.88-0.95
  body: 'Inter' weight 400-700
  mono: 'JetBrains Mono' for codes/refs

Buttons:
  primary: #38BDF8 bg, #0D0D0D text, 0px radius, uppercase, 700 weight
  secondary: transparent, border #383838, hover border #38BDF8
  ghost: rgba(255,255,255,0.04) bg

Cards:
  bg: #141414, border: 1px solid #2A2A2A
  hover: border rgba(56,189,248,0.35), glow shadow

Spacing:
  section: 96px top/bottom desktop, 64px mobile
  cards: 24px padding
  between fields: 24px gap

Animations:
  scroll reveal: opacity 0→1, y 32→0, duration 0.7s, ease power2.out
  hover: 150-200ms transitions, GPU only
  smooth scroll: Lenis lerp 0.1
```

### Ready-to-use prompt suffix for any agent
```
"Follow DESIGN.md strictly:
- Dark automotive aesthetic: bg #0D0D0D, void #000000
- Bebas Neue UPPERCASE for all headings, Inter for body
- Sky blue #38BDF8 as the ONLY accent — one per section max
- 0px border-radius on buttons, 8px max on cards
- Cards: #141414 bg, 1px solid #2A2A2A border, blue glow on hover
- GSAP scroll reveals: opacity 0→1, y 32→0, power2.out
- Lenis smooth scroll
- No gradients except photography overlays
- Status colours: success #22C55E, warning #F59E0B, danger #EF4444
- Touch targets minimum 44px
- Font sizes minimum 16px on inputs"
```
