# Performance Baseline

Measured 2026-08-23 from baseline commit
`e13bbaed888dd96fe657572787bf685d706277fa` on Windows using Next.js 15.5.23.
These are local build measurements, not field p75 data.

## Build and route baseline

- `npm run typecheck`: passed.
- `npm run build`: passed; optimized compile completed in 59 seconds.
- Lint at baseline: script invoked interactive `next lint` configuration and could not run non-interactively. Phase 1 adds an explicit ESLint config.
- Source routes: 14 page files and 10 API route files.
- Client modules containing `use client`: 14.
- Public image assets: 0.

| Route | Baseline route JS | Baseline first-load JS |
|---|---:|---:|
| `/` | 5.53 kB | 119 kB |
| `/booking` | 6.59 kB | 124 kB |
| `/tyres` | 172 B | 106 kB |
| `/admin/login` | 1.71 kB | 112 kB |
| Shared by all routes | — | 103 kB |

## 3D and dependency baseline

- `TyreScene` is dynamically loaded with SSR disabled.
- Its four loadable JavaScript chunks total approximately 898.6 KiB raw (uncompressed). This is not part of the 119 kB homepage initial first-load figure, but it is a material deferred download and execution cost.
- Largest installed dependency directories (development disk size, not shipped bundle size): Next 133.25 MiB, Three.js 26.11 MiB, Lucide 23.46 MiB, date-fns 10.40 MiB, React DOM 6.98 MiB, GSAP 5.97 MiB, Stripe 5.11 MiB.

## Lighthouse and Core Web Vitals

No Lighthouse values are recorded. The repository has no Lighthouse binary or
repeatable local audit harness, and local build output cannot produce LCP, INP,
TBT, CLS, performance or accessibility scores. Therefore these values are
`NOT MEASURED`, not assumed to pass.

Before launch, run mobile Lighthouse against a production-like deployment for
`/`, `/booking`, `/tyres`, and `/admin/login`, then collect real-user p75 LCP,
INP and CLS. Targets remain LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1.
