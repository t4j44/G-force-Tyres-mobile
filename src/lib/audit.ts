import 'server-only';

import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import type { AdminProfile } from '@/lib/auth/admin';

const auditInputSchema = z.object({
  action: z.string().trim().min(1).max(80),
  resourceType: z.string().trim().min(1).max(80),
  resourceId: z.string().uuid().nullable().optional(),
  metadata: z.record(z.unknown()).default({}),
});

export async function writeAuditLog(
  actor: AdminProfile,
  input: z.input<typeof auditInputSchema>,
): Promise<void> {
  const parsed = auditInputSchema.parse(input);
  const db = createAdminClient();
  const { error } = await db.from('audit_logs').insert({
    admin_user_id: actor.user_id,
    action: parsed.action,
    resource_type: parsed.resourceType,
    resource_id: parsed.resourceId ?? null,
    metadata: parsed.metadata,
  });

  if (error) throw new Error('Audit log write failed.');
}
