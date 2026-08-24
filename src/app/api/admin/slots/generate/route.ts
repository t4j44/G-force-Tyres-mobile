import { NextResponse } from 'next/server';
import { localStore } from '@/lib/mockData';
import { z } from 'zod';
import { adminErrorResponse, requireAdmin } from '@/lib/auth/admin';
import { isMockDataEnabled } from '@/lib/mock-mode';
import { writeAuditLog } from '@/lib/audit';

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
  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    return adminErrorResponse(error);
  }

  try {
    const body = await req.json();
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'invalid_params', message: parsed.error.errors[0]?.message ?? 'Invalid parameters' },
        { status: 400 }
      );
    }

    if (!isMockDataEnabled()) {
      return NextResponse.json(
        {
          ok: false,
          error: 'not_implemented',
          message: 'Persistent slot generation is reserved for Phase 3.',
        },
        { status: 501 },
      );
    }

    const { startDate, weeks, days, timeWindows, capacity } = parsed.data;

    // Generate in local store
    const count = localStore.generateRecurringSlots(startDate, weeks, days, timeWindows, capacity);

    await writeAuditLog(admin.profile, {
      action: 'DEMO_SLOTS_GENERATED',
      resourceType: 'booking_slots',
      metadata: { startDate, weeks, days, timeWindows, capacity, generatedCount: count },
    }).catch(() => undefined);

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
