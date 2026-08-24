# Final Architecture and Runtime Map

## Runtime topology

Browser
→ Next.js App Router pages/components
→ Next.js route handlers and server components
→ Supabase Auth/PostgreSQL
→ Postcodes.io / Turnstile / OneAuto
→ Stripe
→ Resend
→ Cloudflare/OpenNext

Status: PARTIAL. The browser/Next.js shell is local-build verified. Every arrow
after Next.js is either disabled, implemented but not live verified, or missing.

## Framework and boundaries

| Layer | Source | Evidence | Status | Risk / action |
|---|---|---|---|---|
| Root UI | src/app/layout.tsx:6-40 | metadata, skip link, Header, main, Footer | LOCAL_VERIFIED | Keep visual design; add route metadata/SEO assets later |
| Middleware | src/middleware.ts:5-33 | refreshes Supabase session when public env exists; otherwise passes through | IMPLEMENTED_NOT_LIVE_VERIFIED | Live refresh/revocation is Gate 0 |
| Browser Supabase | src/lib/supabase/client.ts:1-18 | public URL/anon key only | IMPLEMENTED_NOT_LIVE_VERIFIED | Live RLS must constrain it |
| SSR Supabase | src/lib/supabase/server.ts:7-31 | cookie-backed @supabase/ssr client | IMPLEMENTED_NOT_LIVE_VERIFIED | Live Auth cookie tests required |
| Service role | src/lib/supabase/admin.ts:1-20 | server-only client using SUPABASE_SERVICE_ROLE_KEY | IMPLEMENTED_NOT_LIVE_VERIFIED | Never import into client modules |
| Mock store | src/lib/mockData.ts:544-832 | LocalBookingStore and fictional customer/payment/stock/slots | MOCK_ONLY | Eliminate from production bundles and real branches |
| Runtime validation | src/instrumentation.ts:1-6; src/lib/env.server.ts:51-56 | production validates public/server env and mock safety | LOCAL_VERIFIED | Current production start fails due missing config |
| Background work | src/app/api/stripe/webhook/route.ts:65-66 | fire-and-forget email Promise | PARTIAL | Use durable queue/waitUntil/job table; add retries |
| Scheduled jobs | repository search for cron/route/scheduler | none in active application | MISSING | Expired holds, reminders and cleanup need scheduled ownership |

## Route inventory

### Public pages

/, /tyres, /booking, /booking/pay, /confirmation/[ref], /manage/[token],
/cancellation, /privacy, /terms.

The build generated all routes. /tyres and both token/reference pages are dynamic.
The production data journeys behind them are not accepted.

### Admin pages

/admin, /admin/login, /admin/bookings, /admin/inventory, /admin/slots.

/admin/zones, /admin/fitters and /admin/settings are MISSING. Protected routes
are wrapped by src/app/admin/(protected)/layout.tsx:1-9, which calls
requireAdminPage.

### API routes

| Route | Real behavior | Status |
|---|---|---|
| POST /api/admin/login | Supabase password Auth plus active admin profile | IMPLEMENTED_NOT_LIVE_VERIFIED |
| POST /api/admin/logout | Supabase signOut | IMPLEMENTED_NOT_LIVE_VERIFIED |
| GET /api/admin/acceptance-target | guarded disposable-project attestation | LOCAL_VERIFIED |
| POST /api/admin/slots/generate | mock mutation; real returns 501 | MOCK_ONLY |
| POST /api/admin/slots/update | mock mutation; real returns 501 | MOCK_ONLY |
| POST /api/postcode/check | real returns 501 | MOCK_ONLY |
| POST /api/vrm/lookup | real returns 501 | MOCK_ONLY |
| GET /api/slots | real returns 503 | MOCK_ONLY |
| POST /api/holds/create, release | real returns 501 | MOCK_ONLY |
| POST /api/checkout/create | real returns 501 | MOCK_ONLY |
| POST /api/checkout/confirm-mock | development confirmation only | MOCK_ONLY |
| POST /api/stripe/webhook | signature verification exists; DB contract is absent | PARTIAL |

## Actual path trace A-N

| Path | Current code path | Status | Production action |
|---|---|---|---|
| A Postcode → vehicle → results | TyreFinder → postcode/check → vrm/lookup → /tyres. Non-mock APIs return 501. Manual size link works as UI navigation. | MOCK_ONLY | Gate 1 real zones/Postcodes/Turnstile/OneAuto/catalogue |
| B Tyre selection → booking | /tyres reads LocalBookingStore only; /booking renders pending when mock off | MOCK_ONLY | Query tyre_products + inventory server-side |
| C Slot selection → hold | /api/slots and /api/holds are mock-only; code names nonexistent RPC/columns | MOCK_ONLY | Gate 2 atomic SQL |
| D Checkout → Stripe | /api/checkout/create is disabled; mock branch creates PaymentIntent or fallback secret | MOCK_ONLY | Gate 3 Stripe Checkout |
| E Webhook → confirmation | signature check then nonexistent confirm_booking_paid RPC | PARTIAL | Atomic idempotent webhook transaction |
| F Inventory reservation | inventory_holds table exists; no runnable reservation/decrement operation | MISSING | Lock rows and reserve/decrement transactionally |
| G Confirmation email | Resend template exists; no live send/durable retry | IMPLEMENTED_NOT_LIVE_VERIFIED | Verified domain + durable delivery tests |
| H Manage booking | /manage/[token] reads/mutates LocalBookingStore only | MOCK_ONLY | Token-scoped server endpoints and expiry/revocation |
| I Admin booking operations | UI reads/mutates LocalBookingStore | MOCK_ONLY | Persistent APIs + audit logs |
| J Admin inventory | UI reads/mutates LocalBookingStore | MOCK_ONLY | Real CRUD/import and concurrency rules |
| K Admin slots | UI and APIs are mock-only outside auth shell | MOCK_ONLY | Persistent availability/slot operations |
| L Admin zones | no route | MISSING | Build owner zone/fee management |
| M Admin fitters | no route | MISSING | Build fitter management/assignment |
| N Refund/cancel/reschedule | preview buttons only; webhook calls absent refund RPC | MISSING | Gate 3 transactional policy and Stripe refund |

## 3D and animation runtime

The active hero is src/app/page.tsx:93-106 using a Next/Image wrapped by
HeroTyreMotion. src/components/3d/TyreScene.tsx and TyreSceneClient.tsx are not
imported into any active page and are DEAD_OR_UNUSED. The active hero motion
honours reduced motion and visibility via
src/components/animations/HeroTyreMotion.tsx:28-48.
