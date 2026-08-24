# Phase 0 Report

Status: **PASS for the local code gate; NOT production-ready.**

## Recovery point

- Git repository initialized on `main`.
- Baseline commit: `e13bbaed888dd96fe657572787bf685d706277fa` (`chore: pre-production audit baseline`).
- `.env.local`, build output, dependencies and TypeScript build metadata are ignored.

## What changed

- Recorded the canonical requirement order in `IMPLEMENTATION_AUTHORITY.md`.
- Mapped mock/demo systems and their retirement phases in `MOCK_DATA_AUDIT.md`.
- Added an explicit `APP_ENV` / `ENABLE_MOCK_DATA` boundary. Production mock mode fails configuration loading; the check was executed and returned non-zero as required.
- Added Zod-based public/server environment validation and a server startup hook. A production `next start` with incomplete configuration failed clearly during instrumentation loading.
- Replaced `.env.example` with a complete, annotated variable inventory containing no values that grant access.
- Audited public operational/legal claims in `CLAIMS_REGISTER.md`; no operational claim is currently verified.
- Recorded build/bundle facts in `PERFORMANCE_BASELINE.md` and 3D findings in `3D_PERFORMANCE_AUDIT.md`.
- Production-disabled the existing demo booking, payment, hold, customer portal, catalogue fallback and admin demo-data paths without redesigning the normal development UI.

## Risks found

- The pre-existing mock payment page resembled a card form and routed to confirmation even when confirmation failed. It is now unavailable outside explicit development mock mode, and failed confirmation no longer redirects.
- Demo admin login and unprotected admin mutation routes existed. Phase 1 replaces/protects them.
- OneAuto returned a generic BMW profile for plausible registrations; live search is now disabled pending Phase 2.
- Public copy contains unverified phone, 24/7, same-day, insurance, refund, service-area, fleet and guarantee claims.
- The legacy database used mutable `schema.sql`, outdated names and incomplete hold/payment/admin/RLS foundations.

## Performance baseline

- Baseline typecheck and production build passed.
- Homepage first-load JS: 119 kB; booking: 124 kB; tyres: 106 kB; admin login: 112 kB; shared: 103 kB.
- Deferred 3D chunks: about 898.6 KiB raw.
- Lighthouse/Core Web Vitals: not measured; no score is claimed.
- 3D still lacks the required mobile/weak-device fallback, DPR cap and hidden/offscreen pause.

## Environment and external blockers

- Production credentials and public integration keys are not confirmed complete. This is now fail-safe: production server startup rejects missing mandatory configuration.
- No live Supabase project was mutated during Phase 0.
- Business claims need client evidence and legal/operational approval.
- Browser Lighthouse and real mid-range-device 3D tests remain outstanding.

## Verification

| Check | Result |
|---|---|
| Git recovery point | PASS |
| Mock mode rejected in production | PASS |
| Central environment validation | PASS (failure path exercised) |
| Secrets excluded from commit | PASS |
| Mock and claims audits | PASS |
| Performance and 3D baselines | PASS, with measurements explicitly unavailable where not run |
| Baseline typecheck | PASS |
| Baseline production build | PASS |
