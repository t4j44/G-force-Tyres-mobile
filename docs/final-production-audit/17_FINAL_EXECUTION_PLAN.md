# Final Gated Execution Plan

## Estimation basis

Ranges are focused engineering effort for one senior full-stack engineer with
timely access and owner decisions. They exclude provider approval, DNS
propagation, legal review, client response and controlled-launch observation.
Add 25-40% contingency if the current contract drift requires migration redesign
after live tests. Gates are sequential for safety; owner/account preparation can
run in parallel.

The gate ranges total 41-73 focused engineering days. With the stated
contingency this is approximately 51-102 engineering days, before external
waiting. A one-engineer planning view is therefore roughly 11-13 calendar weeks
in a best case, 16-22 weeks in a more realistic base case, and 24+ weeks when
provider/legal/client delays or migration redesign occur. The controlled launch
also needs 1-2 weeks of observation. These are planning ranges, not a committed
delivery date; Gate 0 evidence must replace the largest unknowns before a client
date is promised.

## GATE 0 — Live Supabase acceptance

- Exact code work: preserve commit; reset authorized disposable project; apply
  migrations 001-012; run phase1_catalog_checks; create normal/inactive/owner
  identities; fix SQL/Auth/RLS only if tests fail; reset and repeat; scan actual
  configured browser bundle.
- External accounts: disposable Supabase project and migration/admin access,
  never production.
- Tests: 19 tables/columns/constraints/FKs/indexes/triggers; exactly 22 policies;
  anonymous and normal-user SELECT/INSERT/UPDATE/DELETE denial; active owner
  reads; login/refresh/persistence/logout/global revocation/deactivation.
- Acceptance: every row in ADMIN_SECURITY_TESTS and live harness passes with
  sanitized evidence; LIVE_SUPABASE_VERIFICATION records LIVE_VERIFIED.
- Must not start: real public search, booking or Stripe persistence.
- Effort: 1-2 engineering days after access; 2-4 if migrations fail.

## GATE 1 — Real public data/search

- Exact code work: generated V3 types/mappers; service_zones read model; strict
  Postcodes.io failure behavior; Turnstile; atomic rate limiter; correct OneAuto
  contract/parser; hashed+encrypted <=24h cache; remove generic/mock fallbacks;
  real tyre_products/inventory catalogue; Budget/Standard/Premium; manual and
  sidewall flows; validated CSV/import foundation.
- External accounts: OneAuto sandbox, Turnstile test site, approved supplier
  catalogue, approved zones/fees.
- Tests: invalid/in/out postcode; provider timeout/malformed; Turnstile
  pass/fail/replay; VRM standard/staggered/unknown; cache expiry/encryption;
  limiter concurrency; manual path; catalogue filters/loading/error/empty.
- Acceptance: a production-mode staging build returns only database/provider
  truth, no fixture strings or fallback; cost is not exposed; owner-approved
  search cases pass.
- Must not start: slot/stock booking transactions or Stripe.
- Effort: 5-8 engineering days after contracts/data.

## GATE 2 — Persistent booking/concurrency

- Exact code work: recurring availability persistence and slot generation;
  atomic slot+inventory hold RPC; cleanup; authoritative pricing from
  business_settings/inventory; transactional customer/pending booking/items/
  payment creation; immutable snapshots; deterministic conflicts.
- External accounts: accepted Supabase staging; owner rules for hours,
  capacity, horizon, fees, deposit, VAT and cancellation.
- Tests: SQL integration/rollback; 20-way capacity-one slot; 20-way final stock;
  multi-item lock order; expired/abandoned hold; process restart; tampered input;
  pence/deposit edge cases.
- Acceptance: no double slot or stock oversell; no partial booking records;
  available/reserved quantities reconcile after expiry/failure.
- Must not start: Stripe Checkout/webhook money collection.
- Effort: 7-12 engineering days; concurrency review required.

## GATE 3 — Stripe/email/customer management

- Exact code work: persisted Stripe Checkout Session; signature-verified atomic
  event ledger; confirmation/release/refund/reconciliation transactions; durable
  Resend outbox/templates; hashed expiring manage tokens; cancel/reschedule and
  balance/refund display.
- External accounts: Stripe test merchant/webhook, Resend verified staging
  sender/domain, approved email/refund/cancellation wording.
- Tests: Checkout success/fail/cancel/expire; forged/duplicate/out-of-order
  webhook; amount/currency mismatch; full/partial refund; email outage/retry;
  token leakage/guess/expiry/revocation; end-to-end customer management.
