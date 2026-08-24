# Final Defect Register

Counts in this register: P0 0; P1 18; P2 14; P3 3.

P0 is zero only because real customer commerce is currently fail-closed. Do not
reinterpret this as low risk: enabling the disabled branches without the P1
fixes would create P0-impact money, fitment and overselling conditions.

## P1 — Launch and integrity blockers

| ID | Priority | Title | Evidence | Risk | Affected files | Recommended fix | Verification required |
|---|---|---|---|---|---|---|---|
| P1-01 | P1 | Live Supabase gate not passed | LIVE_SUPABASE_VERIFICATION.md:7-9,118-129 | Auth/RLS/schema assumptions unproven | migrations, auth clients, harness | disposable reset/migrate/test/fix/repeat | all Gate 0 cases LIVE_VERIFIED |
| P1-02 | P1 | Real postcode/coverage disabled and mismatched | postcode/check route.ts:13-17; postcodes.ts:34-71; 004_service_zones.sql | false coverage/fees or no service | postcode route/helper/types | query V3 names, normalize, fail unavailable, admin zones | in/out/invalid/provider-timeout tests |
| P1-03 | P1 | OneAuto contract wrong with generic BMW fallback | oneauto.ts:95-180 | dangerous wrong fitment | oneauto.ts, vrm route | correct endpoint/query/x-api-key/parser; remove generic fallback; encrypted cache | authorized sandbox vehicles/staggered/unknown |
| P1-04 | P1 | Bot/rate protection ineffective | rateLimit.ts:7-43; no rate_limits migration; Turnstile not live | abuse, quota/cost exhaustion | rateLimit.ts, Turnstile, migrations | atomic durable limiter and enforced Turnstile | pass/fail/replay/parallel/failure tests |
| P1-05 | P1 | No real public catalogue/inventory source | tyres/page.tsx:25-37 | no products or fictional stock/prices | catalogue page, API/data access | server query/view for active products and availability; import pipeline | seeded real catalogue/filter/empty/error |
| P1-06 | P1 | Runtime/domain types diverge from V3 schema | types/index.ts vs migrations 004-010; backend report matrix | real queries fail silently/fallback | types, postcodes, slots, pricing | generated DB types and explicit mappers; remove legacy names | type/integration contract tests |
| P1-07 | P1 | No atomic slot-capacity hold | holds/create route.ts:44-52; RPC absent | double booking | booking_slots, slot_holds, holds routes | transactional row-lock RPC with expiry/capacity | 20-way final-slot test |
| P1-08 | P1 | No atomic inventory hold/reservation | inventory_holds unused; pricing.ts:74-93 | overselling | inventory, inventory_holds, pricing/checkout | lock inventory rows and reserve atomically | 20-way final-stock and expiry test |
| P1-09 | P1 | No persistent pending booking transaction | checkout route creates LocalBookingStore at 120-180 | lost/duplicate/incomplete bookings | customers/bookings/items/payments APIs | one server transaction with immutable snapshots | rollback/fault-injection/integration tests |
| P1-10 | P1 | Server pricing targets nonexistent tables and mock fallback | pricing.ts:19-93 | incorrect money | pricing.ts, business_settings, inventory | authoritative V3 query and no production fallback | tamper/rounding/settings/stock tests |
| P1-11 | P1 | Stripe Checkout not implemented | checkout route.ts:184-201; pay page mock form | cannot safely collect deposit | checkout/pay/Stripe modules | Stripe Checkout Session with persisted association | success/cancel/failure test-mode E2E |
| P1-12 | P1 | Webhook database/idempotency contract absent | webhook route.ts:49-88; RPCs/booking column absent; webhook_events unused | paid but unconfirmed, duplicate side effects | webhook, migrations, payments | signature-verified atomic event transaction | forged/duplicate/out-of-order/amount tests |
| P1-13 | P1 | Payment expiry/failure/refund resource lifecycle missing | webhook route.ts:70-88; no cleanup job | stranded stock/slots, unreconciled refund | holds/payments/webhook/scheduler | release/reconcile/refund transactions and scheduler | expiry/failure/full/partial refund tests |
| P1-14 | P1 | Transactional email not reliable/live | email.ts:21-34; webhook route.ts:65-66 | customer receives no confirmation; silent failures | email.ts, webhook/background | verified domain, escaped templates, durable outbox/retry | inbox, retry, duplicate, provider-failure tests |
| P1-15 | P1 | Customer manage booking is mock-only | manage/[token]/page.tsx:39-73,258-270 | no secure self-service | manage page, token/API/schema | hashed/scoped/expiring token and persistent cancel/reschedule | leakage/guess/expiry/revocation/E2E |
| P1-16 | P1 | Admin operating system is mock/missing | admin pages lines cited in report 09 | client cannot operate business | admin pages/APIs/audit | real CRUD for bookings/inventory/slots/zones/fitters/settings/access | role/persistence/conflict/audit E2E |
| P1-17 | P1 | Deployment, monitoring and DR not accepted | wrangler.toml; no CI/staging/alerts/restore; production start failed | undetected outage/no safe recovery | deployment config/runbooks | client-owned staging, CI, alerts, backup restore and rollback | full staging rehearsal |
| P1-18 | P1 | Claims/legal/account ownership unresolved | CLAIMS_REGISTER.md:5-35; draft legal pages; ownership unknown | misrepresentation/compliance/handoff failure | copy/legal/config/accounts | owner truth pack, qualified review, account transfer matrix | signed approval and prelaunch content scan |

