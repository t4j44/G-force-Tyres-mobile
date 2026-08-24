# Live Supabase Verification

Report timestamp (UTC): `2026-08-24T20:30:11Z`

## Gate status

**GATE 0 — FAIL (SAFE STOP BEFORE DESTRUCTIVE ACTION)**

**PHASE 1 — NOT LIVE VERIFIED**

Phase 2 has not started.

## Executive result

Target attestation did not pass. The configured repository-local Supabase URL,
public key and privileged key are placeholder-shaped, not live disposable-project
credentials. The URL resolves to an 11-character placeholder project reference
(redacted suffix: `…lder`). The privileged key exists only under the forbidden
legacy variable name `SUPABASE_SERVICE_KEY`.

The current process contains none of the required target-attestation variables
and no database-management credential. The Supabase dashboard fallback was also
unavailable: the isolated browser was signed out and no connected authenticated
Chrome session was available.

Consequently, no database reset was attempted, no migration was applied, no row
was mutated and no Auth identity was created. This is the required fail-closed
outcome; treating placeholder configuration as an authorized target would risk
resetting the wrong database.

## Gate matrix

| Gate item | Result | Redacted evidence |
|---|---|---|
| Target attestation | FAIL | Local values are placeholder-shaped; required attestation variables absent from process; HMAC challenge not attempted against a real target |
| Migrations 001–012 from zero | FAIL | Not run because target attestation failed before the destructive boundary |
| 19 V3 tables | FAIL | Live catalogue verifier not run |
| Constraints | FAIL | 19 PK, 15 unique, 39 check and 14 FK expectations remain unverified live |
| Indexes | FAIL | 18 required named indexes remain unverified live |
| Grants and RLS policies | FAIL | 22 policies and effective grants remain unverified live |
| Three disposable Auth users | FAIL | No identities created |
| Admin security matrix | FAIL | Structural cases pass; live normal/inactive/owner cases not run |
| Anonymous/private RLS | FAIL | Live reads and writes not run |
| Active-owner sessions | FAIL | Login, refresh, logout and revocation not run live |
| Secret isolation | FAIL | Local placeholder build scan passed, but no build made with a real service-role key |
| Build/tooling | PASS | Typecheck, lint command, production build and structural security checks exited 0 |

## Target-attestation evidence

Secret values were neither printed nor written to this report.

- `NEXT_PUBLIC_SUPABASE_URL`: present only in ignored `.env.local`; placeholder-shaped.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: present only in ignored `.env.local`; placeholder-shaped.
- `SUPABASE_SERVICE_ROLE_KEY`: absent from ignored local files and process.
- `SUPABASE_SERVICE_KEY`: present only in ignored `.env.local`; placeholder-shaped and explicitly rejected by the live harness.
- `PHASE1_DISPOSABLE_PROJECT_REF`: absent from process.
- `PHASE1_APP_URL`: absent from process.
- `PHASE1_ACCEPTANCE_TOKEN`: absent from process.
- `PHASE1_CONFIRM_DISPOSABLE`: absent from process.
- Migration-capable database URL/access token/linked CLI: absent.
- `scripts/phase1-live-acceptance.mjs`: exited 1 at the first required-variable assertion, before network access or mutation.

## Non-destructive verification completed

| Check | Result | Evidence |
|---|---|---|
| Ordered migration set | PASS (structural only) | `scripts/security-check.mjs` confirmed exactly `001`–`012` |
| TypeScript | PASS | `tsc --noEmit` exited 0 |
| ESLint | PASS with warnings | Exited 0 with 44 warnings and 0 errors |
| Production build | PASS | Next.js 15.5.23 compiled and generated 26/26 static pages; build exited 0 |
| Structural security | PASS | Security script exited 0 before and after the production build |
| Browser bundle scan | PASS (local placeholders only) | 48 JavaScript chunks; 0 privileged variable-name hits; 0 configured privileged-value hits |
| Working-tree integrity | PASS | `git diff --check` exited 0; pre-existing untracked audit documents were preserved |

These checks establish local source/build health only. They do not substitute for
live Supabase acceptance.

## Required configuration before the next Gate 0 run

Configure these through an approved local secret mechanism without committing or
printing their values:

- real disposable `NEXT_PUBLIC_SUPABASE_URL`;
- matching `NEXT_PUBLIC_SUPABASE_ANON_KEY`;
- server-only `SUPABASE_SERVICE_ROLE_KEY` using the exact required name;
- matching `PHASE1_DISPOSABLE_PROJECT_REF`;
- loopback `PHASE1_APP_URL`;
- newly generated `PHASE1_ACCEPTANCE_TOKEN` of at least 32 characters;
- `PHASE1_CONFIRM_DISPOSABLE=I_CONFIRM_THIS_PROJECT_IS_DISPOSABLE`;
- migration-capable database URL/password, Supabase access token with linked CLI,
  or an authenticated approved SQL execution path.

The next run must first complete the nonce/HMAC application attestation, then
reset the disposable database, apply migrations `001`–`012`, run
`supabase/verification/phase1_catalog_checks.sql`, build with the same target and
execute every live acceptance case. Any failure still requires another reset and
full rerun from zero.

## Final status

`GATE 0: FAIL`

No claim of `PHASE 1 — PASS, LIVE VERIFIED` is authorized.
