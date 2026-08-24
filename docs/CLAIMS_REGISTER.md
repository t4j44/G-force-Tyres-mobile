# Public Claims Register

Audit date: 2026-08-23.

The supplied brand board verifies the trading name presentation and palette
only. It does not verify service coverage, insurance, opening hours, pricing,
refunds, fleet, reviews, response times, legal entity details or contact data.
No operational claim below is classified as verified.

| Public statement | Location | Classification | Evidence or required action |
|---|---|---|---|
| `020 7946 0991` contact/dispatch number | `Header.tsx:119`, `Footer.tsx:19`, cancellation/manage pages, mock settings | REMOVE_BEFORE_PRODUCTION | Placeholder-style number; replace only after the client supplies the owned line |
| `24/7 Roadside & Home Callouts` | `Footer.tsx:58` | REMOVE_BEFORE_PRODUCTION | Requires staffed-hours and roadside-capability evidence |
| Same-day slots / book before 11am | `app/page.tsx:27`, root metadata | CLIENT_CONFIRMATION_REQUIRED | Confirm fleet capacity, cutoff rule and operating days; drive from business settings |
| Fully insured / every fitting covered | `app/page.tsx:29` | REMOVE_BEFORE_PRODUCTION | Require current policy wording, insurer, limits and permitted public wording |
| Home, work and roadside service | header, homepage, metadata | CLIENT_CONFIRMATION_REQUIRED | Confirm roadside safety/permissions and exact service modes |
| Across London / Greater London / listed boroughs | homepage, footer, privacy, terms, email | CLIENT_CONFIRMATION_REQUIRED | Confirm launch postcodes; render from live `service_zones` rather than prose |
| Booking in under/about two minutes | metadata and homepage | REMOVE_BEFORE_PRODUCTION | Requires measured production funnel timing |
| Free/no-hidden callout fees in core zones | booking finder, tyre catalogue | CLIENT_CONFIRMATION_REQUIRED | Confirm fee rules and source all output from live zones |
| `100% Fitment Guarantee` | tyre catalogue | REMOVE_BEFORE_PRODUCTION | Requires written guarantee scope, exclusions and remedy |
| Professional workshop and Mercedes Sprinter fleet/equipment | tyre catalogue and site copy | CLIENT_CONFIRMATION_REQUIRED | Confirm actual vehicles and installed equipment |
| £50 deposit and free cancellation/full refund up to 48 hours | cancellation, payment, manage pages | REMOVE_BEFORE_PRODUCTION | Requires owner/legal approval and implemented Stripe refund behavior |
| Refund is instant/immediate or arrives in 5–10 days | cancellation and email templates | REMOVE_BEFORE_PRODUCTION | Contradictory timing; align to payment provider behavior and approved policy |
| Confirmation email/calendar invite sent | confirmation page | REMOVE_BEFORE_PRODUCTION | Email/calendar delivery is not implemented or verified in current scope |
| Driver calls 30 minutes before arrival | confirmation page | CLIENT_CONFIRMATION_REQUIRED | Confirm dispatch process and capability |
| G Force Tyres Ltd. | footer | CLIENT_CONFIRMATION_REQUIRED | Confirm registered legal entity name and company details |
| Privacy/terms representations about live processing | privacy and terms pages | CLIENT_CONFIRMATION_REQUIRED | Legal review after final data flows, processors and retention rules are known |
| Review rating, review count, tyres fitted, response time | no current public numeric claim found | CLIENT_CONFIRMATION_REQUIRED | Do not add until traceable evidence exists |
| Public business email and physical address | no verified value present | CLIENT_CONFIRMATION_REQUIRED | Supply owned inbox and legal/contact address before launch |

## Launch rule

Every `REMOVE_BEFORE_PRODUCTION` item must be removed or supported by evidence.
Every `CLIENT_CONFIRMATION_REQUIRED` item needs a named owner, evidence date and
approved wording. Do not infer verification from design documents or demo data.
