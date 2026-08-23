import { NextResponse } from 'next/server';
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase';
import { releaseHoldSchema } from '@/lib/validation';
import { localStore } from '@/lib/mockData';

export const runtime = 'nodejs';

/** POST /api/holds/release — free the slot when the user backs out. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_request', message: 'Invalid request.' }, { status: 400 });
  }

  const parsed = releaseHoldSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'validation_failed', message: 'Invalid slot.' }, { status: 400 });
  }

  const { slot_id, session_token } = parsed.data;

  if (isSupabaseConfigured()) {
    try {
      const db = createServiceClient();
      await db
        .from('slot_holds')
        .delete()
        .eq('slot_id', slot_id)
        .eq('session_token', session_token);
    } catch {
      // Releasing is best effort
    }
  }

  localStore.releaseHold(slot_id, session_token);

  return NextResponse.json({ ok: true, data: { released: true } });
}
