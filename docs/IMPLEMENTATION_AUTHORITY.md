# Implementation Authority

This repository is implemented against the following order of authority:

1. `G Force Tyres Mobile — Master PRD, TRD & Production Architecture v3.0.md`
2. `DESIGN.md`
3. `G Force Tyres — A–Z Frontend & Backend Vibe-Coding Prompts`
4. `gforce-complete-build-system.md` (legacy reference only)

When two sources conflict, the higher-ranked source wins. Existing working
frontend code should be preserved unless canonical requirements explicitly
require modification for security, reliability, performance, accessibility, or
production correctness.

The Phase 0–1 production-hardening instruction is the active execution scope.
It authorizes safety controls, versioned V3 migrations, real admin
authentication, authorization, RLS, and their verification. It explicitly does
not authorize Phase 2 customer search or Phase 3 booking/commerce work.

The source documents currently live outside this repository in the project
owner's supplied files. Before a team or deployment pipeline treats this repo as
self-contained, copy the canonical Markdown sources into `docs/requirements/`
without editing their wording, then record their checksums.
