# G Force Tyres — Project Status and Recommended Next Work

Report date: 2026-08-24
Workspace: `E:\Taqi Project\gforce-tyres`

## Executive status

**The local frontend builds, the homepage has been reorganized around the tyre
finder, and one mock-data search route has been observed end to end. The product
is not ready to accept real customers or payments.**

The main risk is no longer whether a polished page can be rendered. The main risk
is that the live data, booking transaction, payment, email and operating claims
have not been proven against real services. Shipping the current local preview as
a public commerce site would create false confidence: it can demonstrate the
journey, but it cannot yet fulfil a real paid booking safely.

## Latest navigation and admin review

- The desktop header brand and mobile-drawer brand are now explicit home links.
  From another route they navigate to `/`; on the homepage they clear a section
  hash and return to the top, respecting the operating system's reduced-motion
  preference.
- Local server-rendered output confirms the accessible home link is present on
  `/` and `/admin/login`, both of which return `200`. Interactive pointer testing
  of the exact click was not automated in this pass.
- Anonymous `/admin` and `/admin/bookings` requests redirect to `/admin/login`.
  A deliberately invalid login and an anonymous slot mutation both return `401`.
- Admin operational pages remain development-only mock demonstrations. Their
  labels no longer call mock data “live,” and the pending state now says the
  authorization structure—not live operations—has been implemented.
- No workspace login credential exists. Remote Supabase users are unverified and
  passwords cannot be recovered from the repository. The safe setup and
  disposable-project acceptance procedure is in
  `docs/ADMIN_CONSOLE_AND_NEXT_STEPS_GUIDE.md`.

## How to read this report

- **Verified locally** means the result was observed in this workspace.
- **Implemented, not live-tested** means code or SQL exists but has not been
  exercised against the external service it depends on.
- **Estimate** means planning guidance, not a delivery promise.
- **Blocked** means an owner decision, business fact, credential or external test
  environment is required.

## Current product in plain English

A visitor can open the local website, see the tyre finder immediately, check a
development service-area postcode, identify a tyre size using a development
registration example or manual size entry, and reach compatible tyre options.
The experience is now built around the commercial task—finding tyres—rather than
making the user scroll past a large visual first.

The active homepage code no longer imports or continuously renders the former
WebGL tyre scene. It uses a responsive tyre image with layered CSS depth motion:
wheel rotation, depth orbit, light scan, aura, shadow and mouse-follow perspective
tilt. The implementation does not register touch pointer movement, pauses when
offscreen and contains a reduced-motion reset. Those are code-level safeguards;
touch behaviour and frame pacing still need browser/device testing.

## Implemented and checked locally

### 1. Recovery point and audit trail — verified locally

- Initialized the repository and preserved the pre-hardening state in baseline
  commit `e13bbaed888dd96fe657572787bf685d706277fa`.
- Kept the hardening and UI work uncommitted so it remains directly reviewable.
- Recorded implementation authority, mock-data boundaries, claims risks,
  performance evidence and verification evidence under `docs/`.
- Added ignore rules for local environment files, dependencies and build output.
  The built browser JavaScript was scanned for the service-role variable name with
  zero matches; full repository-history secret scanning is not claimed.

### 2. Configuration safeguards — checked locally

- Added explicit `APP_ENV` and `ENABLE_MOCK_DATA` controls.
- Production configuration rejects mock mode instead of silently serving demo
  customer, catalogue, booking or payment data.
- Added Zod validation for public and server-only environment variables.
- Production startup fails clearly when mandatory configuration is missing.
- Added security headers and a structural security-check script.
- Replaced the example environment file with an annotated inventory that contains
  no working credentials.

### 3. Supabase data foundation — implemented, not live-tested

- Added 12 ordered V3 migrations defining 19 required tables across admins,
  customers, service zones, catalogue, inventory, availability, holds, bookings,
  payments, webhook idempotency, fitters, settings, audit logs and encrypted VRM
  cache data.
- Money is modelled as integer pence rather than floating-point values.
- Booking lines store price snapshots; webhook provider/event identity is unique.
- Added indexes and Row Level Security definitions intended to deny anonymous
  access to private customer, booking, payment, audit, settings, hold and VRM data.
