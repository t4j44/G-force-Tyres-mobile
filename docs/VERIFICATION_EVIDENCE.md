# Verification Evidence

Audit date: 2026-08-23. Workspace: `E:\Taqi Project\gforce-tyres`.

## Recovery

- Baseline commit: `e13bbaed888dd96fe657572787bf685d706277fa`.
- Phase 0–1 implementation commit: not created; changes remain visible in the working tree for owner review.

## Commands and observed outcomes

| Command/check | Observed result |
|---|---|
| local TypeScript CLI: `tsc --noEmit` | Exit 0 |
| local ESLint CLI: `eslint .` | Exit 0; 0 errors, 46 warnings |
| `node scripts/security-check.mjs` | Exit 0; structural security checks passed |
| local Next.js CLI: `next build` | Exit 0; optimized compile 12.5 s; 26 generated routes/pages in build progress |
| production config with `ENABLE_MOCK_DATA=true` | Config import exited non-zero with `Unsafe configuration` |
| `next start` with incomplete mandatory production env | Instrumentation rejected startup with an invalid public-environment error |
| unauthenticated `GET /admin` on local dev server | `307 Temporary Redirect`, `Location: /admin/login` |
| unauthenticated `GET /admin/login` | `200 OK` |
| unauthenticated `POST /api/admin/slots/update` | `401 Unauthorized` |
| deliberately invalid `POST /api/admin/login` on 2026-08-24 | `401 Unauthorized`; no account detail was returned |
| post-change `GET /` and `GET /admin/login` on 2026-08-24 | Both `200`; server-rendered output contains the accessible `G Force Tyres home` link |
| post-change `GET /admin` and `GET /admin/bookings` | Both `307` to `/admin/login` |
| direct local TypeScript, security and Next.js production-build commands after the header fix | Exit `0`; 26 pages/routes generated |
| scan `.next/static/**/*.js` for `SUPABASE_SERVICE_ROLE_KEY` | 0 matches |
| `git diff --check` | Exit 0 |

## Build comparison evidence

Final first-load JS: `/` 119 kB, `/booking` 124 kB, `/tyres` 106 kB,
`/admin/login` 112 kB, `/admin/bookings` 123 kB, shared 103 kB.

## Evidence not available

- Supabase project reference: not provided.
- Fresh PostgreSQL/Supabase migration execution: not run.
- Normal-user, inactive-admin and active-owner test identifiers/results: not available.
- Live anonymous RLS queries against `customers` and `payments`: not run.
- Lighthouse/CWV and real-device 3D measurements: not run.
- Final Phase 1 commit SHA: not created.
- Exact pointer-click interaction for the brand link: not browser-automated; link
  target, same-page handler, rendered anchor and destination responses were checked.

These missing items are acceptance blockers where identified in
`PHASE1_REPORT.md`; they are not inferred from source code.
