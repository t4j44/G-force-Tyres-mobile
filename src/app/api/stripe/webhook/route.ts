import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase';
import { sendBookingConfirmed } from '@/lib/email';
import type { BookingWithDetails } from '@/types';

export const runtime = 'nodejs';
// Stripe needs the raw body byte-for-byte to verify the signature.
export const dynamic = 'force-dynamic';

/**
 * POST /api/stripe/webhook
 *
 * The ONLY place a booking becomes `confirmed`. Never trust the browser's
 * "payment succeeded" redirect — the user can close the tab, and a
 * malicious client can call the success URL without paying.
 *
 * Idempotency lives in the DB function `confirm_booking_paid`: calling it
 * twice for the same PaymentIntent will not decrement stock twice.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET missing');
    return NextResponse.json({ error: 'not_configured' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'no_signature' }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    // Signature mismatch = forged request. Reject loudly.
    console.error('[webhook] signature verification failed', err);
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }

  const db = createServiceClient();

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        const chargeId =
          typeof pi.latest_charge === 'string' ? pi.latest_charge : pi.latest_charge?.id ?? '';

        const { data: bookingId, error } = await db.rpc('confirm_booking_paid', {
          p_payment_intent_id: pi.id,
          p_charge_id: chargeId,
        });

        if (error) {
          console.error('[webhook] confirm_booking_paid failed', error);
          // Return 500 so Stripe retries — do not swallow this.
          return NextResponse.json({ error: 'confirm_failed' }, { status: 500 });
        }

        // Email is fire-and-forget: never block the 200 on it.
        if (bookingId) void notifyConfirmed(bookingId as unknown as string);
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        await db
          .from('bookings')
          .update({ status: 'payment_failed' })
          .eq('stripe_payment_intent_id', pi.id)
          .eq('status', 'pending_payment');
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const piId =
          typeof charge.payment_intent === 'string'
            ? charge.payment_intent
            : charge.payment_intent?.id;
        if (piId) {
          await db.rpc('refund_booking', { p_payment_intent_id: piId });
        }
        break;
      }

      default:
        // Unhandled event types are fine — acknowledge so Stripe stops retrying.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[webhook] handler error', err);
    return NextResponse.json({ error: 'handler_failed' }, { status: 500 });
  }
}

async function notifyConfirmed(bookingId: string): Promise<void> {
  try {
    const db = createServiceClient();
    const { data } = await db
      .from('bookings')
      .select('*, customer:customers(*), slot:booking_slots(*), items:booking_items(*)')
      .eq('id', bookingId)
      .single();

    if (data) await sendBookingConfirmed(data as unknown as BookingWithDetails);
  } catch (err) {
    console.error('[webhook] confirmation email failed', err);
  }
}
