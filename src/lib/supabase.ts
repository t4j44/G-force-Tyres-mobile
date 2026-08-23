import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export function isSupabaseConfigured(): boolean {
  return (
    !!url &&
    !!anonKey &&
    !url.includes('placeholder.supabase.co') &&
    url.startsWith('https://')
  );
}

/**
 * Browser client. RLS applies.
 * Can only read the public catalogue: tyres, slots, zones, settings.
 */
export const supabase: SupabaseClient = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});

/**
 * Server-only client. BYPASSES RLS — full database access.
 *
 * Never import this into a file that ships to the browser.
 * Only use inside `src/app/api/**` route handlers or server components.
 */
export function createServiceClient(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY || anonKey;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
