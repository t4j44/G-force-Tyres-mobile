# Final Booking and Concurrency Audit

## Critical conclusion

Status: MISSING.

The missing capability is production transaction integrity.

Current non-mock booking, slots and holds routes fail closed with 501/503, so
the production system guarantees that no customer can complete a booking. If
the dormant database branches were enabled, they would not guarantee slot or
inventory integrity because the referenced RPCs and schema columns do not
exist.

## Intended versus actual sequence

| Stage | Data foundation | Runnable production behavior | Status |
|---|---|---|---|
| Availability rule | availability_rules table | owner editor/generator absent | PARTIAL |
| Generated slot | booking_slots table | admin generator mock-only | MOCK_ONLY |
| Availability query | booking_slots table | uses wrong slot_date/start_time names; hardcodes remaining=2 | MOCK_ONLY |
| Slot selection | booking UI | UI exists only in mock mode | MOCK_ONLY |
| Slot hold | slot_holds table | create_slot_hold RPC missing; token column mismatch | MISSING |
| Inventory hold | inventory_holds table | no route/RPC | MISSING |
| Customer | customers table | no persistent create flow | MISSING |
| Pending booking/items | bookings/booking_items tables | no transaction | MISSING |
| Payment | payments/webhook_events tables | no matching persistent flow | MISSING |
| Confirmation | intended webhook-only | confirm_booking_paid RPC missing | MISSING |

## Simultaneous final-slot answer

Question: If capacity = 1 and 20 customers request the final slot
simultaneously, what does the current implementation guarantee?

Answer:

- Current non-mock deployment: all are rejected because real holds are disabled.
- Mock mode: all twenty customers can receive a hold. LocalBookingStore.createHold
  at mockData.ts:761-768 checks only that the slot exists and stores one hold per
  session token; it never checks capacity or other holds. State is also lost on
  restart and not shared across Cloudflare instances.
- Dormant Supabase branch: zero proven protection. There is no
  create_slot_hold function, no row lock, and no transaction counting confirmed
  bookings plus unexpired holds.

Required guarantee: at most one valid hold/booking for capacity one, demonstrated
with a 20-way concurrent integration test against PostgreSQL.

## Simultaneous final-stock answer

Question: If inventory = 2 and 20 customers attempt to purchase quantity 2,
what does current implementation guarantee?

Answer:

- Current non-mock deployment: no purchase can complete.
- If enabled: zero transactional oversell protection. calculatePrice checks
  LocalBookingStore stock and does not lock the inventory row. inventory_holds
  exists but is never written by a runnable transaction.

Required guarantee: one request can reserve quantity two; the other nineteen
receive a deterministic stock conflict; reserved_qty never exceeds stock_qty.

## Required atomic design

One database transaction must:

1. delete/ignore expired holds;
2. lock the requested booking_slots row;
3. count confirmed/pending valid occupants and unexpired holds;
4. reject when capacity is exhausted;
5. lock each inventory row in deterministic product-ID order;
6. calculate available = stock_qty - reserved_qty - valid outstanding holds;
7. create slot and inventory holds with the same token/expiry;
8. create customer, pending booking, immutable booking_items and pending payment
   with server-calculated pence values;
9. commit once.

Webhook confirmation must atomically claim a unique webhook event, validate the
payment/amount/currency/booking, convert holds to reservations, update payment
and booking, and make duplicate delivery a no-op. Expiry/failure/cancellation
must atomically release both resource types.

## Missing verification

No unit, PostgreSQL integration, isolation-level, 20-way concurrency, expired
hold, process-restart or duplicate-webhook test exists. This is P1-07/P1-08 and
must pass Gate 2 before Stripe work starts.
