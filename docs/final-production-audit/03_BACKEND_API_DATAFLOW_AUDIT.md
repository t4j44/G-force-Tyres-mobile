# Final Backend API and Dataflow Audit

## Summary

Status: PARTIAL. Validation and fail-closed route gates exist, but almost all
customer and operations APIs are development implementations. Several dormant
“real” branches do not match the V3 schema.

## API matrix

| Route / method | Validation/auth | Data source | Status | Exact issue |
|---|---|---|---|---|
| postcode/check POST | Zod only; no Turnstile or rate limiter | Postcodes helper + zones | MOCK_ONLY | route.ts:13-17 returns 501 when mock off |
| vrm/lookup POST | Zod, Turnstile, rate limit in mock branch | OneAuto helper | MOCK_ONLY | route.ts:27-31 returns 501 when mock off |
| slots GET | no auth | LocalBookingStore | MOCK_ONLY | route.ts:11-15 returns 503; dormant query uses slot_date/start_time not schema |
| holds/create POST | Zod | nonexistent create_slot_hold RPC or local store | MOCK_ONLY | route.ts:17-21 blocks real; RPC/schema mismatch at 44-52 |
| holds/release POST | Zod | delete or local store | MOCK_ONLY | slot_holds has token, not session_token; errors swallowed |
| checkout/create POST | Zod + rate | local store + PaymentIntent | MOCK_ONLY | route.ts:21-29 blocks real; no persistent transaction |
| confirm-mock POST | development confirmation | local store | MOCK_ONLY | must never be part of production |
| stripe/webhook POST | raw body signature | service role | PARTIAL | calls nonexistent RPCs/columns |
| admin/login POST | Supabase Auth/profile | SSR client | IMPLEMENTED_NOT_LIVE_VERIFIED | live role/session tests pending |
| admin/logout POST | Supabase signOut | SSR client | IMPLEMENTED_NOT_LIVE_VERIFIED | live revocation pending |
| admin slots POST | requireAdmin | local store | MOCK_ONLY | persistent branch returns 501 |

## Trust boundaries

- Client checkout input contains product IDs/quantities, not authoritative
  amounts: src/lib/pricing.ts:11-16. This is the correct intended boundary.
- calculatePrice is server-side, but queries nonexistent app_settings and
  tyre_inventory and falls back to mock values at pricing.ts:19-41 and 74-93.
  It therefore cannot be used for real money.
- Service-role clients are server-only through src/lib/supabase/admin.ts and
  src/lib/supabase.ts:1-29. Static browser scan found no private environment
  names or service-role strings.
- Current mock fixture strings are present in browser chunks; this is not a
  secret breach, but production artifact hygiene is incomplete.

## Contract divergence register

| Code contract | Migration contract | Evidence | Impact |
|---|---|---|---|
| service_zones.zone_name / callout_charge | name / callout_fee_pence | postcodes.ts:34-71 vs 004_service_zones.sql:1-8 | live zone mapping fails |
| booking_slots.slot_date/start_time/end_time | date/start_at/end_at | api/slots/route.ts:24-25 vs 006_availability.sql:12-22 | live availability query fails |
| slot_holds.session_token | token | holds routes vs 007_booking_resources.sql:1-6 | hold read/release fails |
| app_settings | business_settings | pricing.ts:23 vs 010_operations.sql:23-40 | pricing falls back |
| tyre_inventory | tyre_products + inventory | pricing.ts:78 vs 005_catalogue.sql:1-35 | product/stock pricing fails |
| bookings.stripe_payment_intent_id | payments.stripe_payment_intent_id | webhook route.ts:70-76 vs 009_payments.sql:1-11 | failed-payment update matches no rows/errors |
| bookings.booking_ref | bookings.reference | confirmation/[ref]/page.tsx:25-29 vs 008_bookings.sql:1-4 | real confirmation resolves as not found |
| create_slot_hold RPC | absent | holds/create route.ts:48 vs all 12 migrations | no atomic slot hold |
| confirm_booking_paid RPC | absent | webhook route.ts:54 vs all migrations | paid booking cannot confirm |
| refund_booking RPC | absent | webhook route.ts:87 vs all migrations | refunds cannot reconcile |
| rate_limits table | absent | rateLimit.ts:20-40 vs all migrations | limit fails open |

## Failure behavior

Fail-closed route responses are truthful for production. Dormant helpers are
not: Postcodes.io outage returns true from validatePostcode
(postcodes.ts:8-20); checkCoverage and OneAuto can fall back to fictional data;
rate limiting catches every database failure and allows the request
(rateLimit.ts:7-8, 19-43). Gate 1 must replace these with explicit unavailable
responses, provider timeouts, bounded retries and structured error telemetry.
