# G Force Tyres Admin Console and Next-Steps Guide

Guide date: 2026-08-24
Workspace: `E:\Taqi Project\gforce-tyres`

## The short answer

The dispatch console is **not fully operational yet**. Its basic authorization
shape is in place: Supabase email/password sign-in, an active owner/admin role
check, protected admin pages, logout and guarded admin mutation routes. The audit
schema/helper is only partially implemented and is not yet a comprehensive,
failure-visible operational audit trail. Local checks confirm that an anonymous
visitor is redirected from `/admin` to `/admin/login`.

The operational data is not live. Bookings, inventory and slot tools currently
use development-only, in-memory mock data when mock mode is enabled. That data
can reset, is not safe across multiple servers or operators and must not be used
to run real customer bookings. With mock mode disabled, those pages deliberately
show a Phase 3 pending state.

**Workspace credential: none.** No default ID or password exists in this
repository. Whether an authorized remote Supabase project already contains
users is unknown and unverified; passwords cannot be recovered from this
workspace. The login ID will be the named operator's email. Create or reset its
password privately in Supabase—never request or share an existing password.
Each operator also needs a matching active row in `public.admin_profiles`.

## What works and what does not

| Capability | Current status | Evidence or limitation |
|---|---|---|
| Open `/admin/login` | Verified locally | Returns HTTP `200`. |
| Block anonymous `/admin` access | Verified locally | Redirects to `/admin/login` with HTTP `307`. |
| Block anonymous admin mutations | Partially verified locally | `/api/admin/slots/update` returned `401`; both current slot routes are statically confirmed to call `requireAdmin()`. |
| Supabase password sign-in code | Implemented, not live-accepted | Requires a real migrated test project and test users. |
| Active owner/admin role check | Implemented, not live-accepted | Checks `admin_profiles.active` and permits only `owner` or `admin`. |
| Logout and session cookies | Implemented, not live-accepted | Needs an authenticated end-to-end test. |
| Audit logging | Partially implemented | Schema/helper exists and demo slot routes attempt writes, but failures are swallowed and booking/inventory mock actions are not audited. |
| Booking queue UI | Development demonstration | Reads and changes in-memory mock bookings only. |
| Inventory UI | Development demonstration | Reads and changes in-memory mock stock only. |
| Slot schedule UI | Development demonstration | Mock mutations only; persistent mode returns `501 Not Implemented`. |
| Persistent database operations | Not implemented | Phase 3 work is required. |
| Real Stripe payment and refunds | Not implemented | Do not collect card data through the current mock flow. |
| Real confirmation email | Not implemented | Resend integration is pending. |
| Production readiness | Not achieved | Live database, security, payment and device tests remain. |

## How the admin identity works

Founder explanation: the login name is the operator's business email, and the
password is set in Supabase. A second database record grants that person the
`owner` or `admin` role. Knowing a valid email and password is therefore not
enough unless the matching admin profile is active.

Technical explanation:

1. Supabase Auth verifies the email and password and creates a cookie-backed
   session.
2. The application looks up the authenticated user's UUID in
   `public.admin_profiles`.
3. Access is granted only when `active = true` and `role` is `owner` or `admin`.
4. Protected pages repeat the authorization check on the server. Current admin
   mutation routes also call the same independent guard.

## Create the first owner safely

Do this against a **disposable non-production Supabase project first**. Do not
paste passwords, access tokens or service-role keys into chat, documentation or
screenshots.

1. Create or select the disposable Supabase project.
2. Apply every SQL file in `supabase/migrations/` in numeric order.
3. Configure the application's Supabase URL and browser-safe anonymous key.
   Keep `SUPABASE_SERVICE_ROLE_KEY` server-only; never prefix it with
   `NEXT_PUBLIC_`.
4. For the disposable test, in Supabase Dashboard open **Authentication ->
   Users**, use the dashboard's direct user-creation path and create the named
   owner with their individual business email. For production invitations,
   configure the approved site redirect and email/SMTP delivery first, then test
   the invite and recovery links in staging.
