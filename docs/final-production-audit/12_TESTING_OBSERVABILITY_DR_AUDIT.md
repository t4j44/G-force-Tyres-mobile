# Final Testing, Observability and Disaster-Recovery Audit

## Local command evidence

| Command/check | Audit result | Status |
|---|---|---|
| git status --short | clean before audit artifacts | LOCAL_VERIFIED |
| git diff --check | no output before artifacts | LOCAL_VERIFIED |
| TypeScript tsc --noEmit | exit 0 | LOCAL_VERIFIED |
| ESLint | exit 0; 44 warnings | LOCAL_VERIFIED |
| scripts/security-check.mjs | exit 0; live role tests explicitly gated | LOCAL_VERIFIED |
| Next build | exit 0; 26 routes | LOCAL_VERIFIED |
| Next production start | failed mandatory environment validation as designed | LOCAL_VERIFIED |
| Live Phase 1 harness | not run; authorization/config absent | BLOCKED_EXTERNAL |

The system npm shim pointed to a missing global npm-cli.js. Repository-local
CLIs were therefore executed with the bundled Node runtime. This is a workstation
tooling issue, not a test failure, but handoff setup must repair/document npm.

## Test inventory

- Unit tests: MISSING.
- Component tests: MISSING.
- API integration tests: MISSING.
- Playwright/browser E2E: MISSING.
- Cross-browser Chromium/WebKit/Firefox: MISSING.
- Accessibility automation: MISSING.
- Database catalogue verifier:
  supabase/verification/phase1_catalog_checks.sql, IMPLEMENTED_NOT_LIVE_VERIFIED.
- Live Auth/RLS harness: scripts/phase1-live-acceptance.mjs,
  IMPLEMENTED_NOT_LIVE_VERIFIED.
- Structural security script: LOCAL_VERIFIED.
- Concurrency/load tests: MISSING.

## Required test matrix

| Scenario | Current evidence | Status |
|---|---|---|
| Valid/invalid/in-area/out-of-area postcode | mock UI only | MISSING |
| Postcodes.io timeout/malformed response | no test; helper fails open | MISSING |
| OneAuto front/staggered/unknown/timeout | generic fixture only | MISSING |
| Turnstile pass/fail/replay/timeout | no authorized run | MISSING |
| Manual tyre size and sidewall confirmation | UI source only | PARTIAL |
| Catalogue tier/season/size/empty/error | mock route only | MISSING |
| Slot selection and expired hold | local store only | MISSING |
| 20-way final slot | none | MISSING |
| 20-way final stock | none | MISSING |
| Server pricing/tampered client | no unit/integration test | MISSING |
| Stripe Checkout success/failure/cancel/expiry | not implemented | MISSING |
| Invalid/duplicate/out-of-order webhook | not implemented | MISSING |
| Full/partial refund | not implemented | MISSING |
| Email success/failure/retry | not live | MISSING |
| Manage-token guessing/expiry/revocation | not implemented | MISSING |
| Anonymous/normal/inactive/admin/owner RLS | harness only | BLOCKED_EXTERNAL |
| Admin CRUD/audit/conflict | mock only | MISSING |
| 320/390/768/1440 responsive | prior code claims only; no fresh browser proof | MISSING |
| Keyboard/screen reader/reduced motion | source review only | PARTIAL |

## Observability

Current logging is unstructured console.warn/error in API helpers, webhook and
email. There is no Sentry/error tracker, request correlation ID, health/readiness
route, Cloudflare alert configuration, Supabase alert evidence, Stripe webhook
alert/reconciliation dashboard, Resend delivery webhook, uptime monitor or
on-call runbook.

Who knows if booking/payment breaks at 2am? No named person or automated paging
path is evidenced. Stripe may retry a 500, and logs may exist in provider
dashboards, but nobody is demonstrated to receive or act on an alert.

Required: structured redacted logs, correlation across booking/payment/event,
error tracking, synthetic search/booking probes, webhook failure/age alerts,
email failure metrics, database saturation/errors, uptime checks, named severity
and escalation policy, and test alerts before launch.

## Backup and disaster recovery

| Control | Evidence | Status |
|---|---|---|
| Git recovery | three recovery commits; source clean baseline | LOCAL_VERIFIED |
| Supabase backup policy | no project/account evidence | BLOCKED_EXTERNAL |
| Restore rehearsal | none | MISSING |
| Migration rollback/forward-fix | ordered up migrations only | PARTIAL |
| Secret rotation | no runbook/attestation | MISSING |
| Stripe reconciliation | none | MISSING |
| Failed booking recovery | none | MISSING |
| Cloudflare rollback | no deployment/runbook | MISSING |
| Incident response | no owner/severity/runbook | MISSING |

Gate 5/6 must restore a staging backup into a clean target, reconcile a staged
payment to booking/stock, rotate one disposable secret, and execute application
rollback without losing confirmed transaction data.
