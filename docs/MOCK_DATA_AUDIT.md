# Mock and Demo Data Audit

Audit date: 2026-08-23. Production policy: mock data is allowed only when
`ENABLE_MOCK_DATA=true` in a non-production environment. Production startup
rejects that configuration.

| File | Line or function | Purpose | Production risk | Migration plan |
|---|---|---|---|---|
| `src/lib/mockData.ts` | `MOCK_SETTINGS`, `MOCK_SERVICE_ZONES`, `MOCK_FITTERS`, `MOCK_TYRES` | Complete local demo dataset | Fictional prices, people, phone numbers, areas, stock and policy values could be mistaken for business data | Keep development-only; Phase 2 replaces zones/catalogue and Phase 3 replaces operations |
| `src/lib/mockData.ts` | `generateMockSlots`, `LocalBookingStore`, seeded `GF-842910` booking | In-memory booking engine | Resets per process, races across instances, and creates false confirmations | Keep development-only; Phase 3 uses transactional PostgreSQL holds/bookings |
| `src/app/booking/page.tsx` | `BookingWizard` | Demo catalogue, zones, slots and checkout form | Could collect customer data and imply availability without persistence | Now production-gated; Phase 2/3 replace each data source |
| `src/app/booking/pay/page.tsx` | `PaymentPageContent` | Simulated card form and payment confirmation | Highest risk: resembles a card capture without Stripe Elements | Now production-gated; remove when Stripe Checkout is implemented in Phase 3 |
| `src/app/api/checkout/confirm-mock/route.ts` | `POST` | Confirms an in-memory booking | Manual API calls could create a false paid state | Returns 404 unless explicit non-production mock mode; delete in Phase 3 |
| `src/app/api/checkout/create/route.ts` | `POST`, `demo_secret_*`, `pi_test_*`, `ch_test_*` | Creates in-memory checkout records | Fake payment IDs and fallback secrets can masquerade as commerce | Returns 501 outside mock mode; replace with persistent booking + Stripe Checkout in Phase 3 |
| `src/app/api/holds/create/route.ts` | `POST` local fallback | Simulated 15-minute slot hold | No cross-instance concurrency protection | Returns 501 outside mock mode; implement atomic slot and inventory holds in Phase 3 |
| `src/app/api/holds/release/route.ts` | `POST` local fallback | Releases simulated holds | Cannot reliably release shared production state | Returns 501 outside mock mode; Phase 3 database transaction |
| `src/app/api/slots/route.ts` | `GET`, hardcoded `remaining: 2` | Demo availability API | Advertises capacity not calculated from bookings/holds | Returns a truthful unavailable response outside mock mode; Phase 3 availability query |
| `src/app/tyres/page.tsx` | `localStore.getTyres/getAllTyres` | Demo catalogue | Fictional brands, stock, prices and EU ratings | Production shows no fake catalogue; Phase 2 reads V3 product/inventory tables |
| `src/app/confirmation/[ref]/page.tsx` | local booking fallback | Demo confirmation | Can display a fictional paid booking | Fallback now requires mock mode; Phase 3 secure persisted lookup |
| `src/app/manage/[token]/page.tsx` | local booking/fitter lookup and mutation | Demo customer portal | Guessable demo token, fictional fitter, no persistence or authorization | Production no longer loads local records; Phase 3 secure manage-token endpoints |
| `src/app/admin/(protected)/*` | local store admin tables | Demonstrates bookings, stock and slot UI | Authenticated owner could otherwise see and mutate fake operations | Production shows an explicit Phase 3 pending state; development mock mode remains available |
| `src/app/api/admin/slots/*` | demo slot mutations | Demonstrates admin slot tools | Formerly unauthenticated and partially wrote through to Supabase | Now independently requires active admin; persistent behavior returns 501 until Phase 3 |
| `src/lib/oneauto.ts` | sandbox dictionary and generic vehicle fallback | Demo VRM results | Any plausible registration could return a generic BMW fitment | Phase 2 route is production-disabled; remove generic fallback when OneAuto sandbox/live contract is verified |
| `src/lib/postcodes.ts` | `MOCK_SERVICE_ZONES` fallback | Demo coverage | Claims service in unconfirmed areas and may show fake callout fees | Phase 2 replaces with real `service_zones`; current production route is disabled |
| `src/lib/pricing.ts` | `MOCK_SETTINGS` and `localStore` fallback | Demo server pricing | Fictional fees/prices could reach checkout | Checkout is production-disabled; Phase 3 must use V3 DB snapshots and server pricing |
| `src/components/booking/TyreFinder.tsx` | hardcoded `customer@gforce.co.uk` | Satisfies an email field in demo VRM requests | Creates an invented customer identity and invalid lead attribution | Remove in Phase 2; collect/validate real consented email or change API contract |
| `supabase/seed.sql` | entire file | Legacy demo seed | Not aligned to V3 migration table names; unsafe for production | Do not run against V3 production; replace with an explicitly development-only V3 seed later |

## Production boundary

- `next.config.mjs` rejects mock mode when either `NODE_ENV` or `APP_ENV` is production.
- `src/instrumentation.ts` validates mandatory production configuration on server startup.
- Customer search, booking, mock payment, hold, confirmation, management and admin-demo paths either return an explicit unavailable response or render a truthful pending state when mock mode is off.
- Mock code remains in the repository for development demonstrations. It is not evidence that Phase 2 or Phase 3 is complete.
