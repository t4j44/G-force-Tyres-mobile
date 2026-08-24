# Final Frontend and UX Audit

## Founder summary

The public site is a credible visual prototype, not a usable production
commerce journey. Users can see and navigate the intended flow, but with mock
mode off they cannot complete search, select real stock, book, pay or manage a
booking. Do not publish unfinished routes as operational services.

## Journey evidence

| Area | Evidence | Status | Risk | Required action |
|---|---|---|---|---|
| Home and hero | src/app/page.tsx:64-118 | LOCAL_VERIFIED | Build only; visual/frame pacing not device tested | Preserve accepted design; Gate 5 browser/device QA |
| Logo home navigation | src/components/layout/Header.tsx:19-35 and 53-60 | LOCAL_VERIFIED | Earlier pointer issue is structurally fixed; interactive cross-browser proof absent | E2E click from all routes |
| Finder proximity | src/app/page.tsx:82-90 | LOCAL_VERIFIED | Finder is above fold by design, but real APIs disabled | Connect Gate 1 |
| Postcode state | src/components/booking/TyreFinder.tsx:39-61 | PARTIAL | Error/retry UI exists; endpoint is mock-only | Real truthful states |
| VRM/manual fallback | TyreFinder.tsx:67-85 and 304-348 | PARTIAL | Manual UI works; live fitment does not | Authorized fitment test and sidewall confirmation |
| Catalogue | src/app/tyres/page.tsx:25-37 and 98-111 | MOCK_ONLY | Empty real source; Mid-Range naming diverges from Standard | Gate 1 real query and locked terminology |
| Booking | src/app/booking/page.tsx:120-132 | MOCK_ONLY | Non-mock mode shows a pending state | Gate 2 persistence |
| Payment | src/app/booking/pay/page.tsx:72-80 | MOCK_ONLY | Correctly refuses real card entry; mock form must not count | Gate 3 Checkout |
| Confirmation | src/app/confirmation/[ref]/page.tsx:23-39 | MISSING | Real query filters booking_ref, but V3 defines reference; it cannot load a V3 booking | Correct mapper/query, then token/reference privacy and paid-state tests |
| Manage booking | src/app/manage/[token]/page.tsx:39-73, 258-270 | MOCK_ONLY | Preview actions can be mistaken for operations | Real scoped APIs; label/remove preview in production |
| Legal pages | privacy/terms/cancellation pages | BLOCKED_OWNER_DECISION | Explicitly draft; not launch content | Qualified owner/legal approval |

## Responsive and motion

- src/app/globals.css:949-965 disables nonessential animation and smooth scroll
  for reduced-motion users. Status: LOCAL_VERIFIED. Evidence is source-level.
- Header mobile controls are 44 px and have accessible names at
  Header.tsx:81-91 and 109-114. Status: LOCAL_VERIFIED. Evidence is source-level.
- The drawer locks body scroll and closes on Escape at Header.tsx:37-46:
  LOCAL_VERIFIED. It has no demonstrated focus trap or focus restoration:
  PARTIAL.
- Active hero motion uses one requestAnimationFrame, pointer-only parallax and
  an IntersectionObserver at HeroTyreMotion.tsx:28-69. Status: LOCAL_VERIFIED.
  Evidence is source-level.
- Exact 320/390/768/1440 overflow, touch, keyboard and screen-reader behavior:
  NOT LIVE VERIFIED.

## Loading, error and empty states

The finder has loading/error states and aria-live at TyreFinder.tsx:107. The
catalogue has a no-results presentation, but the real catalogue path never
loads. Admin production screens use AdminDataPending rather than misleading
data. These are honest fail-closed states, not functional completion.

## Navigation and unfinished destinations

The desktop Staff link exposes /admin/bookings at Header.tsx:73-75; unauthenticated
users are server-redirected. Public Start booking points directly to /booking,
which is unusable with mock mode off. Until Gate 2, CTAs should route through
real search only or remain in a controlled preview deployment.

## Accessibility status

Status: PARTIAL.

Positive source evidence: html lang, skip link, main landmark
(layout.tsx:27-37), labelled inputs, aria-live, focus styles and reduced motion.
Missing evidence: automated axe/Playwright results, keyboard sequence, drawer
focus containment/restoration, contrast measurement, zoom/reflow, screen-reader
testing and WCAG 2.2 AA acceptance.

## Browser evidence limitation

The in-app browser could enumerate the existing localhost tabs, but the claimed
tab timed out during reload. No visual or interactive pass is claimed. Safe
shell HTTP evidence showed the existing development server is mock-enabled;
that environment is not production evidence. The optimized build is the
authoritative local frontend evidence for this audit.