- The SQL has not been applied to an authorized disposable Supabase project, so
  migration order and live RLS behaviour are not yet accepted.

### 4. Admin authentication and authorization — implemented; partial local runtime check

- Added separate browser-safe, SSR and server-only Supabase clients.
- Added cookie-backed session refresh middleware.
- Replaced the demo admin entry with Supabase password authentication.
- Added active owner/admin role checks before protected admin pages render.
- Added reusable authorization guards to current admin mutation routes.
- Added logout and server-side audit-log infrastructure.
- Verified locally that unauthenticated admin access redirects to login and an
  unauthenticated admin mutation returns `401`.
- Wrong-password, normal-user, inactive-admin and active-owner scenarios remain
  blocked on real Supabase test identities.

### 5. Public claims and mock-data controls — verified in code

- Audited unverified claims including phone number, hours, insurance, same-day
  service, exact coverage, guarantees, deposit/refund rules and legal identity.
- Removed or softened unsafe claims from the active homepage, footer, tyre,
  booking, payment, cancellation, confirmation, terms and manage-booking views.
- Kept development mock data behind an explicit non-production flag.
- Real production search and commerce deliberately fail closed instead of falling
  back to invented data.

### 6. Homepage, finder and navigation rebuild — verified in code and build

- Reorganized the homepage so the tyre-search journey begins in the first section.
- Moved the postcode/vehicle-size finder into the first view.
- Added a direct manual tyre-size route alongside registration lookup.
- Added a mobile header call-to-action that jumps to the finder.
- Replaced external Google font loading with system-font stacks.
- Removed Lenis smooth scrolling and GSAP/ScrollTrigger reveal code and packages.
- Restored native browser scrolling and added IntersectionObserver-based CSS
  section reveals.
- Added `content-visibility` to defer below-the-fold rendering work.
- Removed header scroll-state rendering and backdrop blur.
- Added an optimized transparent hero tyre asset and responsive image sizing.

### 7. Latest hero change — verified in code and build

- Removed the line `Mobile tyre fitting · London` and its status-dot animation.
- Added a separate `HeroTyreMotion` component with:
  - continuous 22-second tyre rotation and 7.5-second CSS 3D depth orbit;
  - animated orbital markers, scan light, glint, aura and ground shadow;
  - perspective tilt capped at approximately 8° vertically and 11° horizontally;
  - `requestAnimationFrame` scheduling;
  - direct CSS-variable updates rather than React re-renders;
  - mouse-only tracking, designed to avoid handling touch scrolling; and
  - reduced-motion detection plus offscreen animation pausing in code.
- Kept the legacy Three.js source inactive. No WebGL canvas or continuous render
  loop is imported by the active homepage.

### 8. Development booking-discovery journey — verified locally

With development mock mode explicitly enabled, the observed preview route was:

`E14 8PX` → `AB21 ABC` → `225/45 R18` → compatible tyre-options page.

This demonstrates UI and route continuity only. It does not prove a OneAuto
response, live stock, a real fitting slot, a persistent booking or payment.

## Verification snapshot

