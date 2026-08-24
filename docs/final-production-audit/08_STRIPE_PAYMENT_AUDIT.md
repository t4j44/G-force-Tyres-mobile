# Final Stripe and Payment Audit

## Readiness

PAYMENTS READY: 10%

Checkout status: MOCK_ONLY.

Webhook status: PARTIAL.

Stripe account/runtime status: BLOCKED_EXTERNAL.

## Current payment model

The intended requirement is Stripe Checkout for a deposit. Current development
code uses stripe.paymentIntents.create at
src/app/api/checkout/create/route.ts:184-201 and returns client_secret. The UI at
src/app/booking/pay/page.tsx:34-70 is a mock card form and explicitly refuses
card entry when mock mode is off at lines 72-80. Stripe Elements packages are
installed but no accepted production Elements integration exists.

Mock forms, test IDs and confirm-mock are excluded from readiness.

## Pricing and amount integrity

The client sends product IDs and quantities, not an amount
(src/lib/pricing.ts:11-16). The intended server boundary is correct. The actual
server calculation is unsafe because it reads nonexistent tables and falls back
to MOCK_SETTINGS/LocalBookingStore (pricing.ts:19-93). The booking page also
renders hardcoded £20 fitting and £50 deposit calculations at
booking/page.tsx:190-197.

Can a browser manipulate the amount?

- Current production: it cannot create a real checkout because the route returns
  501.
- Dormant implementation: the browser cannot directly set amount, but the
  server uses fictional/unreliable source data. Amount integrity is therefore
  not production-proven.

## Webhook audit

Positive source evidence:

- raw request text at webhook/route.ts:34;
- Stripe signature verification at lines 36-42;
- non-2xx response on confirmation error at 59-62.

Blocking defects:

- listens for payment_intent.succeeded rather than the required Checkout
  completion/expiry lifecycle;
- confirm_booking_paid and refund_booking RPCs do not exist;
- payment failure filters bookings.stripe_payment_intent_id, but that column is
  on payments, not bookings;
- webhook_events is never inserted, so event uniqueness is unused;
- no amount/currency/customer/booking cross-check;
- no atomic slot/inventory conversion;
- no Checkout expiry handler;
- no resource release on failed/expired payment;
- no partial-refund design or reconciliation job;
- confirmation email is fire-and-forget.

Can duplicate webhook delivery double-decrement stock?

Current code cannot decrement stock at all because its RPC is missing. Once real
decrement is implemented, duplicate safety is not proven and must not be
inferred from the comment at route.ts:19-20.

Can a user reach confirmation without verified payment?

In mock mode, yes: confirm-mock changes local status. In non-mock mode that route
is gated and confirmation reads only whatever exists in Supabase, so there is no
current real success path. Production must permit confirmation only after a
signature-verified, idempotently processed Checkout event.

## Required Gate 3 acceptance

- Create Checkout Session server-side with authoritative product/price snapshot,
  GBP deposit, booking/hold metadata, success/cancel URLs.
- Persist pending payment and Stripe session ID before redirect.
- Verify signature and atomically process exactly once.
- Exercise success, card failure, cancellation, expiry, duplicate/out-of-order
  webhook, amount mismatch, full/partial refund and reconciliation.
- Verify failed/expired payments release resources and email failure does not
  corrupt the confirmed booking state.
