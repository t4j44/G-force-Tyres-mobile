# Final External Integrations Audit

## Integration matrix

| Service | Actual code | Status | Risk | Production action |
|---|---|---|---|---|
| Supabase | SSR/browser/service clients; 12 migrations | BLOCKED_EXTERNAL | no live migration/Auth/RLS proof | Gate 0 disposable acceptance |
| Postcodes.io | GET /postcodes/{postcode}/validate, 4 s timeout in postcodes.ts:8-20 | IMPLEMENTED_NOT_LIVE_VERIFIED | outage returns true; not authoritative fail closed | normalize, fail unavailable, contract tests |
| Turnstile | siteverify POST in turnstile.ts:8-30 | IMPLEMENTED_NOT_LIVE_VERIFIED | dev skips when secret absent; production route disabled | enforce on real search and test valid/invalid/timeout |
| OneAuto | GET {base}/tyres?vrm= with apikey header in oneauto.ts:143-156 | PARTIAL | diverges from required provider contract; generic fallback | replace contract and test authorized sandbox |
| Stripe | PaymentIntent mock checkout and signed webhook | PARTIAL | not required Checkout; database contract absent | Gate 3 Checkout + atomic webhook |
| Resend | direct resend.emails.send in email.ts:21-34 | IMPLEMENTED_NOT_LIVE_VERIFIED | no domain proof, retry/outbox/idempotency | verify domain and durable delivery |
| Cloudflare/OpenNext | package scripts and wrangler.toml | PARTIAL | no adapter/staging/live proof; config mixes Pages language | Gate 6 staging deployment |

No external integration was called or mutated during this audit.

## Postcode and service zones

postcode/check returns 501 in non-mock mode at route.ts:13-17. checkCoverage
starts with MOCK_SERVICE_ZONES and falls back to them on database failure at
postcodes.ts:34-49. It maps zone_name/callout_charge, but V3 stores
name/callout_fee_pence. Admin zone management is MISSING. Production coverage
cannot be changed without code/database intervention.

## OneAuto contract comparison

Contract sources: G Force Tyres Mobile — Master PRD, TRD & Production
Architecture v3.0.md:1543-1582 and
https://www.oneautoapi.com/service/driverightdata-oe-wheel-tyre-fitments/.

| Requirement | Intended V3 | Current code | Status |
|---|---|---|---|
| Endpoint | /driverightdata/oetyrefitmentdata | /tyres | MISSING |
| Query | vehicle_registration_mark | vrm | MISSING |
| Auth header | x-api-key | apikey | MISSING |
| Timeout | 5 seconds | 5 seconds | LOCAL_VERIFIED |
| Parser | provider schema validation/normalization | loose any-based probing at oneauto.ts:160-180 does not parse the documented nested result/oe_data response | MISSING |
| Cache | encrypted, <=24 h | imports client but implements no cache | MISSING |
| Rate limit | server-side durable | nonexistent rate_limits table, non-atomic, fail-open | MISSING |
| Staggered fitment | front/rear supported | types/UI can represent rear size; provider proof absent | PARTIAL |
| Sidewall confirmation | mandatory | finder/catalogue text asks user to check | LOCAL_VERIFIED |
| Manual fallback | always available | TyreFinder manual stage | LOCAL_VERIFIED |

oneauto.ts:95-139 falls through sandbox records and then invents a BMW 3 Series
225/45 R18 + 255/40 R18 fitment for any plausible registration. This is a P1
wrong-fitment defect. Remove it from every non-development branch.

## Resend/email

Templates exist for confirmation, reminder, cancellation and completion.
Reschedule, refund and review-request flows are missing. No verified sending
domain, DNS, inbox delivery or suppression evidence exists. send() logs and
returns when the API key is absent; there is no durable outbox or retry.
Webhook confirmation launches email without awaiting a Cloudflare-safe
background primitive. Template interpolation is not HTML-escaped. All delivery
claims are NOT LIVE VERIFIED.

## External-account inputs still required

Authorized disposable Supabase project, OneAuto sandbox credentials/contract,
Turnstile site, Stripe test account/webhook endpoint, Resend verified domain,
Cloudflare staging account/domain and named client owners. Secrets must enter
only approved secret stores; none may be added to Git or reports.