| Check | Evidence type | Observed result | Meaning |
|---|---|---|---|
| `npm run typecheck` | Build/static check | Pass | TypeScript accepts the current code. |
| `npm run lint` | Build/static check | Exit 0; 0 errors, 44 warnings | No lint blocker; existing cleanup debt remains. |
| `npm run build` | Build/static check | Pass; 26 generated routes/pages | Optimized Next.js production compilation succeeds. |
| Homepage build output | Build/static check | 124 kB first-load JS | A 1 kB rounded increase from the earlier 123 kB CSS-motion version. |
| Legacy deferred WebGL path | Build/static check | Approximately 898.6 KiB raw modules absent from the active homepage path | This is raw source/module size, not measured transferred bytes or a load-time saving. |
| `npm run test:security` | Build/static check | Pass | Structural rules pass; this is not live security acceptance. |
| `git diff --check` | Build/static check | Pass | No whitespace-error blocker. |
| Homepage and finder | Observed runtime | `200`; removed eyebrow absent; finder and hero image present | Fresh local dev-server response on 2026-08-24. |
| Postcode and VRM route | Observed runtime | `E14 8PX` covered; `AB21 ABC` returned front `225/45 R18` mock profile | Confirms explicit development data only. |
| Tyre results route | Observed runtime | `200`; matching size and option cards present | Confirms local route continuity only. |
| Hero source image | Build/static check | 1,579,359 bytes | Source file; Next.js serves responsive derivatives. |
| Local optimized 640 px image request | Observed runtime | `119,501` bytes, HTTP `200`, image/png on 2026-08-24 | Local Next.js delivery observation, not a CDN guarantee. |
| Lighthouse / real-user Core Web Vitals | Not tested | Not measured | No performance score is claimed. |
| Real-device visual and frame-pacing pass | Not tested | Not run | Pixel perfection and device smoothness are not yet proven. |
| Brand home link | Source/build/runtime output | Desktop and mobile-drawer links target `/`; `/` and `/admin/login` render the accessible home link | Route/link structure is verified; exact pointer click remains an interactive QA item. |
| Admin wrong-identity request | Observed runtime | Generic `401` | Confirms the configured Auth path denies a deliberately invalid identity; it does not prove a valid owner flow. |

## What is not complete

### Product and business blockers

- Exact launch postcodes and coverage rules are not approved.
- Real company/legal name, owned phone/email/address and operating hours are not
  confirmed.
- Insurance, roadside capability, same-day policy, guarantees, callout fees,
  deposit amount, cancellation window and refund wording lack approved evidence.
- Real tyre catalogue, supplier feed, stock ownership and final fitted-price rules
  are not connected.
- The commercial demand and operational process should be validated manually
  before automating every exception.

### Technical blockers

- V3 migrations, authentication roles and RLS have not passed live Supabase tests.
- Real postcode-zone data and Turnstile checks are not accepted end to end.
- OneAuto VRM lookup has not been validated against a captured real response.
- Atomic slot and stock holds are not implemented and transaction-tested.
- Stripe PaymentIntent creation, verified idempotent webhooks, booking confirmation,
  stock decrement and refunds are not complete.
- Resend transactional email is not live.
- Secure customer booking management and rescheduling are not complete.
- No Playwright/Vitest regression suite covers the customer journey.
- No real-device performance, accessibility or cross-browser test matrix has run.
- The active working tree has not been committed after owner review.

## Recommended next sequence

The tempting next step is more visual work. That is not the highest-risk item.
One short visual acceptance pass is sensible. In parallel, the owner should
supply the business truth pack and authorized test-service access. The next
engineering gate should be proving the database/security foundation against a
disposable Supabase project. Building real payments on untested schema and
authorization would make later fixes more expensive.

| Order | Outcome | Work | Complexity | Estimate* | Exit gate |
|---:|---|---|---|---|---|
| 1 | Visual and interaction acceptance | Developer captures 390 px mobile and 1440 px desktop screenshots for owner review, then interactively tests keyboard order and the OS reduced-motion setting. | Low–medium | 0.5–1.5 days | No horizontal overflow; title and finder start are visible in the first view; every control is keyboard reachable in logical order; reduced motion removes non-essential motion; owner records acceptance or named defects. |
| 2 | Business truth and test access, in parallel | Owner supplies coverage, contact/legal facts, services, hours, prices, policies, supplier authority and authorized test environments. | Owner-led | 1–3 days if information exists | Every active public claim has an owner/evidence date or is removed; named test operators have access. |
| 3 | Live Phase 1 acceptance | Apply migrations to disposable Supabase; create normal/inactive/admin identities; run migration, Auth and RLS tests. | Medium | 1–2 days | Every case in `ADMIN_SECURITY_TESTS.md` passes and results are recorded. |
| 4 | Manual concierge validation | Route 10–20 genuine enquiries through an owned phone/inbox or clearly non-transactional intake form—not the mock-data website route—before automating exceptions. | Owner-led + low engineering | 2–5 operating days | Requested areas/vehicles, sourcing mismatches and operational exceptions are recorded without card collection or demo-data promises. |
| 5 | Phase 2 search | Connect live service zones, postcode validation, Turnstile and OneAuto; cache and normalize real responses. | Medium–high | 3–6 days | Real in-area/out-of-area/invalid VRM/manual-size flows pass without demo fallback. |
| 6 | Phase 3 booking and money | Atomic holds, slots, stock, Stripe, verified idempotent webhooks, booking records, email and customer management. | High | 8–15 days | Duplicate/tampered/expired/failed/success/refund cases all pass. |
| 7 | Production hardening | Automated end-to-end tests, accessibility, real Android/iPhone checks, Lighthouse, monitoring, backups and staging rehearsal. | High | 3–7 days | Customer money-path tests pass in Chromium, WebKit and Firefox; no critical accessibility issue; no overflow at 320/390/768/1440 px; mobile lab targets are LCP ≤2.5 s, CLS ≤0.1 and TBT ≤200 ms; alert delivery, backup restore and full staging rehearsal are demonstrated. After sufficient live traffic, target p75 INP ≤200 ms and review any miss before expanding launch. |
| 8 | Controlled launch | Start with a limited coverage area and a pre-agreed daily booking cap. | Medium | Operational decision | First live bookings reconcile across payment, stock, email and dispatch; incident owner and rollback rule are named. |

