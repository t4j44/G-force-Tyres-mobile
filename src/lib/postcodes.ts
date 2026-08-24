import { createServiceClient, isSupabaseConfigured } from './supabase';
import { normalisePostcode } from './utils';
import { MOCK_SERVICE_ZONES } from './mockData';
import { isMockDataEnabled } from './mock-mode';
import type { CoverageResult, ServiceZone } from '@/types';

/** Postcodes.io — free, no key, no rate limit for our volume. */
export async function validatePostcode(postcode: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}/validate`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) return false;
    const json = (await res.json()) as { result: boolean };
    return json.result === true;
  } catch {
    // Postcodes.io down / offline — fall back to our own regex check upstream.
    return true;
  }
}

/**
 * Does G Force cover this postcode?
 * Matches the longest zone prefix first so 'EC1' beats 'E1'.
 */
export async function checkCoverage(postcode: string): Promise<CoverageResult> {
  const clean = normalisePostcode(postcode);

  if (clean.length < 4) {
    return { covered: false, message: 'Enter a full UK postcode.' };
  }

  let data: ServiceZone[] = MOCK_SERVICE_ZONES;

  if (!isMockDataEnabled() && isSupabaseConfigured()) {
    try {
      const db = createServiceClient();
      const res = await db
        .from('service_zones')
        .select('*')
        .eq('active', true)
        .returns<ServiceZone[]>();
      if (res.data && res.data.length > 0) {
        data = res.data;
      }
    } catch {
      data = MOCK_SERVICE_ZONES;
    }
  }

  const matches = data
    .filter((z) => clean.startsWith(normalisePostcode(z.postcode_prefix)))
    .sort((a, b) => b.postcode_prefix.length - a.postcode_prefix.length);

  const zone = matches[0];

  if (!zone) {
    return {
      covered: false,
      message: 'We do not cover this postcode yet. Leave your email and we will tell you when we do.',
    };
  }

  return {
    covered: true,
    zone,
    message:
      zone.callout_charge > 0
        ? `We cover ${zone.zone_name}. A call-out charge applies to this area.`
        : `We cover ${zone.zone_name}. No call-out charge.`,
  };
}
