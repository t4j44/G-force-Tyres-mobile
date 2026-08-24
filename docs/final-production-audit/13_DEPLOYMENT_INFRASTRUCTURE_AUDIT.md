# Final Deployment and Infrastructure Audit

## Deployment readiness

DEPLOYMENT READY: 15%

Repository configuration status: PARTIAL.

External account/deployment status: BLOCKED_EXTERNAL.

## Actual configuration

| Item | Evidence | Status | Finding |
|---|---|---|---|
| Next build | package.json:7; fresh exit 0 | LOCAL_VERIFIED | application compiles |
| OpenNext package | manifest ^1.3.0; lockfile 1.20.2 | LOCAL_VERIFIED | adapter build not run/accepted |
| Build/deploy commands | package.json:13-15 | PARTIAL | pages:dev references .vercel/output/static |
| Wrangler | wrangler.toml:1-4 | PARTIAL | nodejs_compat plus pages_build_output_dir |
| open-next.config | file absent | MISSING | no explicit runtime override/queue/incremental-cache config |
| CI/CD | no .github workflow found | MISSING | no repeatable gated pipeline |
| Staging | no environment/domain evidence | MISSING | production cannot be rehearsed |
| Custom domain/TLS/DNS | no account evidence | BLOCKED_EXTERNAL | client-owned Cloudflare needed |

The repository contains the OpenNext Cloudflare package and deploy command, but
the Wrangler file and command naming still describe legacy Pages-style output.
Without an adapter build and deployed preview, this audit cannot determine that
the resulting target is a working Cloudflare Worker. Classify the target as
ambiguous, not confirmed.

## Environment viability

The fresh production server failed in instrumentation because
NEXT_PUBLIC_TURNSTILE_SITE_KEY was empty. Secret-safe status inspection also
found SUPABASE_SERVICE_ROLE_KEY, VRM_CACHE_ENCRYPTION_KEY and APP_URL absent;
ONEAUTO_API_KEY and TURNSTILE_SECRET_KEY empty; and only the unused legacy
SUPABASE_SERVICE_KEY present.

This is expected for an unconfigured workstation, but it proves the current
checkout cannot start as production. Values must be supplied through
Cloudflare/Supabase-approved secret stores, with public variables separated from
secrets and staging separated from production.

## Runtime compatibility risks

- API routes declare runtime=nodejs; Cloudflare compatibility must be exercised
  through the actual adapter, especially Stripe raw bodies, Supabase SSR cookies,
  Resend and background work.
- Fire-and-forget email after a webhook response is unsafe without a durable
  Cloudflare primitive or outbox.
- Middleware is 119 kB and must be measured on the deployed edge.
- Next image optimization and the unrestricted remote image hostname pattern
  require Cloudflare verification and host restriction.
- No scheduled mechanism owns expired holds, reminders or cache purge.

## Dependency/maintenance inventory

package.json declares minimum/range versions; package-lock.json resolves the
actual installed versions:

| Package | Manifest declaration | Lockfile resolution |
|---|---|---|
| Next | 15.5.23 | 15.5.23 |
| React | ^19.0.0 | 19.2.8 |
| TypeScript | ^5.6.3 | 5.9.3 |
| @supabase/ssr | ^0.5.1 | 0.5.2 |
| @supabase/supabase-js | ^2.45.4 | 2.112.3 |
| stripe | ^17.2.0 | 17.7.0 |
| @stripe/react-stripe-js | ^3.0.0 | 3.10.0 |
| @stripe/stripe-js | ^4.9.0 | 4.10.0 |
| resend | ^4.0.0 | 4.8.0 |
| @opennextjs/cloudflare | ^1.3.0 | 1.20.2 |
| wrangler | ^4.86.0 | 4.125.0 |
| three | ^0.169.0 | 0.169.0 |
| @react-three/fiber | ^9.0.0 | 9.7.0 |
| @react-three/drei | ^10.0.0 | 10.7.8 |
| zustand | ^5.0.0 | 5.0.15 |

No online freshness/CVE claim is made. No npm audit or dependency update was
performed. Required maintenance:

- run a current lockfile vulnerability/SBOM/license scan in CI;
- verify the Stripe SDK API version and Cloudflare adapter against official
  compatibility docs at implementation time;
- remove Three/Fiber/Drei if the unused WebGL scene remains dead;
- remove Stripe React/JS packages if Checkout redirect needs no Elements;
- keep package-lock.json authoritative and document a working Node/npm version.

Automatic upgrades are not justified by this audit.

## Required deployment gate

Create client-owned Cloudflare staging, configure secrets, run the exact
OpenNext adapter build, deploy preview, test every dynamic/API route, inspect
logs and cookies, run E2E and performance, configure alerts/custom domain, prove
rollback, then run one end-to-end Stripe test transaction. Production deployment
must not precede this.
