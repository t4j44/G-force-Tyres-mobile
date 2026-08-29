# Client Visual Refinement — 2026-08-26

Status: **IMPLEMENTED LOCALLY; OWNER VISUAL ACCEPTANCE PENDING.**

Branch: `visual/client-refinement`

## Implemented scope

- Replaced the active hero product image with a new transparent performance tyre
  cutout: `public/images/hero-tyre-v3.webp`.
- The new tyre follows the supplied visual reference: lower-profile sidewall,
  visible circumferential/shoulder tread, a five-spoke polished graphite wheel and
  restrained sky-blue rim lighting.
- Kept the lightweight production approach: responsive `next/image` plus the
  existing CSS/requestAnimationFrame motion layer. The inactive Three.js runtime
  was not added back to the homepage.
- Added the client-approved `#D1D5DB` light surface and supporting light-section
  tokens.
- Changed the How It Works section to a light-grey surface with white elevated
  cards while retaining the black hero, graphite journey/coverage areas and black
  closing CTA.
- Added a blue/white/black transition stripe between the dark and light surfaces.
- Added `--brand-on-light: #075985` for small accent text. The supplied sky blue
  remains the decorative brand accent, but its 1.45:1 contrast on light grey is
  insufficient for small text; the darker on-light blue measures approximately
  5.13:1.
- Updated `DESIGN.md` so future work does not revert the approved surface rhythm,
  accessible on-light colors or performance-gated hero approach.

## Asset evidence

- Generation mode: built-in image generation using the supplied brand image as a
  visual reference, not as an edit target.
- Final workspace asset: 1,254 × 1,254 WebP, alpha preserved, 334,636 bytes.
- No logo, brand text, vehicle, people or background is embedded in the product
  cutout.

## Verification

| Check | Result |
|---|---|
| TypeScript | PASS |
| ESLint | PASS with 0 errors and 44 existing warnings |
| Structural security suite | PASS |
| Optimized Next.js build | PASS; homepage first-load JS remains 124 kB |
| `git diff --check` | PASS |
| Responsive overflow | PASS at 320, 390, 430, 768, 1024 and 1440 px |
| Desktop visual inspection | PASS at 1440 × 1000 |
| Mobile visual inspection | PASS at 390 × 844 |
| Light-section text hierarchy | Primary `#0D0D0D`; secondary `#374151`; accessible small accent `#075985` |

## Not claimed

- Gate 0 has not passed. The live acceptance harness still stops before any
  mutation because the required process-local disposable Supabase target and
  attestation variables are absent.
- Production runtime boot remains blocked by placeholder external-service
  configuration. The optimized production compile itself passes.
- Owner visual approval, physical-device frame pacing, OS-level reduced-motion
  interaction and Lighthouse/Core Web Vitals remain acceptance items.

## Owner acceptance questions

1. Is the five-spoke wheel/tread direction close enough to the supplied logo and
   van reference to freeze the hero asset for this gate?
2. Is one light-grey homepage section enough contrast, or should a later product
   card section also adopt the same light surface after real catalogue data exists?