5. Set a strong unique password privately through Supabase Auth. Do not create a
   shared `admin` account and do not send the password in chat.
6. Copy the user's Auth UUID.
7. In Supabase SQL Editor, replace the placeholder UUID and confirm that it maps
   to the expected email before granting any role:

```sql
select id, email
from auth.users
where id = '00000000-0000-0000-0000-000000000000';
```

8. If the result is not exactly the intended user, stop. If it is correct, run
   this fail-closed insert with the real UUID and name:

```sql
insert into public.admin_profiles (user_id, name, role, active)
values ('00000000-0000-0000-0000-000000000000', 'Owner Name', 'owner', true);
```

   If the unique-user constraint rejects this insert, stop and inspect the
   existing profile. Do not silently overwrite, promote or reactivate it.
9. Confirm exactly one active `owner` row matches that user's Auth UUID.
10. Sign in at `/admin/login` using the owner's email and password.
11. Verify `/admin` loads, sign out, and verify `/admin` redirects to login.
12. Temporarily set the test profile to `active = false` and confirm that the
    same credentials are denied. Restore it only after recording the result.

The more detailed bootstrap procedure is in `docs/ADMIN_BOOTSTRAP.md`.

## Required acceptance test before using a real owner account

This is developer/security-operator work, not a task for a nontechnical owner to
perform unaided. The operator should configure `.env.local` from `.env.example`
using the disposable project's `NEXT_PUBLIC_SUPABASE_URL`, browser-safe
`NEXT_PUBLIC_SUPABASE_ANON_KEY` and server-only
`SUPABASE_SERVICE_ROLE_KEY`. Hosted staging must receive the same variable names
through its secret settings, not a committed `.env` file.

Apply `supabase/migrations/001_*.sql` through `012_*.sql` in numeric order in the
disposable project's SQL Editor. Start the local app with `npm run dev`. On this
workstation, if the `npm` launcher is unavailable, use
`node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3000`.
Create three disposable test identities—a normal authenticated user with no
admin profile, an inactive admin and an active owner—and record redacted evidence
for every case below:

1. Anonymous `/admin` request redirects to `/admin/login`.
2. Wrong password receives a generic denial and does not reveal whether the
   email exists.
3. A valid normal user receives a generic denial and is signed out.
4. An inactive admin is denied.
5. An active owner can open protected pages and sign out.
6. Anonymous database reads of `customers` are denied by Row Level Security
   (RLS—database rules that restrict rows by identity).
7. Anonymous database reads of `payments` are denied by RLS.
8. Browser JavaScript contains no service-role key or service-role variable.

Use `docs/ADMIN_SECURITY_TESTS.md` as the executable acceptance runbook and
record; it contains commands, expected results and sign-off fields. Run
`npm run test:security` or, if the local `npm` launcher is unavailable,
`node scripts/security-check.mjs`. That command checks structure only; it does
not replace the live Auth/RLS procedures. Source inspection alone is not a pass
for the live Supabase scenarios.

Before a production owner signs in, also decide and test the MFA policy, password
recovery, Auth provider rate limits/login-abuse response, session-cookie
attributes and confirmed session revocation. These controls are not currently
accepted.

## What Phase 3 must add to make dispatch operational

### Required features

- Persistent booking list, search, detail and status changes backed by Supabase.
- Inventory catalogue and stock transactions, including reservations and
  releases rather than directly overwriting a number.
- Persistent availability rules, blocked dates, fitter/van capacity and slot
  generation.
- Atomic holds: the database must prevent two customers from buying the same
  stock or capacity at the same time.
- Stripe PaymentIntent or Checkout creation on the server, verified idempotent
  webhooks, refunds and reconciliation.
- Booking confirmation, cancellation and reschedule records.
- Transactional emails through Resend after verified state changes.
- Audit records for admin changes, with operator, action, resource and time.
- Role-aware access, session revocation and an owner-controlled offboarding
  process.
- Monitoring, backups, alerting and automated browser tests.

### Suggested architecture

