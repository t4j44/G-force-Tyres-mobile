# Final Performance, Accessibility and SEO Audit

## Performance evidence

Fresh optimized build: LOCAL_VERIFIED.

| Route/build fact | Result |
|---|---|
| Generated pages/routes | 26 |
| Shared first-load JS | 102 kB |
| Homepage | 10.5 kB route, 124 kB first-load |
| Booking | 6.74 kB route, 124 kB first-load |
| Admin bookings/inventory/slots | 122-123 kB first-load |
| Middleware | 119 kB |
| Compile | 13.6 s in this audit |
| Lint in build | 44 warnings, 0 errors |

These are build sizes, not Core Web Vitals. No LCP, INP or CLS measurement is
claimed.

## Performance findings

- Active hero uses Next/Image with explicit 1254x1254 dimensions, priority and
  responsive sizes at app/page.tsx:97-105: LOCAL_VERIFIED.
- Hero pointer motion is one rAF, offscreen-aware and reduced-motion-aware:
  HeroTyreMotion.tsx:28-69.
- ScrollReveal uses IntersectionObserver and compositor-friendly transitions:
  ScrollReveal.tsx:19-48.
- content-visibility is used at globals.css:339.
- The 23 kB source WebGL TyreScene creates three large canvas textures and
  continuous useFrame loops, but is not imported by the active app:
  DEAD_OR_UNUSED. Three/Fiber/Drei remain dependencies without active route
  value.
- No custom font loader is present in layout; typography relies on CSS/system
  behavior.
- Browser chunks still include mock fixtures. Remove mock imports at the module
  boundary so production tree-shaking is provable.

Targets LCP <=2.5 s, INP <=200 ms and CLS <=0.1 remain NOT LIVE VERIFIED. Gate 5
needs throttled mobile Lighthouse plus p75 real-user monitoring after controlled
traffic.

## Accessibility

Positive code evidence:

- en-GB language, skip link and main landmark at layout.tsx:27-37;
- named mobile menu controls and 44 px targets in Header.tsx:81-114;
- focus-visible styles throughout;
- aria-live finder container at TyreFinder.tsx:107;
- reduced-motion CSS at globals.css:949-965;
- semantic labels on login and booking forms.

Gaps:

- no automated axe/Playwright accessibility suite;
- no keyboard order/focus restoration or drawer focus-trap proof;
- no contrast report;
- no zoom/reflow, touch target inventory or screen-reader pass;
- error association is not proven for every field;
- admin dialogs are custom fixed overlays without demonstrated dialog semantics
  or focus management.

WCAG 2.2 AA implementation status: PARTIAL.

Live accessibility acceptance status: BLOCKED_EXTERNAL.

## Technical SEO/local SEO

Root metadata and OpenGraph exist at layout.tsx:6-16. Missing:

- app/robots.ts or public robots.txt;
- sitemap;
- metadataBase/canonical URLs;
- per-route product/location metadata;
- OpenGraph image and Twitter cards;
- LocalBusiness, Product/Offer and Breadcrumb structured data;
- crawlable product detail routes;
- approved location/size landing pages;
- Search Console/Business Profile evidence.

Root robots index=true can flow to unfinished/admin/legal-preview routes. Add
noindex for admin, manage, confirmation and non-production/staging. There are no
fake/thin generated local pages now. Ranking cannot be assessed from code.

SEO status: PARTIAL. Do not generate location pages until zones and business
facts are owner-verified and content is genuinely useful.
