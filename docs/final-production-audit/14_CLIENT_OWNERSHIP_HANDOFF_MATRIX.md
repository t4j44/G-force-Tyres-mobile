# Final Client Ownership and Handoff Matrix

## Principle

Current ownership is not knowable from repository code and is recorded as
UNKNOWN, never guessed. Production accounts, billing, recovery methods and
domains should be owned by the client business. Developers should have named,
least-privilege, revocable collaborator access rather than personal ownership.

| Asset | Current owner | Desired production owner | Developer access needed | Transfer / verification action |
|---|---|---|---|---|
| Domain registrar | UNKNOWN | Client legal entity | DNS collaborator only if needed | record registrar, registrant, expiry, auto-renew, MFA and recovery |
| Cloudflare | UNKNOWN | Client legal entity | scoped admin/deployer | create client org, staging/prod projects, DNS/TLS, billing, logs, rollback |
| Supabase | UNKNOWN | Client legal entity | developer on disposable/staging; restricted prod | project transfer/create, MFA, backups, PITR/restore, service keys and access review |
| Stripe | UNKNOWN | Client legal entity/verified merchant | developer test-mode access; minimal prod diagnostics | verify business/bank/tax, webhook endpoints, restricted keys, refund roles |
| OneAuto | UNKNOWN | Client legal entity | sandbox credential/config access | confirm contract, quota, DPA, permitted cache and production key |
| Resend | UNKNOWN | Client legal entity | domain/config/log access | verify sending domain, SPF/DKIM/DMARC, sender, suppression and billing |
| GitHub/repository | UNKNOWN/local Git only | Client organization | maintainer during warranty; branch-protected | create/transfer private repo, teams, CI secrets, protected main, backup |
| Google Business Profile | UNKNOWN | Client business owner | manager only for approved launch work | verify location/service-area rules and ownership |
| Google Search Console | UNKNOWN | Client business owner | delegated full/read access | verify domain property, submit sitemap after launch |
| Merchant Center | UNKNOWN | Client business owner if used | scoped manager | decide whether applicable; verify product policy/feed before use |
| Business email | UNKNOWN | Client-owned domain/mail tenant | named support access only | create operations/support/privacy/security inboxes and recovery |

## Client action tracker required at Gate 0

Every UNKNOWN must be converted into an assigned record; the audit cannot name
people who are not evidenced.

| Accountability | Current assignee | Due gate | Status | Completion evidence |
|---|---|---|---|---|
| Client sponsor/approver | UNKNOWN | Gate 0 | BLOCKED_OWNER_DECISION | named person approves business truth, accounts and launch decisions |
| Technical account owner | UNKNOWN | Gate 0 | BLOCKED_OWNER_DECISION | named person owns Cloudflare/Supabase/GitHub access and recovery |
| Payments/refund owner | UNKNOWN | Gate 2 | BLOCKED_OWNER_DECISION | named Stripe account/refund/reconciliation owner |
| Operations owner | UNKNOWN | Gate 2 | BLOCKED_OWNER_DECISION | approved hours, capacity, stock, fitters, zones and escalation |
| Privacy/legal reviewer | UNKNOWN | Gate 5 | BLOCKED_OWNER_DECISION | dated approval of final data flows, claims, terms and policies |
| Incident/on-call owner | UNKNOWN | Gate 6 | BLOCKED_OWNER_DECISION | named primary/backup and tested alert acknowledgement |
| Handoff approver | UNKNOWN | Gate 8 | BLOCKED_OWNER_DECISION | signed acceptance, access review and developer offboarding |

The client sponsor should add accountable person, approver, target date and
evidence link for each asset row in the delivery tracker. UNKNOWN is a blocker,
not a value to carry into launch.

## Required handoff pack

- Account inventory with owner, billing owner, MFA, recovery and renewal dates.
- Named production/staging roles and offboarding checklist.
- Secret inventory by name/location/rotation date, never secret value.
- Architecture/data-flow/RLS/payment diagrams and runbooks.
- Deployment/rollback, backup/restore, incident and reconciliation runbooks.
- Supplier catalogue/import procedure and business-settings guide.
- Approved legal/claims pack and processor/DPA inventory.
- Test evidence, known-defect acceptance and warranty/support boundaries.

## Client handoff readiness

CLIENT HANDOFF READY: 15%.

The repository has useful baseline and phase documentation, but the client
cannot operate bookings, products, zones, fitters, settings, refunds or incidents
without engineering. No external ownership evidence exists. Handoff requires
Gate 8, not merely delivery of the source folder.
