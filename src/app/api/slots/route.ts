import { NextResponse } from 'next/server';
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase';
import { localStore } from '@/lib/mockData';
import type { BookingSlot, SlotWithAvailability } from '@/types';

export const runtime = 'nodejs';

/** GET /api/slots?date=YYYY-MM-DD */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date') ?? undefined;

  if (isSupabaseConfigured()) {
    try {
      const db = createServiceClient();
      let query = db.from('booking_slots').select('*').eq('active', true).order('slot_date').order('start_time');
      if (date) query = query.eq('slot_date', date);

      const { data, error } = await query.returns<BookingSlot[]>();
      if (!error && data && data.length > 0) {
        const withAvail: SlotWithAvailability[] = data.map((s) => ({
          ...s,
          remaining: 2,
          available: true,
        }));
        return NextResponse.json({ ok: true, data: withAvail });
      }
    } catch {
      // fallback
    }
  }

  const slots = localStore.getSlots(date);
  return NextResponse.json({ ok: true, data: slots });
}