## P2 — Important production quality

| ID | Priority | Title | Evidence | Risk | Affected files | Recommended fix | Verification required |
|---|---|---|---|---|---|---|---|
| P2-01 | P2 | Hook dependencies and ignored async outcomes | lint warnings at admin bookings/slots; admin fetch calls | stale UI or hidden mutation failure | admin pages | stable callbacks and authoritative response/error handling | unit/component tests |
| P2-02 | P2 | Mock fixtures remain in browser bundle | static scan found demo-token-123, GF-842910, Local fitment preview | bundle bloat/confusing artifact | mockData imports/client pages | isolate dev fixtures behind server/dev-only module | production chunk scan zero |
| P2-03 | P2 | Unused WebGL scene and 3D dependencies | no active imports of TyreScene; package.json Three/Fiber/Drei | maintenance/bundle install surface | 3d components/package | remove if rejected, or explicitly own/test if restored | dependency/build comparison |
| P2-04 | P2 | No application security headers/CSP | next.config.mjs:12-26 | weaker browser containment | Next/Cloudflare config | deploy-tested CSP, HSTS, frame/referrer/permissions headers | header scanner + CSP E2E |
| P2-05 | P2 | Any HTTPS image host allowed | next.config.mjs:21-23 | SSR fetch/asset policy exposure | image config | allowlist supplier/CDN domains | build and remote image tests |
| P2-06 | P2 | Technical/local SEO incomplete | layout.tsx:6-16; no sitemap/robots/canonical/schema | poor indexing/control | app metadata/routes | add approved sitemap, robots, canonical and structured data | crawler/schema validation |
| P2-07 | P2 | Accessibility acceptance absent | source positives but no axe/keyboard/screen-reader results | WCAG failures | public/admin UI | focus/dialog fixes and WCAG 2.2 AA test suite | axe + manual assistive-tech pass |
| P2-08 | P2 | Performance targets unmeasured | build sizes only; no LCP/INP/CLS | mobile conversion risk | app/assets/motion | mobile lab/RUM budget and regression gate | LCP/INP/CLS accepted |
| P2-09 | P2 | MFA/recovery/admin security policy absent | ADMIN_SECURITY_TESTS.md:139; no routes/policy | admin account takeover/recovery risk | Supabase Auth/admin docs | owner policy, MFA, recovery and access review | live enrol/recover/revoke tests |
| P2-10 | P2 | Privacy retention/consent operations missing | draft privacy page; interest/VRM/audit tables | data retained/used without operations | privacy, schema/jobs/email | approved retention, purge, DSAR and consent separation | privacy review + purge test |
| P2-11 | P2 | Legacy schema/seed remain dangerous | README.md:39,243-244; legacy files | operator may initialize wrong schema | supabase/schema.sql, seed.sql | quarantine/rename with executable guard or remove after archival | fresh operator rehearsal |
| P2-12 | P2 | Local environment/toolchain drift | service key wrong name; missing npm-cli; required vars absent/empty | unreliable handoff/startup | .env example/docs/tooling | validated setup script and exact supported runtime | clean-machine bootstrap |
| P2-13 | P2 | Locked tier language diverges | PRD Budget/Standard/Premium; schema/UI Mid-Range | product inconsistency/data migration cost | migration/types/catalogue UI | adopt Standard enum/label before data import | migration/filter/content tests |
| P2-14 | P2 | Admin conflict/loading/error quality incomplete | AdminDataPending plus mock optimistic state | operator mistakes/concurrent overwrite | admin UI/APIs | server pagination, row versions, conflict/error/empty UX | two-operator E2E |

## P3 — Polish/maintainability

| ID | Priority | Title | Evidence | Risk | Affected files | Recommended fix | Verification required |
|---|---|---|---|---|---|---|---|
| P3-01 | P3 | Remaining unused imports/any warnings | 44 lint warnings total | maintainability noise | lint output files | remove unused imports and type any values | lint with zero agreed warnings |
| P3-02 | P3 | Comments overstate nonexistent transaction behavior | holds/create route.ts:12-14; webhook route.ts:19-20 | maintainer false confidence | holds/webhook routes | rewrite comments with actual guarantees after implementation | code review against SQL |
| P3-03 | P3 | Root-only metadata/copy lacks route refinement | layout metadata only | presentation/search polish | public routes | add per-route approved metadata after truth pack | preview/content review |
