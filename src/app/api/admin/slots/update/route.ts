import { NextResponse } from 'next/server';
import { localStore } from '@/lib/mockData';
import { isSupabaseConfigured, createServiceClient } from '@/lib/supabase';
import { z } from 'zod';

export const runtime = 'nodejs';

const updateSchema = z.object({
  action: z.enum(['set_capacity', 'toggle_active', 'block_date', 'unblock_date']),
  slotId: z.string().optional(),
  date: z.string().optional(),
  capacity: z.number().int().min(1).max(10).optional(),
  reason: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'invalid_params', message: parsed.error.errors[0]?.message ?? 'Invalid parameters' },
        { status: 400 }
      );
    }

    const { action, slotId, date, capacity } = parsed.data;

    if (action === 'set_capacity' && slotId && capacity) {
      localStore.setSlotCapacity(slotId, capacity);
      if (isSupabaseConfigured()) {
        try {
          const db = createServiceClient();
          await db.from('booking_slots').update({ max_bookings: capacity }).eq('id', slotId);
        } catch {}
      }
      return NextResponse.json({ ok: true, message: `Capacity updated to ${capacity}.` });
    }

    if (action === 'toggle_active' && slotId) {
      localStore.toggleSlotActive(slotId);
      return NextResponse.json({ ok: true, message: 'Slot status updated.' });
    }

    if (action === 'block_date' && date) {
      localStore.blockDate(date);
      if (isSupabaseConfigured()) {
        try {
          const db = createServiceClient();
          await db.from('booking_slots').update({ active: false }).eq('slot_date', date);
        } catch {}
      }
      return NextResponse.json({ ok: true, message: `Blocked all slots for ${date}.` });
    }

    if (action === 'unblock_date' && date) {
      localStore.unblockDate(date);
      if (isSupabaseConfigured()) {
        try {
          const db = createServiceClient();
          await db.from('booking_slots').update({ active: true }).eq('slot_date', date);
        } catch {}
      }
      return NextResponse.json({ ok: true, message: `Re-opened slots for ${date}.` });
    }

    return NextResponse.json({ ok: false, error: 'unhandled_action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
