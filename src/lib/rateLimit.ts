import { createServiceClient } from './supabase';

/**
 * Fixed-window IP rate limiting backed by Postgres.
 * No Redis, no extra service, no cost.
 *
 * Fails OPEN: if the DB errors we allow the request rather than
 * breaking checkout. Turnstile is the harder gate.
 */
export async function checkRateLimit(
  key: string,
  maxHits: number,
  windowMinutes: number
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const db = createServiceClient();
    const windowStart = new Date(Date.now() - windowMinutes * 60_000).toISOString();

    const { data: rows, error } = await db
      .from('rate_limits')
      .select('id, hits, window_start')
      .eq('bucket_key', key)
      .gte('window_start', windowStart)
      .order('window_start', { ascending: false })
      .limit(1);

    if (error) return { allowed: true, remaining: maxHits };

    const current = rows?.[0];

    if (!current) {
      await db.from('rate_limits').insert({ bucket_key: key, hits: 1 });
      return { allowed: true, remaining: maxHits - 1 };
    }

    if (current.hits >= maxHits) {
      return { allowed: false, remaining: 0 };
    }

    await db.from('rate_limits').update({ hits: current.hits + 1 }).eq('id', current.id);
    return { allowed: true, remaining: maxHits - current.hits - 1 };
  } catch {
    return { allowed: true, remaining: maxHits };
  }
}

/** Best-effort client IP from Cloudflare / standard proxy headers. */
export function getClientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get('cf-connecting-ip') ??
    h.get('x-real-ip') ??
    h.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown'
  );
}
