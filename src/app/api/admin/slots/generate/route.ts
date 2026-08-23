import { NextResponse } from 'next/server';
import { localStore } from '@/lib/mockData';
import { isSupabaseConfigured, createServiceClient } from '@/lib/supabase';
import { z } from 'zod';

export const runtime = 'nodejs';

const generateSchema = z.object({
  startDate: z.string(),
  weeks: z.number().int().min(1).max(24).default(8),
  days: z.array(z.number().int().min(0).max(6)), // 0=Sun, 1=Mon, ..., 6=Sat
  timeWindows: z.array(
    z.object({
      start: z.string(),
      end: z.string(),
    })
  ),
  capacity: z.number().int().min(1).max(10).default(2),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'invalid_params', message: parsed.error.errors[0]?.message ?? 'Invalid parameters' },
        { status: 400 }
      );
    }

    const { startDate, weeks, days, timeWindows, capacity } = parsed.data;

    // Generate in local store
    const count = localStore.generateRecurringSlots(startDate, weeks, days, timeWindows, capacity);

    // If Supabase configured, insert in DB
    if (isSupabaseConfigured()) {
      try {
        const db = createServiceClient();
        const start = new Date(startDate);
        const recordsToInsert = [];

        for (let w = 0; w < weeks; w++) {
          for (const dayOfWeek of days) {
            const d = new Date(start);
            const currentDay = d.getDay();
            const diff = (dayOfWeek - currentDay + 7) % 7;
            d.setDate(d.getDate() + w * 7 + diff);
            const dateStr = d.toISOString().split('T')[0];

            for (const tw of timeWindows) {
              recordsToInsert.push({
                slot_date: dateStr,
                start_time: tw.start.length === 5 ? `${tw.start}:00` : tw.start,
                end_time: tw.end.length === 5 ? `${tw.end}:00` : tw.end,
                max_bookings: capacity,
                active: true,
              });
            }
          }
        }

        if (recordsToInsert.length > 0) {
          await db
            .from('booking_slots')
            .upsert(recordsToInsert, { onConflict: 'slot_date,start_time' });
        }
      } catch (dbErr) {
        console.error('[admin/slots/generate] db error', dbErr);
      }
    }

    return NextResponse.json({
      ok: true,
      data: {
        generated_count: count,
        message: `Successfully created recurring slots for ${weeks} weeks (${capacity} vans per slot).`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'server_error', message: 'Failed to generate recurring slots.' },
      { status: 500 }
    );
  }
}
