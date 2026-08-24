import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { getSupabasePublicEnv } from '@/lib/env';
import { getSupabaseServiceEnv } from '@/lib/env.server';

export function createAdminClient() {
  const publicEnv = getSupabasePublicEnv();
  const serverEnv = getSupabaseServiceEnv();

  return createClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
