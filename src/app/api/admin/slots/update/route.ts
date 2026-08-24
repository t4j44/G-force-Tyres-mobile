import { NextResponse } from 'next/server';
import { localStore } from '@/lib/mockData';
import { z } from 'zod';
import { adminErrorResponse, requireAdmin } from '@/lib/auth/admin';
import { isMockDataEnabled } from '@/lib/mock-mode';
import { writeAuditLog } from '@/lib/audit';

export const runtime = 'nodejs';

const updateSchema = z.object({
  action: z.enum(['set_capacity', 'toggle_active', 'block_date', 'unblock_date']),
  slotId: z.string().optional(),
  date: z.string().optional(),
  capacity: z.number().int().min(1).max(10).optional(),
  reason: z.string().optional(),
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
    const parsed = updateSchema.safeParse(body);
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
          message: 'Persistent slot mutations are reserved for Phase 3.',
        },
        { status: 501 },
      );
    }

    const { action, slotId, date, capacity } = parsed.data;

    if (action === 'set_capacity' && slotId && capacity) {
      localStore.setSlotCapacity(slotId, capacity);
      await writeAuditLog(admin.profile, {
        action: 'DEMO_SLOT_CAPACITY_CHANGED',
        resourceType: 'booking_slots',
        metadata: { slotId, capacity },
      }).catch(() => undefined);
      return NextResponse.json({ ok: true, message: `Capacity updated to ${capacity}.` });
    }

    if (action === 'toggle_active' && slotId) {
      localStore.toggleSlotActive(slotId);
      await writeAuditLog(admin.profile, {
        action: 'DEMO_SLOT_TOGGLED',
        resourceType: 'booking_slots',
        metadata: { slotId },
      }).catch(() => undefined);
      return NextResponse.json({ ok: true, message: 'Slot status updated.' });
    }

    if (action === 'block_date' && date) {
      localStore.blockDate(date);
      await writeAuditLog(admin.profile, {
        action: 'DEMO_DATE_BLOCKED',
        resourceType: 'blocked_dates',
        metadata: { date },
      }).catch(() => undefined);
      return NextResponse.json({ ok: true, message: `Blocked all slots for ${date}.` });
    }

    if (action === 'unblock_date' && date) {
      localStore.unblockDate(date);
      await writeAuditLog(admin.profile, {
        action: 'DEMO_DATE_UNBLOCKED',
        resourceType: 'blocked_dates',
        metadata: { date },
      }).catch(() => undefined);
      return NextResponse.json({ ok: true, message: `Re-opened slots for ${date}.` });
    }

    return NextResponse.json({ ok: false, error: 'unhandled_action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
