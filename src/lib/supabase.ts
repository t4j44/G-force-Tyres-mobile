import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabasePublicEnv, hasSupabasePublicEnv } from '@/lib/env';
import { createAdminClient } from '@/lib/supabase/admin';

export function isSupabaseConfigured(): boolean {
  return hasSupabasePublicEnv();
}

/**
 * Browser client. RLS applies.
 * Can only read the public catalogue: tyres, slots, zones, settings.
 */
export function createPublicClient(): SupabaseClient {
  const env = getSupabasePublicEnv();
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Server-only client. BYPASSES RLS — full database access.
 *
 * Never import this into a file that ships to the browser.
 * Only use inside `src/app/api/**` route handlers or server components.
 */
export function createServiceClient(): SupabaseClient {
  return createAdminClient();
}
