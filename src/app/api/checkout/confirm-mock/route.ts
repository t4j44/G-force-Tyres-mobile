import { NextResponse } from 'next/server';
import { localStore } from '@/lib/mockData';
import { isMockDataEnabled } from '@/lib/mock-mode';

export const runtime = 'nodejs';

/** POST /api/checkout/confirm-mock — confirm a booking in test/local dev mode */
export async function POST(req: Request) {
  if (!isMockDataEnabled()) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  try {
    const { booking_ref } = await req.json();
    if (!booking_ref) {
      return NextResponse.json({ ok: false, error: 'missing_ref' }, { status: 400 });
    }

    const booking = localStore.getBookingByRef(booking_ref);
    if (!booking) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    }

    booking.status = 'confirmed';
    booking.deposit_paid_at = new Date().toISOString();
    booking.updated_at = new Date().toISOString();

    return NextResponse.json({ ok: true, data: { status: 'confirmed', booking_ref } });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
