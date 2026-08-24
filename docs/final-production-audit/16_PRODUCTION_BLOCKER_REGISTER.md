# Final Production Blocker Register

No current P0 blocker is reachable because commerce is fail-closed. All rows
below are P1 and must pass before an unrestricted production launch.

| ID | Priority | Subsystem | Problem | Evidence | Production Impact | Exact Required Fix | Verification Gate | External Dependency | Owner Decision Required |
|---|---|---|---|---|---|---|---|---|---|
| B-01 | P1 | Supabase/Auth/RLS | no live acceptance | LIVE_SUPABASE_VERIFICATION.md:7-9,118-129 | private-data/auth behavior unknown | reset disposable DB, apply 001-012, run all catalogue/Auth/RLS cases | Gate 0 | Supabase disposable access | name authorized tester/project |
| B-02 | P1 | Coverage | real route disabled; helper/schema mismatch/fallback | postcode route.ts:13-17; postcodes.ts:34-71 | no truthful service decision/fee | V3 mapper, real zones, fail-unavailable Postcodes flow | Gate 1 | Postcodes.io/Supabase | approve launch zones/fees |
| B-03 | P1 | Fitment | wrong OneAuto contract and invented BMW fallback | oneauto.ts:95-180 | wrong tyre recommendation | implement intended endpoint/header/parser/cache; remove fallback | Gate 1 | OneAuto sandbox/contract | approve provider/cache terms |
| B-04 | P1 | Abuse control | missing durable rate table; fail-open limiter | rateLimit.ts:7-43 | quota/cost abuse | atomic server limiter plus enforced Turnstile | Gate 1 | Turnstile | define abuse thresholds |
| B-05 | P1 | Catalogue | no real public product/stock/price query/import | tyres/page.tsx:25-37 | customer cannot buy truthfully | product/inventory read model and validated import | Gate 1 | supplier data | approve catalogue/prices/tiers |
| B-06 | P1 | Data contracts | code uses legacy table/column names | report 03 contract matrix | enabled routes fail/fallback | generated DB types and explicit mappers | Gates 0-2 | none | no |
| B-07 | P1 | Slots | atomic slot hold absent | missing create_slot_hold RPC | double-booking risk | row-lock capacity transaction + expiry | Gate 2 | Supabase | approve rules/capacity |
| B-08 | P1 | Inventory | atomic inventory hold absent | inventory_holds unused | overselling risk | locked multi-item reservation/release | Gate 2 | Supabase | approve stock semantics |
| B-09 | P1 | Booking | no persistent customer/booking/payment transaction | checkout localStore create | lost/incomplete booking | atomic pending booking with immutable items | Gate 2 | Supabase | approve required data/status flow |
| B-10 | P1 | Pricing | nonexistent tables and mock fallback | pricing.ts:19-93 | incorrect charge | V3 authoritative server pricing/no fallback | Gate 2 | catalogue/settings | approve fees/deposit/VAT |
| B-11 | P1 | Stripe | Checkout not implemented | PaymentIntent mock route/form | no safe customer payment | persisted Stripe Checkout Session | Gate 3 | Stripe test account | approve deposit/refund policy |
| B-12 | P1 | Webhook | missing RPC/idempotency/column contract | webhook route.ts:49-88 | paid but unconfirmed/duplicate side effects | atomic event ledger and booking/resource confirmation | Gate 3 | Stripe webhook | no |
| B-13 | P1 | Lifecycle/refund | no expiry/failure/release/refund/reconcile | no jobs/RPCs | stranded resources/unresolved money | transactional release/refund and scheduler/reconciler | Gate 3 | Stripe | approve partial/full refund rules |
| B-14 | P1 | Email | delivery/domain/retry not accepted | email.ts:21-34 | no confirmation/reminders | verified domain, outbox, retry/idempotent templates | Gate 3 | Resend/domain DNS | approve sender/content |
| B-15 | P1 | Customer self-service | manage page mock-only; token lacks lifecycle | manage page and bookings schema | no secure cancel/reschedule | hashed expiring scoped tokens and persistent actions | Gate 3 | Supabase/Stripe | approve windows/actions |
| B-16 | P1 | Admin OS | operations mock/missing | report 09 matrix | client cannot run business | persistent role-safe audited admin CRUD | Gate 4 | Supabase | approve roles/workflows |
| B-17 | P1 | Delivery/operations | no accepted Cloudflare staging, E2E, alerts, restore/rollback | report 12/13 | outage or loss unnoticed/unrecoverable | CI, staging, cross-browser, monitoring, restore/rollback rehearsal | Gates 5-7 | Cloudflare/Supabase/providers | name incident owners/SLO |
| B-18 | P1 | Claims/legal/handoff | business facts/legal/account ownership unknown | CLAIMS_REGISTER.md; draft pages; report 14 | misleading launch/non-operable handoff | signed truth/legal/account transfer pack and final scan | claims/legal minimum Gate 6; final ownership transfer Gate 8 | client/legal/accounts | yes, extensive |
