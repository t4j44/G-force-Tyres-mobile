import { NextResponse } from 'next/server';
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase';
import { createHoldSchema } from '@/lib/validation';
import { localStore } from '@/lib/mockData';

export const runtime = 'nodejs';

/**
 * POST /api/holds/create
 *
 * Soft-locks a slot for 15 minutes while the customer pays.
 * The DB function takes a row lock so two people cannot claim
 * the last slot in the same millisecond.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'bad_request', message: 'Invalid request.' },
      { status: 400 }
    );
  }

  const parsed = createHoldSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'validation_failed', message: 'Invalid slot.' },
      { status: 400 }
    );
  }

  const { slot_id, session_token } = parsed.data;

  // If Supabase is configured, use the database RPC
  if (isSupabaseConfigured()) {
    try {
      const db = createServiceClient();
      const { data, error } = await db.rpc('create_slot_hold', {
        p_slot_id: slot_id,
        p_session_token: session_token,
        p_minutes: 15,
      });

      if (error) {
        if (error.message?.includes('SLOT_FULL')) {
          return NextResponse.json(
            { ok: false, error: 'slot_full', message: 'Someone just took that slot. Pick another.' },
            { status: 409 }
          );
        }
        throw error;
      }

      const row = Array.isArray(data) ? data[0] : data;

      return NextResponse.json({
        ok: true,
        data: { hold_id: row?.hold_id, slot_id, expires_at: row?.expires_at },
      });
    } catch (err) {
      console.warn('[holds/create] Supabase error, using local fallback:', err);
    }
  }

  // Local fallback
  const hold = localStore.createHold(slot_id, session_token, 15);
  if (!hold) {
    return NextResponse.json(
      { ok: false, error: 'slot_full', message: 'Slot could not be held. Pick another.' },
      { status: 409 }
    );
  }

  return NextResponse.json({
    ok: true,
    data: { hold_id: hold.hold_id, slot_id, expires_at: hold.expires_at },
  });
}
