# G Force Tyres — Mobile Tyre Fitting Platform

Next.js 15 booking and commerce platform. Vehicle lookup, tyre catalogue,
slot booking with soft locks, Stripe deposits, and a customer-facing 3D hero.

**Build status when shipped to you:** `npm run build` passes, `tsc --noEmit`
reports 0 errors, `npm audit --omit=dev` reports 0 vulnerabilities.

**What that does *not* mean:** none of the money paths have been exercised
against real Stripe or real Supabase. Read [Before you go live](#before-you-go-live)
before this touches a customer.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # then fill it in — see below
npm run dev                    # http://localhost:3000
```

The site boots with an empty catalogue until you run the SQL below.

---

## 1. Supabase

Create a project at supabase.com (free tier is enough), then:

1. **SQL Editor → New query →** paste `supabase/schema.sql` → Run
2. **SQL Editor → New query →** paste `supabase/seed.sql` → Run

`seed.sql` gives you 20 tyres across 4 common UK sizes, 10 London service
zones, 2 fitters, and 3 weeks of weekday slots — enough to click through
the whole flow.

Then **Settings → API** and copy into `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
```

> The service key bypasses Row Level Security completely. It belongs in
> `.env.local` and your host's environment variables — never in a component,
> never in git.

Optionally schedule the cleanup job (Database → Extensions → enable `pg_cron`):

```sql
select cron.schedule('purge-holds', '*/5 * * * *', 'select purge_expired_holds()');
```

Without it, abandoned slot holds linger for their full 15 minutes rather
than being swept early. Not fatal, but slots free up slower.

---

## 2. Stripe

Test mode keys from dashboard.stripe.com/test/apikeys:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

For the webhook, run the Stripe CLI in a second terminal:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

It prints `whsec_...` — put that in `STRIPE_WEBHOOK_SECRET`.

**The webhook is not optional.** A booking only becomes `confirmed` when
`payment_intent.succeeded` arrives. Without the CLI running locally, every
test booking will sit at `pending_payment` forever and you will think the
code is broken when it is working exactly as designed.

Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

---

## 3. Optional services

Everything below is optional. The app runs without any of it.

| Variable | Without it |
|---|---|
| `ONEAUTO_API_KEY` | Registration lookup returns nothing; users enter tyre size manually. This is a valid launch mode and costs £0. |
| `RESEND_API_KEY` | Emails are logged to console instead of sent. |
| `TURNSTILE_SECRET_KEY` | Bot check is skipped in dev. **In production the code refuses requests when this is missing** — that is deliberate. |

---

## Architecture

```
Browser ──► Next.js API routes ──► Supabase (service key, bypasses RLS)
                    │
                    ├──► Stripe        (deposit PaymentIntent)
                    ├──► OneAutoAPI    (VRM → OEM tyre size, cached 60 days)
                    ├──► Postcodes.io  (postcode validation, free)
                    └──► Resend        (transactional email)
```

The browser's anon key can only read the public catalogue: tyres, slots,
zones, settings. Every write and every read of customer data goes through
an API route. That is why `schema.sql` has no "anon can insert booking"
policy — the browser never writes.

### Money

Every monetary value in the codebase is an **integer number of pence**.
£149.00 is `14900`. There are no floats anywhere in the money path.
`formatPrice()` in `lib/utils.ts` is the only place money becomes a string.

### The two files that matter most

**`src/lib/pricing.ts`** — the browser sends tyre IDs and quantities.
It never sends a price. Every figure that reaches Stripe is recalculated
here from the database. If you ever change this to accept a client-supplied
price, someone will pay £1 for four Michelins.

**`src/app/api/stripe/webhook/route.ts`** — the only place a booking becomes
`confirmed`. The browser's success redirect is a UI convenience, not proof
of payment. Signature verification runs before anything else touches the DB.

### Slot locking

Two customers hitting the last slot simultaneously is handled in Postgres,
not JavaScript. `create_slot_hold()` takes a row lock on the slot before
counting availability, so the race cannot happen. Holds expire after 15
minutes.

---

## Deployment

### Vercel (simplest)

Push to GitHub, import at vercel.com, paste the environment variables. Done.

### Cloudflare Workers (£0 fixed cost)

```bash
npm run pages:build
npm run pages:deploy
```

Set the same environment variables in the Cloudflare dashboard.

Either way, **update the Stripe webhook endpoint** to your live URL at
dashboard.stripe.com/webhooks, subscribing to:

- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

---

## Before you go live

This codebase compiles and builds. It has not been run against real
services. Work through this list before a paying customer sees it.

### Money paths — non-negotiable

- [ ] Complete a test booking end to end with card `4242 4242 4242 4242`
- [ ] Confirm the booking flips `pending_payment` → `confirmed` in Supabase
- [ ] Confirm tyre `stock` decremented by the right quantity
- [ ] Fire the same webhook event twice (`stripe events resend <id>`) and
      confirm stock does **not** decrement twice
- [ ] Tamper with the request: intercept `/api/checkout/create` and change
      a quantity or inject a `price` field. The server must ignore it.
- [ ] POST to `/api/stripe/webhook` with a wrong signature → expect 400
- [ ] Let a slot hold expire mid-checkout → expect a clean "reservation
      expired" message, not a crash
- [ ] Process one real £1 live-mode payment before opening to customers

### VRM lookup

- [ ] **Log one real OneAutoAPI response and verify the field names in
      `normaliseOneAutoResponse()` actually match.** The parser is written
      against the documented shape, not a captured response. Until you have
      checked this, treat VRM lookup as unverified.
- [ ] Confirm a repeat lookup for the same plate hits `vrm_cache` and does
      not bill you twice
- [ ] Confirm an out-of-area postcode never reaches the paid API

### Rate limiting and bots

- [ ] 4 VRM lookups from one IP inside 10 minutes → 4th returns 429
- [ ] 6 checkout attempts from one IP inside an hour → 6th returns 429
- [ ] Set `TURNSTILE_SECRET_KEY` in production and confirm requests without
      a token are rejected

### Frontend

- [ ] Booking flow on a real mid-range Android phone, not just DevTools
- [ ] 3D hero: check the frame rate on that same phone. If it stutters,
      raise the fallback threshold in `useCanRender3D()`.
- [ ] Keyboard-only pass through the entire booking flow
- [ ] Enable "reduce motion" in OS settings and confirm the site still works

---

## Known gaps

These are deliberately unbuilt, not oversights:

- **Admin dashboard** — schema, RLS, and audit logging are in place; the UI
  is not. Bookings can be managed from the Supabase table editor in the
  meantime.
- **Manage-booking page** (`/manage/[token]`) — the route and secure token
  exist; the reschedule/cancel UI does not.
- **Automated tests** — no Playwright or Vitest suite. The checklist above
  is the manual substitute.
- **Payment page** (`/booking/pay`) — the API returns a `client_secret`;
  the Stripe Elements form is not wired up.

---

## Project layout

```
src/
├── app/
│   ├── page.tsx                 Homepage: 3D hero + tyre finder
│   ├── tyres/                   Catalogue results
│   ├── confirmation/[ref]/      Post-payment summary
│   └── api/
│       ├── vrm/lookup/          Gated vehicle lookup
│       ├── holds/               Slot soft-locking
│       ├── checkout/create/     Booking + PaymentIntent
│       └── stripe/webhook/      Payment confirmation
├── components/
│   ├── 3d/                      React Three Fiber tyre
│   ├── animations/              Lenis + GSAP scroll reveals
│   ├── booking/                 TyreFinder gate
│   ├── layout/                  Header, Footer
│   └── ui/                      MStripe
├── lib/
│   ├── pricing.ts               ⚠ server-side price authority
│   ├── supabase.ts              anon + service clients
│   ├── oneauto.ts               VRM lookup with cache
│   ├── postcodes.ts             coverage checking
│   ├── rateLimit.ts             Postgres-backed throttling
│   ├── turnstile.ts             bot verification
│   ├── validation.ts            Zod schemas, UK reg/postcode rules
│   └── email.ts                 Resend templates
└── types/index.ts               shared types

supabase/
├── schema.sql                   tables, RLS, atomic functions
└── seed.sql                     demo catalogue and slots

DESIGN.md                        design system — read before UI work
```

---

## Design system

`DESIGN.md` is the single source of truth for colour, type, spacing, and
motion. `globals.css` implements it as CSS custom properties; `tailwind.config.ts`
maps Tailwind utilities onto those same properties.

Never hardcode a hex value in a component. If you need a colour that is not
in the token set, add it to both files first.

When prompting an AI agent to build UI for this project, paste the
"Agent Prompt Guide" section at the bottom of `DESIGN.md` into the prompt.