- **Frontend:** keep Next.js and the existing admin pages.
- **Database/Auth:** Supabase PostgreSQL and Supabase Auth, after the migrations
  and RLS rules pass the disposable-project test.
- **Server operations:** Next.js route handlers using the server-only Supabase
  service client after `requireAdmin()` succeeds.
- **Payments:** Stripe server endpoints plus signature-verified webhooks.
- **Email:** Resend, triggered only from confirmed server-side booking events.
- **Testing:** unit tests for pricing/state rules and Playwright browser tests for
  customer and admin journeys.

Complexity is **high** because booking, stock and payment state must remain
correct during retries, duplicate webhooks and simultaneous customers. A cheap
UI-only shortcut would look complete but could oversell stock or lose money.

## Recommended parallel work and engineering gates

Two owner-led tracks can begin immediately: visual/interaction acceptance and
the business truth pack. The disposable Supabase acceptance is the **first
engineering/security gate**; do not proceed to authenticated admin acceptance or
Phase 3 persistence until it passes.

| Order | Outcome | Estimated effort* | Exit gate |
|---:|---|---:|---|
| Parallel A | Accept the current visual and interaction baseline | 0.5-1.5 days | Mobile/desktop, keyboard, reduced-motion and overflow checks recorded. |
| Parallel B | Approve business truth and test access | 1-3 owner-led days | Coverage, contact details, pricing, policies and test services are documented. |
| Gate 1 | Pass live Phase 1 Supabase acceptance | 1-2 days | Fresh migrations plus all admin Auth/RLS tests pass. |
| Gate 2 | Validate operations manually | 2-5 operating days | Process 10-20 genuine enquiries without mock payments and record exceptions. |
| Gate 3 | Connect real search and service-area data | 3-6 days | Real postcode, vehicle/manual-size and catalogue journeys pass without demo fallback. |
| Gate 4 | Build persistent booking, dispatch and money flows | 8-15 days | Holds, stock, Stripe, email, refunds and admin state transitions pass failure tests. |
| Gate 5 | Production hardening | 3-7 days | Cross-browser E2E, accessibility, mobile performance, monitoring and restore rehearsal pass. |
| Launch | Controlled pilot launch | Operational decision | Limited coverage/cap; first bookings reconcile across payment, stock, email and dispatch. |

\*Planning estimates assume one experienced full-stack developer, prompt owner
decisions and working test-service access. They are not fixed-price promises.

## Cheapest sensible next move

Do not spend the next cycle making the mock dispatch screen look more complete.
First run the disposable Supabase acceptance test, while the owner assembles the
business truth pack. Then process 10-20 enquiries manually through an owned
phone/inbox or a clearly non-transactional enquiry form. This reveals real
coverage, fitment, sourcing and cancellation exceptions before they are encoded
into an expensive workflow.

Do not collect card details, promise mock availability or treat the development
booking count as business evidence.

## Inputs the owner needs to provide

1. Authorized disposable Supabase project access or an authorized operator who
   can execute the migrations and tests.
2. Business email for the named first owner; keep its password private.
3. Approved legal/company name, phone, email, address and operating hours.
4. Exact initial service postcodes and callout-fee rules.
5. Authorized tyre catalogue/stock source and fitted-price formula.
6. Approved deposit, cancellation, refund and reschedule policies.
7. Test access for OneAuto, Stripe, Resend and Turnstile.
8. Target pilot date, booking cap and named operational/security owners.

## Recovery and offboarding

- To remove access, set `admin_profiles.active = false` immediately and revoke
  the user's Supabase Auth sessions.
- Never fix access by exposing the service-role key to browser code.
- Keep one account per human operator. Never share the owner credentials.
- Record who approved each role change and when.

## Current local-development note

The local environment declares Supabase public variables and explicitly enables
development mock mode. Their presence does not prove that the values point to a
migrated, authorized or working Supabase project. No working admin credential is
stored or reported by this guide.

For the wider launch status, blockers and evidence, read
`docs/PROJECT_STATUS_2026-08-24.md` and `docs/VERIFICATION_EVIDENCE.md`.
