# Live Supabase Verification

Report date: 2026-08-24

## Gate status

**BLOCKED — NOT LIVE VERIFIED**

Phase 1 is not `PASS — LIVE VERIFIED`. Phase 2 has not started.

The current workspace contains a real-looking public Supabase configuration and
a legacy `SUPABASE_SERVICE_KEY` variable, but the project is not identified as an
authorized disposable target. The expected `SUPABASE_SERVICE_ROLE_KEY`, a
migration-capable database URL or Supabase access token, a linked CLI project and
an explicit disposable project reference are absent. The existing project was
therefore not mutated and the legacy key was not used.

Direct anonymous diagnostics from the sandbox could not reach the configured
remote endpoint. That network result is not treated as an RLS pass or failure.

## Preserved source state

- Review commit: `898a785` (`review: preserve Phase 0-1 hardening baseline`)
- Parent baseline: `e13bbae`
- Environment and build directories were ignored and excluded from the commit.
- A boundary-aware staged scan found zero credential-shaped values.
- TypeScript, the structural security script and the production build passed
  before the live-acceptance task began.

## Prepared acceptance controls

### Database catalogue verifier

`supabase/verification/phase1_catalog_checks.sql` is a read-only, fail-closed SQL
check for:

- all 19 required V3 tables;
- RLS enabled on every table;
- all 19 exact `id` primary keys, 15 exact unique constraints, 39 exact check
  expressions and 14 exact foreign-key paths/delete actions;
- the 18 named Phase 1 indexes, each valid, ready and attached to the expected
  table;
- exactly 22 RLS policies, including their role sets, commands,
  permissiveness, `USING` expressions and absent `WITH CHECK` clauses;
- the `SECURITY DEFINER` admin predicate;
- the complete 25-column effective anonymous product/service-zone read surface,
  including privileges inherited through `PUBLIC` or role membership; and
- absence of effective anonymous/authenticated table-level and column-level
  mutation grants.

It also returns constraint and policy inventories for redacted evidence. It has
not been executed against PostgreSQL because no authorized target is connected.

### Live API/Auth harness

`scripts/phase1-live-acceptance.mjs` is guarded by all of the following:

- `PHASE1_CONFIRM_DISPOSABLE=I_CONFIRM_THIS_PROJECT_IS_DISPOSABLE`;
- an explicit `PHASE1_DISPOSABLE_PROJECT_REF` that must match the configured
  Supabase hostname;
- a 32-character-or-longer `PHASE1_ACCEPTANCE_TOKEN` used by a disabled-by-
  default server endpoint to answer a nonce/HMAC challenge bound to the app
  origin and configured Supabase fingerprint. The token is never transmitted;
  the proof attests that `PHASE1_APP_URL` is configured for the same disposable
  target before any identity or row is created;
- the expected server-only `SUPABASE_SERVICE_ROLE_KEY`; and
- rejection of the legacy `SUPABASE_SERVICE_KEY` name.

When authorized configuration is supplied, the harness creates random,
non-emailed disposable identities and sentinel records, without printing their
credentials or full identifiers. It checks:

- normal user, inactive admin and active owner behavior;
- anonymous, normal-user and inactive-admin denial for customers, payments,
  bookings, audit logs, slot/inventory holds and VRM cache;
- active-owner RLS reads;
- denied INSERT/UPDATE/DELETE attempts for anonymous, normal, inactive and owner
  browser clients;
- generic normal/inactive application-login denial;
- active-owner login, two protected refreshes, logout cookie expiry and denial
  when the pre-logout cookie is replayed;
- global refresh-token revocation;
- immediate live-session denial after account deactivation; and
- absence of both the service-role variable name and value from browser chunks.

The harness cleans up in reverse dependency order and verifies the returned
Supabase result for every deleted row and identity. A failed cleanup marks the
run failed and requires a full disposable database reset before rerunning.

Its fail-closed no-configuration check was executed locally and stopped before
network or mutation with `NEXT_PUBLIC_SUPABASE_URL is required`.

After the acceptance controls were tightened, the following local-only checks
passed: JavaScript syntax, TypeScript, targeted ESLint, structural security,
`git diff --check`, and a Next.js production build. The build completed with
pre-existing lint warnings and included the disabled-by-default target-
attestation route. Its 48 browser JavaScript chunks contained zero privileged
Supabase variable-name matches and zero matches for locally configured
privileged values. This is useful local evidence, but it does not replace the
required scan of a build made with the authorized disposable configuration.

An unauthenticated request to the target-attestation route under the current
non-acceptance environment returned `404` with a fail-closed response.

A separate production-mode local smoke test used non-secret placeholders only
to enable the otherwise disabled attestation route. It returned `200`, matched
the configured public-target fingerprint, passed the nonce/HMAC proof check and
did not transmit or return the attestation token. No database call or mutation
was made. The current real production configuration remains incomplete (for
example, the Turnstile keys are not configured), so this smoke test is not live
Phase 1 evidence and is not a Phase 2 pass.

## Required live acceptance record

| Acceptance item | Result | Evidence |
|---|---|---|
| Authorized disposable project confirmed | NOT RUN | No approved project reference/access path supplied |
| Fresh reset and migrations 001-012 in exact order | NOT RUN | Migration-capable access absent |
| 19 tables and required columns/constraints | NOT RUN | SQL verifier prepared only |
| 18 named indexes | NOT RUN | SQL verifier prepared only |
| 22 RLS policies and grants | NOT RUN | SQL verifier prepared only |
| Normal user created and denied | NOT RUN | Live harness prepared only |
| Inactive admin created and denied | NOT RUN | Live harness prepared only |
| Active owner login and protected access | NOT RUN | Live harness prepared only |
| Session persistence and logout | NOT RUN | Live harness prepared only |
| Refresh-token revocation and deactivation | NOT RUN | Live harness prepared only |
| Private-table anonymous/user RLS denial | NOT RUN | Live harness prepared only |
| Unauthorized INSERT/UPDATE/DELETE | NOT RUN | Live harness prepared only |
| Browser bundle actual-secret scan | NOT RUN | Local 48-chunk name/value scan passed; disposable-target build not available |
| Reset/reapply/rerun after any failure | NOT RUN | Requires disposable target |

## Secret-safe execution inputs still required

An authorized operator must configure these locally or in an approved secret
store. Do not paste their values into chat, documentation, screenshots or Git:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PHASE1_DISPOSABLE_PROJECT_REF`
- `PHASE1_APP_URL`
- `PHASE1_ACCEPTANCE_TOKEN` (a newly generated disposable value with at least
  32 characters)
- `PHASE1_CONFIRM_DISPOSABLE=I_CONFIRM_THIS_PROJECT_IS_DISPOSABLE`
- migration-capable Supabase CLI/management authorization or a disposable
  PostgreSQL connection credential

The existing `.env.local` must not be overwritten. Use a dedicated disposable
worktree/deployment or set session-only variables through the approved secret
workflow.

## Exact continuation gate

1. Identify the authorized disposable project and migration-capable access path.
2. Reset it to zero and apply migrations `001` through `012` in order.
3. Run `supabase/verification/phase1_catalog_checks.sql` and retain redacted
   output.
4. Build and run the application using only the disposable configuration.
5. Run `npm run test:phase1:live` and retain the sanitized JSON result.
6. If any case fails, patch source, reset to zero and repeat all steps.
7. Replace every `NOT RUN` above with timestamped evidence.
8. Only when every row passes may this document state `PASS — LIVE VERIFIED`.

Phase 2 remains prohibited until that state is reached.