\*Estimates assume one experienced full-stack developer, prompt owner decisions,
and working third-party test environments. Engineering stages 1, 3, 5, 6 and 7
total approximately **15.5–31.5 working days** if performed sequentially. The
owner-led truth/concierge stages add roughly 3–8 operating days but can overlap;
controlled-launch observation is excluded. Plan on approximately **3–7 focused
engineering weeks**, with low confidence until real API responses and catalogue
quality are known. This is not a fixed calendar promise.

## Cheapest validation before more automation

Before completing every Phase 3 feature, process a small controlled set of real
enquiries manually—without using the current mock-data route or taking payment
through unfinished code. Use an owned, verified telephone/inbox or a clearly
non-transactional enquiry form. Store the minimum necessary personal data in an
owner-approved access-controlled CRM or temporary register with a defined
deletion date. Record:

- which requested postcodes are inside/outside the intended launch area;
- which vehicles or registrations require manual fitment help;
- whether proposed tyre options match what can actually be sourced;
- how often customers need help choosing a tyre; and
- which booking/cancellation questions and payment expectations recur.

Ten to twenty genuine enquiries will reveal more about the necessary workflow
than adding speculative admin features now. Do not collect card details, promise
unapproved availability, or paste personal data into development logs.

After Phase 2 connects real coverage, catalogue and vehicle data, run a separate
10–20-person staging usability test to measure completion and abandonment across
postcode → vehicle/size → tyre selection. Do not use the mock funnel as demand or
conversion evidence.

## Inputs needed from the owner

1. Authorized disposable Supabase test-environment access or execution by an
   authorized operator; do not place secrets in this report or chat messages.
2. Test identities for normal user, inactive admin and active owner/admin roles.
3. Owned company name, phone, email, address, hours and service modes.
4. Exact initial postcode coverage and callout-fee rules.
5. Tyre catalogue/stock source and approved fitted-pricing formula.
6. Deposit, cancellation, refund and reschedule policy approved for implementation.
7. Authorized test-environment access for OneAuto, Stripe, Resend and Turnstile;
   do not place secrets in this report or chat messages.
8. Acceptance or named defect notes for developer-captured 390 px mobile and
   1440 px desktop screenshots.
9. Target pilot date, launch budget and maximum initial daily booking volume.
10. Named approver for public policies and named operational owners for enquiries,
    refunds, fitting dispatch, incidents and personal-data handling.
11. Supplier authority confirming who may access catalogue, price and stock data.

## Recommended immediate decision

Refresh the local homepage and judge the new tyre movement at mobile and desktop
sizes. If the visual direction is accepted, freeze broad homepage redesign for
one cycle and execute the disposable Supabase acceptance tests next. Continue
small UI corrections in parallel only when they are tied to a concrete screenshot
or failed usability check.
