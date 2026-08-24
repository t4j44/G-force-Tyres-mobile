# Final Security, Privacy and Secrets Audit

## Security readiness

SECURITY READY: 45%

The code has meaningful fail-closed and server-only foundations. Live RLS/Auth,
rate limiting, privacy operations and production headers are not accepted.

## Environment inventory

| Variable | Class | Production status |
|---|---|---|
| APP_ENV | SERVER_ONLY, PRODUCTION_REQUIRED | present in ignored .env.development.local; absent from .env.local used by the audited production start |
| ENABLE_MOCK_DATA | SERVER_ONLY, DEVELOPMENT_ONLY=true | present in ignored .env.development.local; absent from .env.local; production true is rejected |
| NEXT_PUBLIC_SUPABASE_URL | PUBLIC, PRODUCTION_REQUIRED | present locally |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | PUBLIC, PRODUCTION_REQUIRED | present locally |
| SUPABASE_SERVICE_ROLE_KEY | SERVER_ONLY, PRODUCTION_REQUIRED | absent locally |
| SUPABASE_SERVICE_KEY | SERVER_ONLY, LEGACY/UNUSED | present locally; wrong name |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | PUBLIC, PRODUCTION_REQUIRED | present locally |
| STRIPE_SECRET_KEY | SERVER_ONLY, PRODUCTION_REQUIRED | present locally |
| STRIPE_WEBHOOK_SECRET | SERVER_ONLY, PRODUCTION_REQUIRED | present locally |
| RESEND_API_KEY | SERVER_ONLY, PRODUCTION_REQUIRED | present locally |
| EMAIL_FROM | SERVER_ONLY, PRODUCTION_REQUIRED operationally | present locally |
| ONEAUTO_API_KEY | SERVER_ONLY, PRODUCTION_REQUIRED | empty locally |
| ONEAUTO_BASE_URL | SERVER_ONLY, OPTIONAL override | present locally |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | PUBLIC, PRODUCTION_REQUIRED | empty locally |
| TURNSTILE_SECRET_KEY | SERVER_ONLY, PRODUCTION_REQUIRED | empty locally |
| VRM_CACHE_ENCRYPTION_KEY | SERVER_ONLY, PRODUCTION_REQUIRED | absent locally |
| APP_URL | SERVER_ONLY, PRODUCTION_REQUIRED | absent locally; validated but not currently consumed by email links |
| NEXT_PUBLIC_SITE_URL | PUBLIC, ACTIVE LEGACY CONTRACT | present locally; email.ts:15 currently consumes it |
| PHASE1_* variables | SERVER_ONLY, DISPOSABLE ACCEPTANCE ONLY | not runtime product settings |

No values are recorded in this audit.

## Secret evidence

- .env.local is untracked/ignored; only .env.example is tracked.
- Static browser scan after the fresh build found zero occurrences of the
  service-role and named server-secret variables.
- Local history filename-only scans found key-name assignments only in
  .env.example/README and sk_test_ only in README; no sk_live_ pattern.
- The same browser scan found demo-token-123, GF-842910 and Local fitment preview.
  These are fictional fixtures, not secrets, but must be removed from production
  bundles.

Pattern-scan status: LOCAL_VERIFIED. This is not a complete secret-scanner or
provider-side key-rotation attestation.

## Authorization/security findings

| Finding | Evidence | Status | Risk/action |
|---|---|---|---|
| Service role server-only | supabase/admin.ts:1 and supabase.ts:1 | LOCAL_VERIFIED | keep server-only imports |
| Active admin role guard | auth/admin.ts:34-63 | IMPLEMENTED_NOT_LIVE_VERIFIED | Gate 0 live identities |
| Production mock rejection | next.config.mjs:2-9; env.ts:30-35 | LOCAL_VERIFIED | add CI negative test |
| Central required env | env.server.ts:6-15, 51-56 | LOCAL_VERIFIED | configure secret store; the negative startup path passed |
| RLS all 19 tables | 011_rls.sql:20-38 | IMPLEMENTED_NOT_LIVE_VERIFIED | live deny/mutation tests |
| Rate limiting | rateLimit.ts:7-43 | MISSING | durable atomic limiter; fail safe |
| MFA/recovery/password policy | no product policy/routes | MISSING | owner security policy and Supabase config |
| CSP/security headers | next.config.mjs has none | MISSING | CSP, HSTS, frame, referrer and permissions policy |
| Remote images | next.config.mjs:21-23 permits any HTTPS host | PARTIAL | restrict approved supplier/CDN hosts |

No open redirect was found in the login route; the redirect target is fixed.
Login errors are generic. Live enumeration/rate/session behavior is untested.

## Privacy/GDPR operational gaps

This is not legal advice. The code may store customer identity/contact, vehicle
registration, address, postcode, notes, payment identifiers, IP-derived rate
keys and interest registrations. privacy/page.tsx is explicitly draft.

Missing production controls:

- approved lawful-basis/purpose/processor/retention wording;
- consent distinction for transactional versus marketing/review mail;
- data subject access/deletion/correction procedure;
- retention and automated purge rules for VRM cache, holds, interest and logs;
- encrypted-cache implementation and rotation plan;
- access review and audit-log retention;
- incident/breach response owner;
- privacy review of raw registration/address in logs and third-party metadata.

These are BLOCKED_OWNER_DECISION plus engineering implementation.

## Current public-claim classification

Claim classifications below use the requested claims vocabulary, not
implementation statuses. No claim is VERIFIED by the supplied brand board or
repository.

| Claim area | Current source evidence | Classification | Required action |
|---|---|---|---|
| 24/7 service | no current public occurrence | NOT_PRESENT | do not add without staffed-hours evidence |
| Same-day/cutoff | no current public occurrence | NOT_PRESENT | drive only from approved live settings |
| Fully insured | no current public occurrence | NOT_PRESENT | do not add without insurer-approved wording |
| Roadside service | no current public occurrence | NOT_PRESENT | validate safe/authorized service scope before adding |
| 100% fitment guarantee | no current public occurrence | NOT_PRESENT | do not add without written scope/remedy |
| 48-hour free/full refund | booking/page.tsx:870 and pay/page.tsx:298-299 in mock-only journey | REMOVE | remove from production artifacts or replace after policy/Stripe implementation and approval |
| Refund in 5-10 working days | email.ts:129-140 | REMOVE | align to approved provider/policy wording and tested refund flow |
| Greater London/across London | privacy/page.tsx:20 and email.ts:48 | OWNER_CONFIRMATION_REQUIRED | replace with approved live service-zone truth |
| At home/at work/mobile workshop | app/page.tsx:45-55 and booking copy | OWNER_CONFIRMATION_REQUIRED | approve service modes, access and fleet capability |
| OEM torque/workmanship statements | booking/page.tsx:872; manage page status copy | OWNER_CONFIRMATION_REQUIRED | approve operational procedure and legal wording |
| G Force Tyres Ltd | no current public occurrence | NOT_PRESENT | use only verified legal entity details |
| Public phone/email/address | placeholder phone exists only in mockData.ts:11; no verified public contact | REMOVE | remove fixture from bundle and supply client-owned contacts |
| Reviews/rating/response time | no current public numeric occurrence | NOT_PRESENT | do not add without traceable evidence |

The cancellation and terms pages correctly disclose that wording is draft.
That disclosure does not make them launch-ready legal documents.