- Acceptance: payment alone cannot be browser-forged; duplicate events are
  harmless; resources release; confirmed booking/payment/stock/email reconcile;
  secure self-service persists.
- Must not start: production admin sign-off or real payments.
- Effort: 7-12 engineering days after Gate 2.

## GATE 4 — Production admin OS

- Exact code work: real bookings search/status/fitter/reschedule/cancel/refund;
  inventory/product/price/stock/CSV; availability/slots/blocked dates/capacity;
  zones/fees; fitters; settings; admin access/offboarding; audit logs;
  pagination, conflict-safe mutations and truthful UI states.
- External accounts: accepted Supabase staging; owner workflow/roles and sample
  operations.
- Tests: owner/admin/normal/inactive authorization; CRUD persistence; two-operator
  conflicts; audit completeness; refund permissions; CSV validation/rollback.
- Acceptance: client performs every action in report 09 without developer or
  database console; changes persist and audit; errors do not create false UI.
- Must not start: staging launch rehearsal.
- Effort: 8-15 engineering days depending on approved workflow depth.

## GATE 5 — QA/security/performance

- Exact code work: unit/API/SQL/Playwright suites; CSP/security headers; a11y
  fixes; SEO technical assets; performance budgets; structured logging/error
  tracking/alerts; retention/purge; dependency/SBOM scan; remove dead mocks/3D
  dependencies.
- External accounts: error tracker/monitoring destination, test device/browser
  access, owner security/privacy policies.
- Tests: Chromium/WebKit/Firefox; 320/390/768/1440; iOS/Android; axe + keyboard/
  screen reader; OWASP abuse cases; Lighthouse; load/concurrency; secret scan;
  alert delivery; backup restore.
- Acceptance: no P0/P1 within application, data, security and quality scope
  assigned through Gates 0-5; WCAG 2.2 AA accepted; lab LCP <=2.5s, INP proxy
  <=200ms and CLS <=0.1 on agreed mobile profile; alerts and restore
  demonstrated. Delivery/handoff items remain explicitly tracked.
- Must not start: staging end-to-end transaction sign-off.
- Effort: 5-10 engineering days plus device/access scheduling.

## GATE 6 — Staging

- Exact code work: resolve Worker/Pages ambiguity; exact OpenNext build; CI/CD;
  isolated staging variables/data; scheduled jobs; custom staging domain;
  deployment/rollback and reconciliation runbooks.
- External accounts: client Cloudflare, staging Supabase, Stripe test, OneAuto,
  Turnstile, Resend, monitoring.
- Tests: deploy all routes; cookies/Auth/webhook raw body/background/scheduler;
  full customer/admin/refund/email transaction; observability; restore and
  application rollback.
- Acceptance: one documented end-to-end staging transaction reconciles across
  database, Stripe, stock, slot, email and admin; rollback/restore succeed.
- Must not start: production credentials/data/deployment.
- Effort: 3-5 engineering days after prior gates.

## GATE 7 — Controlled production

- Exact code work: production environment configuration, limited zones/daily
  cap, synthetic checks, dashboards, incident/rollback switches and daily
  reconciliation.
- External accounts: client-owned production accounts/domain/billing and named
  on-call decision makers.
- Tests: production smoke without real charge where possible, then owner-approved
  low-value real transaction/refund; live email; live admin operation; alert.
- Acceptance: first limited bookings reconcile; no reachable P0/P1 for
  production operation; measured SLOs within thresholds; incident and rollback
  owners available; evidence retained. Only final documented account transfer
  and training actions may remain for Gate 8.
- Must not start: unrestricted marketing/coverage expansion or final access
  transfer.
- Effort: 2-4 engineering days plus 1-2 weeks controlled observation.

## GATE 8 — Client handoff

- Exact code work: final runbooks, architecture/data dictionary, admin guide,
  account/access/secret inventory, support/warranty boundaries, known-defect
  acceptance, training and repository/CI transfer.
- External accounts: every asset in report 14 under client ownership with MFA,
  recovery, billing and delegated developer access.
- Tests: clean-machine setup; client operator completes booking/refund/stock/
  zone/fitter/settings and incident drill; developer offboarding dry run.
- Acceptance: client can operate and recover service without database console or
  personal developer accounts; sign-off and access review completed.
- Must not start: declaration “G FORCE TYRES V1.0 — FULLY PRODUCTION READY AND
  SAFE TO HAND TO THE CLIENT.”
- Effort: 3-5 engineering days plus client training/sign-off time.
